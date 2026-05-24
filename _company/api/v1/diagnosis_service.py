# /Users/iyeongjae/Desktop/초보프로젝트/_company/api/v1/diagnosis_service.py

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, List

app = FastAPI(title="Diagnosis Score API Mockup")

# --- 💡 스키마 정의 (Self-RAG 근거 기반) ---
class KpiMetricResponse(BaseModel):
    description: str
    score: float
    level: str

class DiagnosisResult(BaseModel):
    """학생 성장 리포트의 핵심 지표를 담는 구조 (Visualizer 및 스키마 통합)."""
    title: str
    overallScore: float
    grade: str
    painPointSummary: str
    gainPotentialStatement: str
    kpiMetrics: List[KpiMetricResponse]
    # 하위 호환성을 위한 구형 필드도 함께 남겨둡니다.
    score: float
    growth_index: float
    engagement_index: float
    monetization_potential: float

@app.get("/api/v1/diagnosis_score", response_model=DiagnosisResult)
async def get_diagnosis_score(
    user_id: str = Query(default="test_user_high"),
    diagnosis_type: str = Query(default="pitch_stability")
):
    """
    사용자 ID와 진단 유형을 기반으로 가상의 Gap Score 및 KPI를 반환합니다. 
    실제 DB 연동 없이 더미 데이터를 사용하며, 데이터 구조 안정성 검증에 중점을 둡니다.
    """
    print(f"--- [Mock API Call] User {user_id} requested diagnosis type: {diagnosis_type} ---")

    # 🚨 비즈니스 로직 Mocking (실제로는 DB에서 데이터를 가져와 계산해야 함)
    if diagnosis_type not in ["pitch_stability", "rhythm_control"]:
        raise HTTPException(status_code=400, detail="Unsupported diagnosis type.")

    # 테스트 케이스별 고정된 더미 값 사용
    if user_id == "test_user_high" and diagnosis_type == "pitch_stability":
        return DiagnosisResult(
            title="화성학 및 발성 종합 진단 결과",
            overallScore=85.0,
            grade="Advanced",
            painPointSummary="현재 기초 음정 정확도에서 미세한 떨림이 발생하여 성장에 한계가 존재합니다.",
            gainPotentialStatement="3화음 해결 관계 트레이닝으로 2주 안에 실력 향상이 예측됩니다.",
            kpiMetrics=[
                KpiMetricResponse(description="Growth (성장 잠재력)", score=85.0, level="High"),
                KpiMetricResponse(description="Engagement (참여도)", score=60.0, level="Medium"),
                KpiMetricResponse(description="Monetization (수익화 잠재력)", score=92.0, level="High")
            ],
            score=8.5, 
            growth_index=0.75, 
            engagement_index=0.60, 
            monetization_potential=0.92
        )
    elif user_id == "test_user_low" and diagnosis_type == "rhythm_control":
         return DiagnosisResult(
            title="화성학 및 발성 종합 진단 결과",
            overallScore=31.0,
            grade="Needs Improvement",
            painPointSummary="박자 유지력 영역의 불안정성이 매우 높습니다.",
            gainPotentialStatement="기본 메트로놈 리듬 피칭 연습이 시급합니다.",
            kpiMetrics=[
                KpiMetricResponse(description="Growth (성장 잠재력)", score=45.0, level="Medium"),
                KpiMetricResponse(description="Engagement (참여도)", score=22.0, level="Low"),
                KpiMetricResponse(description="Monetization (수익화 잠재력)", score=30.0, level="Low")
            ],
            score=3.1, 
            growth_index=0.45, 
            engagement_index=0.22, 
            monetization_potential=0.30
        )
    else:
        # 기본 더미 반환 값 (유효성 검증용)
        return DiagnosisResult(
            title="화성학 및 발성 종합 진단 결과",
            overallScore=50.0,
            grade="Developing",
            painPointSummary="무난한 점수이나 개선의 여지가 다소 존재합니다.",
            gainPotentialStatement="전반적인 연습량을 소폭 향상시킬 것을 권장합니다.",
            kpiMetrics=[
                KpiMetricResponse(description="Growth (성장 잠재력)", score=50.0, level="Medium"),
                KpiMetricResponse(description="Engagement (참여도)", score=40.0, level="Medium"),
                KpiMetricResponse(description="Monetization (수익화 잠재력)", score=50.0, level="Medium")
            ],
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