import json
from typing import Dict, Any

# --- 🛠️ 가정한 시스템 상수 및 스키마 ---
EXPECTED_SCHEMA = {
    "user_id": str,
    "diagnosis_type": str,  # 예: 'Pitch', 'Frequency Stability'
    "context_id": str,      # 세션 고유 ID
    "timestamp": str,       # ISO Format
    "result_data": dict,    # 진단 결과 JSON 스키마 (핵심)
}

KPI_FIELDS = ["Growth", "Engagement", "Monetization"]


def validate_kpi(kpis: Dict[str, Any]) -> bool:
    """진단 결과 내의 KPI 필드들을 검증합니다. 값이 숫자인지 확인합니다."""
    for field in KPI_FIELDS:
        if field not in kpis or not isinstance(kpis[field], (int, float)):
            print(f"[ERROR] KPI '{field}'가 누락되었거나 유효한 숫자 타입이 아닙니다.")
            return False
    return True


def validate_diagnosis_data(raw_json: str) -> Dict[str, Any]:
    """API Mockup 데이터를 읽어와 스키마 및 비즈니스 로직에 따라 검증합니다."""
    print("\n--- 🚀 데이터 유효성 검증 시작 ---")
    try:
        data = json.loads(raw_json)
    except json.JSONDecodeError:
        raise ValueError("유효하지 않은 JSON 형식입니다.")

    # 1. 기본 스키마 체크 (핵심 필드 존재 여부)
    for field, expected_type in EXPECTED_SCHEMA.items():
        if field not in data or not isinstance(data[field], expected_type):
            raise TypeError(f"필수 필드 '{field}'가 누락되었거나 타입이 다릅니다. (기대: {expected_type.__name__})")

    # 2. KPI 검증 (비즈니스 로직 통합)
    kpis = data['result_data'].get('kpi', {})
    if not validate_kpi(kpis):
        raise ValueError("진단 결과 내의 핵심 KPI 데이터에 문제가 있습니다.")

    print("[✅ SUCCESS] 전체 스키마 및 KPI 유효성 검증 통과. 데이터를 이용해 시각화 준비 완료.")
    return data


def simulate_api_call(mockup_json: str):
    """가상의 API 호출을 시뮬레이션하고 결과를 출력합니다."""
    print("==============================================")
    print("🚀 [API 통합 검증] Mockup Data를 이용한 백엔드 로직 실행")
    print("==============================================")

    try:
        validated_data = validate_diagnosis_data(mockup_json)
        # 이 단계에서 성공적으로 파싱되고 스키마에 맞는 데이터가 나왔음을 확인했습니다.
        return validated_data
    except (ValueError, TypeError) as e:
        print(f"\n[❌ FAILED] 데이터 통합 오류 발생: {e}")
        print("==============================================")
        return None


if __name__ == "__main__":
    # Designer가 제시했다고 가정한 Mockup JSON 예시 (성공 케이스 시뮬레이션)
    MOCKUP_SUCCESS = json.dumps({
        "user_id": "user-1234",
        "diagnosis_type": "Pitch Consistency",
        "context_id": "session-abcde",
        "timestamp": "2026-06-25T10:00:00Z",
        "result_data": {
            "score": 78.5,
            "feedback": "전반적인 피치 안정성이 우수합니다.",
            "kpi": {
                "Growth": 3.2,      # 성장 지표 (높음)
                "Engagement": 4.1,  # 몰입도 (매우 높음)
                "Monetization": 1.5 # 유료 전환 가능성 (보통)
            }
        }
    })

    # 실패 케이스 시뮬레이션 (데이터 누락/오류 발생 가정)
    MOCKUP_FAILURE = json.dumps({
        "user_id": "user-9999",
        "diagnosis_type": "Pitch Consistency",
        "context_id": "session-fail",
        "timestamp": "2026-06-25T10:00:00Z",
        "result_data": {
            "score": 45.0,
            # 'kpi' 필드가 누락되어 오류를 발생시킴
        }
    })

    print("\n\n==================== [테스트 케이스 1: 성공] ====================")
    simulate_api_call(MOCKUP_SUCCESS)

    print("\n\n==================== [테스트 케이스 2: 실패] ====================")
    simulate_api_call(MOCKUP_FAILURE)