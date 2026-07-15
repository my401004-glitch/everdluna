import json
from typing import Dict, Any

# 로컬 모듈 임포트 가정 (실제 경로에 따라 수정 필요)
try:
    from kpi_validator import validate_kpis # 기존 KPI 검증 함수
    from design_validator_service import validate_design_logic # 새로 정의할 디자인 검증 서비스
except ImportError as e:
    print(f"🚨 경고: 필수 모듈 임포트 실패. 파일 경로를 확인해주세요: {e}")


def run_full_diagnostic_validation(diagnosis_context: Dict[str, Any], diagnosis_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    진단 과정의 데이터와 컨텍스트를 받아 3단계의 기술적/디자인적 검증을 수행하는 통합 게이트웨이.

    Args:
        diagnosis_context: 진단을 요청한 사용자 및 시스템 컨텍스트 (RBAC 등에 사용).
        diagnosis_data: 핵심 분석 결과 데이터 (KPI, Gap Score 등).

    Returns:
        검증 결과를 포함하는 최종 딕셔너리. 실패 시 오류 메시지 반환.
    """
    print("✅ [Step 1/3] Running KPI & Business Rule Validation...")
    try:
        kpi_result = validate_kpis(diagnosis_context, diagnosis_data)
        if not kpi_result['success']:
            return {"status": "FAILED", "message": f"KPI 검증 실패: {kpi_result['reason']}", "details": kpi_result}

    except Exception as e:
        return {"status": "ERROR", "message": f"KPI 검증 중 치명적 오류 발생: {e}"}

    print("✅ [Step 2/3] Running Design Logic & Flow Validation...")
    try:
        design_result = validate_design_logic(diagnosis_data) # 데이터 기반 디자인 유효성 검사
        if not design_result['success']:
            return {"status": "FAILED", "message": f"디자인 논리 검증 실패: {design_result['reason']}", "details": design_result}

    except Exception as e:
        return {"status": "ERROR", "message": f"디자인 로직 검증 중 치명적 오류 발생: {e}"}


    print("✅ [Step 3/3] All validations passed. Finalizing Score...")
    # 모든 게이트를 통과했으므로, 최종 점수 계산 (가정)
    final_score = diagnosis_data.get('gap_score', 0)
    return {
        "status": "SUCCESS",
        "message": "모든 기술적/디자인적 검증을 완료했습니다. 프로토타입 데모에 사용 가능합니다.",
        "diagnosis_score": final_score,
        "kpi_metrics": kpi_result['data'], # 성공한 KPI 데이터 반환
        "design_validated_pattern": design_result['data'] # 디자인 검증 패턴 정보 반환
    }

# --- 예시 실행 (실제 API 호출 시 이 로직이 사용됨) ---
if __name__ == "__main__":
    print("--- 통합 진단 게이트웨이 테스트 시작 ---")
    
    # 가상의 컨텍스트와 데이터 정의 (테스트용)
    mock_context = {
        "user_role": "paid", # RBAC 통과 가정
        "subscription_level": 2,
    }
    mock_data = {
        "diagnosis_type": "vocal_growth",
        "gap_score": 85.5, # 높음 -> Problem/Solution 강조 필요
        "kpi_inputs": {"growth": 0.6, "engagement": 0.9, "monetization": 0.4}
    }

    # 실제로 API 호출되는 시점에는 이 함수가 백엔드 프레임워크(FastAPI 등)의 컨트롤러에서 호출될 것입니다.
    validation_result = run_full_diagnostic_validation(mock_context, mock_data)
    print("\n==============================")
    print("최종 검증 결과:", json.dumps(validation_result, indent=4))