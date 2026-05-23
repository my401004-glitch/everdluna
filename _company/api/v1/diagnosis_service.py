# /Users/iyeongjae/Desktop/초보프로젝트/_company/api/v1/diagnosis_service.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI(title="Diagnosis Score API Mockup")

# --- 💡 스키마 정의 (Self-RAG 근거 기반) ---
class DiagnosisResult(BaseModel):
    """학생 성장 리포트의 핵심 지표를 담는 구조."""
    score: float  # Gap Score (0.0 ~ 10.0)
    growth_index: float # Growth KPI
    engagement_index: float # Engagement KPI
    monetization_potential: float # Monetization KPI

class DiagnosisRequest(BaseModel):
    """진단 점수 계산을 위한 요청 바디."""
    user_id: str
    diagnosis_type: str # 예: 'pitch_stability', 'rhythm_control'

@app.get("/api/v1/diagnosis_score", response_model=DiagnosisResult)
async def get_diagnosis_score(request: DiagnosisRequest):
    """
    사용자 ID와 진단 유형을 기반으로 가상의 Gap Score 및 KPI를 반환합니다. 
    실제 DB 연동 없이 더미 데이터를 사용하며, 데이터 구조 안정성 검증에 중점을 둡니다.
    """
    print(f"--- [Mock API Call] User {request.user_id} requested diagnosis type: {request.diagnosis_type} ---")

    # 🚨 비즈니스 로직 Mocking (실제로는 DB에서 데이터를 가져와 계산해야 함)
    if request.diagnosis_type not in ["pitch_stability", "rhythm_control"]:
        raise HTTPException(status_code=400, detail="Unsupported diagnosis type.")

    # 테스트 케이스별 고정된 더미 값 사용
    if request.user_id == "test_user_high" and request.diagnosis_type == "pitch_stability":
        return DiagnosisResult(
            score=8.5, 
            growth_index=0.75, 
            engagement_index=0.60, 
            monetization_potential=0.92 # 매우 높은 잠재력으로 가정
        )
    elif request.user_id == "test_user_low" and request.diagnosis_type == "rhythm_control":
         return DiagnosisResult(
            score=3.1, 
            growth_index=0.45, 
            engagement_index=0.22, 
            monetization_potential=0.30 # 개선 필요로 가정
        )
    else:
        # 기본 더미 반환 값 (유효성 검증용)
        return DiagnosisResult(
            score=5.0, 
            growth_index=0.5, 
            engagement_index=0.4, 
            monetization_potential=0.5
        )

# 실행을 위한 안내 주석 추가 (개발 편의성 증진)
if __name__ == "__main__":
    import uvicorn
    print("\n[INFO] Mock API Server is running on http://127.0.0.1:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)