-- ----------------------------------------
-- [Version 2] User Interaction Logging 추가 (Content Data 확보 목적)
-- ----------------------------------------

-- 기존 Diagnosis_Results 테이블은 유지하며, 아래 로그 테이블을 추가합니다.
CREATE TABLE IF NOT EXISTS user_interaction_log (
    log_id SERIAL PRIMARY KEY,
    user_uuid UUID NOT NULL, -- 사용자 식별자 (로그인 유무 관계없이 고유)
    context_session_id UUID NOT NULL, -- 특정 진단 세션의 고유 ID
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interaction_type VARCHAR(50) NOT NULL, -- 예: 'CLICK', 'SCROLL', 'API_FAIL', 'VIEW'
    element_selector VARCHAR(255), -- 상호작용이 발생한 UI 요소의 CSS/XPath 선택자
    data_payload JSONB, -- 추가적인 데이터 (예: 클릭된 값, 스크롤 깊이 %)
    is_critical BOOLEAN DEFAULT FALSE -- 이 로그가 핵심 콘텐츠 제작에 필요한 지표인지 여부
);

-- 인덱스 추가를 통해 빠른 검색을 보장합니다.
CREATE INDEX idx_user_log_session ON user_interaction_log (context_session_id, timestamp);
CREATE INDEX idx_user_log_type ON user_interaction_log (interaction_type);

-- API 호출 로그가 성공적으로 저장되는지 검증하는 트랜잭션 구문은 별도로 테스트할 것입니다.