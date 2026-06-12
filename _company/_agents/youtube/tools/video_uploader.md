# 🎬 비디오 자동 업로드 (Video Uploader)

유튜브 채널에 영상 파일(.mp4 등)을 업로드하고 제목, 설명, 태그, 공개 상태, 카테고리를 지정할 수 있습니다.
최초 1회 실행 시 터미널에서 구글 로그인(OAuth) 창이 열리며, 업로드 권한을 허용해야 합니다.

## 실행 방법

### 1. 대화형 위저드 모드 (추천)
인자 없이 스크립트를 실행하면 터미널에서 대화식으로 설정을 단계별로 입력할 수 있습니다. 파일 경로 입력 시 **Tab 키를 눌러 경로 자동완성** 기능을 사용할 수 있습니다.

```bash
python3 video_uploader.py
```

### 2. CLI 명령행 인자 모드
자동화 스크립트나 터미널에서 한 번에 실행하려면 다음과 같이 필수 및 선택 옵션을 인자로 제공합니다.

```bash
python3 video_uploader.py --file "/path/to/my_video.mp4" --title "영상 제목" --description "설명" --tags "태그1,태그2" --privacy-status "private" --category "gaming"
```

## 주요 옵션 안내

* `--file`: 업로드할 영상 파일 경로
* `--title`: 영상 제목 (최대 100자)
* `--description`: 영상 상세 설명 (기본값: 빈 값)
* `--tags`: 태그 (콤마로 구분하여 입력, 기본값: 빈 값)
* `--privacy-status`: 공개 상태 (`private`, `unlisted`, `public` 중 선택. 기본값: `private`)
* `--category`: 카테고리 ID (숫자) 또는 영문 이름. 기본값은 `22` (People & Blogs)입니다.
  * 지원되는 영문 카테고리 키워드: `gaming`, `education`, `howto`, `tech`, `entertainment`, `comedy`, `music`, `sports`, `travel`, `news`
* `-i`, `--interactive`: 강제로 대화형 모드로 진입합니다.
* `--no-interactive`: 대화형 입력을 명시적으로 차단합니다 (자동화 스크립트 실행 시 권장).
