from sqlalchemy import Column, Enum, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Movimentacao(Base):
    __tablename__ = "movimentacao"

    id_movimentacao = Column(Integer, primary_key=True, index=True)
    tipo_movimentacao = Column(
        Enum("entrada", "saida", name="tipo_movimentacao_enum"),
        nullable=False
    )
    data_movimentacao = Column(DateTime, default=datetime.utcnow)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"))
    id_destino = Column(Integer, ForeignKey("destino.id_destino"), nullable=True)

    usuario = relationship("Usuario", back_populates="movimentacoes")
    lotes = relationship("MovimentacaoLote", back_populates="movimentacao")
    destino = relationship("Destino", back_populates="movimentacoes")