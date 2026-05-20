# 🎬 비디오 자동 업로드 (Video Uploader)

유튜브 채널에 영상 파일(.mp4 등)을 직접 업로드하고 제목, 설명, 태그, 공개 상태를 지정할 수 있습니다.
최초 1회 실행 시 터미널에서 구글 로그인(OAuth) 창이 열리며, 업로드 권한을 허용해야 합니다.

## 실행 방법 (터미널)

```bash
python3 video_uploader.py --file "C:/my_video.mp4" --title "테스트 영상 제목" --description "이것은 영상 설명입니다." --tags "음악,화성학,AI" --privacy-status "private"
```

* `privacy-status`는 `public`(공개), `private`(비공개), `unlisted`(일부 공개) 중 선택할 수 있습니다. 기본값은 `private`입니다.
