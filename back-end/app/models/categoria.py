import uuid
from sqlalchemy import Column, Integer, String, Boolean, UUID
from sqlalchemy.orm import relationship
from core.database.database import Base

class Categoria(Base):
    __tablename__ = "categoria"

    id_categoria = Column(UUID(as_uuid = True), primary_key= True, default=uuid.uuid4)
    nome_categoria = Column(String, nullable=False, unique=True)

    produtos = relationship("Produto", back_populates="categoria")