-- ---------------------------------------------------
-- [V2.0] Core Schema Update: Video Engagement Tracking Integration
-- 목적: 영상 콘텐츠 소비 단계의 참여 지표를 추적하여, KPI(Engagement)에 활용 가능하게 함.
-- 참고: 기존 Diagnosis_Results와 외래 키로 연결됨.
-- ---------------------------------------------------

-- 1. [NEW] Content Library Table (영상 콘텐츠 마스터 목록)
CREATE TABLE Video_Content_Library (
    content_id UUID PRIMARY KEY, -- 예: 'Intro_Concept', 'Skill_A_DeepDive'
    title VARCHAR(255) NOT NULL,
    script_ref VARCHAR(255) UNIQUE, -- Writer가 확정한 스크립트 버전 참조
    duration_sec INT NOT NULL, -- 영상 총 길이 (초 단위)
    is_premium BOOLEAN DEFAULT FALSE, -- 유료 콘텐츠 여부
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. [NEW] Video Engagement Metrics Table (개별 시청 로그 및 지표 기록)
CREATE TABLE Video_Engagement_Metrics (
    metric_id UUID PRIMARY KEY,
    user_id UUID NOT NULL, -- 사용자 식별자
    content_id UUID NOT NULL, -- 어떤 콘텐츠를 봤는지
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE, -- 시청 종료 시간 (NULL 가능)
    viewed_duration_sec INT NOT NULL, -- 실제로 본 길이 (초 단위). 이 값이 핵심 지표.
    completion_ratio NUMERIC(5, 2), -- 완료 비율 (예: 0.75 = 75%)
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES Video_Content_Library(content_id) ON DELETE RESTRICT,
    UNIQUE (user_id, content_id, start_time) -- 같은 사용자가 같은 콘텐츠를 동시에 중복 기록하는 것을 방지
);

-- 3. [UPDATE/ADD] Diagnosis_Results Table Refinement
ALTER TABLE Diagnosis_Results ADD COLUMN primary_video_content_id UUID REFERENCES Video_Content_Library(content_id) ON DELETE SET NULL;
-- 추가 설명: 진단 결과에 가장 관련성이 높은 '핵심 추천 영상'을 1차적으로 연결합니다.

-- Indexing for performance (필수 고려사항):
CREATE INDEX idx_engagement_user_content ON Video_Engagement_Metrics (user_id, content_id);
CREATE INDEX idx_diag_primary_video ON Diagnosis_Results (primary_video_content_id);