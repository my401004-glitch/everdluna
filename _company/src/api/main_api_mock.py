from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json

# API Mockup의 목적: Designer가 제작한 Pain Point Shock Visualization에 필요한 더미 데이터 제공
app = FastAPI(title="Diagnosis API Mock", version="0.1.0")

# --- 1. Request Body 정의 (Input Data) ---
class DiagnosisInput(BaseModel):
    """사용자가 진단 페이지에서 제출하는 가상의 핵심 데이터 구조."""
    user_id: str
    diagnosis_type: str  # 예: "vocal_range", "rhythm_timing"
    raw_score_data: dict # 추가적인 원시 점수 데이터를 담을 딕셔너리

# --- 2. Response Body 정의 (Output Data) ---
class KpiMetrics(BaseModel):
    """성장, 몰입, 수익화와 같은 핵심 지표."""
    growth_potential: float  # 잠재적 성장률 (%)
    engagement_score: float # 사용자 참여 점수 (0-100)
    monetization_value: float # 예상되는 서비스 가치 ($)

class DiagnosisResult(BaseModel):
    """최종 진단 결과 및 충격화된 데이터 구조."""
    diagnosis_id: str
    overall_score: float  # 최종 종합 점수 (100점 만점 기준)
    shock_level: str      # 감정적 임팩트를 정의하는 레벨 (e.g., 'Critical', 'Needs Improvement')
    pain_point_summary: str # 가장 시급히 해결해야 할 문제 요약 문구
    kpi_metrics: KpiMetrics

@app.post("/temp/diagnosis_mock", response_model=DiagnosisResult)
async def mock_submit_diagnosis(data: DiagnosisInput):
    """
    [Mock Endpoint] 사용자가 제출한 진단 데이터를 받아 가짜 점수와 충격화된 결과를 반환합니다.
    실제 DB 호출 없이, Mockup 테스트를 위해 고정된 (Static) 데이터를 반환합니다.
    """
    print(f"Received mock submission for user: {data.user_id} ({data.diagnosis_type})")

    # 임시로 정의하는 더미 데이터 로직 (Mocking Logic)
    if data.diagnosis_type == "vocal_range":
        overall = 58.2  # 낮은 점수 설정하여 Shock Effect 유발
        shock = "Critical: 음역대 하한선 부족으로 인한 폭넓은 표현력의 제한"
        summary = "현재 목소리의 범위를 벗어나지 못하고 있어, 전반적인 음악적 스펙트럼 확장이 절실합니다."
    elif data.diagnosis_type == "rhythm_timing":
        overall = 75.0
        shock = "Warning: 리듬의 미세한 박자 불안정성"
        summary = "전체적인 구조는 좋으나, 특정 구간에서 타이밍이 자주 흐트러져 전문성이 떨어집니다."
    else:
        overall = 85.0
        shock = "Stable: 전반적으로 균형 잡힌 기본기 보유"
        summary = "현재 점수는 평균 이상이나, 더 높은 단계로 가기 위해 특화된 영역 강화가 필요합니다."

    # Mock KPI 데이터 생성
    mock_kpis = KpiMetrics(
        growth_potential=35.0,     # 비교적 낮게 설정 (개선 여지)
        engagement_score=78.0,     # 중간 수준
        monetization_value=120.0   # 예상 가치
    )

    return DiagnosisResult(
        diagnosis_id="MOCK-20260629",
        overall_score=round(overall, 1),
        shock_level=shock,
        pain_point_summary=summary,
        kpi_metrics=mock_kpis
    )

# 테스트용 실행 명령어 (실제 사용 시 FastAPI 서버를 통해 접근해야 함)
if __name__ == "__main__":
    import uvicorn
    print("="*50)
    print("✨ Mock API가 성공적으로 준비되었습니다. 이 파일은 백엔드에서 /temp/diagnosis_mock으로 호출될 예정입니다.")
    print("==============================================")