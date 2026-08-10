/**
 * src/types/index.ts
 * @description 프로젝트 전반에 걸쳐 사용되는 핵심 데이터 구조(DTO)를 정의합니다.
 */

// KPI 점수만 담는 타입 (Number Only)
export type PerformanceMetrics = {
    growthScore: number; // Growth Score
    engagementScore: number; // Engagement Score
    monetizationScore: number; // Monetization Score
};

/**
 * DiagnosisResultDto: 진단 결과를 DB에서 조회했을 때의 데이터 구조.
 */
export type DiagnosisResultDto = {
    // 실제로는 JSON 필드가 될 수 있지만, 백엔드 로직을 위해 명시적 타입을 사용합니다.
    resultData: {
        growth: number; 
        engagement: number;
        monetization: number;
    };
}

/**
 * UserContextDto: 현재 사용자 세션 및 구독 정보를 담는 컨텍스트 객체.
 */
export type UserContextDto = {
    userId: string;
    subscriptionLevel: 'Free' | 'Basic' | 'Premium';
};