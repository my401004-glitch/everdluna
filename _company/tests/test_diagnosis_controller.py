# tests/test_diagnosis_controller.py
import unittest
from src.api.v1.diagnosis_controller import DiagnosisController, PermissionError, InvalidInputError

class TestDiagnosisController(unittest.TestCase):
    """
    AI 진단 시스템의 핵심 비즈니스 로직 및 API 안정성을 테스트하는 스위트입니다.
    테스트 케이스는 Happy Path, Failure Path (권한), Edge Case를 모두 포함합니다.
    """
    def setUp(self):
        self.controller = DiagnosisController()

    # --------------------------------------------------
    # [TEST CASE 1: 성공적인 진단 점수 산출 (Happy Path)]
    # --------------------------------------------------
    def test_successful_diagnosis_score(self):
        """ADMIN 권한으로 모든 KPI가 정상일 때의 테스트."""
        user_role = "ADMIN"
        diagnosis_type = "Combined"
        context_data = {"context_id": "C123", "source": "web"}
        kpi_metrics = {"Growth": 8.5, "Engagement": 7.0, "Monetization": 9.0}

        try:
            result = self.controller.get_diagnosis_score(user_role, diagnosis_type, context_data, kpi_metrics)
            self.assertIsInstance(result, dict)
            self.assertTrue("gap_score" in result)
            # Gap Score가 0 이상인지 검증 (비즈니스 규칙)
            self.assertGreaterEqual(result['gap_score'], 0)
        except Exception as e:
            self.fail(f"Successful diagnosis failed unexpectedly: {e}")

    # --------------------------------------------------
    # [TEST CASE 2: 권한 부족으로 인한 접근 제어 실패 (RBAC Failure)]
    # --------------------------------------------------
    def test_permission_denied_for_free_user(self):
        """무료 사용자가 특정 진단 타입에 접근하려 할 때의 테스트."""
        user_role = "FREE"
        diagnosis_type = "Growth" # Free user가 접근 불가한 가상 데이터
        context_data = {"context_id": "C123"}
        kpi_metrics = {"Growth": 5.0, "Engagement": 5.0, "Monetization": 5.0}

        # 기대값: PermissionError 발생
        with self.assertRaises(PermissionError) as cm:
            self.controller.get_diagnosis_score(user_role, diagnosis_type, context_data, kpi_metrics)
        print(f"\n[PASS] RBAC 테스트 통과: {cm.exception}")


    # --------------------------------------------------
    # [TEST CASE 3: 필수 데이터 누락으로 인한 입력값 오류 (Invalid Input)]
    # --------------------------------------------------
    def test_missing_context_data(self):
        """진단 과정에서 핵심 컨텍스트 ID가 빠졌을 때의 테스트."""
        user_role = "ADMIN"
        diagnosis_type = "Combined"
        context_data = {} # 빈 딕셔너리 전송 (필수 ID 누락)
        kpi_metrics = {"Growth": 5.0, "Engagement": 5.0, "Monetization": 5.0}

        # 기대값: InvalidInputError 발생 (ValueError -> InvalidInputError 매핑)
        with self.assertRaises(InvalidInputError):
            self.controller.get_diagnosis_score(user_role, diagnosis_type, context_data, kpi_metrics)


    # --------------------------------------------------
    # [TEST CASE 4: 비즈니스 규칙 위반 (Bad Data Format)]
    # --------------------------------------------------
    def test_missing_kpi_metric(self):
        """KPI 메트릭 중 하나가 누락되었을 때의 테스트."""
        user_role = "ADMIN"
        diagnosis_type = "Combined"
        context_data = {"context_id": "C123"}
        # Monetization 키 누락 (스키마 위반)
        kpi_metrics = {"Growth": 5.0, "Engagement": 5.0}

        # 기대값: InvalidInputError 발생
        with self.assertRaises(InvalidInputError):
            self.controller.get_diagnosis_score(user_role, diagnosis_type, context_data, kpi_metrics)


if __name__ == '__main__':
    unittest.main()