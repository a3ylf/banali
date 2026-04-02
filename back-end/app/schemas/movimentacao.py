from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID

class EntradaItemCreate(BaseModel):
    id_produto: UUID
    quantidade: int
    data_validade: date

class EntradaBatchRequest(BaseModel):
    id_local_origem: UUID
    itens: List[EntradaItemCreate]

class MovimentacaoPublic(BaseModel):
    id_movimentacao: UUID
    tipo_movimentacao: str
    data_movimentacao: datetime
    id_usuario: UUID
    id_origem: Optional[UUID]
    id_destino: Optional[UUID]
    
    class Config:
        from_attributes = True

class SaidaItemCreate(BaseModel):
    id_lote: UUID
    quantidade: int

class SaidaBatchRequest(BaseModel):
    id_local_destino: UUID
    itens: List[SaidaItemCreate]

class MovimentacaoItemPublic(BaseModel):
    id_movimentacao_lote: UUID
    produto_nome: str
    quantidade: int
    categoria_nome: str

class MovimentacaoHistoryPublic(BaseModel):
    id_movimentacao: UUID
    tipo_movimentacao: str
    data_movimentacao: datetime
    usuario_nome: str
    origem_nome: Optional[str]
    destino_nome: Optional[str]
    itens: List[MovimentacaoItemPublic]