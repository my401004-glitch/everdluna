# 🎬 오디오-비디오 합성 및 FFmpeg 제어 워크플로우

이 문서는 생성된 BGM 오디오 에셋을 원본 영상(또는 이미지 홍보 자료)과 안정적으로 합성하고 제어하기 위한 기술적 운영 지침입니다.

---

## 1. BGM 생성 및 믹싱 실행 순서

BGM과 영상의 합성을 오류 없이 완료하려면 다음의 3단계 실행 사이클을 엄격히 준수합니다.

### ⚙️ 1단계: 모델 설치 및 환경 확인
* 최초 실행 또는 모델 변경 시 반드시 `music_studio_setup.py`를 실행하여 사용하려는 모델이 설치 완료 상태인지 확인합니다.
* 환경 설정 정보는 `music_studio_setup.json`에 영구 기록되며, 주입된 가상환경 경로(`VENV_PYTHON`)를 자동으로 활용합니다.

### 🎼 2단계: BGM 생성 설정 (`music_generate.json`)
* 생성 대상 BGM의 설정을 `music_generate.json` 파일에 쓰기(write)하여 파라미터를 입력합니다.
  ```json
  {
    "PROMPT": "uplifting cinematic acoustic pop, warm piano, 110 BPM, hopeful mood",
    "DURATION_SEC": 30,
    "GENRE": "cinematic"
  }
  ```
* 그 후 `python3 tools/music_generate.py`를 실행합니다.
* 성공 시 `LAST_OUTPUT` 필드에 생성된 오디오 절대 경로가 기록됩니다.

### 🎬 3단계: 비디오 합성 설정 (`music_to_video.json`)
* 합성 대상 영상 파일과 음향 조절 설정을 `music_to_video.json` 파일에 기록합니다.
  ```json
  {
    "VIDEO_PATH": "/Users/iyeongjae/Desktop/초보프로젝트/assets/video_promo.mp4",
    "MUSIC_PATH": "",
    "BGM_VOLUME": 0.25,
    "OUTPUT_PATH": ""
  }
  ```
  - *팁: `MUSIC_PATH`를 비워두면 2단계에서 기록된 `LAST_OUTPUT`을 자동으로 가져옵니다.*
  - *볼륨: 나레이션(Voiceover)이 포함된 BGM은 `0.2`~`0.3` (20~30%), 나레이션 없이 배경 음악만 쓸 때는 `0.5`~`0.7` (50~70%)이 적절합니다.*
* 그 후 `python3 tools/music_to_video.py`를 실행하여 최종 영상을 추출합니다.

---

## 2. FFmpeg 믹싱 제어 및 이상 현상 해결

`music_to_video.py`는 내부적으로 FFmpeg을 호출하여 합성합니다. 이때 발생하는 주요 문제 상황과 해결 룰입니다.

### 🖼️ 이미지 파일에 BGM을 입혀 홍보 영상(MP4)을 만들 때
* 입력 파일이 비디오가 아닌 정적 이미지(`.png`, `.jpg`, `.jpeg`, `.webp`)일 경우, 이미지 크기의 가로/세로 픽셀이 **홀수**이면 H.264 인코더가 오류를 내며 멈춥니다.
* `music_to_video.py`는 이 문제를 방지하기 위해 `-vf scale=trunc(iw/2)*2:trunc(ih/2)*2` 필터를 적용하여 자동으로 가로세로를 짝수로 맞춰 인코딩합니다. 이미지를 변환할 때는 이 로직을 신뢰하고 실행하십시오.

### 🔊 비디오 오디오 스트림 유무에 따른 자동 분기
* **원본 영상에 오디오가 있을 때**: BGM 볼륨을 지정값(예: `0.3`)으로 낮추고, 원본 오디오는 `1.0` 볼륨을 유지한 채 믹싱(`amix=inputs=2:duration=first`)합니다.
* **원본 영상이 무음(Silent)일 때**: 복잡한 amix 믹서 대신 오디오 트랙을 그대로 맵핑(`-map 0:v -map 1:a`)하여 불필요한 노이즈와 빌드 실패를 원천 차단합니다.

### 🔁 BGM 길이 동기화 규칙 (`-shortest`, `-stream_loop`)
* BGM이 비디오보다 길 경우: `-shortest` 플래그에 의해 비디오가 끝나는 즉시 BGM이 커트됩니다.
* BGM이 비디오보다 짧을 경우: `-stream_loop -1` 설정에 의해 영상이 끝날 때까지 BGM이 지연 없이 무한 루프됩니다.
