from pydantic import BaseModel
from uuid import UUID

class EstoquePublic(BaseModel):
    id_produto: UUID
    produto: str
    categoria: str
    unidade_medida: str
    quantidade_total: int