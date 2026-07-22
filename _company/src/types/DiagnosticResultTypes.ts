/**
 * DiagnosticResultTypes: 진단 관련 API 요청 및 응답의 타입을 정의합니다.
 */
export interface UserContext {
    userId: string;
    role: 'FREE' | 'PREMIUM'; // RBAC 검증에 사용됨 [근거: sessions/2026-05-18T13:43/developer.md]
}

/**
 * 진단 로직 수행에 필요한 모든 입력 데이터 구조를 정의합니다.
 */
export interface DiagnosticResultInput {
    contextId: string; // 현재 학습 콘텐츠 ID
    userId: string;
    sessionData?: {
        pitchAccuracy?: number | null;
        frequencyStability?: number | null;
        isTrackedKPI?: boolean; // KPI 추적 여부 (유료화 트리거에 사용)
    };
}

/**
 * 진단 점수 계산의 최종 응답 스키마를 정의합니다.
 */
export interface DiagnosisResult {
    diagnosisId: string;
    contextId: string;
    timestamp: string;
    scoreDetails: {
        gapScore: number; // 핵심 진단 점수 (0~10)
        pitchAccuracy: number | null;
        frequencyStability: number | null;
    };
    diagnosisType: 'Beginner' | 'Intermediate' | 'Advanced';
    summaryReport: string;
    // 비즈니스 로직에서 산출되는 필드
    monetizationTriggers: { 
        isPremiumRequired: boolean; 
        recommendedActions: string[]; 
    };
}