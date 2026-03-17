
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.categoria import Categoria
from app.models.lote import Lote
from app.models.produto import Produto
from app.models.usuario import Usuario
from app.schemas.estoque import EstoquePublic
from core.seguranca import get_current_user
from database.database import get_db


rota_estoque = APIRouter(prefix="/api/demand", tags=["stock"])

@rota_estoque.get("/stock", response_model=list[EstoquePublic])
async def get_stock(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):

    estoque = (
        db.query(
            Produto.id_produto.label("id_produto"),
            Produto.nome_produto.label("produto"),
            Categoria.nome_categoria.label("categoria"),
            Produto.unidade_medida.label("unidade_medida"),
            func.sum(Lote.quantidade_disponivel).label("quantidade_total")
        )
        .join(Lote, Produto.id_produto == Lote.id_produto)
        .join(Categoria, Produto.id_categoria == Categoria.id_categoria)
        .filter(Lote.quantidade_disponivel > 0)
        .group_by(
            Produto.id_produto,
            Produto.nome_produto,
            Categoria.nome_categoria,
            Produto.unidade_medida
        )
        .all()
    )

    return estoque