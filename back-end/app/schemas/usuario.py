from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from uuid import UUID


class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str


class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str


class UsuarioPublic(BaseModel):
    id_usuario: UUID
    nome: str
    email: EmailStr

    class Config:
        from_attributes = True

class UserList(BaseModel):
    users: list[UsuarioPublic]

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    senha: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class RefreshToken(Token):
    refresh_token: str

class OnboardingRequest(BaseModel):
    # ONG (Local) fields
    nome_ong: str
    cnpj_ong: str
    endereco_ong: Optional[str] = None
    
    # Admin (Usuario) fields
    nome_admin: str
    email_admin: EmailStr
    senha_admin: str
