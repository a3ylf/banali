from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str


class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str


class UsuarioPublic(BaseModel):
    id_usuario: int
    nome: str
    email: EmailStr

    class Config:
        orm_mode = True

class UserList(BaseModel):
    users: list[UsuarioPublic]

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    senha: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
