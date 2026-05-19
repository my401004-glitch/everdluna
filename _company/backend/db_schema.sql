-- DB 스키마 설계 (SQL 초안)
-- 1. Users 테이블 (사용자 및 권한 관리의 기반)
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'owner', 'teacher', 'student')), -- RBAC 기본 역할 정의
    subscription_level VARCHAR(50) DEFAULT 'free', -- 구독 레벨 (무료/프리미엄 등)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Diagnosis_Results 테이블 (진단 결과 저장)
CREATE TABLE Diagnosis_Results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id), -- 누가 진단받았는지 연결
    diagnosis_type VARCHAR(100) NOT NULL, -- 진단 종류 (예: 보컬 진단 테스트)
    raw_data JSONB NOT NULL, -- AI가 분석한 원본 데이터 (JSON 스키마 준수)
    score_data JSONB NOT NULL, -- 최종 점수 및 상세 결과 (Growth, Engagement, Monetization 포함)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. KPI_Metrics 테이블 (성장 지표 추적 - Growth, Engagement, Monetization 분리 관리)
CREATE TABLE KPI_Metrics (
    metric_id SERIAL PRIMARY KEY,
    result_id INTEGER NOT NULL REFERENCES Diagnosis_Results(result_id), -- 어떤 진단 결과에 대한 지표인지 연결
    growth_score NUMERIC(5, 2), -- 성장 점수 (Growth KPI)
    engagement_score NUMERIC(5, 2), -- 참여/몰입 점수 (Engagement KPI)
    monetization_score NUMERIC(5, 2), -- 수익화 잠재력 점수 (Monetization KPI)
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (result_id) -- 한 진단 결과당 하나의 KPI 집계만 저장
);

-- 인덱스 설정: 빠른 조회 및 필터링을 위해 필수
CREATE INDEX idx_diagnosis_user_id ON Diagnosis_Results(user_id);
CREATE INDEX idx_kpi_result_id ON KPI_Metrics(result_id);