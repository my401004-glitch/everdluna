-- Migration Script for 2026-07-17: Adding A/B & Pricing Tracking Fields

BEGIN;

-- 1. Diagnosis_Results 테이블에 새로운 트래킹 필드 추가
ALTER TABLE "Diagnosis_Results" ADD COLUMN IF NOT EXISTS most_interested_module VARCHAR(100) NULL;
ALTER TABLE "Diagnosis_Results" ADD COLUMN IF NOT EXISTS price_tier_viewed VARCHAR(50) NULL;

-- 2. (선택적) A/B 테스트 결과 기록을 위한 별도 테이블 추가 고려
CREATE TABLE AbTestLogs (
    log_id UUID PRIMARY KEY,
    user_id UUID REFERENCES Users(user_id),
    test_version VARCHAR(100) NOT NULL, -- e.g., 'v2_header_blue'
    ab_group ENUM('A', 'B') NOT NULL,
    tested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMIT;