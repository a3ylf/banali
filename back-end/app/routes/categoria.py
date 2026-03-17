from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from database.database import get_db
from app.models.categoria import Categoria
from app.models.usuario import Usuario
from app.schemas.categoria import CategoriaCreate, CategoriaList, CategoriaPublic, CategoriaUpdate
from core.seguranca import get_current_user
from sqlalchemy.orm import Session
from uuid import UUID


rota_categoria = APIRouter(prefix="/api/demand", tags=["categories"])

@rota_categoria.get("/categories/", response_model=CategoriaList)
async def read_categories(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    categorias = db.query(Categoria).all()
    return {"categorias": categorias}

@rota_categoria.get("/categories/{categories_id}", response_model=CategoriaPublic)
async def get_category(
    categoria_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )
    
    return categoria

@rota_categoria.post("/categories/", response_model=CategoriaPublic, status_code=status.HTTP_201_CREATED)
async def create_category(
    categoria_in: CategoriaCreate,
    db: Session = Depends(get_db), 
    current_user: Usuario = Depends(get_current_user)
):
    # 1. Remover espaços extras
    nome_limpo = categoria_in.nome_categoria.strip()
    
    # 2. Normalizar para Title Case (primeira letra de cada palavra maiúscula)
    nome_normalizado = nome_limpo.title()
    
    # 3. Verificar duplicidade (case-insensitive)
    existe_categoria = db.query(Categoria).filter(
        func.lower(Categoria.nome_categoria) == func.lower(nome_normalizado)
    ).first()
    
    if existe_categoria:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Categoria '{existe_categoria.nome_categoria}' já existe"
        )
    
    # 4. Criar com nome normalizado
    nova_categoria = Categoria(nome_categoria=nome_normalizado)
    
    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)
    
    return nova_categoria

@rota_categoria.put("/categories/{categories_id}", response_model=CategoriaPublic)
async def update_category_put(
    categoria_id: UUID,
    categorie_in: CategoriaUpdate,  # ou CategoriaUpdate, tanto faz
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )
    
    # Normalizar nome
    nome_normalizado = categorie_in.nome_categoria.strip().title()
    
    # Verificar duplicidade (excluindo a própria categoria)
    existe = db.query(Categoria).filter(
        func.lower(Categoria.nome_categoria) == func.lower(nome_normalizado),
        Categoria.id_categoria != categoria_id
    ).first()
    
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Já existe categoria com nome '{nome_normalizado}'"
        )
    
    categoria.nome_categoria = nome_normalizado
    db.commit()
    db.refresh(categoria)
    
    return categoria
    
@rota_categoria.delete("/categories/{categories_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    categoria_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    categoria = db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()
    
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria não encontrada"
        )
    
    # Verificar se a categoria tem produtos associados (opcional)
    if categoria.produtos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
             detail="Não é possível excluir categoria com produtos associados"
    )
    
    db.delete(categoria)
    db.commit()
    
    return None  # Retorna 204 No Content



