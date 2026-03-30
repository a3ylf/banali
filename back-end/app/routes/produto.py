from fastapi import Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.routing import APIRouter

from app.models.lote import Lote
from database.database import get_db
from app.models.categoria import Categoria
from app.models.produto import Produto
from app.models.usuario import Usuario
from app.schemas.produto import ProdutoCreate, ProdutoList, ProdutoPublic, ProdutoUpdate
from core.seguranca import get_current_user
from uuid import UUID

rota_produto = APIRouter(prefix="/api/demand", tags=["products"])

@rota_produto.get("/products/", response_model=ProdutoList)
async def read_products(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    produtos = db.query(Produto).all()
    return {"produtos":produtos}

@rota_produto.get("/products/{products_id}", response_model=ProdutoPublic)
async def get_product(
    produto_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    produto = db.query(Produto).filter(Produto.id_produto == produto_id).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    return produto

@rota_produto.post("/products/", response_model=ProdutoPublic, status_code=status.HTTP_201_CREATED)
async def create_product(
    produto_in: ProdutoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    # Verificar se a categoria existe
    categoria = db.query(Categoria).filter(
        Categoria.id_categoria == produto_in.id_categoria
    ).first()
    
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )
    
    # Criar produto
    novo_produto = Produto(
        nome_produto=produto_in.nome_produto.strip().title(),
        descricao=produto_in.descricao.strip(),
        unidade_medida=produto_in.unidade_medida.lower(),
        id_categoria=produto_in.id_categoria
    )
    
    try:
        db.add(novo_produto)
        db.commit()
        db.refresh(novo_produto)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao criar produto: {str(e)}"
        )
    
    return novo_produto

@rota_produto.put("/products/{products_id}", response_model=ProdutoPublic)
async def update_product(
    produto_id: UUID,
    produto_in: ProdutoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    produto = db.query(Produto).filter(Produto.id_produto == produto_id).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    # 2. Atualizar campos fornecidos (com validações de banco)
    
    if produto_in.nome_produto is not None:
        # Validar duplicidade (exceto ele mesmo)
        existe = db.query(Produto).filter(
            func.lower(Produto.nome_produto) == func.lower(produto_in.nome_produto),
            Produto.id_produto != produto_id
        ).first()
        
        if existe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Produto '{produto_in.nome_produto}' já existe"
            )
        
        produto.nome_produto = produto_in.nome_produto
    
    # Categoria
    if produto_in.id_categoria is not None:
        categoria = db.query(Categoria).filter(
            Categoria.id_categoria == produto_in.id_categoria
        ).first()
        
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoria não encontrada"
            )
        
        produto.id_categoria = produto_in.id_categoria
    
    # Descrição
    if produto_in.descricao is not None:
        produto.descricao = produto_in.descricao
    
    # Unidade de medida
    if produto_in.unidade_medida is not None:
        produto.unidade_medida = produto_in.unidade_medida
    
    try:
        db.commit()
        db.refresh(produto)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao atualizar produto: {str(e)}"
        )
    
    return produto

@rota_produto.delete("/products/{products_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    produto_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    produto = db.query(Produto).filter(Produto.id_produto == produto_id).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    db.delete(produto)
    db.commit()
    
    return None #204 No Content

@rota_produto.get("/products/{id_product}/batches")
async def get_lotes_by_produto(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    lotes = db.query(Lote).filter(Lote.id_produto == id).all()

    return {"lotes": lotes}