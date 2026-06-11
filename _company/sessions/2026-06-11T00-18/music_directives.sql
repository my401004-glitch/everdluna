-- 🎵 AI 음악 합성 파이프라인 지침 스키마 (Audio Directive Schema)
-- Gap Score와 KPI 추이를 음향적 특성으로 매핑하기 위한 테이블입니다.

CREATE TABLE Audio_Directives (
    directive_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    context_id UUID NOT NULL, -- Diagnosis_Results와 외래 키 연결
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- 1. 핵심 감성 파라미터 (Core Emotional Parameters)
    emotional_valence REAL NOT NULL,      -- 긍정적/부정적 감성 지수 (-1.0 ~ 1.0). 진단 점수가 낮을수록 음의 가치(Negative Valence) 증가 예상.
    tension_level INT NOT NULL CHECK (tension_level >= 1 AND tension_level <= 10), -- 불안감 또는 긴장도 (1: 매우 평온, 10: 극도의 위협). Gap Score와 직접 매핑.
    urgency_score REAL NOT NULL,           -- 메시지의 시급성/절박함 (0.0 ~ 1.0). CTA나 Hook 부분에 집중적으로 할당.

    -- 2. 음악적 구조 파라미터 (Musical Structure Parameters)
    tempo_modifier FLOAT NOT NULL,        -- 목표 BPM 대비 변화율 (예: 0.95 = 5% 느려짐). 감정 전환 시 사용.
    key_shift INT NOT NULL,               -- 마이너/메이저 키 이동 정도 (-12반음 ~ +12반음). 분위기 반전(Pain -> Gain)에 핵심.
    harmonic_complexity REAL DEFAULT 0.5, -- 화성적 복잡도 (단순함 vs 풍부함). 신뢰도를 높일 때 증가 예상.

    -- 3. 추이 및 예외 관리 (Trend & Exception Handling)
    trend_direction VARCHAR(20),          -- 'INCREASING', 'DECREASING', 'STABLE'. KPI 변화 방향을 반영하여 리듬 변화에 사용.
    is_critical BOOLEAN DEFAULT FALSE,     -- 이 지침이 영상의 핵심 전환점(Hook/Reveal)에 쓰이는지 여부 (True: 고강도 사운드 처리).

    FOREIGN KEY (context_id) REFERENCES Diagnosis_Results(result_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,

    UNIQUE (context_id) -- 한 컨텍스트 당 하나의 대표 지침만 존재하도록 강제
);