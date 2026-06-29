import json
from typing import Dict, Any, Optional

class DataValidationError(Exception):
    """데이터 유효성 검증 실패 시 발생하는 커스텀 예외."""
    pass

class ValidationUtility:
    """
    진단 결과 데이터의 구조적 무결성과 비즈니스 규칙을 검증하는 유틸리티 레이어.
    [근거: sessions/2026-05-18T14-34/developer.md, self-ragn]
    """

    @staticmethod
    def validate_diagnosis_result(data: Dict[str, Any], user_role: str) -> bool:
        """
        진단 결과 딕셔너리가 필수 스키마 및 비즈니스 규칙을 따르는지 검증합니다.
        :param data: 진단 결과를 담은 딕셔너리.
        :param user_role: 현재 사용자 역할 (RBAC 구현에 사용).
        :raises DataValidationError: 유효성 검사 실패 시 발생.
        """
        required_fields = [
            "context_id", "timestamp", "diagnosis_type", 
            "result_data", "kpi_metrics"
        ]

        # 1. 필수 필드 존재 여부 체크 (Schema Check)
        for field in required_fields:
            if field not in data or data[field] is None:
                raise DataValidationError(f"필수 필드 누락 또는 Null 값 감지: '{field}'")

        # 2. RBAC 체크 (Role-Based Access Control) [근거: sessions/2026-05-18T13:43]
        if data["diagnosis_type"] == "Premium" and user_role != "PaidUser":
            raise DataValidationError("권한 부족: 프리미엄 진단 결과에 접근할 수 없습니다. (RBAC Check)")

        # 3. result_data 스키마 검증 및 KPI 범위 체크 [근거: sessions/2026-05-18T14-34/developer.md]
        try:
            result_data = data["result_data"]
            if not isinstance(result_data, dict):
                raise TypeError("result_data는 반드시 JSON Dictionary 형태여야 합니다.")

            # 핵심 KPI 값들이 예상 범위를 벗어나는지 체크 (Business Rule)
            kpi_metrics = data.get("kpi_metrics", {})
            if not isinstance(kpi_metrics, dict):
                 raise TypeError("kpi_metrics는 반드시 Dictionary 형태여야 합니다.")

            # Growth Score는 0~100 범위여야 함
            growth_score = kpi_metrics.get("GrowthScore")
            if growth_score is not None and (not isinstance(growth_score, (int, float)) or not (0 <= growth_score <= 100)):
                raise DataValidationError(f"유효하지 않은 Growth Score 범위: {growth_score}. 0~100 사이여야 합니다.")

            # Engagement 및 Monetization 점수도 유효성 검증 로직 추가 가능.

        except TypeError as e:
             raise DataValidationError(f"데이터 타입 오류 발생: {e}")


        return True

    @staticmethod
    def validate_kpi_metrics(kpis: Dict[str, Any]) -> bool:
        """KPI 딕셔너리가 필수 키와 유효한 데이터 타입을 갖는지 검증합니다."""
        required_keys = ["GrowthScore", "EngagementScore", "MonetizationScore"]
        for key in required_keys:
            if key not in kpis or kpis[key] is None:
                raise DataValidationError(f"KPI 필수 항목 누락: '{key}'")

        # 타입 강제 검증 (예시)
        try:
            float(kpis["GrowthScore"])
            float(kpis["EngagementScore"])
            float(kpis["MonetizationScore"])
        except ValueError:
             raise DataValidationError("KPI 항목의 값이 숫자 형태가 아닙니다.")

        return True

# 테스트용 더미 데이터 (예시)
SAMPLE_VALID_DATA = {
    "context_id": 123,
    "timestamp": "2026-05-20T10:00:00",
    "diagnosis_type": "Premium",
    "result_data": {"score": 85.5, "detail": "Good progress"},
    "kpi_metrics": {
        "GrowthScore": 75.2,  # 유효 범위
        "EngagementScore": 60.1,
        "MonetizationScore": 45.0
    }
}

SAMPLE_INVALID_DATA = {
    "context_id": "A-45", # 타입 오류 가능성
    "timestamp": None,   # Null 값
    "diagnosis_type": "Basic",
    "result_data": "Not a dict", # 스키마 불일치
    "kpi_metrics": {
        "GrowthScore": 120.5, # 범위 초과 (Business Rule)
        "EngagementScore": 60.1,
        "MonetizationScore": None # 필수 값 누락
    }
}

def validate_diagnosis_data(raw_input: Dict[str, Any], context_id: str, user_role: str) -> Dict[str, Any]:
    """
    [E2E/API Helper] API 입력 데이터를 받아 유효성 검사 및 데이터 구조화를 담당합니다.
    """
    if not context_id:
        raise ValueError("context_id가 필요합니다.")

    # 1. raw_input 검증
    for field in ["pitch_stability", "frequency_variance", "harmonic_alignment"]:
        if field not in raw_input or raw_input[field] is None:
            raise ValueError(f"필수 필드 누락: {field}")
        
        val = raw_input[field]
        if not isinstance(val, (int, float)):
            raise ValueError(f"필드 {field}는 숫자여야 합니다.")
        
        if not (0.0 <= val <= 1.0):
            raise ValueError(f"필드 {field}는 0.0과 1.0 사이여야 합니다: {val}")

    # 2. 계산된 지표 구성
    pitch = raw_input["pitch_stability"]
    freq = raw_input["frequency_variance"]
    harmonic = raw_input["harmonic_alignment"]
    
    # overall_gap 예시 계산
    overall_gap = 1.0 - (pitch + freq + harmonic) / 3.0
    
    growth = pitch
    engagement = freq
    monetization = harmonic
    
    # 3. RBAC 제한 처리 (무료 사용자일 경우 monetization 제한)
    if user_role == "Free":
        monetization = 0.0

    return {
        "success": True,
        "calculated_metrics": {
            "overall_gap": overall_gap,
            "growth": growth,
            "engagement": engagement,
            "monetization": monetization
        }
    }