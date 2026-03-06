import os
import traceback

from app.database import engine, Base

# importa os models para registrar no metadata
import app.models  # noqa: F401


def main():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        print("Error creating tables:")
        traceback.print_exc()

if __name__ == "__main__":
    main()