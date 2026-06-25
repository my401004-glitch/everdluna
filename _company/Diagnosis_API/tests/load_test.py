import time
from locust import HttpUser, task, between

# API 엔드포인트와 파라미터는 기존의 Gap Score 로직을 따릅니다.
DIAGNOSIS_ENDPOINT = "/api/v1/diagnosis_score"

class DiagnosisLoadTestUser(HttpUser):
    """
    Gap Score 진단 점수 API에 부하를 주는 사용자 시뮬레이션 클래스입니다.
    """
    wait_time = between(0, 1)  # 요청 간 대기 시간 (초)

    @task
    def check_diagnosis_score(self):
        """
        진단 점수를 조회하는 API 엔드포인트를 호출합니다.
        실제 사용 시나리오를 반영하여 가상의 진단 파라미터를 전달합니다.
        """
        payload = {
            "context_id": "simulated_user_123",  # 고유 컨텍스트 ID
            "diagnosis_type": "GapScore",
            "request_params": {
                "period": "last_7_days",
                "kpi_focus": ["Growth", "Engagement"] # 주요 KPI를 집중적으로 요청
            }
        }
        
        # POST 또는 GET 형태가 될 수 있으나, 데이터 전송이 필요하므로 JSON 데이터를 담는 POST로 가정합니다.
        self.client.post(DIAGNOSIS_ENDPOINT, json=payload)

if __name__ == "__main__":
    print("=========================================================")
    print("🚀 Gap Score API 부하 테스트 스크립트 준비 완료.")
    print("💡 실행 전: Diagnosis_API 백엔드 서버가 정상적으로 구동 중이어야 합니다.")
    print("=========================================================")