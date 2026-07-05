/**
 * API로부터 받을 진단 점수 데이터의 타입을 정의합니다.
 * 이 스키마는 백엔드 설계(sessions/2026-07-05T09:48)를 기반으로 합니다.
 */

export interface KpiMetrics {
    growthScore: number; // 예: 성취도 증가 예측 점수 (Growth)
    engagementScore: number; // 예: 서비스 참여율 관련 점수 (Engagement)
    monetizationScore: number; // 예: 유료 전환 가능성 점수 (Monetization)
}

export interface DiagnosisScoreResponse {
    contextId: string;
    overallDiagnosisScore: number; // 종합 진단 점수 (0~100)
    riskLevel: 'Low' | 'Medium' | 'High'; // 리스크 레벨
    kpiMetrics: KpiMetrics; // KPI 상세 지표
    timestamp: Date; 
}

// 사용자 권한 정보를 담는 가상의 타입
export interface UserProfile {
    userId: string;
    subscriptionTier: 'Free' | 'Silver' | 'Gold';
    hasAccessToDiagnosis: boolean;
}