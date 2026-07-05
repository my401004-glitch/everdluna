// src/types/diagnosis-types.ts

/**
 * @description 사용자 세션 활동 로그의 기본 구조 (Raw Data)
 */
export interface SessionLog {
    timestamp: string;
    duration: number; // 초 단위
    feature: 'BasicPitch' | 'PremiumPitch' | 'VocalWarmup';
    performanceMetric?: number; // 예: Pitch Accuracy 점수
}

/**
 * @description 진단 결과의 핵심 구조 (API 응답 포맷과 일치해야 함)
 */
export interface DiagnosisResult {
    contextId: string; // 사용자 ID 또는 세션 ID
    diagnosisType: 'AI_VOCAL_ANALYSIS' | string; // 어떤 종류의 진단인지 명시
    totalScore: number; // 최종 점수 (0~100)
    kpiMetrics: {
        growth: number;         // 성장 지표 (Growth KPI)
        engagement: number;     // 참여도 지표 (Engagement KPI)
        monetization: number;   // 수익화 가능성 지표 (Monetization KPI)
    };
}

/**
 * @description 진단 서비스에 필요한 사용자 컨텍스트 데이터
 */
export interface UserContext {
    id: string; // User ID
    isPremiumUser: boolean;
    currentTier: 'Bronze' | 'Silver' | 'Gold'; // RBAC 체크의 근거가 됨
}

// (추가적으로 API 응답에 사용될 Error 타입도 정의하는 것이 좋습니다.)