from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 환경변수에서 DB URL을 읽어와야 합니다. (예: postgresql://user:pass@localhost/dbname)
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/vocaldb" 

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """DB 세션을 제공하는 의존성 함수 (FastAPI에서 사용됨)"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()