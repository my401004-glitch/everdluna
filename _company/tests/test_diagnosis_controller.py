import pytest
from src.controllers.diagnosisController import get_diagnosis_score

def test_successful_diagnosis_score_retrieval():
    """get_diagnosis_score가 올바른 결과를 반환하는지 테스트합니다."""
    context_id = "sess-12345"
    user_role = "Premium"
    
    result = get_diagnosis_score(context_id=context_id, user_role=user_role)
    
    assert result is not None
    assert result["contextId"] == context_id
    assert result["gapScore"] == 0.75
    assert "metrics" in result
    assert "warningSignal" in result
    assert result["warningSignal"]["isWarningActive"] is True