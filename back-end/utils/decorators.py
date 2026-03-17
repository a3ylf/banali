from functools import wraps
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException


def handle_db_session(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        db = kwargs.get('db')
        try:
            return await func(*args, **kwargs)
        except HTTPException:
            if db:
                db.rollback()
            raise
        except (SQLAlchemyError, Exception) as e:
            if db:
                db.rollback()
            print(f"Erro: {str(e)}")
            raise HTTPException(500, f"Erro no banco de dados: {str(e)}")
    return wrapper