from sqlalchemy import Column, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class MovimentacaoLote(Base):
    __tablename__ = "movimentacao_lote"

    id_movimentacao_lote = Column(Integer, primary_key=True, index=True)
    id_movimentacao = Column(Integer, ForeignKey("movimentacao.id_movimentacao"))
    id_lote = Column(Integer, ForeignKey("lote.id_lote"))
    quantidade = Column(Integer, nullable=False)
    data_registro = Column(DateTime, default=datetime.utcnow)
    
    movimentacao = relationship("Movimentacao", back_populates="lotes")
    lote = relationship("Lote", back_populates="movimentacoes_lote")