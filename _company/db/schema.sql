-- ==============================================
-- 🚀 Performance_History Table (New)
-- 사용자 진단 활동 및 사용량 추적을 위한 통합 로그 테이블
-- LTV 증대 및 RBAC 기반 Billing 로직의 핵심 근거가 됩니다.
-- ==============================================
CREATE TABLE IF NOT EXISTS Performance_History (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id), -- 사용자 식별자
    context_type VARCHAR(50) NOT NULL COMMENT '진단, 리포트 생성, 기능 접근 등 활동 유형',
    diagnosis_result_id UUID REFERENCES Diagnosis_Results(diagnosis_result_id), -- 연결되는 진단 결과 (선택적)
    attempted_access_kpi VARCHAR(100) COMMENT '사용자가 접근하려 했으나 권한 부족으로 제한된 KPI 항목명 (예: Growth_Depth)',
    is_restricted BOOLEAN DEFAULT FALSE COMMENT '접근이 제한되었는지 여부',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- 비즈니스 로직 필드: 사용량 카운터 및 트래킹
    metric_value JSONB COMMENT '진단 관련 상세 메트릭 데이터 (예: {"pitch_accuracy": 0.85})',
    session_type VARCHAR(50) DEFAULT 'Diagnosis' -- 진단 세션, 리포트 생성 세션 등 분류
);

-- 인덱스 설정: 빠른 조회와 권한 검증에 필수적입니다.
CREATE INDEX idx_perf_user_context ON Performance_History (user_id, context_type);
CREATE INDEX idx_perf_restricted ON Performance_History (is_restricted, recorded_at);