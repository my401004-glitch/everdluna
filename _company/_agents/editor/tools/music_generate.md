<!-- version: music_v4 -->
# 🎵 BGM 생성 — 로컬 모델 & Google Gemini API

영상에 어울리는 BGM을 텍스트 프롬프트로 생성합니다. 로컬 모델(MusicGen, ACE-Step) 또는 Google Gemini API(Multimodal Output)를 활용할 수 있습니다.

## 사용 전 체크
### 1. Google Gemini (클라우드 API) 사용 시 (추천)
- 무거운 로컬 다운로드 없이 즉시 고품질 오디오를 생성합니다.
- `_company/_agents/editor/config.md` 파일에 `GEMINI_API_KEY`를 설정하세요.
- `music_generate.json`의 `MODEL`을 `gemini`로 지정하여 사용할 수 있습니다.

### 2. 로컬 모델 (오프라인) 사용 시
- `music_studio_setup.py`가 먼저 실행돼야 합니다 (최초 1회).
- 첫 BGM 생성 시 모델 가중치를 로컬에 다운로드합니다 (~10GB, 인터넷 필요).
- 이후에는 100% 오프라인 환경에서 비용 없이 무제한 사용 가능합니다.

## 설정 (⚙️ 클릭해서 변경)
- `MODEL` — 생성 방식 (`gemini` 또는 로컬 자동 선택)
- `PROMPT` — 음악 묘사 (영어 작성 시 고품질 결과)
- `DURATION_SEC` — 길이 초 (기본 30)
- `GENRE` — 장르 힌트 (lo-fi, ambient, cinematic, edm 등)
- `OUTPUT_DIR` — 저장 위치 (기본 ~/connect-ai-music/output/)

## 출력
- MP3 파일 (~/connect-ai-music/output/bgm_<timestamp>.mp3)
- 다음 단계 도구(`music_to_video.py`)가 자동으로 이 파일 사용

## 좋은 프롬프트 팁
- ✓ "calm intro music, soft piano, 90 BPM, hopeful mood"
- ✓ "energetic synth lead, cyberpunk, fast tempo, electronic drums"
- ✗ "음악" (너무 추상)

## 비용 및 환경
- Google Gemini: Gemini API 토큰 비용 발생 (API 키 필요).
- 로컬 모델: 완전 무료, 오프라인.

