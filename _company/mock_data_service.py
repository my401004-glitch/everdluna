import random
from typing import Dict, Any, List

def generate_progress_segment(title: str, value: int, max_value: int = 100) -> Dict[str, Any]:
    """단일 시각화 섹션 데이터를 생성합니다."""
    return {
        "type": "progress",
        "title": title,
        "value": min(max_value, max(0, value)), # 값 클램핑
        "max_value": max_value,
        # 임시로 random 색상을 넣고, 실제 통합 시 디자인팀과 논의하여 고정해야 함.
        "color_code": "#" + "%.2r" % (random.randint(0, 0xFFFFFF), 16) 
    }

def generate_mock_diagnosis_result(scenario: str = "average") -> Dict[str, Any]:
    """
    주어진 시나리오에 따라 진단 결과를 모의 생성합니다.
    scenarios: 'low', 'high', 'edge' 등
    """
    if scenario == "high":
        score = random.randint(80, 100)
        status = "HIGH"
        explanation = f"진단 점수 {score}점! 객관적 데이터를 기반으로 확실한 성장 포텐셜을 확인했습니다."
        growth = random.randint(75, 95)
        engagement = random.randint(80, 100)
        monetization = random.randint(60, 85)
    elif scenario == "low":
        score = random.randint(20, 40)
        status = "LOW"
        explanation = f"진단 점수 {score}점. 현재 패턴에 대한 객관적 진단이 필요합니다. 작은 습관 개선부터 시작해야 합니다."
        growth = random.randint(10, 35)
        engagement = random.randint(20, 45)
        monetization = random.randint(15, 30)
    elif scenario == "edge":
        score = random.randint(50, 65) # 중간 난이도지만 특정 KPI가 극단적인 경우 시뮬레이션
        status = "MEDIUM"
        explanation = f"진단 점수 {score}점. 잠재력은 높으나, 특정 영역의 데이터 누적과 전략 수립이 필요합니다."
        growth = random.randint(50, 70)
        engagement = random.randint(40, 60)
        monetization = random.randint(70, 90) # monetization만 높게 설정하여 메시지 강제 유도 테스트
    else: # average scenario
        score = random.randint(50, 75)
        status = "MEDIUM"
        explanation = f"진단 점수 {score}점. 현재 상태를 파악하고 다음 목표 설정을 위한 기준점을 잡는 것이 중요합니다."
        growth = random.randint(40, 60)
        engagement = random.randint(50, 70)
        monetization = random.randint(50, 70)


    # 최종 결과 구조 조합
    result: Dict[str, Any] = {
        "diagnosis_score": {
            "value": score,
            "status": status,
            "explanation": explanation
        },
        "kpi_metrics": {
            "growth_score": growth,
            "engagement_score": engagement,
            "monetization_potential": monetization
        },
        "visual_data_segments": [
            generate_progress_segment("보컬 레인지 (Growth)", growth),
            generate_progress_segment("꾸준함 지수 (Engagement)", engagement),
            generate_progress_segment("시장성/잠재력 (Monetization)", monetization)
        ]
    }
    return result

if __name__ == "__main__":
    # 테스트 실행 예시: 'high' 시나리오 테스트
    print("\n--- [테스트 1: High Potential Scenario] ---")
    result_high = generate_mock_diagnosis_result("high")
    import json
    print(json.dumps(result_high, indent=2))

    # 테스트 실행 예시: 'low' 시나리오 테스트
    print("\n--- [테스트 2: Low Potential Scenario] ---")
    result_low = generate_mock_diagnosis_result("low")
    print(json.dumps(result_low, indent=2))

    # 테스트 실행 예시: 'edge' 시나리오 (특정 KPI 강조)
    print("\n--- [테스트 3: Edge Case Scenario] ---")
    result_edge = generate_mock_diagnosis_result("edge")
    print(json.dumps(result_edge, indent=2))

# NOTE: 이 파일은 API 시뮬레이터 역할을 하며, 실제 백엔드 로직과는 분리되어 있습니다.