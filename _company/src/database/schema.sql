-- Diagnosis 시스템 및 AI 음악 합성 파이프라인 통합 스키마 (v1.0)
-- 핵심 목표: 진단 결과와 사용자 경험 데이터가 누적되고, 이를 기반으로 다음 단계 콘텐츠(음악) 제작에 필요한 메타데이터를 추출하는 구조 확립.

-- 1. Users 테이블: 기본 사용자 정보 및 권한 관리 (RBAC의 기준)
CREATE TABLE IF NOT EXISTS Users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('FREE', 'PREMIUM', 'ADMIN') NOT NULL DEFAULT 'FREE', -- Role-Based Access Control
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DiagnosisContext 테이블: 진단 과정의 컨텍스트를 저장 (어떤 시점의 데이터를 분석했는지)
CREATE TABLE IF NOT EXISTS DiagnosisContext (
    context_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(user_id),
    diagnosis_type VARCHAR(100) NOT NULL, -- 예: 'POP_VOCAL', 'JAZZ_ARIA'
    run_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DiagnosisResults 테이블: 최종 진단 결과 (Mockup의 핵심 데이터 저장소)
CREATE TABLE IF NOT EXISTS DiagnosisResults (
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context_id UUID REFERENCES DiagnosisContext(context_id),
    diagnosis_score JSONB NOT NULL, -- {"Growth": 0.72, "Engagement": 0.65, "Monetization": 0.8}
    analysis_data JSONB, -- 상세 분석 데이터 (예: 특정 음역대 문제점 리스트)
    is_processed BOOLEAN DEFAULT FALSE, -- 후속 작업(음악 생성 등) 처리 여부 플래그
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MusicSynthesisData 테이블: AI 음악 합성 파이프라인에 필요한 메타데이터 저장소 (새로 추가)
CREATE TABLE IF NOT EXISTS MusicSynthesisData (
    music_data_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID UNIQUE REFERENCES DiagnosisResults(result_id), -- 어떤 진단 결과가 이 음악을 필요로 했는지 연결
    required_genre VARCHAR(100) NOT NULL, -- 필요한 음악 장르 (예: Pop Ballad, Jazz Swing)
    target_mood VARCHAR(100) NOT NULL, -- 목표 분위기/감정 ('Optimistic', 'Tense')
    key_pitch FLOAT, -- 핵심 음높이 (C4, F#5 등)
    suggested_tempo INTEGER, -- BPM 범위
    synthesis_status ENUM('PENDING', 'SUCCESS', 'FAILURE') DEFAULT 'PENDING'
);

-- 5. KPI_Metrics 테이블: 누적 성과 지표 추적 (Growth/Engagement/Monetization의 트랜잭션 기록)
CREATE TABLE IF NOT EXISTS KPI_Metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(user_id),
    kpi_name VARCHAR(100) NOT NULL, -- 'Growth', 'Engagement', 'Monetization'
    score FLOAT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, kpi_name, recorded_at) -- 중복 기록 방지
);

-- 인덱스 및 제약조건 설정
CREATE INDEX idx_diagnosis_context ON DiagnosisContext(user_id, diagnosis_type);
CREATE INDEX idx_kpi_metrics ON KPI_Metrics(user_id, kpi_name);