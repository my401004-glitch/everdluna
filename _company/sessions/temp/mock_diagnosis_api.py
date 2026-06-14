# Mock Diagnosis Score API Implementation (Temporary)
import json

def get_mock_diagnosis(input_params):
    """
    실제 DB 연결 없이, 진단 보고서의 구조를 모방한 가짜 JSON 데이터를 반환합니다.
    이 함수는 Front-end 목업 테스트용입니다.
    """
    try:
        # 1. 입력 파라미터 로깅 (테스트 용)
        print(f"--- Mock API Input Received ---")
        print(f"Input Params: {input_params}")

        # 2. 핵심 JSON 구조 정의 (실제 리포트의 모든 요소를 담아야 함)
        mock_data = {
            "report_id": "MOCK-1001",
            "user_name": "테스트 사용자 이름", # 실제 값으로 대체될 부분
            "overall_score": 78.5, # 100점 만점 (가정)
            "diagnosis_date": "2026-06-14",
            "key_finding": {
                "title": "⚠️ 핵심 진단: 감성 표현의 객관적 증거 부족", # Pain Point 강조
                "explanation": "기술적으로는 어느 정도 가능하나, 녹음 데이터 상에서 특정 구간의 감정 변화 폭이 포착되지 않았습니다. 이는 입시에서 가장 큰 리스크 요인입니다.",
                "severity_score": 85 # 높은 점수 = 심각한 문제
            },
            "improvement_areas": [
                {"area": "호흡 지지 및 발성 안정화", "current_score": 60, "goal": 90, "action": "매일 10분간 호흡 근력 운동 필수"},
                {"area": "멜로디 라인 구조 분석", "current_score": 75, "goal": 85, "action": "코드 변화에 따른 음정별 패턴 학습 필요"}
            ],
            "recommendation": {
                "title": "다음 액션 플랜: 코치와의 밀착 피드백 (유료 모듈 연계)",
                "description": "AI 진단 결과만으로는 해결할 수 없는 감성적 '변곡점'을 만들기 위해, 전문가의 1:1 컨설팅이 필수입니다." # Funnel 유도 핵심 메시지
            }
        }
        return json.dumps(mock_data)

    except Exception as e:
        return json.dumps({"error": str(e)})

# 예시 테스트 실행 (실제 API가 아님을 명시)
if __name__ == '__main__':
    test_params = {"user_id": 123, "date": "2026-06-14"}
    result = get_mock_diagnosis(test_params)
    print("\n--- Mock API Success ---")
    print(result)