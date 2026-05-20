import pytest
from datetime import datetime
import json

# 로컬 환경에 있는 유효성 검증 유틸리티를 임포트합니다.
# 이 파일은 DiagnosisUtility가 API 레이어의 핵심 역할을 수행한다고 가정합니다.
from src.utils.validation_utility import validate_diagnosis_data 

# --- Mock Data Setup ---
# 실제 API에서 들어올 법한 가상의 원본 데이터입니다.
MOCK_API_DATA = {
    "user_id": "user_123",
    "session_context_id": "sess_abcde123",
    "diagnosis_type": "GapScoreDepth", # 진단 타입 명시
    "raw_data": {
        "pitch_stability": 0.75,  # 예: 0.0 ~ 1.0 스케일
        "frequency_variance": 0.82,
        "harmonic_alignment": 0.91
    },
    "user_role": "Premium" # RBAC 테스트용 역할
}

def mock_api_call(data: dict):
    """
    [Mock] 실제 API Gateway 역할을 시뮬레이션하는 함수입니다.
    이 함수는 원본 데이터를 받아 유효성 검사 및 데이터 구조화를 담당합니다.
    """
    print(f"--- Testing E2E Flow for User {data['user_id']} ---")
    
    # 1. Validation Utility를 이용한 핵심 로직 실행 (API 입력 -> Validation)
    try:
        validated_result = validate_diagnosis_data(
            raw_input=data["raw_data"], 
            context_id=data["session_context_id"],
            user_role=data["user_role"] # RBAC 정보도 함께 전달
        )
    except ValueError as e:
        # 유효성 검증 실패 시 예외를 잡고, 에러 구조만 반환합니다.
        return {
            "success": False, 
            "error_code": "VALIDATION_FAILED", 
            "message": str(e)
        }

    # 2. Validation 결과를 Designer가 요구하는 시각화 데이터 포맷으로 변환 (Mapping Layer)
    if validated_result and validated_result['success']:
        visualization_data = {
            "diagnosis_type": data["diagnosis_type"],
            "timestamp": datetime.now().isoformat(),
            # Gap Score Visualization을 위한 핵심 Metric 매핑
            "gap_score": round(validated_result['calculated_metrics']['overall_gap'], 3),
            "kpi_details": {
                "growth": validated_result['calculated_metrics'].get('growth', 0.5),
                "engagement": validated_result['calculated_metrics'].get('engagement', 0.6),
                "monetization": validated_result['calculated_metrics'].get('monetization', 0.4)
            },
            "report_status": "READY" # 시각화 컴포넌트가 사용할 상태 값
        }
        return {
            "success": True, 
            "data": visualization_data
        }
    else:
        # 유효성 검증 실패 또는 기타 오류 처리
        return {"success": False, "message": "Validation failed or missing data."}

@pytest.mark.e2e
def test_successful_diagnosis_flow():
    """[Happy Path] 모든 데이터가 완벽하게 들어와서 성공적으로 시각화 데이터를 생성하는 경우를 테스트합니다."""
    print("\n[TEST START] Running Successful Diagnosis Flow Test...")
    
    # API 호출 시뮬레이션 (성공 예상 데이터)
    result = mock_api_call(MOCK_API_DATA)
    
    assert result["success"] is True, f"Expected success but got error: {result.get('message')}"
    data = result['data']

    # Designer 프로토타입 매핑 검증 1: 핵심 지표 존재 여부
    assert 'gap_score' in data, "Visualization data must contain 'gap_score'."
    # Designer 프로토타입 매핑 검증 2: KPI 데이터 구조 확인
    assert 'kpi_details' in data and isinstance(data['kpi_details'], dict), "KPI details structure mismatch."
    
    print("✅ E2E Test Passed: Successful flow validation confirmed.")

@pytest.mark.e2e
def test_rbac_restriction_flow():
    """[Failure Path] 유효성 검증은 성공했으나, 사용자 권한(Role) 문제로 시각화 데이터가 제한되는 경우를 테스트합니다."""
    print("\n[TEST START] Running RBAC Restriction Flow Test...")

    # Mock API 데이터를 무료 사용자 (Free User)로 변경
    mock_data = MOCK_API_DATA.copy()
    mock_data["user_role"] = "Free" 
    
    # mock_api_call 내부의 validate_diagnosis_data가 RBAC 로직을 처리한다고 가정하고 호출
    result = mock_api_call(mock_data)

    assert result["success"] is True, f"Expected success with limitation message but got error: {result.get('message')}"
    data = result['data']

    # Designer 프로토타입 매핑 검증 3: 권한 제한으로 인한 데이터 변형 확인
    # (예: 유료 사용자만 볼 수 있는 Monetization 점수가 기본값(0) 또는 대체 값으로 처리되어야 함)
    assert data['kpi_details']['monetization'] <= 0.1, "Monetization KPI should be restricted for Free Users."
    print("✅ E2E Test Passed: RBAC restriction successfully detected and mapped.")

@pytest.mark.e2e
def test_invalid_input_data_flow():
    """[Failure Path] API 입력 데이터 자체가 유효하지 않아 ValidationUtility가 에러를 반환하는 경우를 테스트합니다."""
    print("\n[TEST START] Running Invalid Input Data Flow Test...")

    # Mock API 데이터를 의도적으로 파괴하여 전송
    invalid_data = MOCK_API_DATA.copy()
    invalid_data["raw_data"] = {
        "pitch_stability": 1.5, # 유효 범위 초과 (가정)
        "frequency_variance": "N/A", # 숫자여야 하는데 문자열 전송
        "harmonic_alignment": None
    }

    result = mock_api_call(invalid_data)

    assert result["success"] is False, "Expected failure due to invalid input data."
    # 에러 메시지 코드와 함께 실패했음을 확인합니다.
    assert result.get("error_code") == "VALIDATION_FAILED", "Error code mismatch for invalid input."
    print("✅ E2E Test Passed: Invalid data handling successfully caught and reported.")