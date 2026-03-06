from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Produto(Base):
    __tablename__ = "produto"

    id_produto = Column(Integer, primary_key=True, index=True)
    nome_produto = Column(String, nullable=False)
    descricao = Column(String)
    unidade_medida = Column(String, nullable=False)
    peso_unitario = Column(Float)
    id_categoria = Column(Integer, ForeignKey("categoria.id_categoria"))

    categoria = relationship("Categoria", back_populates="produtos")
    lotes = relationship("Lote", back_populates="produto")