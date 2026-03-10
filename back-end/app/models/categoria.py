from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Categoria(Base):
    __tablename__ = "categoria"

    id_categoria = Column(Integer, primary_key=True, index=True)
    nome_categoria = Column(String, nullable=False, unique=True)

    produtos = relationship("Produto", back_populates="categoria")