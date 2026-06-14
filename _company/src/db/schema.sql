-- =============================================
-- 아지트아트컴페니 - Diagnosis System Schema v1.0
-- Pain -> Proof / Gap Score 진단 시스템을 위한 핵심 DB 스키마
-- 데이터 무결성 및 트랜잭션 관리가 필수적입니다.
-- =============================================

-- 1. Users: 사용자 기본 정보 (Authentication/Access Control의 기준)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- 실제로는 bcrypt 해시 사용 권장
    role ENUM('free', 'premium', 'admin') DEFAULT 'free', -- RBAC 구현 핵심 필드
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User_Profiles: 사용자별 추가 정보 (튜토리얼/진단 설문 등)
CREATE TABLE User_Profiles (
    user_id INT PRIMARY KEY,
    profile_data JSON, -- 유연한 스키마를 위해 JSON 사용 (예: 학습 목표, 취미 등)
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. Sessions: 사용자 세션 기록 (진단 및 활동의 시간적 흐름 추적)
CREATE TABLE Sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    diagnosis_type VARCHAR(50) NOT NULL, -- 진단 유형 (예: 'Pitch Stability', 'Rhythm Consistency')
    context_data JSON, -- 세션 중 기록된 모든 원본 데이터 (Raw Waveform metadata 등)
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. Diagnosis_Results: 핵심 진단 결과 저장소 (Pain -> Proof의 중심 테이블)
CREATE TABLE Diagnosis_Results (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT UNIQUE NOT NULL, -- 세션당 하나의 최종 진단 결과만 존재하도록 UNIQUE 제약 설정
    diagnosis_score JSON NOT NULL, -- { 'growth': 0.85, 'engagement': 0.72, 'monetization': 0.91 } (KPI 종합 점수)
    raw_score_details JSON, -- 상세 진단 지표를 저장 (예: Mean Pitch Deviation, Average BPM 등)
    risk_level ENUM('Low', 'Medium', 'High') NOT NULL, -- Pain의 심각도 분류
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES Sessions(session_id) ON DELETE CASCADE
);

-- 5. KPI_Metrics: Growth/Engagement/Monetization 핵심 지표 추적 테이블 (비즈니스 가치 증명)
CREATE TABLE KPI_Metrics (
    kpi_metric_id INT PRIMARY KEY AUTO_INCREMENT,
    result_id INT NOT NULL,
    kpi_type ENUM('Growth', 'Engagement', 'Monetization') NOT NULL, -- 어떤 KPI인지 명확히 구분
    score DECIMAL(5, 2) NOT NULL, -- 점수 (0.00 ~ 1.00)
    description TEXT, -- 이 점수가 의미하는 바에 대한 설명
    FOREIGN KEY (result_id) REFERENCES Diagnosis_Results(result_id) ON DELETE CASCADE,
    UNIQUE KEY unique_kpi_per_result (result_id, kpi_type) -- 한 결과당 하나의 KPI만 존재 가능
);

-- 6. User_Feedback: 사용자 피드백 및 콘텐츠 소비 기록 (추가적인 Engagement 데이터)
CREATE TABLE User_Feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content_id VARCHAR(100), -- 어떤 자료에 대한 피드백인지 식별자
    feedback_text TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 7. Indexes for performance
CREATE INDEX idx_session_user_id ON Sessions(user_id);
CREATE INDEX idx_result_session_id ON Diagnosis_Results(session_id);