#!/usr/bin/env python3
# version: hook_analyzer_v2 — 실제 YouTube API 기반 후킹 분석기
"""유튜브 영상 후킹(첫 30초) 패턴 자동 분석.

youtube_account.json에서 API 키와 채널 ID를 읽어
실제 영상 제목·길이·조회수 데이터 기반으로 후킹 패턴을 분석합니다.

config (hook_analyzer.json):
  RECENT_N — 분석할 최근 영상 수 (기본 10)
"""
import os, json, sys, re, datetime
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG  = os.path.join(HERE, "hook_analyzer.json")
ACCOUNT = os.path.join(HERE, "youtube_account.json")

# 후킹 유형별 키워드 패턴
HOOK_PATTERNS = {
    "숫자형": re.compile(r"\d+"),
    "질문형": re.compile(r"[?？]"),
    "비밀/폭로형": re.compile(r"비밀|폭로|진실|충격|사실은|알려드립|공개"),
    "방법형": re.compile(r"방법|하는법|하는 법|따라하|하는 방법|하면|쉽게"),
    "결과/후기형": re.compile(r"후기|결과|해봤|해봤더니|해보니|실제로|했더니"),
    "위기/감성형": re.compile(r"망했|실패|성공|살아남|기적|눈물|감동|충격"),
    "최상급형": re.compile(r"최고|최대|역대|역사상|세계|국내|압도적|완벽"),
    "공감형": re.compile(r"저만|나만|다들|혹시|여러분|우리|이런"),
}

def _load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def _parse_duration(iso):
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', iso or '')
    if not m: return 0
    h, mn, s = (int(x) if x else 0 for x in m.groups())
    return h * 3600 + mn * 60 + s

def _fmt_duration(secs):
    if secs >= 3600: return f"{secs//3600}시간 {(secs%3600)//60}분"
    if secs >= 60: return f"{secs//60}분 {secs%60}초"
    return f"{secs}초"

def _detect_hook_type(title):
    found = []
    for name, pattern in HOOK_PATTERNS.items():
        if pattern.search(title):
            found.append(name)
    return found if found else ["일반형"]

def main():
    # 설정 로드
    cfg = _load_json(CONFIG) if os.path.exists(CONFIG) else {}
    n = int(cfg.get("RECENT_N", 10))

    if not os.path.exists(ACCOUNT):
        print("❌ youtube_account.json이 없어요. YouTube 에이전트 설정에서 API 키와 채널 ID를 입력해주세요.")
        sys.exit(1)
    acct = _load_json(ACCOUNT)
    api_key = (acct.get("YOUTUBE_API_KEY") or "").strip()
    handle  = (acct.get("MY_CHANNEL_HANDLE") or "").strip()
    chan_id = (acct.get("MY_CHANNEL_ID") or "").strip()

    # 채널 ID에서 URL이 들어온 경우 자동 추출
    if chan_id.startswith("http"):
        m = re.search(r'UC[\w-]{22}', chan_id)
        if m:
            chan_id = m.group(0)
        else:
            chan_id = ""

    if not api_key:
        print("❌ YOUTUBE_API_KEY 미설정. youtube_account.json에 API 키를 입력해주세요.")
        sys.exit(1)
    if not (handle or chan_id):
        print("❌ 채널 핸들(MY_CHANNEL_HANDLE) 또는 채널 ID(MY_CHANNEL_ID)가 필요합니다.")
        sys.exit(1)

    try:
        from googleapiclient.discovery import build
    except ImportError:
        print("❌ google-api-python-client 미설치.")
        print("   터미널에서: pip install google-api-python-client requests")
        sys.exit(1)

    youtube = build("youtube", "v3", developerKey=api_key)

    # 채널 ID 확보
    if not chan_id:
        h = handle.lstrip("@")
        try:
            r = youtube.search().list(part="snippet", q=h, type="channel", maxResults=1).execute()
            items = r.get("items", [])
            if items:
                chan_id = items[0]["snippet"]["channelId"]
        except Exception as e:
            print(f"❌ 채널 ID 조회 실패: {e}")
            sys.exit(1)

    if not chan_id:
        print("❌ 채널 ID를 찾지 못했어요. youtube_account.json의 핸들/ID를 확인해주세요.")
        sys.exit(1)

    print(f"🎬 [후킹 분석기] 채널 {handle or chan_id} — 최근 {n}개 영상 분석 중...")
    print()

    # 최근 영상 목록 조회
    try:
        sr = youtube.search().list(
            part="snippet", channelId=chan_id, maxResults=n,
            order="date", type="video"
        ).execute()
    except Exception as e:
        print(f"❌ 영상 목록 조회 실패: {e}")
        sys.exit(1)

    vids = [
        (it["id"]["videoId"], it["snippet"]["title"], it["snippet"]["publishedAt"])
        for it in sr.get("items", [])
    ]
    if not vids:
        print("⚠️  최근 업로드된 영상이 없습니다.")
        sys.exit(0)

    # 영상별 상세 통계 조회
    vid_ids = [v[0] for v in vids]
    stats_resp = youtube.videos().list(
        part="statistics,contentDetails", id=",".join(vid_ids)
    ).execute()
    stats_map = {it["id"]: it for it in stats_resp.get("items", [])}

    rows = []
    for vid_id, title, pub in vids:
        item = stats_map.get(vid_id, {})
        s = item.get("statistics", {})
        cd = item.get("contentDetails", {})
        views = int(s.get("viewCount", 0))
        likes = int(s.get("likeCount", 0))
        dur_sec = _parse_duration(cd.get("duration", ""))
        hook_types = _detect_hook_type(title)
        rows.append({
            "id": vid_id, "title": title,
            "views": views, "likes": likes,
            "duration_sec": dur_sec,
            "is_short": dur_sec <= 60,
            "hook_types": hook_types,
        })

    # 분석
    rows_sorted = sorted(rows, key=lambda r: r["views"], reverse=True)
    median_views = sorted([r["views"] for r in rows])[len(rows) // 2] if rows else 0
    top_half = [r for r in rows_sorted if r["views"] >= median_views]
    bottom_half = [r for r in rows_sorted if r["views"] < median_views]

    # 상위 영상의 후크 유형 통계
    top_hook_counter = Counter()
    for r in top_half:
        for ht in r["hook_types"]:
            top_hook_counter[ht] += 1
    bottom_hook_counter = Counter()
    for r in bottom_half:
        for ht in r["hook_types"]:
            bottom_hook_counter[ht] += 1

    # 숫자 포함 제목이 조회수에 미치는 영향
    num_vids = [r for r in rows if re.search(r"\d", r["title"])]
    no_num_vids = [r for r in rows if not re.search(r"\d", r["title"])]
    avg_views_num = sum(r["views"] for r in num_vids) / len(num_vids) if num_vids else 0
    avg_views_no_num = sum(r["views"] for r in no_num_vids) / len(no_num_vids) if no_num_vids else 0

    # 제목 길이 분석
    title_lens = [len(r["title"]) for r in rows]
    top_title_lens = [len(r["title"]) for r in top_half]
    avg_title_len = sum(title_lens) / len(title_lens) if title_lens else 0
    top_avg_title_len = sum(top_title_lens) / len(top_title_lens) if top_title_lens else 0

    # ───── 출력 ─────
    print("=" * 60)
    print(f"🎬 후킹 패턴 분석 보고서 — {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"채널: {handle or chan_id} · 분석 영상: {len(rows)}개")
    print("=" * 60)
    print()

    print("─── 1. 영상별 후킹 유형 (조회수 순) ───")
    for i, r in enumerate(rows_sorted[:n], 1):
        marker = "🔥" if r["views"] >= median_views * 1.5 else ("👍" if r["views"] >= median_views else "🥶")
        short_mark = "📱" if r["is_short"] else ""
        types_str = ", ".join(r["hook_types"])
        print(f"  {i}{marker}{short_mark} {r['views']:>8,}회 · [{types_str}] · {r['title'][:55]}")
    print()

    print("─── 2. 상위 영상에서 많이 쓰인 후킹 유형 ───")
    if top_hook_counter:
        for hook_type, count in top_hook_counter.most_common(5):
            bar = "█" * count
            print(f"  {hook_type:<12} {bar} ({count}개)")
    print()
    print("─── 3. 하위 영상에서 많이 쓰인 후킹 유형 ───")
    if bottom_hook_counter:
        for hook_type, count in bottom_hook_counter.most_common(5):
            bar = "░" * count
            print(f"  {hook_type:<12} {bar} ({count}개)")
    print()

    print("─── 4. 숫자 포함 제목 효과 ───")
    if num_vids and no_num_vids:
        ratio = avg_views_num / avg_views_no_num if avg_views_no_num > 0 else 1
        winner = "숫자 포함" if avg_views_num >= avg_views_no_num else "숫자 없음"
        print(f"  숫자 포함 ({len(num_vids)}개): 평균 {avg_views_num:,.0f}회")
        print(f"  숫자 없음 ({len(no_num_vids)}개): 평균 {avg_views_no_num:,.0f}회")
        print(f"  → {winner} 제목이 {abs(ratio-1)*100:.0f}% {'더 높은' if ratio >= 1 else '더 낮은'} 조회수")
    print()

    print("─── 5. 제목 길이 분석 ───")
    print(f"  전체 평균 제목 길이: {avg_title_len:.0f}자")
    print(f"  상위 영상 평균 제목 길이: {top_avg_title_len:.0f}자")
    print()

    print("─── 6. 🎯 후킹 전략 추천 ───")
    recs = []
    if top_hook_counter:
        best_hook = top_hook_counter.most_common(1)[0][0]
        recs.append(f"✅ [{best_hook}] 유형이 상위 영상에서 가장 많이 발견됨 → 다음 제목에 적극 활용")
    if avg_views_num > avg_views_no_num and len(num_vids) < len(rows) * 0.5:
        recs.append(f"🔢 숫자 포함 제목이 평균 {(avg_views_num/avg_views_no_num - 1)*100:.0f}% 더 성과 좋음 → 제목에 숫자 추가 추천 (예: '5가지 방법', '30초 만에')")
    if top_avg_title_len > 0:
        recs.append(f"📝 상위 영상 제목은 평균 {top_avg_title_len:.0f}자 → 제목 작성 시 이 길이 참고")
    best_vid = rows_sorted[0] if rows_sorted else None
    if best_vid:
        recs.append(f"🔥 최고 성과 영상 제목 참고: \"{best_vid['title'][:50]}\" ({best_vid['views']:,}회)")
    if not recs:
        recs.append("데이터 부족 — 영상이 더 쌓이면 재분석 권장")
    for r in recs:
        print(f"  • {r}")
    print()
    print("✅ 후킹 분석 완료!")

if __name__ == "__main__":
    main()
