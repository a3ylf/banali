from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class CategoriaCreate(BaseModel):
    nome_categoria: str

class CategoriaPublic(BaseModel):
    id_categoria: UUID
    nome_categoria: str

    class Config:
        from_attributes = True

class CategoriaList(BaseModel):
    categorias: list[CategoriaPublic]
    
class CategoriaUpdate(BaseModel):
    nome_categoria: Optional[str] = None