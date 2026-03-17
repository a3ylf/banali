from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID

class EntradaCreate(BaseModel):
    id_produto: UUID
    quantidade: int
    data_validade: date
    id_local_origem: UUID

class EntradaPublic(BaseModel):
    id_movimentacao: UUID
    tipo_movimentacao: str
    data_movimentacao: datetime
    id_usuario: UUID
    id_origem: Optional[UUID]
    id_destino: Optional[UUID]
    quantidade: float
    id_produto: UUID
    data_validade: date
    id_lote: UUID
    
    class Config:
        from_attributes = True

class SaidaCreate(BaseModel):
    """Schema para criar uma saída"""
    id_produto: UUID
    quantidade: int
    id_local_destino: UUID

    class Config:
        json_schema_extra = {
            "example": {
                "id_produto": "123e4567-e89b-12d3-a456-426614174000",
                "quantidade": 50,
                "id_local_destino": "123e4567-e89b-12d3-a456-426614174002",
            }
        }

class LoteUtilizado(BaseModel):
    """Schema para detalhar lotes usados na saída"""
    id_lote: UUID
    quantidade_utilizada: int
    quantidade_restante: int
    data_validade: date

class SaidaResponse(BaseModel):
    """Schema de resposta para saída"""
    id_movimentacao: UUID
    quantidade_total: int
    id_produto: UUID
    produto_nome: str
    data_movimentacao: datetime
    lotes_utilizados: List[LoteUtilizado]

    class Config:
        from_attributes = True