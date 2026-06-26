-- -----------------------------------------------------
-- Table: hook2_progress (Hook 2 상호작용 진도 추적)
-- 설명: 사용자의 Hook 2 세션별 핵심 활동 및 그에 따른 점수 변화 기록
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hook2_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id), -- 사용자 식별 (외래 키)
    session_uuid UUID UNIQUE NOT NULL,               -- 해당 세션 고유 ID
    action_type VARCHAR(50) NOT NULL,                -- 수행한 액션 타입 (e.g., 'QuizCompletion', 'MaterialView', 'PracticeAttempt')
    context_id VARCHAR(100),                          -- 어떤 자료/모듈을 다뤘는지 식별자
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- 활동 발생 시간
    progress_data JSONB,                              -- 세부 진행 데이터 (예: 점수, 소요시간 등)
    score_impact INTEGER NOT NULL,                    -- 이 액션으로 인한 순수 점수 영향도 (+/-)
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table: hook2_summary (최신 요약 및 KPI 집계)
-- 설명: 사용자의 Hook 2 최종 진단 점수와 핵심 지표를 저장하는 View/Summary 테이블
-- 이 테이블은 Diagnosis_Results보다 더 '진행 과정'에 초점을 맞춥니다.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hook2_summary (
    user_id UUID PRIMARY KEY REFERENCES users(user_id),
    last_progress_timestamp TIMESTAMP WITH TIME ZONE,
    overall_score INTEGER DEFAULT 0,  -- 현재까지의 누적 점수
    growth_metric REAL DEFAULT NULL, -- Hook 2에 특화된 성장 지표 (e.g., Mastery %)
    engagement_ratio REAL DEFAULT NULL -- 상호작용 빈도 대비 깊이 비율
);

CREATE INDEX idx_hook2_user_id ON hook2_progress (user_id);
-- 인덱스 추가: 자주 조회될 조합에 대한 성능 최적화
CREATE INDEX idx_progress_action_type ON hook2_progress (action_type, timestamp DESC);