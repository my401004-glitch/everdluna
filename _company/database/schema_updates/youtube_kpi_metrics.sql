-- 💡 [WHY] 유튜브 콘텐츠의 핵심 지표(KPI)와 트래킹 메타데이터를 저장하는 테이블입니다.
-- KPI는 시간에 따라 누적되거나 주기적으로 업데이트되므로, 원본 데이터를 보관하고 분석에 사용합니다.

CREATE TABLE IF NOT EXISTS youtube_kpi_metrics (
    -- 기본 식별자
    kpi_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_pk VARCHAR(100) NOT NULL COMMENT '연동되는 콘텐츠의 Primary Key (예: content_uuid)',
    youtube_video_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'YouTube에서 제공하는 고유 비디오 ID',

    -- 측정 시점 및 메타데이터
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'KPI가 기록된 시간 (시간적 순서 중요)',
    source_agent VARCHAR(50) NOT NULL DEFAULT 'System' COMMENT '데이터를 수집한 에이전트/시스템 이름',

    -- 핵심 KPI 지표 (Metric Data)
    view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
    like_count INTEGER DEFAULT 0 CHECK (like_count >= 0),
    dislike_count INTEGER DEFAULT 0 CHECK (dislike_count >= 0),
    comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),

    -- Engagement Depth 지표 (분석 가치 높은 데이터)
    average_view_duration REAL COMMENT '평균 시청 지속 시간 (초)',
    watch_time_seconds BIGINT DEFAULT 0 COMMENT '총 시청 시간에 대한 누적 합계',
    retention_rate REAL COMMENT '시청 유지율 (%)',

    -- 비즈니스 목표 연결 지표 (Goal Mapping)
    is_monetized BOOLEAN DEFAULT FALSE COMMENT '광고 수익 발생 여부',
    cta_click_count INTEGER DEFAULT 0 CHECK (cta_click_count >= 0),

    -- 데이터 무결성을 위한 인덱싱 및 외래 키 설정
    UNIQUE (content_pk, youtube_video_id) -- 동일 콘텐츠의 같은 비디오 ID는 중복 기록 방지
);

-- 성능 향상을 위해 자주 조회되는 컬럼에 인덱스를 추가합니다.
CREATE INDEX idx_kpi_source ON youtube_kpi_metrics(source_agent, recorded_at);
CREATE INDEX idx_kpi_video_id ON youtube_kpi_metrics(youtube_video_id);