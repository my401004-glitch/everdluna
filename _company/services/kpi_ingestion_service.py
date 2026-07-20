import sqlite3
from typing import Dict, Any, List
import os

# 💡 [WHY] 이 서비스는 원시(Raw) KPI 데이터를 받아와 DB 스키마에 맞게 변환하고 삽입하는 단일 책임 모듈입니다.
# 데이터 검증과 트랜잭션 관리를 통해 시스템 안정성을 확보합니다.

DB_NAME = 'content_data.db' # 실제 환경에서는 이 부분을 환경변수에서 로드해야 합니다.

def get_db_connection():
    """데이터베이스 연결을 설정하고 커넥션을 반환합니다."""
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row # 결과를 딕셔너리 형태로 받기 위함
        return conn
    except sqlite3.Error as e:
        print(f"🚨 DB Connection Error occurred: {e}")
        raise

def validate_and_sanitize_kpi(raw_data: Dict[str, Any]) -> Dict[str, Any] | None:
    """
    입력된 원시 데이터를 스키마와 타입에 맞게 검증하고 정리합니다. (Data Validation Layer)
    """
    required_fields = ['content_pk', 'youtube_video_id']
    if not all(field in raw_data for field in required_fields):
        print("❌ Validation Failed: 필수 필드 누락.")
        return None

    try:
        # 강제 타입 캐스팅 및 기본값 설정
        sanitized_data = {
            'content_pk': str(raw_data['content_pk']),
            'youtube_video_id': str(raw_data['youtube_video_id']),
            'recorded_at': raw_data.get('timestamp', 'NOW()'), # SQL 함수를 사용하도록 임시 처리
            'source_agent': raw_data.get('source_agent', 'System'),
            'view_count': int(raw_data.get('views', 0)),
            'like_count': int(raw_data.get('likes', 0)),
            'dislike_count': int(raw_data.get('dislikes', 0)),
            'comment_count': int(raw_data.get('comments', 0)),
            # 실수형 데이터는 NaN 또는 0으로 처리하여 오류 방지
            'average_view_duration': round(float(raw_data.get('avg_view_sec', 0.0)), 2),
            'watch_time_seconds': int(raw_data.get('total_watch_sec', 0)),
            'retention_rate': float(raw_data.get('retention_pct', 0.0)),
            'is_monetized': bool(raw_data.get('is_paid', False)),
            'cta_click_count': int(raw_data.get('cta_clicks', 0))
        }
        return sanitized_data

    except (ValueError, TypeError) as e:
        print(f"❌ Validation Failed due to type conversion error: {e}")
        return None


def ingest_kpi_metrics(raw_records: List[Dict[str, Any]]) -> int:
    """
    KPI 원시 데이터 목록을 받아와 DB에 삽입하고 트랜잭션을 커밋합니다. (Core Ingestion Logic)
    
    Args:
        raw_records: KPI 데이터를 포함하는 딕셔너리 리스트.
        
    Returns:
        성공적으로 기록된 레코드 수.
    """
    if not raw_records:
        print("ℹ️ No records provided for ingestion.")
        return 0

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL 삽입 구문 (가장 효율적인 배치 삽입 형태)
        sql = """
            INSERT INTO youtube_kpi_metrics 
            (content_pk, youtube_video_id, recorded_at, source_agent, view_count, like_count, dislike_count, comment_count, average_view_duration, watch_time_seconds, retention_rate, is_monetized, cta_click_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        records_to_insert = []
        successful_validations = 0

        # 1. 데이터 검증 및 준비 루프
        for record in raw_records:
            sanitized = validate_and_sanitize_kpi(record)
            if sanitized:
                records_to_insert.append((
                    sanitized['content_pk'],
                    sanitized['youtube_video_id'],
                    sanitized['recorded_at'],
                    sanitized['source_agent'],
                    sanitized['view_count'],
                    sanitized['like_count'],
                    sanitized['dislike_count'],
                    sanitized['comment_count'],
                    sanitized['average_view_duration'],
                    sanitized['watch_time_seconds'],
                    sanitized['retention_rate'],
                    sanitized['is_monetized'],
                    sanitized['cta_click_count']
                ))
                successful_validations += 1

        if not records_to_insert:
            print("⚠️ All provided records failed validation. No data inserted.")
            return 0

        # 2. 배치 삽입 (Batch Insertion)
        cursor.executemany(sql, records_to_insert)
        conn.commit()
        print(f"✅ Success: {successful_validations}개 레코드의 KPI 데이터가 성공적으로 기록되었습니다.")
        return successful_validations

    except sqlite3.OperationalError as e:
        # 스키마에 없는 컬럼을 넣거나, 외래 키 제약 조건 위반 시 발생 가능
        print(f"🚨 DB Operation Failed (Schema/Constraint Error): {e}")
        if conn:
            conn.rollback() # 트랜잭션 롤백 필수
        return 0
    except sqlite3.Error as e:
        print(f"🚨 General Database Error: {e}")
        if conn:
            conn.rollback()
        return 0
    finally:
        if conn:
            conn.close()

# === 테스트용 실행 블록 (실제 환경에서는 주석 처리하거나 별도 스크립트로 분리) ===
if __name__ == '__main__':
    print("--- Running KPI Ingestion Service Test ---")
    
    # 1. 가상의 원시 데이터 생성 (API 응답 형태 모방)
    raw_kpi_data = [
        {
            'content_pk': 'ART_PRJ_001', 
            'youtube_video_id': 'ABCDEF123', 
            'timestamp': '2026-07-20T10:00:00', 
            'source_agent': 'YouTubeAPI',
            'views': 500, 
            'likes': 80, 
            'dislikes': 5, 
            'comments': 12,
            'avg_view_sec': 45.5, # 초 단위
            'total_watch_sec': 36000, # 누적 시청 시간 (초)
            'retention_pct': 65.0,
            'is_paid': True,
            'cta_clicks': 20
        },
        {
            # 유효하지 않은 데이터 예시: views가 문자열인 경우
            'content_pk': 'ART_PRJ_001', 
            'youtube_video_id': 'ABCDEF123', 
            'timestamp': '2026-07-20T11:00:00', 
            'source_agent': 'YouTubeAPI',
            'views': "FIVE HUNDRED", # <- 이 부분이 실패를 유발해야 함
            'likes': 75, 
            'dislikes': 4, 
            'comments': 10,
            'avg_view_sec': 42.0,
            'total_watch_sec': 35000,
            'retention_pct': 63.0,
            'is_paid': True,
            'cta_clicks': 18
        },
         {
            # 필수 필드 누락 예시
            'content_pk': 'ART_PRJ_999', 
            'youtube_video_id': None, # <- 이 부분이 실패를 유발해야 함
            'timestamp': '2026-07-21T10:00:00', 
            'source_agent': 'YouTubeAPI',
            'views': 50, 
            # ... 나머지 필드 생략 (누락 테스트)
        }
    ]

    print("\n--- Running Test Batch 1 (Success expected for first record only) ---")
    ingest_kpi_metrics(raw_kpi_data)