from fastapi import FastAPI

app = FastAPI()

from .routes.autenticacao import rota_autenticacao
from .routes.usuario import rota_usuario
from .routes.categoria import rota_categoria
from .routes.produto import rota_produto

app.include_router(rota_autenticacao)
app.include_router(rota_usuario)
app.include_router(rota_categoria)
app.include_router(rota_produto)