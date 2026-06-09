#!/usr/bin/env python3
# version: music_v3
"""생성된 BGM을 영상에 합치기 (ffmpeg 래퍼).

설정에서 VIDEO_PATH 지정 (또는 LAST_GENERATED 자동 사용).
영상 길이에 BGM 자동 맞춤 (loop 또는 fade out).
"""
import os, sys, json, subprocess, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
GEN_CONFIG = os.path.join(HERE, "music_generate.json")
MERGE_CONFIG = os.path.join(HERE, "music_to_video.json")


def _log(msg, kind="info"):
    prefix = {"info": "🎬", "ok": "✅", "warn": "⚠️ ", "err": "❌"}.get(kind, "•")
    print(f"{prefix} {msg}", file=sys.stderr, flush=True)


def _load(p):
    if os.path.exists(p):
        try:
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def _init_env_path():
    try:
        shell = os.environ.get("SHELL", "/bin/bash")
        r = subprocess.run(f"{shell} -l -c 'echo $PATH'", shell=True, capture_output=True, text=True, timeout=3)
        if r.returncode == 0 and r.stdout.strip():
            os.environ["PATH"] = r.stdout.strip()
    except Exception:
        pass


def _find_latest_media():
    search_dirs = [
        os.path.abspath(os.path.join(HERE, "../../..")),
        "/Users/iyeongjae/.gemini/antigravity-ide/brain",
        os.path.expanduser("~/connect-ai-music/output")
    ]
    extensions = ('.mp4', '.mov', '.avi', '.mkv', '.png', '.jpg', '.jpeg', '.webp')
    latest_file = None
    latest_mtime = 0
    for sd in search_dirs:
        if not os.path.exists(sd):
            continue
        for root, dirs, files in os.walk(sd):
            skip_dirs = {'.venv', 'node_modules', '.git', '.next', '.cursor', '.windsurf', '.opencode'}
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            depth = root[len(sd):].count(os.sep)
            if depth > 4:
                dirs.clear()
                continue
            for file in files:
                if file.startswith('.'):
                    continue
                if "_with_bgm" in file.lower() or "promo_10s" in file.lower():
                    continue
                if file.lower().endswith(extensions):
                    full_path = os.path.join(root, file)
                    try:
                        mtime = os.path.getmtime(full_path)
                        if os.path.getsize(full_path) < 5000:
                            continue
                        if mtime > latest_mtime:
                            latest_mtime = mtime
                            latest_file = full_path
                    except Exception:
                        pass
    return latest_file


def _has_audio(video_path):
    cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "a",
        "-show_entries", "stream=codec_type",
        "-of", "csv=p=0",
        video_path
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True)
        return "audio" in res.stdout.lower()
    except Exception:
        return True


def main():
    _init_env_path()
    if not shutil.which("ffmpeg"):
        print("❌ ffmpeg가 설치돼있지 않아요.")
        print("  macOS: brew install ffmpeg")
        print("  Windows: https://ffmpeg.org/download.html")
        sys.exit(1)

    cfg = _load(MERGE_CONFIG)
    gen = _load(GEN_CONFIG)

    video_path = (cfg.get("VIDEO_PATH") or "").strip()
    if not video_path:
        _log("VIDEO_PATH 미지정. 최근 생성된 미디어 파일을 검색합니다...")
        video_path = _find_latest_media()
        if video_path:
            _log(f"자동 발견한 미디어 사용: {video_path}", "ok")
        else:
            print("❌ 미디어 파일을 찾을 수 없습니다. ⚙️ 클릭해서 VIDEO_PATH에 영상 또는 이미지 경로를 입력해주세요.")
            sys.exit(1)
    else:
        video_path = os.path.abspath(os.path.expanduser(video_path))
        if not os.path.exists(video_path):
            print(f"❌ 파일 없음: {video_path}")
            sys.exit(1)

    # BGM 파일: 명시적 또는 마지막 생성된 거 자동
    music_path = (cfg.get("MUSIC_PATH") or "").strip()
    if not music_path:
        music_path = gen.get("LAST_OUTPUT") or ""
    if music_path:
        music_path = os.path.abspath(os.path.expanduser(music_path))
    if not music_path or not os.path.exists(music_path):
        print("❌ BGM 파일 없음. 먼저 'music_generate.py' 실행해서 BGM 생성하거나,")
        print("  ⚙️에서 MUSIC_PATH 직접 지정.")
        sys.exit(1)

    bgm_volume = float(cfg.get("BGM_VOLUME", 0.3))  # 0.0~1.0, 디폴트 30%
    is_image = video_path.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp'))
    
    if is_image:
        output_path = cfg.get("OUTPUT_PATH") or video_path.rsplit(".", 1)[0] + "_promo.mp4"
    else:
        output_path = cfg.get("OUTPUT_PATH") or video_path.rsplit(".", 1)[0] + "_with_bgm.mp4"
    output_path = os.path.abspath(os.path.expanduser(output_path))

    _log(f"입력 미디어: {video_path} ({'이미지' if is_image else '비디오'})")
    _log(f"BGM: {music_path}")
    _log(f"BGM 볼륨: {int(bgm_volume * 100)}%")
    _log(f"출력: {output_path}")

    if is_image:
        # 이미지의 크기가 홀수면 H.264 인코딩 실패하므로 짝수로 맞춤
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", video_path,
            "-i", music_path,
            "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            output_path,
        ]
    else:
        has_aud = _has_audio(video_path)
        if has_aud:
            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-stream_loop", "-1",
                "-i", music_path,
                "-filter_complex",
                f"[0:a]volume=1.0[orig];[1:a]volume={bgm_volume}[bgm];[orig][bgm]amix=inputs=2:duration=first[a]",
                "-map", "0:v",
                "-map", "[a]",
                "-c:v", "copy",
                "-c:a", "aac",
                "-shortest",
                output_path,
            ]
        else:
            # 원본 비디오에 오디오 스트림이 없는 경우
            cmd = [
                "ffmpeg", "-y",
                "-i", video_path,
                "-stream_loop", "-1",
                "-i", music_path,
                "-map", "0:v",
                "-map", "1:a",
                "-c:v", "copy",
                "-c:a", "aac",
                "-shortest",
                output_path,
            ]

    _log("ffmpeg 실행 중...")
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        print(f"❌ ffmpeg 실패 (exit {proc.returncode})")
        print(proc.stderr[-1000:])
        sys.exit(1)

    if not os.path.exists(output_path):
        print(f"❌ 출력 파일 없음")
        sys.exit(1)

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"✅ 비디오 합성 완료")
    print(f"  📁 {output_path}")
    print(f"  📊 {size_mb:.1f} MB")


if __name__ == "__main__":
    main()
