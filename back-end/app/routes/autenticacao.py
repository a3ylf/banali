import os
import re
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy import func
from passlib.context import CryptContext
from jose import JWTError, jwt

from database.database import get_db
from app.models.usuario import Usuario
from app.models.local import Local
from app.schemas.usuario import RefreshToken, Token, UserList, UsuarioCreate, UsuarioLogin, UsuarioPublic, OnboardingRequest
from core.seguranca import ALGORITHM, SECRET_KEY, create_access_token, create_refresh_token, get_password_hash, verify_password


rota_autenticacao = APIRouter(prefix="/api/authentication", tags=["authentication"])

@rota_autenticacao.post("/register", response_model=UsuarioPublic, status_code=status.HTTP_201_CREATED)
async def register(user_in: UsuarioCreate, db: Session = Depends(get_db)):
    # Verifica se email já está cadastrado
    existing_user = db.query(Usuario).filter(Usuario.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email já registrado"
        )

    # Gera hash da senha
    hashed_password = get_password_hash(user_in.senha)

    # Cria novo usuário
    new_user = Usuario(
        nome=user_in.nome,
        email=user_in.email,
        senha_hash=hashed_password,
    )

    # Salva no banco de dados
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Erro de integridade"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro no banco de dados {str(e)}"
        )

    return new_user


@rota_autenticacao.post("/register-onboarding", response_model=UsuarioPublic, status_code=status.HTTP_201_CREATED)
async def register_onboarding(data: OnboardingRequest, db: Session = Depends(get_db)):
    existing_user = db.query(Usuario).filter(Usuario.email == data.email_admin).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email já registrado")
    
    nome_normalizado = data.nome_ong.strip().title()
    existe_nome = db.query(Local).filter(func.lower(Local.nome_local) == func.lower(nome_normalizado)).first()
    if existe_nome:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Local '{nome_normalizado}' já existe")
    
    if data.cnpj_ong and len(data.cnpj_ong) != 14:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="O CNPJ deve possuir 14 números.")

    if data.cnpj_ong:
        existe_cnpj = db.query(Local).filter(Local.cnpj_local == data.cnpj_ong).first()
        if existe_cnpj:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CNPJ já cadastrado")

    hashed_password = get_password_hash(data.senha_admin)
    new_user = Usuario(nome=data.nome_admin, email=data.email_admin, senha_hash=hashed_password)
    
    new_local = Local(
        nome_local=nome_normalizado,
        cnpj_local=data.cnpj_ong,
        endereco=data.endereco_ong,
        is_owner=True
    )
    
    db.add(new_user)
    db.add(new_local)
    
    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Erro de integridade")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro no banco de dados {str(e)}")
        
    return new_user


@rota_autenticacao.post("/login", response_model=Token)
async def login(
    credentials: UsuarioLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    user = db.query(Usuario).filter(Usuario.email == credentials.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credencial inválida"
        )

    if not verify_password(credentials.senha, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credencial inválida"
        )

    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
        secure=False,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@rota_autenticacao.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"detail": "Logout com sucesso"}

@rota_autenticacao.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token ausente")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        new_access_token = create_access_token({"sub": email})

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Refresh token inválido")

@rota_autenticacao.post("/token")
def login_oauth2(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(Usuario).filter(
        Usuario.email == form_data.username
    ).first()

    if not user or not verify_password(form_data.password, user.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    access_token = create_access_token({"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}