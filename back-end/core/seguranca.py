from base64 import decode
from datetime import datetime, timedelta
from http import HTTPStatus
import os
import bcrypt
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from app.models import Usuario
from sqlalchemy.orm import Session
from database.database import get_db

# token settings (env vars with sensible defaults)
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-prod")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    
    expire = datetime.utcnow() + timedelta(days=1)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

# password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Gera hash usando bcrypt diretamente"""
    try:
        # Converte string para bytes
        password_bytes = password.encode('utf-8')
        # Gera salt e hash
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        # Retorna como string
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"Erro no bcrypt: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar senha: {str(e)}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica senha usando bcrypt diretamente"""
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        print(f"Erro na verificação: {e}")
        return False
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/authentication/token')

def get_current_user(
    session: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):

    credentials_exception = HTTPException(
        status_code=HTTPStatus.UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject_email = payload.get("sub")

        if subject_email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = session.scalar(
        select(Usuario).where(Usuario.email == subject_email)
    )

    if user is None:
        raise credentials_exception

    return user

