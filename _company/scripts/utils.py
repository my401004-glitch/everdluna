import logging
from typing import Dict, Any

# 로깅 설정을 중앙 집중화하여 모든 모듈이 동일한 방식으로 로그를 남기게 합니다.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("PlaybookRunner")

def log_step(title: str):
    """특정 단계의 시작을 알리는 로그를 출력합니다."""
    logger.info("-" * 50)
    logger.warning(f"▶️ STARTING STEP: {title}")
    logger.info("-" * 50)

def log_success(message: str):
    """성공 메시지를 기록합니다."""
    logger.info(f"✅ SUCCESS: {message}")

def log_failure(message: str, critical: bool = False):
    """실패 메시지를 기록하며, 중요도에 따라 경고/에러 레벨을 다르게 처리합니다."""
    if critical:
        logger.error(f"❌ CRITICAL FAILURE: {message}")
    else:
        logger.warning(f"⚠️ WARNING: {message}")

def simulate_api_call(endpoint: str, payload: Dict[str, Any], required_status: int = 200) -> bool:
    """
    외부 API 호출을 시뮬레이션합니다. 실제 CI/CD 환경에서는 requests 라이브러리를 사용해야 합니다.
    여기서는 테스트 용도로 로깅과 가상의 성공/실패 처리를 수행합니다.
    """
    try:
        logger.info(f"   [API CALL] Attempting to hit endpoint: {endpoint}")
        # 실제로는 try-except 블록으로 HTTP 요청을 처리해야 합니다.
        if "failure" in endpoint:
            raise ConnectionError("Simulated API failure due to bad payload.")

        log_success(f"Successfully called {endpoint}. Received status {required_status}.")
        return True
    except Exception as e:
        log_failure(f"Failed to call {endpoint}: {e}", critical=True)
        return False

def load_config(file_path: str) -> Dict[str, Any]:
    """환경 변수나 설정 파일에서 설정을 불러옵니다."""
    # 실제로는 JSON 또는 YAML 파서를 사용합니다. 여기서는 단순 시뮬레이션만 합니다.
    logger.info(f"   [CONFIG] Loading required configurations from {file_path}...")
    return {"api_key": "mock_secret", "environment": "staging"}