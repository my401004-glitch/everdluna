-- 파일명: V1.2.0__add_error_log_table.sql (DB 마이그레이션 스크립트)
-- 목적: Funnel Flow Audit Map 기반 핵심 실패 케이스 로그 기록 및 트래킹 가능 구조 확보

CREATE TABLE IF NOT EXISTS Error_Log (
    log_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,                -- 🚨 외래 키: 누가 실패했는지 추적
    context_type VARCHAR(50) NOT NULL,      -- 예: 'Diagnosis', 'Payment', 'AccessGate'
    context_id UUID,                         -- 실패가 발생한 특정 자원/상황 ID (예: 진단 테스트 세션 ID)
    error_code VARCHAR(20) UNIQUE NOT NULL, -- 시스템 정의 에러 코드 (예: AUTH_MISSING_PERMISSION, PAYMENT_CARD_DECLINED)
    message TEXT NOT NULL,                  -- 사용자에게 보여줄 친절한 메시지 (Front-end Display Message)
    details JSONB,                          -- 기술적 상세 정보 (원래 스택 트레이스, 요청 본문 등)
    failed_action VARCHAR(100),            -- 실패가 발생한 액션 이름 (예: 'submit_diagnosis', 'pay_subscription')
    failure_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_retryable BOOLEAN NOT NULL DEFAULT TRUE -- 재시도가 가능한 오류인지 여부 (예: 카드 한도 초과 vs. 비밀번호 오류)
);

-- 🚨 인덱스 및 외래 키 설정 (성능 최적화 필수)
CREATE INDEX idx_error_log_user_context ON Error_Log (user_id, context_type, failure_timestamp DESC);
CREATE UNIQUE INDEX uq_error_log_unique_failure ON Error_Log (user_id, error_code, failed_action);

-- 외래 키 제약 조건 (User 테이블과 연결)
ALTER TABLE Error_Log ADD CONSTRAINT fk_error_user
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE;

COMMENT ON COLUMN Error_Log.context_type IS '에러가 발생한 서비스의 맥락 분류 (예: Payment, Quiz, Auth)';
COMMENT ON COLUMN Error_Log.details IS '원시 에러 스택 트레이스 또는 요청 JSON 본문 등 디버깅을 위한 원본 데이터';

-- Index/Constraint 검증 완료. 이제 백엔드 로직 통합이 필요합니다.