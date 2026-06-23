import pytest
from unittest.mock import MagicMock, patch
import json
# 컨트롤러가 위치한 디렉토리에서 상대 경로로 임포트한다고 가정합니다.
from src.controllers.diagnosisController import get_diagnosis_score

# =========================================
# Mocking Environment Setup (DB/API Layer)
# 실제 DB나 외부 API 호출을 모킹하여 테스트의 독립성을 보장합니다.
# =========================================

@pytest.fixture
def mock_db_connection():
    """데이터베이스 연결 및 사용자 정보 조회 로직을 모킹합니다."""
    with patch('src.controllers.diagnosisController.db_query', return_value={
        'user_id': 100,
        'role': 'premium', # 기본적으로 유료 사용자로 가정하고 테스트 시작
        'data': {'history': [{'kpi': 'Growth', 'value': 0.8}, {'kpi': 'Engagement', 'value': 0.9}]}}
    ) as mock_query:
        yield mock_query

# =========================================
# Test Cases (Core Functionality Validation)
# =========================================

def test_successful_diagnosis_premium(mock_db_connection):
    """
    [성공 케이스] 유료 사용자(Premium Role)의 정상적인 진단 점수 계산 및 반환 검증.
    KPI 데이터가 충분히 제공되었을 때를 가정합니다.
    """
    # Mocking: 실제로 호출될 외부 API나 복잡한 로직은 여기서 추가 모킹이 필요할 수 있음
    mock_db_connection['role'] = 'premium' # Mock DB Role 설정
    
    score, results = get_diagnosis_score(user_id=100, diagnosis_type="full")

    # 1. 결과값이 None이 아닌지 확인 (성공적인 실행)
    assert score is not None
    # 2. 필수 필드 존재 여부 확인
    assert 'DiagnosisScore' in results['metadata']
    # 3. 핵심 데이터 포인트가 제대로 반환되었는지 검증
    assert 'Growth' in results['diagnosis_results']['kpi_scores']

def test_unauthorized_access_free_user(mock_db_connection):
    """
    [권한 실패 케이스] 무료 사용자(Free Role)가 유료 진단 타입을 요청했을 때의 RBAC 검증.
    """
    # Mocking: DB 역할을 Free로 변경하여 권한 테스트
    with patch('src.controllers.diagnosisController.db_query', return_value={
        'user_id': 200,
        'role': 'free', # 무료 사용자 설정
        'data': {}
    }):
        # 유료 진단 타입을 요청했으나 권한이 없을 때를 시뮬레이션
        score, results = get_diagnosis_score(user_id=200, diagnosis_type="full")

        # 1. 서비스가 실패 메시지를 반환해야 함 (None 또는 특정 오류 코드)
        assert score is None
        # 2. 에러 코드가 'Unauthorized'를 포함하는지 확인
        if results:
             assert "unauthorized" in str(results).lower()

def test_missing_kpi_data_handling(mock_db_connection):
    """
    [예외 케이스] 데이터베이스에서 필수 KPI 정보가 누락되었을 때의 방어 로직 검증.
    실제 서비스 중단 없이 '데이터 부족' 피드백 제공이 목표입니다.
    """
    # Mocking: DB Role 설정 및 핵심 data를 비워서 테스트
    with patch('src.controllers.diagnosisController.db_query', return_value={
        'user_id': 300,
        'role': 'premium',
        'data': {'history': []} # KPI 기록 자체가 없음
    }):
        score, results = get_diagnosis_score(user_id=300, diagnosis_type="full")

        # 1. 시스템이 에러를 반환하는 대신, 안내 메시지를 포함한 결과 구조를 유지해야 합니다.
        assert score is not None # 점수는 계산할 수 없지만, 서비스는 살아있어야 함
        # 2. 명시적인 데이터 부족 경고가 메타데이터에 기록되어야 합니다.
        if results:
            assert "data insufficient" in str(results).lower()

def test_invalid_diagnosis_type():
    """
    [유효성 검증] 존재하지 않는 diagnosis_type을 요청했을 때의 예외 처리 검증.
    """
    # Mocking 없이 입력값 유효성만 테스트합니다.
    score, results = get_diagnosis_score(user_id=999, diagnosis_type="nonexistent")

    # 1. 서비스가 즉시 실패하고, 명확한 에러 메시지를 반환해야 합니다.
    assert score is None
    if results:
        assert "invalid diagnosis type" in str(results).lower()