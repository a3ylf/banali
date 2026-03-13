import uuid
from sqlalchemy import UUID, Column, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class MovimentacaoLote(Base):
    __tablename__ = "movimentacao_lote"

    id_movimentacao_lote = Column(UUID(as_uuid = True), primary_key= True, default=uuid.uuid4)
    id_movimentacao = Column(UUID(as_uuid=True), ForeignKey("movimentacao.id_movimentacao"))
    id_lote = Column(UUID(as_uuid=True), ForeignKey("lote.id_lote"))
    quantidade = Column(Integer, nullable=False)
    data_registro = Column(DateTime, default=datetime.utcnow)
    
    movimentacao = relationship("Movimentacao", back_populates="itens")
    lote = relationship("Lote", back_populates="movimentacoes_lote")