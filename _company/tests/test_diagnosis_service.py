# unittest 또는 pytest 프레임워크를 사용한다고 가정합니다.
import pytest
import asyncio
from unittest.mock import MagicMock, patch
from src.services.diagnosisService import DiagnosisService

@pytest.fixture
def mock_db():
    """가짜 DB 연결 객체 제공"""
    return MagicMock()

@pytest.fixture
def diagnosis_service(mock_db):
    """서비스 클래스 인스턴스화 및 Mock DB 주입"""
    return DiagnosisService(db_connection=mock_db)

# --- 성공 시나리오 테스트 ---
def test_successful_diagnosis_process(diagnosis_service, mock_db):
    """권한 체크와 스키마 검증 모두 통과하는 정상 진단 과정."""
    user_id = 1
    role = "Premium"
    raw_data = {"score": 85.0, "relevance_score": 70, "potential_value": 30}
    diagnosis_type = "Growth"

    # DB의 비동기 메서드 호출을 모킹합니다.
    with patch('src.services.diagnosisService.DiagnosisService._save_diagnosis_results', return_value=1001) as mock_result, \
         patch('src.services.diagnosisService.DiagnosisService._save_kpi_metrics') as mock_kpi:

        # 실행 및 결과 확인
        service = DiagnosisService(db_connection=mock_db) # 인스턴스를 다시 생성하여 테스트합니다.
        result = asyncio.run(service.process_diagnosis(user_id, diagnosis_type, raw_data, role))

        # 1. 권한 체크가 실패하지 않았는지 확인
        assert result["success"] is True
        
        # 2. DB 호출이 올바르게 이루어졌는지 검증 (핵심)
        mock_result.assert_called_once() # 결과 저장 시도
        mock_kpi.assert_called_once()   # KPI 저장 시도

# --- 실패 시나리오 테스트: 권한 위반 ---
def test_diagnosis_failure_permission_denied(diagnosis_service, mock_db):
    """무료 사용자(Free)가 유료 진단 타입(Monetization)에 접근할 때의 방어 로직 검증."""
    user_id = 1
    role = "Free" # 제한된 역할 설정
    raw_data = {"score": 50, "relevance_score": 50, "potential_value": 10}
    diagnosis_type = "Monetization" # 접근 제한 타입

    # 예외가 발생해야 하므로 pytest.raises를 사용합니다.
    with pytest.raises(PermissionError) as excinfo:
        service = DiagnosisService(db_connection=mock_db)
        asyncio.run(service.process_diagnosis(user_id, diagnosis_type, raw_data, role))

    assert "접근 제한됩니다" in str(excinfo.value)


# --- 실패 시나리오 테스트: 스키마 유효성 검사 실패 ---
def test_diagnosis_failure_invalid_schema(diagnosis_service, mock_db):
    """필수 필드가 누락되거나 타입이 잘못된 경우의 처리 로직 검증."""
    user_id = 1
    role = "Premium"
    raw_data = {"score": "Error"} # 스코어는 숫자여야 하는데 문자열일 경우
    diagnosis_type = "Growth"

    with pytest.raises(ValueError) as excinfo:
        service = DiagnosisService(db_connection=mock_db)
        asyncio.run(service.process_diagnosis(user_id, diagnosis_type, raw_data, role))

    assert "스키마가 유효하지 않습니다" in str(excinfo.value)