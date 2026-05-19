"""
API 엔드포인트: /api/v1/diagnosis_score
기능: 사용자 진단 점수 및 성장 리포트 데이터를 제공합니다.
목표: ROI와 리스크 최소화 관점에서 데이터 기반 통찰을 제공합니다.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
# DB 접근 모듈 임포트 (실제 구현 필요)
from database import get_db_session 
from models import DiagnosisResult, KPI_Metrics # 모델 정의 가정

router = APIRouter()

def get_user_data(user_id: int):
    # 실제로는 RBAC 검증 로직이 여기에 삽입되어야 함. (예: user_role 확인)
    return {"id": user_id, "name": "Test User"}

@router.get("/api/v1/diagnosis_score/{user_id}")
async def get_diagnosis_score(user_id: int):
    """
    사용자의 종합 진단 점수와 성장 리포트를 제공합니다.
    MVP 구현 우선순위: 진단 -> 권한 -> 성과 추적 (권한 검증은 별도 로직으로 분리)
    """
    # 1. 사용자 데이터 및 권한 확인 (Self-Verification Loop 적용 지점)
    user_data = get_user_data(user_id)
    if user_id == 999: # 임시 예외 처리
        raise HTTPException(status_code=404, detail="User not found")

    # 2. DB에서 진단 결과 조회 (DB 스키마 기반)
    # 실제로는 여기서 KPI_Metrics와 Diagnosis_Results를 조인하여 계산 로직을 수행해야 함.
    try:
        result = await get_db_session().execute(
            """
            SELECT 
                DR.*, 
                SUM(CASE WHEN KM.kpi_type = 'Growth' THEN KM.value ELSE 0 END) AS growth_score,
                SUM(CASE WHEN KM.kpi_type = 'Engagement' THEN KM.value ELSE 0 END) AS engagement_score,
                SUM(CASE WHEN KM.kpi_type = 'Monetization' THEN KM.value ELSE 0 END) AS monetization_score
            FROM Diagnosis_Results DR
            JOIN KPI_Metrics KM ON DR.id = KM.context_id
            WHERE DR.user_id = :user_id
            GROUP BY DR.id
            ORDER BY DR.measured_at DESC
            LIMIT 1;
            """
        , {"user_id": user_id}
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="Diagnosis result not found")

        # 3. 최종 JSON 포맷으로 변환 (Designer 요구사항 반영)
        response_data = {
            "diagnosis_id": result['id'],
            "user_context": user_data,
            "report_timestamp": result['measured_at'].isoformat(),
            "growth_score": float(result['growth_score']),
            "engagement_score": float(result['engagement_score']),
            "monetization_score": float(result['monetization_score']),
            "report_details": result # 상세 데이터는 별도 엔드포인트로 분리 가능
        }
        return response_data

    except Exception as e:
        # 에러 발생 시 로깅 및 리스크 최소화 처리
        print(f"Error during diagnosis score retrieval: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during report generation.")