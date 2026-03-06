from fastapi import FastAPI

app = FastAPI()

from .routes.autenticacao import rota_autenticacao
from .routes.usuario import rota_usuario

app.include_router(rota_autenticacao)
app.include_router(rota_usuario)