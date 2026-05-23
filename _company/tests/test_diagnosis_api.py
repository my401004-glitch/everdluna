import pytest
from fastapi.testclient import TestClient
# 실제 프로젝트 구조에 맞게 임포트 경로 조정 필요
# from app.main import api # 가상의 API 모듈

# Mock Client setup (실제 백엔드 환경에서 사용되는 클라이언트 가정)
client = TestClient("http://localhost:8000") 

def test_successful_diagnosis_flow():
    """
    [Happy Path] 모든 데이터가 정상일 때, 유효한 Gap Score와 리포트 구조를 반환하는지 검증.
    - 테스트 목표: 전체 파이프라인 (입력 -> 로직 -> 출력) 성공 확인.
    """
    # 가상의 유효 사용자 토큰 및 입력 데이터
    valid_token = "Bearer valid-premium-user-token" 
    payload = {
        "context_id": "user_session_abc123",
        "diagnosis_type": "full_potential_analysis", # 프리미엄 유형 가정
        "input_data": {
            "pitch_stability": 0.85,  # 예시 데이터
            "frequency_range": 440,
            "vocal_effort_score": 7.2
        }
    }

    response = client.get("/api/v1/diagnosis_score", headers={"Authorization": valid_token}, params=payload)
    assert response.status_code == 200
    data = response.json()
    
    # 핵심 지표가 존재하고, 필수 필드가 채워져 있는지 검증 (스키마 유효성 체크)
    assert "gap_score" in data and isinstance(data["gap_score"], float)
    assert "recommendation" in data
    print("✅ Test passed: Successful Diagnosis Flow")


def test_rbac_failure_free_user():
    """
    [RBAC Failure] 무료 사용자 토큰으로 유료 진단 리포트 접근 시, 403 Forbidden을 반환하는지 검증.
    - 테스트 목표: 수익화 로직(권한 기반 접근 제어)의 기술적 실존성 확보.
    """
    free_token = "Bearer free-user-token"
    payload = {
        "context_id": "user_session_abc123",
        "diagnosis_type": "full_potential_analysis", # 유료 유형 시도
        "input_data": {}
    }

    response = client.get("/api/v1/diagnosis_score", headers={"Authorization": free_token}, params=payload)
    assert response.status_code == 403
    # 응답 본문에 권한 관련 메시지가 포함되는지 확인 (UX 가이드라인 준수 여부 검토)
    assert "Insufficient permission" in response.json().get("message", "")
    print("✅ Test passed: RBAC Failure Handled")


def test_schema_validation_failure():
    """
    [Schema Validation] 필수 입력 데이터가 누락되거나 형식이 틀릴 때, 400 Bad Request를 반환하는지 검증.
    - 테스트 목표: 백엔드 입력 가드의 안정성 확보.
    """
    # 'diagnosis_type'이 아예 없는 경우 (필수 파라미터 미제공)
    invalid_payload = {
        "context_id": "user_session_abc123",
        # diagnosis_type 누락
        "input_data": {}
    }

    response = client.get("/api/v1/diagnosis_score", headers={"Authorization": "Bearer valid-token"}, params=invalid_payload)
    assert response.status_code == 400
    # 구체적인 에러 메시지 확인 (어떤 필드가 누락되었는지 사용자에게 알려야 함)
    assert "Missing required parameter" in response.json().get("detail", "")
    print("✅ Test passed: Schema Validation Handled")

if __name__ == "__main__":
    pytest.main()