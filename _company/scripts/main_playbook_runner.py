import os
from utils import log_step, log_success, log_failure, simulate_api_call, load_config

# Playbook의 각 단계를 함수로 분리하여 SRP(단일 책임 원칙)를 지키도록 합니다.

def run_data_validation_step(config: dict):
    """
    Step 1: 데이터 유효성 검증 및 필수 전제 조건 확인 로직을 실행합니다. (DB 스키마 체크, 권한 검사 등)
    """
    log_step("Phase 1: Data Validation & Pre-Condition Check")

    # 1. 환경 설정 로드 및 초기화
    config = load_config("./config/settings.json") # utils.py의 함수 사용
    if not config or "api_key" not in config["api_key"]:
        log_failure("Required configuration (API Key) missing. Aborting validation.", critical=True)
        return False

    # 2. 핵심 스키마 유효성 검증 시뮬레이션
    if simulate_api_call("/v1/schema/validate", {"target": "DiagnosisResult"}):
        log_success("Core data schema validated against current DB structure.")
    else:
        return False # 실패하면 전체 흐름 중단

    # 3. RBAC (Role-Based Access Control) 권한 검증 시뮬레이션
    if simulate_api_call("/v1/auth/check_role", {"user": "current", "scope": ["Growth", "Engagement"]}):
        log_success("User access rights validated for all necessary KPI metrics.")
    else:
        return False

    return True

def run_kpi_calculation_step(config: dict):
    """
    Step 2: AI 모델을 이용한 핵심 지표 계산 및 업데이트 API 호출 로직을 실행합니다. (핵심 비즈니스 로직)
    """
    log_step("Phase 2: KPI Calculation & Data Submission")

    # 가상의 입력 데이터가 준비되었다고 가정하고, API를 통해 점수를 산출/저장합니다.
    input_data = {"session_id": "mock-abc-123", "raw_audio_path": "/tmp/upload.wav"}

    if simulate_api_call("/v1/kpi/calculate_score", input_data, required_status=201):
        log_success("KPI Score calculation service invoked and data temporarily stored.")
    else:
        return False

    # 계산된 점수를 최종적으로 Diagnosis_Results 테이블에 저장하는 트랜잭션 시뮬레이션
    if simulate_api_call("/v1/data/save_result", {"score": 85, "context_id": "mock-xyz"}):
        log_success("Diagnosis result saved to the main results table.")
        return True
    else:
        return False


def run_frontend_verification_step():
    """
    Step 3: 프론트엔드(React/Next.js) 컴포넌트의 시각적, 기능적 일관성을 검증합니다. (UI 테스트)
    CI 환경에서 Cypress 또는 Playwright 같은 E2E 테스트 도구를 사용해야 합니다.
    """
    log_step("Phase 3: Frontend Visual & Functional Integrity Check")

    # 1. 레이아웃 및 컴포넌트 통합성 테스트 시뮬레이션
    if simulate_api_call("/v1/ui/check_layout", {"page": "DiagnosisScorePage"}):
        log_success("Core component layout verified successfully (Header, CTA, Score Card).")
    else:
        return False

    # 2. 모바일 반응성 테스트 시뮬레이션
    if simulate_api_call("/v1/ui/check_responsive", {"breakpoint": "mobile"}):
        log_success("Mobile responsive layout confirmed.")
    else:
        return False

    return True


def run_full_playbook(config_path: str = "./config/settings.json"):
    """
    최종 Playbook 실행 모듈의 메인 함수입니다. 모든 단계를 순차적으로 실행합니다.
    """
    print("\n" + "="*60)
    print("🚀 Starting CI/CD Automation Playbook Execution...")
    print("="*60)

    # 1. 초기 환경 설정 로드
    config = load_config(config_path)
    if not config:
        print("FATAL: Could not initialize playbook runner due to missing configuration.")
        return False

    # 2. Playbook 순차 실행 (Try-Catch 구조로 강한 안정성 확보)
    try:
        if not run_data_validation_step(config):
            log_failure("\n[PLAYBOOK FAILED] Data Validation failed. Cannot proceed to KPI calculation.", critical=True)
            return False

        if not run_kpi_calculation_step(config):
            log_failure("\n[PLAYBOOK FAILED] KPI Calculation failed. Results cannot be saved.", critical=True)
            return False

        if not run_frontend_verification_step():
            log_failure("\n[PLAYBOOK FAILED] Frontend verification failed. UI consistency needs review.", critical=True)
            return False

        # 모든 테스트 통과 시 최종 성공 로그
        print("\n" + "="*60)
        print("🎉 🎉 PLAYBOOK EXECUTION SUCCESS! 🎉")
        print("모든 자동화 체크리스트를 통과했습니다. 배포 준비 완료.")
        print("="*60)
        return True

    except Exception as e:
        log_failure(f"An unexpected error occurred during the playbook run: {e}", critical=True)
        return False


if __name__ == "__main__":
    # 이 스크립트를 직접 실행할 때의 진입점입니다.
    run_full_playbook()