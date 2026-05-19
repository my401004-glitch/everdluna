<![CDATA[
-- 🎯 테이블 설계: MVP 우선순위 (진단 → 권한 → 성과 추적) 기반

-- 1. User 관리 테이블 (RBAC의 기본)
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'free', -- role: free, paid, admin 등 권한 정의
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Diagnosis 결과 테이블 (핵심 진단 기록)
CREATE TABLE Diagnosis_Results (
    result_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE, -- 사용자 연결
    diagnosis_type VARCHAR(100) NOT NULL, -- 예: 'Vocal_Foundation', 'Pitch_Stability' 등
    context_id VARCHAR(255), -- LLM 호출 시 사용된 컨텍스트 ID (트래킹용)
    result_data JSONB NOT NULL, -- 최종 진단 결과 데이터 (JSON 스키마 준수)
    score_depth NUMERIC, -- Gap Score Depth (수익화 관련 지표)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. KPI 측정 테이블 (성과 추적을 위한 분리 설계)
CREATE TABLE KPI_Metrics (
    metric_id SERIAL PRIMARY KEY,
    result_id INTEGER NOT NULL REFERENCES Diagnosis_Results(result_id) ON DELETE CASCADE, -- 진단 결과 연결
    growth_score NUMERIC, -- 성장 점수 (Growth: #4CAF50)
    engagement_score NUMERIC, -- 참여도 점수 (Engagement: #FF9800)
    monetization_potential NUMERIC, -- 수익 잠재력 (Monetization: #4CAF50)
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 세션 및 로그 테이블 (상세 추적 및 감사용)
CREATE TABLE Session_Details (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50), -- success, failed, pending
    related_diagnosis_id INTEGER REFERENCES Diagnosis_Results(result_id) ON DELETE SET NULL
);

-- 인덱스 설정 (성능 최적화)
CREATE INDEX idx_diagnosis_type ON Diagnosis_Results(diagnosis_type);
CREATE INDEX idx_kpi_metric_result ON KPI_Metrics(result_id);
CREATE INDEX idx_session_user_id ON Session_Details(user_id);

COMMIT;
]]>