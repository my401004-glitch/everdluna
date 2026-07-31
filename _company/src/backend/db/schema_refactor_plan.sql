-- ===============================================================
-- [코다리] Diagnosis Platform - V2.0 DB 스키마 리팩토링 계획 ⚙️
-- 목표: 구독 기반 접근 제어(RBAC) 및 데이터 일관성 확보 (P0)
-- 작성일: 2026-07-31
-- ===============================================================

-- 1. `users` 테이블 개선 (기존 유지 + Subscription FK 추가)
ALTER TABLE users ADD COLUMN subscription_id INT NULL;
ALTER TABLE users ADD CONSTRAINT fk_user_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id);


-- 2. [신규] `subscriptions` 테이블: 사용자의 구독 정보 관리
CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, -- 사용자당 하나만 존재하도록 강제
    plan_tier VARCHAR(50) NOT NULL,  -- 예: 'FREE', 'PREMIUM', 'ENTERPRISE'
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,                -- 구독 만료일. 이 날짜를 기준으로 권한 게이팅 구현.
    is_active BOOLEAN DEFAULT TRUE,    -- 현재 활성 상태 여부 (결제 실패 등)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. [신규] `feature_access` 테이블: 기능별 접근 제어 목록 관리
CREATE TABLE feature_access (
    access_id SERIAL PRIMARY KEY,
    feature_name VARCHAR(100) NOT NULL UNIQUE, -- 예: 'Advanced_Pitch_Analysis', 'Growth_KPI_Report'
    description TEXT,
    required_tier VARCHAR(50) DEFAULT 'FREE'  -- 최소 요구 등급 (Tiered Pricing의 핵심)
);

-- 4. [개선] `Diagnosis_Results` 테이블 수정: 권한 검증 필드 추가
ALTER TABLE Diagnosis_Results ADD COLUMN required_feature_access_id INT;
ALTER TABLE Diagnosis_Results ADD CONSTRAINT fk_result_feature FOREIGN KEY (required_feature_access_id) REFERENCES feature_access(access_id);

-- 5. [신규] `user_log` 테이블: 행동 기반 데이터 추적 및 과금 로직 지원
CREATE TABLE user_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL, -- 예: 'REPORT_VIEW', 'ANALYSIS_RUN'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_paid_feature BOOLEAN DEFAULT FALSE, -- 이 액션이 유료 기능이었는지 추적
    details JSONB -- 상세 파라미터 (예: 어떤 분석을 했는지)
);

-- 💡 인덱스 최적화 및 트랜잭션 고려가 필수입니다.
\d+ users;
\d+ subscriptions;
\d+ feature_access;