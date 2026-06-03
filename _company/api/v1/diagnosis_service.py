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

# --- 💡 B2B 비즈니스 진단 보고서 스키마 및 엔드포인트 추가 ---
class ChurnMetrics(BaseModel):
    metric_name: str
    current_value_pct: float
    benchmark_value_pct: float
    gap_value_pct: float
    estimated_monthly_loss_krw: float

class InstructorMetrics(BaseModel):
    metric_name: str
    current_hours: float
    optimized_hours_est: float
    saved_hours_est: float
    saved_cost_krw: float

class PricePremiumMetrics(BaseModel):
    metric_name: str
    current_fee_avg_krw: float
    justifiable_premium_fee_krw: float
    potential_revenue_increase_krw: float

class PainPoints(BaseModel):
    short_term_churn: ChurnMetrics
    instructor_efficiency: InstructorMetrics
    price_premium: PricePremiumMetrics

class ReportSummary(BaseModel):
    total_students: int
    at_risk_count: int
    churn_rate_benchmark_gap_pct: float

class RoiSimulation(BaseModel):
    monthly_total_saving_krw: float
    monthly_revenue_preservation_krw: float
    monthly_net_gain_krw: float
    payback_period_months: float

class BusinessDiagnosticReport(BaseModel):
    academy_id: str
    period_days: int
    summary: ReportSummary
    pain_points: PainPoints
    roi_simulation: RoiSimulation

@app.get("/api/v1/diagnostic-report/business", response_model=BusinessDiagnosticReport)
async def get_business_diagnostic_report(
    academy_id: str = Query(default="academy_seoul_vocal"),
    period_days: int = Query(default=30)
):
    """
    학원 운영자(원장)용 B2B 리스크 분석 및 ROI 시뮬레이션 데이터를 반환합니다.
    """
    print(f"--- [Mock API Call] Academy {academy_id} requested business diagnostic report ---")
    return BusinessDiagnosticReport(
        academy_id=academy_id,
        period_days=period_days,
        summary=ReportSummary(
            total_students=45,
            at_risk_count=8,
            churn_rate_benchmark_gap_pct=12.5
        ),
        pain_points=PainPoints(
            short_term_churn=ChurnMetrics(
                metric_name="3개월 내 이탈 위험 수강생 비율",
                current_value_pct=28.5,
                benchmark_value_pct=15.0,
                gap_value_pct=13.5,
                estimated_monthly_loss_krw=2400000.0
            ),
            instructor_efficiency=InstructorMetrics(
                metric_name="강사 주간 수작업 피드백 시간",
                current_hours=18.5,
                optimized_hours_est=1.8,
                saved_hours_est=16.7,
                saved_cost_krw=250500.0
            ),
            price_premium=PricePremiumMetrics(
                metric_name="객관적 AI 진단 도입 시 요금 저항선 극복 잠재력",
                current_fee_avg_krw=280000.0,
                justifiable_premium_fee_krw=330000.0,
                potential_revenue_increase_krw=2250000.0
            )
        ),
        roi_simulation=RoiSimulation(
            monthly_total_saving_krw=250000.0,
            monthly_revenue_preservation_krw=2400000.0,
            monthly_net_gain_krw=2650000.0,
            payback_period_months=0.5
        )
    )

# 실행을 위한 안내 주석 추가 (개발 편의성 증진)
if __name__ == "__main__":
    import uvicorn
    print("\n[INFO] Mock API Server is running on http://127.0.0.1:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)