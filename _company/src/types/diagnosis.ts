// src/types/diagnosis.ts: 진단 점수 계산에 사용되는 모든 데이터 타입을 정의합니다.
export interface DiagnosisInput {
    // 필수 입력 값 (사용자로부터 받을 정보)
    practiceDurationMinutes: number; // 연습 지속 시간 (분 단위)
    vocalRangeConsistencyScore: number; // 음역대 일관성 지표 (0~100)
    emotionalExpressivenessIndex: number; // 감정 표현 지수 (0~100)
    technicalSkillLevel: 'beginner' | 'intermediate' | 'advanced'; // 기술 숙련도
}

// API의 최종 결과물 구조체. Designer가 정의한 시각적 요소를 포함합니다.
export interface DiagnosisResult {
    score: number; // 종합 진단 점수 (0~100)
    category: string; // 주요 진단 카테고리 (e.g., "Technical Deficit", "Emotional Gap")
    recommendation: string; // 사용자에게 제공할 구체적 조언
    metrics: {
        growthPotentialScore: number; // Growth KPI 반영 점수
        engagementLevel: number; // Engagement KPI 반영 점수
        monetizationValueEstimate: number; // Monetization KPI(잠재 가치) 반영 점수
    };
}

// API 응답을 위한 에러 구조체
export interface ApiResponse {
    success: boolean;
    message: string;
    data?: DiagnosisResult | null;
}