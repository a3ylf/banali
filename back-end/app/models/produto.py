import uuid
from sqlalchemy import UUID, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class Produto(Base):
    __tablename__ = "produto"

    id_produto = Column(UUID(as_uuid = True), primary_key= True, default=uuid.uuid4)
    nome_produto = Column(String, nullable=False)
    descricao = Column(String)
    unidade_medida = Column(String, nullable=False)
    id_categoria = Column(UUID(as_uuid=True), ForeignKey("categoria.id_categoria"))

    categoria = relationship("Categoria", back_populates="produtos")
    lotes = relationship("Lote", back_populates="produto")