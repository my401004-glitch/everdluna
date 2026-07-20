-- [테이블명: youtube_kpi_metrics] - 성능 지표 통합 테이블
CREATE TABLE IF NOT EXISTS youtube_kpi_metrics (
    metric_id INT PRIMARY KEY AUTO_INCREMENT,
    video_title VARCHAR(255) NOT NULL,            -- 영상 제목 식별자
    publish_date DATE NOT NULL,                    -- 발행일자
    total_views BIGINT DEFAULT 0,                  -- 총 조회수
    impressions INT DEFAULT 0,                     -- 노출 수 (KPI 지표)
    click_through_rate DECIMAL(5, 2) DEFAULT 0.00, -- 클릭률 (CTR: Impressions 대비 Click)
    average_watch_time INTERVAL DEFAULT 'PT0M',   -- 평균 시청 시간 (AWT)
    conversion_event_count INT DEFAULT 0,          -- 최종 전환 이벤트 발생 수 (CTA 관련 지표)
    data_source VARCHAR(50) NOT NULL               -- 데이터 출처 (e.g., YouTube API, Internal Script)
);

CREATE INDEX idx_video_date ON youtube_kpi_metrics (video_title, publish_date);