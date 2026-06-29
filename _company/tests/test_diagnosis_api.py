import pytest
from fastapi.testclient import TestClient
from src.api.main_api_mock import app

client = TestClient(app)

def test_successful_diagnosis_mock_vocal_range():
    """vocal_range 진단 타입으로 요청 시 성공적으로 결과를 반환하는지 테스트합니다."""
    payload = {
        "user_id": "test-user-123",
        "diagnosis_type": "vocal_range",
        "raw_score_data": {"pitch_accuracy": 0.8}
    }
    response = client.post("/temp/diagnosis_mock", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert data["diagnosis_id"] == "MOCK-20260629"
    assert data["overall_score"] == 58.2
    assert "Critical" in data["shock_level"]
    assert "growth_potential" in data["kpi_metrics"]

def test_successful_diagnosis_mock_rhythm_timing():
    """rhythm_timing 진단 타입으로 요청 시 성공적으로 결과를 반환하는지 테스트합니다."""
    payload = {
        "user_id": "test-user-123",
        "diagnosis_type": "rhythm_timing",
        "raw_score_data": {"latency": 12}
    }
    response = client.post("/temp/diagnosis_mock", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert data["overall_score"] == 75.0
    assert "Warning" in data["shock_level"]

def test_schema_validation_failure_missing_field():
    """필수 필드(user_id)가 누락되었을 때 422 Unprocessable Entity 에러가 발생하는지 검증합니다."""
    # user_id 필드 누락
    payload = {
        "diagnosis_type": "vocal_range",
        "raw_score_data": {}
    }
    response = client.post("/temp/diagnosis_mock", json=payload)
    assert response.status_code == 422  # FastAPI의 Pydantic 유효성 검증 실패 코드