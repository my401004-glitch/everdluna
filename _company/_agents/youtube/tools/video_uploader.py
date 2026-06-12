#!/usr/bin/env python3
"""YouTube Video Uploader
자동으로 유튜브에 영상을 업로드하는 도구입니다.

사용법 (CLI):
python3 video_uploader.py --file <video_file_path> --title <title> [options]

대화형 모드:
python3 video_uploader.py
"""
import os
import sys
import json
import argparse
import glob
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.http import MediaFileUpload

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(HERE, "youtube_account.json")
TOKEN_PATH = os.path.join(HERE, "token_uploader.json")

# 친숙한 카테고리 매핑
CATEGORY_MAP = {
    "people": "22",       # People & Blogs
    "blogs": "22",
    "entertainment": "24",# Entertainment
    "education": "27",    # Education
    "howto": "26",        # Howto & Style
    "style": "26",
    "tech": "28",         # Science & Technology
    "science": "28",
    "gaming": "20",       # Gaming
    "comedy": "23",       # Comedy
    "music": "10",        # Music
    "sports": "17",       # Sports
    "travel": "19",       # Travel & Events
    "news": "25",         # News & Politics
}

# 카테고리 이름 한국어 매핑 (표시용)
CATEGORY_NAMES = {
    "22": "인물/블로그 (People & Blogs)",
    "24": "엔터테인먼트 (Entertainment)",
    "27": "교육 (Education)",
    "26": "노하우/스타일 (Howto & Style)",
    "28": "과학기술 (Science & Technology)",
    "20": "게임 (Gaming)",
    "23": "코미디 (Comedy)",
    "10": "음악 (Music)",
    "17": "스포츠 (Sports)",
    "19": "여행/이벤트 (Travel & Events)",
    "25": "뉴스/정치 (News & Politics)",
}

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print("❌ Error: youtube_account.json 파일을 찾을 수 없습니다.", file=sys.stderr)
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_authenticated_service():
    cfg = load_config()
    client_id = cfg.get("YOUTUBE_OAUTH_CLIENT_ID", "").strip()
    client_secret = cfg.get("YOUTUBE_OAUTH_CLIENT_SECRET", "").strip()
    
    if not client_id or not client_secret:
        print("❌ Error: youtube_account.json에 YOUTUBE_OAUTH_CLIENT_ID와 YOUTUBE_OAUTH_CLIENT_SECRET이 설정되어 있지 않습니다.", file=sys.stderr)
        print("Google Cloud Console에서 발급받아 입력해주세요.", file=sys.stderr)
        sys.exit(1)

    client_config = {
        "installed": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost"]
        }
    }

    scopes = ["https://www.googleapis.com/auth/youtube.upload"]
    creds = None

    if os.path.exists(TOKEN_PATH):
        try:
            creds = Credentials.from_authorized_user_file(TOKEN_PATH, scopes)
        except Exception:
            pass

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            print("\n🚨 [최초 1회 인증 필요] 🚨")
            print("브라우저가 열리면 Google 계정으로 로그인하고 권한을 허용해 주세요.")
            flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_config(client_config, scopes)
            creds = flow.run_local_server(port=0)
            
        with open(TOKEN_PATH, "w") as token_file:
            token_file.write(creds.to_json())

    return googleapiclient.discovery.build("youtube", "v3", credentials=creds)

def resolve_category_id(category_input):
    if not category_input:
        return "22"  # 기본값: 인물/블로그
    category_input = str(category_input).strip().lower()
    if category_input.isdigit():
        return category_input
    return CATEGORY_MAP.get(category_input, "22")

def setup_readline():
    """파일 경로 입력을 위한 Tab 자동완성 기능 활성화"""
    try:
        import readline
        readline.set_completer_delims(' \t\n;')
        
        def completer(text, state):
            # ~ 기호 확장 지원
            expanded = os.path.expanduser(text)
            matches = glob.glob(expanded + '*')
            results = []
            for m in matches:
                # 디렉터리는 끝에 '/'를 붙여 탐색을 용이하게 함
                if os.path.isdir(m):
                    results.append(m + '/')
                else:
                    results.append(m)
            try:
                return results[state]
            except IndexError:
                return None
                
        readline.set_completer(completer)
        readline.parse_and_bind("tab: complete")
    except Exception:
        # readline이 지원되지 않는 환경(예: 일부 Windows 등)에서는 무시
        pass

def run_interactive_wizard(args):
    """사용자로부터 업로드 설정을 입력받는 대화형 위저드"""
    print("\n==================================================")
    print(" 🎬 YouTube Video Uploader (대화형 모드)")
    print("==================================================")
    
    setup_readline()
    
    # 1. 파일 경로 입력 및 검증
    file_path = args.file
    while not file_path:
        file_path = input("📁 업로드할 영상 파일 경로 (Tab 자동완성 지원): ").strip()
        if not file_path:
            print("⚠️ 파일 경로는 반드시 입력해야 합니다.")
            continue
        
        expanded_path = os.path.expanduser(file_path)
        if not os.path.exists(expanded_path):
            print(f"❌ 파일이 존재하지 않습니다: {file_path}")
            file_path = None
            continue
        if os.path.isdir(expanded_path):
            print(f"❌ 폴더(디렉터리)입니다. 영상 파일 경로를 입력하세요: {file_path}")
            file_path = None
            continue
        file_path = expanded_path

    # 2. 제목 입력 및 검증
    title = args.title
    while not title:
        title = input("📝 영상 제목 (최대 100자): ").strip()
        if not title:
            print("⚠️ 제목은 반드시 입력해야 합니다.")
            continue
        if len(title) > 100:
            print(f"⚠️ 제목이 너무 깁니다 ({len(title)}/100자). 100자 이하로 입력해 주세요.")
            title = None
            continue

    # 3. 설명 입력
    description = args.description
    if not description:
        print("📄 영상 설명 (선택사항, 입력 후 Enter, 생략하려면 그냥 Enter):")
        description = input("> ").strip()

    # 4. 태그 입력
    tags = args.tags
    if not tags:
        tags = input("🏷️ 태그 입력 (콤마로 구분, 예: 음악,화성학,AI, 생략하려면 Enter): ").strip()

    # 5. 공개 상태 선택
    privacy_status = args.privacy_status
    if not privacy_status:
        print("\n🔒 공개 상태 선택 (기본값: [1] 비공개):")
        print(" [1] 비공개 (private)")
        print(" [2] 일부공개 (unlisted)")
        print(" [3] 공개 (public)")
        choice = input("선택 (1-3, 기본값 1): ").strip()
        if choice == "2":
            privacy_status = "unlisted"
        elif choice == "3":
            privacy_status = "public"
        else:
            privacy_status = "private"

    # 6. 카테고리 선택
    category = args.category
    if not category or category == "22":  # 기본값이 지정되어 있어도 대화형에선 다시 물어볼 수 있도록 유도
        print("\n📺 영상 카테고리 선택 (기본값: [1] 인물/블로그):")
        print(" [1] 인물/블로그 (People & Blogs)")
        print(" [2] 엔터테인먼트 (Entertainment)")
        print(" [3] 교육 (Education)")
        print(" [4] 노하우/스타일 (Howto & Style)")
        print(" [5] 과학기술 (Science & Technology)")
        print(" [6] 게임 (Gaming)")
        print(" [7] 코미디 (Comedy)")
        print(" [8] 음악 (Music)")
        print(" [9] 스포츠 (Sports)")
        choice = input("선택 (1-9, 기본값 1): ").strip()
        category_choices = {
            "1": "22", "2": "24", "3": "27", "4": "26", "5": "28", "6": "20", "7": "23", "8": "10", "9": "17"
        }
        category = category_choices.get(choice, "22")

    # args 객체 업데이트
    args.file = file_path
    args.title = title
    args.description = description
    args.tags = tags
    args.privacy_status = privacy_status
    args.category = category

    print("\n--------------------------------------------------")
    print("⚙️ 설정 완료! 아래 정보로 업로드를 실행합니다.")
    print(f" 📂 파일: {args.file}")
    print(f" 📝 제목: {args.title}")
    print(f" 📄 설명: {args.description or '(없음)'}")
    print(f" 🏷️ 태그: {args.tags or '(없음)'}")
    print(f" 🔒 공개: {args.privacy_status}")
    print(f" 📺 분류: {CATEGORY_NAMES.get(resolve_category_id(args.category), args.category)}")
    print("--------------------------------------------------\n")

def upload_video(youtube, args):
    category_id = resolve_category_id(args.category)
    body = {
        "snippet": {
            "title": args.title,
            "description": args.description,
            "tags": [tag.strip() for tag in args.tags.split(",")] if args.tags else [],
            "categoryId": category_id
        },
        "status": {
            "privacyStatus": args.privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }

    # 파일 크기에 맞춰 청크 크기 동적 조절 (256 KB의 배수여야 함)
    file_size = os.path.getsize(args.file)
    if file_size < 5 * 1024 * 1024:
        chunk_size = 1024 * 1024       # 5MB 미만은 1MB 청크
    else:
        chunk_size = 5 * 1024 * 1024   # 5MB 이상은 5MB 청크

    media = MediaFileUpload(args.file, chunksize=chunk_size, resumable=True)

    request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=media
    )

    print(f"🚀 유튜브 업로드 시작: {args.title}")
    print(f"   (파일: {args.file} / 크기: {file_size / (1024*1024):.1f} MB)")
    
    response = None
    bar_width = 30
    
    try:
        while response is None:
            status, response = request.next_chunk()
            if status:
                progress_val = status.progress()
                total_size = status.total_size
                resumable_progress = status.resumable_progress
                
                if total_size:
                    uploaded_mb = resumable_progress / (1024 * 1024)
                    total_mb = total_size / (1024 * 1024)
                    percent = progress_val * 100
                    filled_length = int(bar_width * progress_val)
                    bar = '█' * filled_length + '░' * (bar_width - filled_length)
                    print(f"\r⏳ 업로드 진행 중: |{bar}| {percent:.1f}% ({uploaded_mb:.1f} / {total_mb:.1f} MB)", end="", flush=True)
                else:
                    percent = progress_val * 100
                    print(f"\r⏳ 업로드 진행 중: {percent:.1f}%", end="", flush=True)
        
        # 줄바꿈
        print()
        print("\n✅ 유튜브 업로드 완료!")
        print(f"📺 영상 URL: https://youtu.be/{response['id']}")
        
    except Exception as e:
        print() # 에러 발생 시 줄바꿈
        raise e

def main():
    parser = argparse.ArgumentParser(description="YouTube Video Uploader (개선판)")
    parser.add_argument("--file", help="업로드할 영상 파일 경로")
    parser.add_argument("--title", help="영상 제목")
    parser.add_argument("--description", default="", help="영상 설명")
    parser.add_argument("--tags", default="", help="태그 (콤마로 구분)")
    parser.add_argument("--privacy-status", choices=["public", "private", "unlisted"], help="공개 상태 (public, private, unlisted)")
    parser.add_argument("--category", default="22", help="카테고리 ID 또는 이름 (예: 22, gaming, education, howto, people, tech...)")
    parser.add_argument("-i", "--interactive", action="store_true", help="대화형 입력을 강제 활성화합니다.")
    parser.add_argument("--no-interactive", action="store_true", help="대화형 입력을 사용하지 않습니다 (스크립트/자동화용).")
    
    args = parser.parse_args()

    # 대화형 모드 동작 여부 판별
    is_interactive = False
    if args.interactive:
        is_interactive = True
    elif args.no_interactive:
        is_interactive = False
    else:
        # 필수 인자(--file, --title) 중 하나라도 없고 터미널 입력이 가능(TTY)한 경우 대화형으로 자동 진입
        if (not args.file or not args.title) and sys.stdin.isatty():
            is_interactive = True

    if is_interactive:
        run_interactive_wizard(args)
    else:
        # 비대화형 모드 검증
        if not args.file or not args.title:
            parser.error("대화형 모드가 아니거나 --no-interactive가 설정된 경우 --file과 --title은 필수입니다.")
        
        # 파일 존재 검증
        expanded_path = os.path.expanduser(args.file)
        if not os.path.exists(expanded_path):
            print(f"❌ Error: 파일이 존재하지 않습니다: {args.file}", file=sys.stderr)
            sys.exit(1)
        args.file = expanded_path
        
        # 기본값 채우기
        if not args.privacy_status:
            args.privacy_status = "private"

    try:
        youtube = get_authenticated_service()
        upload_video(youtube, args)
    except googleapiclient.errors.HttpError as e:
        print(f"\n❌ YouTube API 에러 발생 (HTTP {e.resp.status})", file=sys.stderr)
        try:
            err_details = json.loads(e.content.decode("utf-8"))
            err_msg = err_details.get("error", {}).get("message", "")
            print(f"   상세 메시지: {err_msg}", file=sys.stderr)
        except Exception:
            print(f"   상세 메시지: {e.content}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 오류가 발생했습니다: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
