from sqlalchemy import CheckConstraint, Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

class Lote(Base):
    __tablename__ = "lote"

    __table_args__ = (
        CheckConstraint("quantidade_disponivel >= 0", name="check_quantidade_positiva"),
    )

    id_lote = Column(Integer, primary_key=True, index=True)
    id_item = Column(Integer, ForeignKey("produto.id_produto"))
    quantidade_inicial = Column(Integer, nullable=False)
    quantidade_disponivel = Column(Integer, nullable=False)
    data_entrada = Column(Date)
    data_validade = Column(Date)

    produto = relationship("Produto", back_populates="lotes")
    movimentacoes_lote = relationship("MovimentacaoLote", back_populates="lote")