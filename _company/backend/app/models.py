from pydantic import BaseModel, Field
from typing import Dict

# 요청 바디 스키마 정의 (사용자 입력)
class DiagnosisRequest(BaseModel):
    user_id: str = Field(description="진단 대상 사용자 ID")
    diagnosis_type: str = Field(description="진단 유형 (예: pitch, rhythm)")
    audio_file_path: str = Field(description="분석할 오디오 파일 경로")
    # 테스트 용도: 요청에 지연 시간을 강제하여 Latency Test를 할 수 있게 함. 기본 0.5초 지연.
    simulate_latency: float = Field(default=0.5, ge=0.1) 

# 응답 바디 스키마 정의 (API 결과)
class DiagnosisResponse(BaseModel):
    diagnosis_type: str
    gap_score: float = Field(description="데이터 기반 Gap Score (0.0 ~ 1.0)")
    kpis: Dict[str, float] = Field(description="Growth, Engagement, Monetization KPI")
    message: str