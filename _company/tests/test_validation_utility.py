import unittest
from src.utils.validation_utility import (
    ValidationUtility, DataValidationError, 
    SAMPLE_VALID_DATA, SAMPLE_INVALID_DATA
)

class TestValidationUtility(unittest.TestCase):
    """ValidationUtility 클래스의 모든 기능을 테스트하는 유닛/통합 테스트 스위트."""

    def test_01_valid_data_pass(self):
        """유효한 데이터를 입력했을 때, 예외 없이 True를 반환해야 한다."""
        try:
            result = ValidationUtility.validate_diagnosis_result(SAMPLE_VALID_DATA, "PaidUser")
            self.assertTrue(result)
        except DataValidationError as e:
            self.fail(f"유효한 데이터에서 예상치 못한 유효성 검증 에러 발생: {e}")

    def test_02_rbac_failure(self):
        """무료 사용자 Role에게 Premium 진단 결과 접근 시도 시, 예외가 발생해야 한다."""
        data = SAMPLE_VALID_DATA.copy()
        user_role = "FreeUser"
        with self.assertRaisesRegex(DataValidationError, r".*권한 부족.*"):
            ValidationUtility.validate_diagnosis_result(data, user_role)

    def test_03_missing_field_failure(self):
        """필수 필드 (예: timestamp)가 누락된 경우 예외가 발생해야 한다."""
        invalid_data = SAMPLE_VALID_DATA.copy()
        del invalid_data["timestamp"] # 필수 필드를 삭제하여 테스트
        with self.assertRaisesRegex(DataValidationError, r".*필수 필드.*"):
            ValidationUtility.validate_diagnosis_result(invalid_data, "PaidUser")

    def test_04_type_mismatch_failure(self):
        """데이터 타입이 예상과 다를 경우 예외가 발생해야 한다 (e.g., result_data)."""
        invalid_data = SAMPLE_INVALID_DATA.copy()
        # 이 케이스는 이미 샘플에 있지만, 명시적으로 테스트 구조화
        with self.assertRaises(DataValidationError): 
             ValidationUtility.validate_diagnosis_result(invalid_data, "PaidUser")

    def test_05_business_rule_violation_kpi_range(self):
        """KPI 점수가 비즈니스 규칙(예: GrowthScore > 100)을 위반하는 경우 예외가 발생해야 한다."""
        # SAMPLE_INVALID_DATA는 이미 범위 초과를 포함하고 있음.
        with self.assertRaisesRegex(DataValidationError, r".*Growth Score.*"):
            ValidationUtility.validate_diagnosis_result(SAMPLE_INVALID_DATA, "PaidUser")

    def test_06_kpi_validation(self):
        """KPI 유효성 검사 함수가 필수 항목 누락 시 실패해야 한다."""
        bad_kpis = {"GrowthScore": 70.0} # Engagement/Monetization 누락
        with self.assertRaisesRegex(DataValidationError, r".*KPI 필수 항목 누락.*"):
            ValidationUtility.validate_kpi_metrics(bad_kpis)

if __name__ == '__main__':
    unittest.main()
#