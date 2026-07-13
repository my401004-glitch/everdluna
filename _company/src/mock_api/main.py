from fastapi import FastAPI, HTTPException, Depends, Body
from pydantic import BaseModel
import uvicorn
from typing import Literal, Dict, Any

# --- 1. 데이터 모델 정의 (API 계약 준수) ---
class DiagnosisRequest(BaseModel):
    """클라이언트로부터 받는 진단 요청 페이로드."""
    user_id: str
    diagnosis_type: str # 예: 'Growth', 'Engagement', 'Monetization'
    context_data: Dict[str, Any] # 추가 컨텍스트 데이터

class DiagnosisResult(BaseModel):
    """API가 반환하는 진단 결과 스키마."""
    is_success: bool
    message: str
    score_data: Dict[str, float] # 예: {"Growth": 8.5, "Engagement": 7.2}
    recommendation: str
    required_role: Literal["Free", "Premium", "Admin"]

# --- 2. FastAPI 앱 초기화 및 라우팅 정의 ---
app = FastAPI(title="Diagnosis Mock API")

@app.get("/")
def root():
    return {"status": "Mock Diagnosis API Operational"}

# 핵심 진단 엔드포인트 (QA_Technical_Verification_Plan_V2.0 참조)
@app.post("/api/v1/diagnosis_score", response_model=DiagnosisResult)
async def get_diagnosis_score(request: DiagnosisRequest):
    """진단 요청을 받아 성공, 실패, 권한 등 다양한 시나리오를 목업으로 반환."""

    user_role = "Premium" # 임시 설정 값. 실제로는 DB에서 가져와야 함.

    # 1. [RBAC 체크] 사용자가 해당 진단을 볼 권한이 있는지 확인 (가장 먼저 검증)
    if request.diagnosis_type == 'Monetization' and user_role == "Free":
        raise HTTPException(status_code=403, detail="접근 거부: 이 리포트는 Premium 등급 이상의 사용자만 접근 가능합니다.")

    # 2. [데이터 유효성 검증] 요청 데이터가 필수 스키마를 따르는지 확인 (이 부분은 Pydantic에서 처리됨)
    if not request.context_data or 'score' not in str(request.context_data):
        raise HTTPException(status_code=400, detail="요청 실패: context_data에 'score' 키가 누락되었습니다.")

    # 3. [진단 로직 시뮬레이션] (Mock Logic)
    try:
        # 성공 케이스 시뮬레이션
        mock_scores = {
            "Growth": float(request.context_data.get('growth', 0)) * 1.1,
            "Engagement": float(request.context_data.get('engagement', 0)),
            "Monetization": float(request.context_data.get('monetization', 0)),
        }

        # 성공 응답 반환
        return DiagnosisResult(
            is_success=True,
            message="진단 점수 계산 및 분석 완료.",
            score_data={k: round(v, 2) for k, v in mock_scores.items()},
            recommendation="현재 진단 결과에 따라 [구독 업그레이드]를 추천합니다.",
            required_role=user_role
        )

    except Exception as e:
        # 예상치 못한 서버 에러 처리
        print(f"Unexpected error during diagnosis: {e}")
        raise HTTPException(status_code=500, detail="서버 내부 오류가 발생했습니다. 나중에 다시 시도해주세요.")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)