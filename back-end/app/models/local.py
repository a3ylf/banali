import uuid
from sqlalchemy import UUID, CheckConstraint, Column, Integer, String
from database.database import Base
from sqlalchemy.orm import relationship

class Local(Base):
    __tablename__ = "local"

    id_local = Column(UUID(as_uuid = True), primary_key= True, default=uuid.uuid4)
    nome_local = Column(String, nullable=False)
    cpf_local = Column(String, unique=True)
    cnpj_local = Column(String, unique=True)
    
    movimentacoes_origem = relationship(
        "Movimentacao",
        foreign_keys="Movimentacao.id_origem",
        back_populates="origem"
    )

    movimentacoes_destino = relationship(
        "Movimentacao",
        foreign_keys="Movimentacao.id_destino",
        back_populates="destino"
    )

    __table_args__ = (
        CheckConstraint(
            "cpf_local IS NOT NULL OR cnpj_local IS NOT NULL",
            name="check_cpf_ou_cnpj"
        ),
    )