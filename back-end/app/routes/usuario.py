from fastapi import APIRouter, Depends

from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UserList, UsuarioPublic
from sqlalchemy.orm import Session

from app.seguranca import get_current_user


rota_usuario = APIRouter(prefix="/core", tags=["core"])

@rota_usuario.get("/users", response_model=UserList)
async def read_users(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    users = db.query(Usuario).all()
    return { 'users': users}

@rota_usuario.get("/me", response_model=UsuarioPublic)
def read_me(current_user: Usuario = Depends(get_current_user)):
    return current_user