-- ============================================================
-- 아지트아트컴페니 - 실용음악 AI 진단 시스템 (V2) 스키마 정의
-- 핵심: 사용자 행동 데이터 -> KPI 추적 -> 유료화 모델 지원
-- ============================================================

-- 1. Users Table: 회원 정보 및 권한 관리 (RBAC의 기초)
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    subscription_level ENUM('FREE', 'PREMIUM', 'ENTERPRISE') DEFAULT 'FREE' NOT NULL, -- 유료화 핵심 필드
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Learning_Sessions Table: 모든 학습 기록 (출결 및 시간)
CREATE TABLE IF NOT EXISTS Learning_Sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0), -- 최소 학습 시간 체크
    focus_area VARCHAR(100), -- 예: Pitch Control, Breathing, Rhythm 등
    is_manual_entry BOOLEAN DEFAULT FALSE, -- 관리자/수동 입력 여부 플래그
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Diagnosis_Results Table: AI 진단 결과 저장 (핵심 비즈니스 데이터)
CREATE TABLE IF NOT EXISTS Diagnosis_Results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    diagnosis_type VARCHAR(50) NOT NULL, -- 예: 'PitchAnalysis', 'RhythmTest'
    context_id UUID DEFAULT gen_random_uuid(), -- 어떤 학습 세션을 기반으로 했는지 추적
    result_data JSONB NOT NULL, -- 진단 점수 및 상세 결과 (JSON 스키마 준수 필수)
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, diagnosis_type, created_at)
);

-- 4. KPI_Metrics Table: 성과 지표 추적 (Growth/Engagement/Monetization)
-- 이 테이블이 모든 비즈니스 리포팅의 근간이 됩니다.
CREATE TABLE IF NOT EXISTS KPI_Metrics (
    kpi_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    diagnosis_type VARCHAR(50) NOT NULL,
    kpi_date DATE NOT NULL,
    growth_score NUMERIC(5, 2) DEFAULT 0.00, -- 성장도 지표 (Rate of Change)
    engagement_score NUMERIC(5, 2) DEFAULT 0.00, -- 몰입/빈도 지표 (Frequency)
    monetization_potential INTEGER DEFAULT 0, -- 잠재 구매 금액 혹은 점수
    details JSONB, -- 기타 상세 분석 데이터
    UNIQUE (user_id, kpi_date, diagnosis_type)
);

-- 인덱스 및 제약 조건 최적화: 검색 성능 향상을 위해 핵심 필드에 인덱스를 추가합니다.
CREATE INDEX idx_learning_sessions_user ON Learning_Sessions(user_id);
CREATE INDEX idx_diagnosis_results_user_type ON Diagnosis_Results(user_id, diagnosis_type);
CREATE INDEX idx_kpi_metrics_user_date ON KPI_Metrics(user_id, kpi_date);