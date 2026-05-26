from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, text
from .database import Base

# 1. 사용자 테이블 (Authentication)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="basic") # basic, premium, admin (RBAC 기준)

# 2. 진단 결과 테이블 (Diagnosis Result - 핵심 데이터)
class DiagnosisResult(Base):
    __tablename__ = "diagnosis_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False) # Foreign Key: User.id
    diagnosis_type = Column(String, index=True, nullable=False) # 예: PitchDeviation, Resonance
    score_data = Column(JSON, nullable=True) # { "index": 0.85, "deviation": 12 }
    created_at = Column(DateTime, default=datetime.utcnow)

# 3. KPI 측정 지표 테이블 (KPI Metrics - 재무/성장 추적용)
class KPIMetric(Base):
    __tablename__ = "kpi_metrics"
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, nullable=False) # Foreign Key: DiagnosisResult.id
    metric_name = Column(String, index=True, nullable=False) # Growth, Engagement, Monetization
    value = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)