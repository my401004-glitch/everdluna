-- V20260518에서 정의된 기존 테이블 구조를 기반으로, 스토리텔링 퍼널에 필요한 데이터를 추가합니다.
-- -------------------------------------------------------------------

-- 1. User_Progress: 사용자의 진도 및 활동 로그 (Part 3 핵심)
CREATE TABLE IF NOT EXISTS user_progress (
    user_id BIGINT PRIMARY KEY REFERENCES users(id), -- 기존 사용자 테이블 참조
    context_id VARCHAR(255) NOT NULL,              -- 어떤 컨텍스트(영상/진단)에서의 진행인지 식별
    progress_step INT NOT NULL,                     -- 현재 진도 단계 (예: 1-100)
    completed_items JSONB DEFAULT '{}',             -- 완료한 세부 아이템 목록 (예: [{"item": "Scale", "status": "completed"}])
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_progress UNIQUE (user_id) -- 사용자당 하나의 최신 진도만 유지
);

-- 2. Diagnosis_Plan: AI가 생성하는 구체적인 학습 계획 (Part 3의 CTA 근거)
CREATE TABLE IF NOT EXISTS diagnosis_plan (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES users(id),
    diagnosis_result_id BIGINT UNIQUE REFERENCES diagnosis_results(id), -- 이 계획이 어떤 진단 결과에 기반했는지 연결
    plan_title VARCHAR(255) NOT NULL,             -- 예: "Part 1 Gap 해소 집중 트레이닝"
    plan_details JSONB NOT NULL,                  -- 상세 커리큘럼 (배경음악 링크, 연습 과제 등 구조화된 데이터)
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 추가: 빠른 조회와 관계 무결성 보장
CREATE INDEX idx_user_progress_user_id ON user_progress (user_id);
CREATE INDEX idx_diagnosis_plan_user_id ON diagnosis_plan (user_id);