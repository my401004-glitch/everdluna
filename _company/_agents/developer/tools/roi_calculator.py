import json
from typing import Dict, Any

# ========================================================
# 1. 비즈니스 상수 (Conversion Factors) 정의 - [근거: CEO 지시]
# 이 값들은 나중에 DB 또는 별도의 Config API에서 로드되어야 합니다.
# 현재는 초기 가정을 위해 상수로 정의합니다.
# ========================================================

# KPI별 재정적 가치 변환 계수 (예: 1점당 기대 매출/유지 비용 절감액)
KPI_CONVERSION_FACTORS = {
    "growth": 50,     # Growth Score 1점당 예상 가치 ($50)
    "engagement": 20, # Engagement Score 1점당 유지 가치 ($20)
    "monetization": 80 # Monetization Score 1점당 전환 기여 가치 ($80)
}

def calculate_roi(diagnosis_data: Dict[str, Any]) -> float:
    """
    진단 데이터(DiagnosisScore JSON 구조 예상)를 입력받아 ROI 점수를 계산합니다.

    Args:
        diagnosis_data: API 응답 형태의 진단 결과 딕셔너리.
                         필수 키: 'kpi_metrics' (Dict[str, float])

    Returns:
        총 ROI 점수 (float). 계산 실패 시 0.0을 반환합니다.
    """
    if not diagnosis_data or "kpi_metrics" not in diagnosis_data:
        print("⚠️ 경고: 유효한 KPI 메트릭이 포함되지 않은 진단 데이터를 받았습니다.")
        return 0.0

    kpis = diagnosis_data["kpi_metrics"]
    total_roi = 0.0
    
    # 각 KPI별로 가중치 적용하여 ROI 점수 계산
    try:
        for kpi_name, score in kpis.items():
            if kpi_name not in KPI_CONVERSION_FACTORS:
                print(f"⚠️ 경고: 알 수 없는 KPI '{kpi_name}'가 발견되어 무시합니다.")
                continue
            
            # ROI = 점수 * 변환 계수
            roi_contribution = score * KPI_CONVERSION_FACTORS[kpi_name]
            total_roi += roi_contribution

    except TypeError as e:
        print(f"❌ 치명적 에러 발생: 데이터 타입 오류. 입력 데이터를 확인하세요. ({e})")
        return 0.0
    
    # 최종 로직 검증: ROI는 점수가 높을수록 높아져야 합니다. (단순 합산이므로 OK)
    return round(total_roi, 2)


def generate_detailed_report(diagnosis_data: Dict[str, Any], user_context: Dict[str, str]) -> Dict[str, Any]:
    """
    최종 보고서 구조를 생성하고 ROI 계산 결과를 포함합니다.
    
    Args:
        diagnosis_data: 진단 결과 데이터 딕셔너리.
        user_context: 사용자 컨텍스트 (예: 'role', 'subscription_level').

    Returns:
        완성된 상세 보고서 구조 딕셔너리.
    """
    # ROI 계산을 통해 핵심 지표를 도출합니다.
    roi_score = calculate_roi(diagnosis_data)
    
    report = {
        "summary": "AI 보컬 성장 종합 진단 리포트",
        "diagnostics": diagnosis_data,
        "financial_assessment": {
            "calculated_roi_score": roi_score,
            "interpretation": f"{'매우 높은 가치': 'ROI가 높음', '보통 수준': '적절한 관리가 필요'} 등 (추후 상세 로직 추가)",
            "recommended_action": "KPI 개선을 위한 맞춤형 학습 모듈 추천" # Placeholder
        },
        "user_context_applied": user_context
    }
    return report

# ========================================================
# 2. 테스트 코드 블록 (필수)
# ========================================================

if __name__ == "__main__":
    print("--- ROI Calculator Test Start ---")
    
    # 가상의 진단 데이터 구조 (API 응답과 동일하다고 가정)
    mock_diagnosis_data = {
        "overall_score": 85,
        "kpi_metrics": {
            "growth": 7.5,       # Growth Score
            "engagement": 9.0,   # Engagement Score
            "monetization": 6.0  # Monetization Score
        },
        "diagnosis_type": "Overall Vocal Assessment"
    }

    user_context = {
        "role": "student",
        "subscription_level": "premium"
    }

    # 1. ROI 계산 테스트
    calculated_roi = calculate_roi(mock_diagnosis_data)
    print(f"\n✅ [테스트 1] 계산된 총 ROI 점수: {calculated_roi}") # 예상 값: (7.5*50) + (9.0*20) + (6.0*80) = 375 + 180 + 480 = 1035

    # 2. 전체 보고서 생성 테스트
    final_report = generate_detailed_report(mock_diagnosis_data, user_context)
    print("\n✅ [테스트 2] 상세 보고서 구조화 완료:")
    print(json.dumps(final_report['financial_assessment'], indent=4))

    # 실패 케이스 테스트 (데이터 누락)
    failed_mock_data = {"overall_score": 50}
    calculate_roi(failed_mock_data)
    
    print("\n--- ROI Calculator Test End ---")