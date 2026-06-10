import logging
from typing import Optional, Dict, Any

# 로깅 설정: 모든 API 호출 및 실패 상황을 중앙 집중화합니다.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("AIPipelineClient")

class AIPipelineError(Exception):
    """AI 파이프라인 관련 모든 예외를 포괄하는 커스텀 예외."""
    pass

class AI_Pipeline_Client:
    """
    AI 음악 합성 및 비디오 렌더링 API 연동을 담당하는 핵심 클라이언트 클래스.
    모든 외부 I/O와 비즈니스 로직의 실패 지점(Failure Points)을 관리합니다.
    """

    def __init__(self, base_config: Dict[str, Any]):
        # 환경 변수나 설정 파일을 통해 읽어오는 것이 원칙이나, 현재는 임시 구조체 사용.
        self._api_keys = {"music": base_config.get("MUSIC_API_KEY"), "video": base_config.get("VIDEO_API_KEY")}
        logger.info("AI Pipeline Client Initialized. API Keys Loaded.")

    def _safe_api_call(self, api_name: str, func):
        """재시도 로직 및 일반적인 네트워크/파라미터 오류를 처리하는 내부 헬퍼."""
        # 지수 백오프(Exponential Backoff) 전략을 기본으로 수행한다고 가정합니다.
        MAX_RETRIES = 3
        for attempt in range(MAX_RETRIES):
            try:
                logger.info(f"Attempt {attempt + 1}/{MAX_RETRIES}: Calling {api_name} API.")
                result = func()
                return result # 성공 시 바로 반환

            except TimeoutError:
                logger.warning(f"{api_name} API 호출 시간 초과. 재시도합니다.")
                if attempt == MAX_RETRIES - 1:
                    raise AIPipelineError(f"[{api_name}] 최종적으로 연결 시간이 초과되었습니다.")
                continue # 다음 시도로 진행

            except Exception as e:
                # 예상치 못한 다른 에러 처리 (예: 파라미터 유효성 검사 실패)
                logger.error(f"Critical failure during {api_name} API call: {e}")
                raise AIPipelineError(f"[{api_name}] 서비스 호출 중 심각한 오류 발생: {str(e)}")

        # 모든 재시도 실패 시점 (이 코드는 도달하지 않아야 함)
        return None


    def synthesize_audio(self, topic: str, style: str, duration_sec: int) -> Optional[str]:
        """
        AI 음악 합성 API 호출. Failure 시 대체 오디오 에셋을 반환합니다.
        :param topic: 콘텐츠 주제 (e.g., 'Pitch Stability')
        :param style: 원하는 음악 스타일 (e.g., 'Cinematic Pop')
        :param duration_sec: 길이
        :return: 합성된 오디오 파일 경로 또는 Fallback 오디오 경로
        """
        def call_music_api():
            # 실제 외부 API 호출 로직이 여기에 들어갑니다.
            if not self._api_keys["music"]:
                 raise ConnectionError("Music API Key missing.")
            # 임시 실패 시뮬레이션: 20% 확률로 실패하게 만듭니다.
            import random
            if random.random() < 0.2 and duration_sec > 10:
                raise TimeoutError("Simulated Music API Timeout")

            return f"/temp/audio/{topic}_{style}.mp3" # 성공 시 예상 경로 반환

        try:
            # _safe_api_call을 사용하여 안전하게 호출하고, 실패할 경우 Fallback 로직 실행
            result = self._safe_api_call("Music Synthesis", call_music_api)
            logger.info(f"✅ Audio synthesis successful. Path: {result}")
            return result

        except AIPipelineError as e:
            logger.warning(f"Audio synthesis failed ({e}). Fallback to default track.")
            # **핵심 Fallback 로직 구현:** 실패 시 미리 준비된 기본 트랙을 사용합니다.
            return "/assets/fallback/default_music_track.mp3"


    def render_video_sequence(self, audio_path: str, script_text: str, visual_template: str) -> Optional[str]:
        """
        최종 비디오 렌더링 API 호출. 오디오 경로와 스크립트를 기반으로 실행됩니다.
        :param audio_path: 합성된 최종 오디오 파일 경로
        :param script_text: 영상에 삽입할 자막/내레이션 스크립트
        :param visual_template: 사용할 비주얼 템플릿 (e.g., 'DarkBlueYellowV3')
        :return: 최종 렌더링된 비디오 파일 경로 또는 Fallback 비디오 경로
        """
        def call_video_api():
            # 실제 외부 API 호출 로직이 여기에 들어갑니다.
            if not self._api_keys["video"]:
                raise ConnectionError("Video API Key missing.")

            # 임시 실패 시뮬레이션: 오디오가 Fallback 경로일 경우, 렌더링 엔진이 에러를 낼 수 있습니다.
            if "fallback" in audio_path and script_text.count('!') > 3:
                 raise RuntimeError("Simulated Rendering Engine Failure: Too many exclamation marks.")

            return f"/temp/video/{visual_template}_{hash(audio_path)}_{script_text[:10]}.mp4" # 성공 시 예상 경로 반환

        try:
            result = self._safe_api_call("Video Renderer", call_video_api)
            logger.info(f"✅ Video rendering successful. Path: {result}")
            return result

        except AIPipelineError as e:
            logger.error(f"Final video rendering failed ({e}). Returning pre-rendered fallback asset.")
            # **핵심 Fallback 로직 구현:** 실패 시, 최소한의 정보가 담긴 기본 비디오 템플릿을 사용합니다.
            return "/assets/fallback/basic_intro_template.mp4"

# ====================================================
# [테스트 및 검증 섹션 - 실제 실행은 외부에서 진행]
# 이 코드는 테스트를 위해 작성된 모듈의 예시입니다.
if __name__ == "__main__":
    print("--- Running Pipeline Client Self-Test ---")
    test_config = {"MUSIC_API_KEY": "dummy", "VIDEO_API_KEY": "dummy"}
    client = AI_Pipeline_Client(test_config)

    # 1. 성공 케이스 시뮬레이션
    print("\n[TEST CASE 1: SUCCESS]")
    audio_path_success = client.synthesize_audio("Pitch Stability", "Cinematic Pop", 30)
    video_path_success = client.render_video_sequence(audio_path_success, "이번 영상은 완벽합니다!", "DarkBlueYellowV3")

    # 2. 실패 케이스 시뮬레이션 (Fallback 검증)
    print("\n[TEST CASE 2: FAILURE/FALLBACK]")
    # 의도적으로 Failure를 유발할 수 있는 파라미터 사용 (예: 매우 긴 스크립트와 fallback 오디오 경로 조합)
    audio_path_fail = client.synthesize_audio("Pitch Stability", "Cinematic Pop", 50) # 가끔 실패하게 설계됨
    if audio_path_fail.startswith("/assets/fallback"):
        video_path_fail = client.render_video_sequence(audio_path_fail, "너무 많은 느낌표!!!! 이게 문제입니다!", "DarkBlueYellowV3")
    else:
        print("Skipping Failure Test (Initial Audio Success)")

# ----------------------------------------------------