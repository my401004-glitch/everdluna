-- -----------------------------------------------
-- 아지트아트컴페니 - 진단 결과 및 KPI 추적 시스템 스키마 (V2)
-- [변경점]: 모든 핵심 테이블에 user_id 컬럼 추가 및 외래 키 강제 적용
-- -----------------------------------------------

-- 1. Users Table: 사용자 기본 정보 (Primary Key)
CREATE TABLE users (
    user_id UUID PRIMARY KEY, -- 전역 고유 ID 사용 권장
    email VARCHAR(255) UNIQUE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_plan VARCHAR(50) NOT NULL DEFAULT 'free' -- free, paid, premium 등
);

-- 2. Diagnosis_Results Table: 진단 결과 로그 (핵심 트래킹 테이블)
CREATE TABLE diagnosis_results (
    result_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL, -- <--- 핵심 추가
    diagnosis_type VARCHAR(100) NOT NULL, -- 예: 'Growth', 'Engagement', 'Monetization'
    context_id VARCHAR(255), -- 진단에 사용된 특정 콘텐츠/모듈 ID
    score_data JSONB NOT NULL, -- { "GapScore": 85, "PotentialPoints": 120, ... }
    result_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE -- 관리자 검증 여부 플래그 추가 가능
);

-- 인덱스: 사용자별 진단 이력 조회 최적화
CREATE INDEX idx_user_diagnosis_history ON diagnosis_results (user_id, result_date DESC);


-- 3. KPI_Metrics Table: 성장 지표 추적 기록
CREATE TABLE kpi_metrics (
    metric_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL, -- <--- 핵심 추가
    diagnosis_result_id UUID REFERENCES diagnosis_results(result_id) ON DELETE CASCADE, -- 어떤 결과에 대한 KPI인지 연결
    kpi_type VARCHAR(50) NOT NULL, -- 'Growth', 'Engagement', 'Monetization'
    value INT NOT NULL,
    recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스: 사용자별 KPI 조회 최적화
CREATE INDEX idx_user_kpi ON kpi_metrics (user_id, kpi_type, recorded_date DESC);


-- 4. Roles Table: 권한 관리 (RBAC)
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL -- 예: free, premium, admin
);

-- 5. UserRoles Table: 사용자-역할 연결 테이블
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 트랜잭션 처리를 위한 외래 키 제약 조건 최종 확인
ALTER TABLE diagnosis_results ADD CONSTRAINT fk_diagnosis_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
ALTER TABLE kpi_metrics ADD CONSTRAINT fk_kpi_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- 트랜잭션 종료
COMMIT;