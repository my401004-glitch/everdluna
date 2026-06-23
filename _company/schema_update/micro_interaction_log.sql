-- ----------------------------------------------
-- MicroInteractionLog: 미세 상호작용 이벤트 추적 테이블
-- Purpose: 사용자가 특정 애니메이션 에셋이나 UI 요소와 '어떻게' 상호작용한지 기록합니다. (KPI의 Engagement 측정 핵심)
-- FKs are critical for data integrity and linking back to the source event/session.
-- ----------------------------------------------

CREATE TABLE MicroInteractionLog (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_fk BIGINT NOT NULL, -- 사용자 ID (Users 테이블 참조)
    session_fk BIGINT NOT NULL, -- 해당 상호작용이 발생한 세션 ID (SessionDetails 테이블 참조)
    asset_id VARCHAR(50) NOT NULL, -- Designer가 정의한 애니메이션 에셋 고유 ID (예: A-01_PITCH_VISUALIZER)
    interaction_type ENUM('hover', 'click', 'scroll_depth', 'focus', 'dwell') NOT NULL, 
    interaction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 이벤트 발생 시간
    duration_ms INT, -- 상호작용 지속 시간 (밀리초). dwell(머무름) 측정에 사용.
    context_data JSON, -- 추가적인 맥락 데이터 (예: scroll percentage, button name 등)

    -- Constraints & Indexes for Performance
    FOREIGN KEY (user_fk) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (session_fk) REFERENCES SessionDetails(session_id) ON DELETE CASCADE,
    INDEX idx_asset_interaction (asset_id, interaction_type, interaction_timestamp) 
);

-- [Note]: 이 테이블은 기존의 Diagnosis_Results에 기록되는 '결과'가 아닌, '행동 로그'를 저장합니다.