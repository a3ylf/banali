import uuid
from sqlalchemy import UUID, Column, Enum, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class Movimentacao(Base):
    __tablename__ = "movimentacao"

    id_movimentacao = Column(UUID(as_uuid = True), primary_key= True, default=uuid.uuid4)
    tipo_movimentacao = Column(
        Enum("entrada", "saida", name="tipo_movimentacao_enum"),
        nullable=False
    )
    data_movimentacao = Column(DateTime, default=datetime.utcnow, nullable=False)
    id_usuario = Column(UUID(as_uuid=True), ForeignKey("usuario.id_usuario"))
    id_destino = Column(UUID(as_uuid=True), ForeignKey("local.id_local"), nullable=True)
    id_origem = Column(UUID(as_uuid=True), ForeignKey("local.id_local"), nullable=True)

    usuario = relationship("Usuario", back_populates="movimentacoes")
    itens = relationship("MovimentacaoLote", back_populates="movimentacao")
    origem = relationship(
        "Local",
        foreign_keys=[id_origem],
        back_populates="movimentacoes_origem"
    )

    destino = relationship(
        "Local",
        foreign_keys=[id_destino],
        back_populates="movimentacoes_destino"
    )