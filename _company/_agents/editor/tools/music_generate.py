#!/usr/bin/env python3
# version: music_v4
"""BGM 생성 — 설치된 모델에 따라 자동 dispatch.

music_studio_setup.py 로 설치한 모델(MusicGen / ACE-Step)을 자동 감지해서
같은 인터페이스로 BGM 생성. 사용자는 모델 차이 신경 쓸 필요 X.

config:
  PROMPT — 음악 묘사 (영어 권장)
  DURATION_SEC — 길이 (초)
  GENRE — 장르 힌트 (lo-fi, ambient, cinematic, edm 등)
  OUTPUT_DIR — 저장 위치 (디폴트 ~/connect-ai-music/output/)
"""
import os, sys, json, subprocess, time, urllib.request, base64

HERE = os.path.dirname(os.path.abspath(__file__))
SETUP_CONFIG = os.path.join(HERE, "music_studio_setup.json")
GEN_CONFIG = os.path.join(HERE, "music_generate.json")


def _log(msg, kind="info"):
    prefix = {"info": "🎵", "ok": "✅", "warn": "⚠️ ", "err": "❌"}.get(kind, "•")
    print(f"{prefix} {msg}", file=sys.stderr, flush=True)


def _load(p):
    if os.path.exists(p):
        try:
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def _generate_musicgen(setup, prompt, duration_sec, output_path):
    """MusicGen 류 (transformers 기반). 가벼움."""
    venv_python = setup.get("VENV_PYTHON")
    hf_id = setup.get("HF_ID", "facebook/musicgen-small")

    # MusicGen은 약 50 토큰/초 (sample rate 32000Hz, 50hz token rate)
    # duration → max_new_tokens 환산
    max_tokens = max(64, int(duration_sec * 50))

    # v2.89.76 — outer f-string이 prompt!r 치환할 때 quote 충돌하던 문제 수정.
    # 변수에 먼저 담은 뒤 inner f-string에서 {{변수}} 형태로 참조 (literal { 이스케이프).
    wav_path = output_path.replace('.mp3', '.wav')
    script = f"""
import os, sys
os.environ['TRANSFORMERS_VERBOSITY'] = 'error'
import logging, warnings
logging.getLogger('transformers').setLevel(logging.ERROR)
warnings.filterwarnings('ignore')
import torch, scipy.io.wavfile

PROMPT = {prompt!r}
HF_ID = {hf_id!r}
WAV_PATH = {wav_path!r}
DURATION_SEC = {duration_sec}
MAX_TOKENS = {max_tokens}

print('🔧 모델 로드 중...', file=sys.stderr, flush=True)
from transformers import MusicgenForConditionalGeneration, AutoProcessor
processor = AutoProcessor.from_pretrained(HF_ID)
model = MusicgenForConditionalGeneration.from_pretrained(HF_ID)
device = 'mps' if torch.backends.mps.is_available() else ('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)
print('🎵 디바이스: ' + str(device), file=sys.stderr, flush=True)
print('🎼 생성 중... (' + str(DURATION_SEC) + '초)', file=sys.stderr, flush=True)
inputs = processor(text=[PROMPT], padding=True, return_tensors='pt').to(device)
audio = model.generate(**inputs, max_new_tokens=MAX_TOKENS)
audio_np = audio[0, 0].cpu().numpy()
sr = model.config.audio_encoder.sampling_rate
scipy.io.wavfile.write(WAV_PATH, sr, audio_np)
print('✅ wav: ' + WAV_PATH, file=sys.stderr, flush=True)
"""
    proc = subprocess.run([venv_python, "-c", script], capture_output=True, text=True)
    if proc.stderr.strip():
        for line in proc.stderr.splitlines():
            _log(f"  {line}")
    if proc.returncode != 0:
        return False, f"MusicGen 추론 실패 (exit {proc.returncode})"

    wav_path = output_path.replace('.mp3', '.wav')
    if not os.path.exists(wav_path):
        return False, "wav 파일 생성 안 됨"

    # wav → mp3 변환 (ffmpeg 있을 때)
    if subprocess.run(["which", "ffmpeg"], capture_output=True).returncode == 0:
        subprocess.run([
            "ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-qscale:a", "2", output_path
        ], capture_output=True)
        if os.path.exists(output_path):
            os.remove(wav_path)  # mp3로 변환했으니 wav는 삭제
            return True, output_path
    # ffmpeg 없으면 wav 그대로
    return True, wav_path


def _generate_acestep(setup, prompt, duration_sec, output_path):
    """ACE-Step — repo의 infer 스크립트 호출. 무거움."""
    venv_python = setup.get("VENV_PYTHON")
    repo_dir = setup.get("ACE_STEP_DIR")

    # ACE-Step entry point 자동 탐색
    candidates = ["infer.py", "src/infer.py", "scripts/infer.py", "ace_step/infer.py", "main.py"]
    infer_script = None
    for c in candidates:
        full = os.path.join(repo_dir, c)
        if os.path.exists(full):
            infer_script = full
            break
    if not infer_script:
        return False, f"ACE-Step infer 스크립트 못 찾음 — {repo_dir} 의 README 확인 필요"

    cmd = [venv_python, infer_script,
           "--prompt", prompt, "--duration", str(duration_sec), "--output", output_path]
    proc = subprocess.run(cmd, cwd=repo_dir, capture_output=True, text=True)
    if proc.stderr.strip():
        for line in proc.stderr.splitlines()[-30:]:
            _log(f"  {line}")
    if proc.returncode != 0:
        return False, f"ACE-Step 실패 (exit {proc.returncode}). README의 명령 형식 확인 필요"
    if not os.path.exists(output_path):
        return False, "출력 파일 없음 — ACE-Step 명령 형식이 다를 수 있음"
    return True, output_path


def _init_env_path():
    try:
        shell = os.environ.get("SHELL", "/bin/bash")
        r = subprocess.run(f"{shell} -l -c 'echo $PATH'", shell=True, capture_output=True, text=True, timeout=3)
        if r.returncode == 0 and r.stdout.strip():
            os.environ["PATH"] = r.stdout.strip()
    except Exception:
        pass


def _load_config_md():
    config_path = os.path.join(HERE, "..", "config.md")
    cfg = {}
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                for line in f:
                    # 라인 끝에 붙은 주석 제거
                    if "#" in line:
                        line = line.split("#", 1)[0]
                    line = line.strip()
                    if not line:
                        continue
                    if "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'").strip()
                        cfg[k] = v
        except Exception:
            pass
    return cfg


def _generate_gemini(prompt, duration_sec, output_path, api_key):
    """Google Gemini API를 사용해 오디오(BGM/효과음) 생성 및 저장"""
    _log("Google Gemini API를 통해 오디오 생성을 요청합니다...")
    if not api_key:
        return False, "Gemini API Key가 누락되었습니다."

    # Gemini 2.0 Flash 모델을 사용하여 오디오 생성
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Please generate a {duration_sec}-second background music or audio track based on this prompt: {prompt}. Return ONLY the audio output."
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {
                        "voiceName": "Puck"
                    }
                }
            }
        }
    }
    
    req_data = json.dumps(payload).encode('utf-8')
    headers = {
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
    except Exception as e:
        return False, f"Gemini API 호출 실패: {str(e)}"
        
    try:
        candidates = res_data.get("candidates", [])
        if not candidates:
            return False, f"Gemini API 응답에 candidates가 없습니다: {res_data}"
            
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            return False, "Gemini API 응답에 parts가 없습니다."
            
        audio_part = None
        for part in parts:
            if "inlineData" in part and "audio" in part["inlineData"].get("mimeType", ""):
                audio_part = part
                break
            if "inlineData" in part:
                audio_part = part
                break
                
        if not audio_part:
            return False, f"Gemini API 응답에서 오디오 데이터를 찾을 수 없습니다. (텍스트 응답일 가능성 있음): {res_data}"
            
        inline_data = audio_part["inlineData"]
        mime_type = inline_data.get("mimeType", "audio/mp3")
        base64_data = inline_data.get("data", "")
        
        if not base64_data:
            return False, "오디오 데이터가 비어있습니다."
            
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        audio_bytes = base64.b64decode(base64_data)
        
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
            
        _log(f"Gemini 오디오 파일 저장 완료 (MimeType: {mime_type})")
        return True, output_path
        
    except Exception as e:
        return False, f"오디오 파싱 및 저장 실패: {str(e)}"


def main():
    _init_env_path()
    
    # config.md에서 Gemini API 설정 로드
    suno_config = _load_config_md()
    gemini_key = suno_config.get("GEMINI_API_KEY", "")
    
    cfg = _load(GEN_CONFIG)
    
    # Gemini 사용 여부 확인
    setup = _load(SETUP_CONFIG)
    model_kind = (cfg.get("MODEL") or "").strip().lower()
    is_gemini_mode = False
    
    if gemini_key and (model_kind == "" or model_kind == "gemini"):
        is_gemini_mode = True
    elif model_kind == "gemini":
        is_gemini_mode = True
    elif not setup.get("INSTALLED_AT") and gemini_key:
        is_gemini_mode = True
        
    if is_gemini_mode:
        if not gemini_key:
            print("❌ Gemini API Key가 필요합니다.")
            print("  _company/_agents/editor/config.md 파일에 GEMINI_API_KEY를 입력해주세요.")
            sys.exit(1)
    else:
        if not setup.get("INSTALLED_AT"):
            print("❌ 음악 모델 미설치.")
            print("  Google Gemini를 사용하려면 config.md에 API 키를 입력하시거나,")
            print("  로컬 모델을 사용하려면 같은 폴더의 'music_studio_setup.py'를 실행해주세요.")
            sys.exit(1)
            
        venv_python = setup.get("VENV_PYTHON")
        if not (venv_python and os.path.exists(venv_python)):
            print("❌ 설치 정보 손상. music_studio_setup.py 다시 실행해주세요.")
            sys.exit(1)

    prompt = (cfg.get("PROMPT") or "calm korean YouTube intro music, gentle piano, hopeful").strip()
    duration = int(cfg.get("DURATION_SEC") or 30)
    genre = (cfg.get("GENRE") or "").strip()
    if genre:
        prompt = f"{prompt}, genre: {genre}"

    output_dir = cfg.get("OUTPUT_DIR") or os.path.expanduser("~/connect-ai-music/output")
    os.makedirs(output_dir, exist_ok=True)
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, f"bgm_{timestamp}.mp3")

    model_label = "Google Gemini API" if is_gemini_mode else setup.get("INSTALLED_MODEL", "unknown")
    _log(f"모델: {model_label}")
    _log(f"프롬프트: {prompt}")
    _log(f"길이: {duration}초")
    _log(f"출력: {output_path}")

    if is_gemini_mode:
        ok, result = _generate_gemini(prompt, duration, output_path, gemini_key)
    else:
        install_kind = setup.get("INSTALL_KIND", "transformers")
        if install_kind == "transformers":
            ok, result = _generate_musicgen(setup, prompt, duration, output_path)
        elif install_kind == "acestep":
            ok, result = _generate_acestep(setup, prompt, duration, output_path)
        else:
            print(f"❌ 알 수 없는 INSTALL_KIND: {install_kind}")
            sys.exit(1)

    if not ok:
        print(f"❌ {result}")
        sys.exit(1)

    final_path = result
    file_size = os.path.getsize(final_path)
    print(f"✅ BGM 생성 완료")
    print(f"  🎵 모델: {model_label}")
    print(f"  📁 {final_path}")
    print(f"  📊 {file_size // 1024} KB · {duration}초")
    print(f"  💬 프롬프트: {prompt}")
    print(f"  🎬 영상에 합치려면: 같은 폴더의 'music_to_video.py' 실행")

    # 다음 도구가 자동으로 사용
    cfg["LAST_OUTPUT"] = final_path
    cfg["LAST_PROMPT"] = prompt
    with open(GEN_CONFIG, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
