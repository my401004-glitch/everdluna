-- Migration Script: 2026-07-31 - Add Error Log Tracking System
BEGIN;

-- 1. Error_Log 테이블 생성 (System Failure Logging)
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- 어떤 사용자에게 발생했는지 추적 (Foreign Key to Users table)
    context_id UUID NOT NULL, -- 실패가 발생한 특정 기능/트랜잭션 ID (예: diagnosis_run_123)
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    error_code VARCHAR(100) UNIQUE NOT NULL, -- 시스템에서 정의된 표준 에러 코드 (예: AUTH_FAIL_403)
    error_message TEXT NOT NULL, 
    stack_trace TEXT, -- 상세 스택 트레이스 기록
    is_handled BOOLEAN DEFAULT FALSE, -- 내부 로직에 의해 처리되었는지 여부
    reportable JSONB DEFAULT NULL -- 관리자에게 보고할 추가 데이터 (예: 사용자 환경 정보)
);

-- 2. 외래 키 및 인덱싱 최적화
ALTER TABLE error_logs ADD CONSTRAINT fk_error_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_error_timestamp ON error_logs (timestamp);
CREATE INDEX idx_error_context ON error_logs (context_id);

COMMIT;