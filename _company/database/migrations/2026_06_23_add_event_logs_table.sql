-- 테이블 이름: event_logs (모든 사용자 행동 기록)
CREATE TABLE IF NOT EXISTS event_logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL, -- 외래 키: User.id
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100),        -- 현재 세션의 컨텍스트 ID (FK: DiagnosisSession.id)
    event_type VARCHAR(100) NOT NULL COMMENT '이벤트 유형 예: DIAGNOSIS_START, PREVIEW_CLICK',
    payload JSON DEFAULT NULL COMMENT '이벤트 발생 시점의 상세 데이터 구조 (e.g., clicked_element_id)',
    is_premium BOOLEAN DEFAULT FALSE COMMENT '유료 기능 사용 여부 플래그'
);

-- 인덱스 설정: 빠른 검색과 필터링을 위해 핵심 조합에 인덱스를 걸어야 합니다.
CREATE INDEX idx_user_event ON event_logs (user_id, event_timestamp);
CREATE INDEX idx_session_type ON event_logs (session_id, event_type);

-- KPI Metric 추적용 테이블은 이미 존재한다고 가정하고, 이 로그가 해당 테이블을 업데이트하는 로직으로 처리하겠습니다.