#!/usr/bin/env python3
"""YouTube Video Uploader
자동으로 유튜브에 영상을 업로드하는 도구입니다.

사용법:
python3 video_uploader.py <video_file_path> <title> <description> <tags> <privacy_status>
"""
import os
import sys
import json
import argparse
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.http import MediaFileUpload

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(HERE, "youtube_account.json")
TOKEN_PATH = os.path.join(HERE, "token_uploader.json")

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


def upload_video(youtube, args):
    body = {
        "snippet": {
            "title": args.title,
            "description": args.description,
            "tags": [tag.strip() for tag in args.tags.split(",")] if args.tags else [],
            "categoryId": "22"  # 22 = People & Blogs
        },
        "status": {
            "privacyStatus": args.privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(args.file, chunksize=-1, resumable=True)

    request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=media
    )

    print(f"🚀 업로드 시작: {args.title} ({args.file})")
    
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"진행률: {int(status.progress() * 100)}%")

    print("✅ 업로드 완료!")
    print(f"📺 영상 URL: https://youtu.be/{response['id']}")


def main():
    parser = argparse.ArgumentParser(description="YouTube Video Uploader")
    parser.add_argument("--file", required=True, help="업로드할 영상 파일 경로")
    parser.add_argument("--title", required=True, help="영상 제목")
    parser.add_argument("--description", default="", help="영상 설명")
    parser.add_argument("--tags", default="", help="태그 (콤마로 구분)")
    parser.add_argument("--privacy-status", choices=["public", "private", "unlisted"], default="private", help="공개 상태 (기본: private)")
    
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"❌ Error: 파일이 존재하지 않습니다: {args.file}")
        sys.exit(1)

    try:
        youtube = get_authenticated_service()
        upload_video(youtube, args)
    except googleapiclient.errors.HttpError as e:
        print(f"❌ YouTube API 에러 발생: {e.resp.status}")
        print(e.content)
    except Exception as e:
        print(f"❌ 알 수 없는 에러 발생: {e}")

if __name__ == "__main__":
    main()
