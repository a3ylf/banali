from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship

class Destino(Base):
    __tablename__ = "destino"

    id_destino = Column(Integer, primary_key=True)
    nome_destino = Column(String, nullable=False)
    
    movimentacoes = relationship("Movimentacao", back_populates="destino")