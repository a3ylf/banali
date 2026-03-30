from uuid import UUID
from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List

from app.schemas.categoria import CategoriaPublic

def validar_nome_produto(v: str) -> str:
    if not v or not v.strip():
        raise ValueError('Nome do produto não pode ser vazio')
    return v.strip().title()

def validar_unidade_medida(v: str) -> str:
    unidades_validas = ['kg', 'g', 'l', 'ml', 'un', 'cx', 'pct']
    if v.lower() not in unidades_validas:
        raise ValueError(f'Unidade deve ser uma das: {unidades_validas}')
    return v.lower()

# ===== Schemas de Produto =====
class ProdutoBase(BaseModel):
    nome_produto: str
    descricao: str
    unidade_medida: str

class ProdutoCreate(ProdutoBase):
    id_categoria: UUID
    
    @field_validator('nome_produto')
    def validar_nome(cls, v):
        return validar_nome_produto(v)
    
    @field_validator('unidade_medida')
    def validar_unidade(cls, v):
        return validar_unidade_medida(v)

class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    descricao: Optional[str] = None
    unidade_medida: Optional[str] = None
    id_categoria: Optional[UUID] = None

    @field_validator('nome_produto')
    def validar_nome(cls, v):
        if v is not None:
            return validar_nome_produto(v)
        return v
    
    @field_validator('unidade_medida')
    def validar_unidade(cls, v):
        if v is not None:
            return validar_unidade_medida(v)
        return v
    
class ProdutoPublic(ProdutoBase):
    id_produto: UUID
    categoria: Optional[CategoriaPublic] = None
    
    model_config = ConfigDict(from_attributes=True)

class ProdutoList(BaseModel):
    produtos: List[ProdutoPublic]
