# API 라우터 및 엔드포인트 정의 (FastAPI 기준 가정)
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from src.services.diagnosisService import DiagnosisService

router = APIRouter()

# 요청 바디 스키마 정의 (Pydantic 사용)
class DiagnosisRequest(BaseModel):
    diagnosis_type: str
    raw_data: Dict[str, Any]

# 가상 의존성 주입을 위한 함수 (실제로는 DB 세션 관리 등)
def get_service():
    # 실제 환경에서는 DB 연결 풀에서 객체를 가져와야 합니다.
    return DiagnosisService(db_connection=None) 

@router.post("/v1/diagnosis_score")
async def post_diagnosis_score(request: DiagnosisRequest, service: DiagnosisService = Depends(get_service)):
    """
    진단 점수를 계산하고 저장하는 메인 엔드포인트.
    요청 시 사용자 컨텍스트(ID, Role)가 필요합니다. 
    (여기서는 가상으로 user_id=1, role="Premium" 가정)
    """
    user_context = {"user_id": 1, "role": "Premium"} # 실제는 JWT 등에서 추출

    try:
        result = await service.process_diagnosis(
            user_id=user_context["user_id"],
            diagnosis_type=request.diagnosis_type,
            raw_data=request.raw_data,
            role=user_context["role"]
        )
        return result

    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # 모든 예상치 못한 백엔드 에러를 잡고 기록 (Logging)
        print(f"Fatal Error in Diagnosis API: {e}") 
        raise HTTPException(status_code=500, detail="서버 내부 오류가 발생했습니다.")