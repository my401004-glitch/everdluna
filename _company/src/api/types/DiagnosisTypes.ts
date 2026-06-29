/**
 * DiagnosisResult Types Definition (API Contract)
 * @description 시스템의 핵심 진단 데이터를 담는 모든 엔드포인트의 표준 인터페이스.
 */

export type KpiMetrics = {
    growthScore: number; // Growth KPI (예: 연습 시간 증가율, 곡 폭 확장 등)
    engagementScore: number; // Engagement KPI (예: 세션 지속 시간, 기능 활용 빈도)
    monetizationPotential: number; // Monetization KPI (예: 유료 콘텐츠 구매 예상 지수)
};

export interface DiagnosisResult {
    diagnosisId: string;        // 고유 진단 ID (UUID v4 권장)
    userId: string;             // 사용자 식별자
    contextId: string;          // 어떤 컨텍스트(예: 특정 노래, 특정 기간)에서 측정했는지
    timestamp: Date;            // 데이터 생성 시점
    diagnosisType: 'Vocal' | 'Rhythm' | 'Overall'; // 진단 유형
    resultData: {
        overallScore: number; // 종합 점수 (0~100)
        detailedMetrics: Record<string, number>; // 세부 측정 항목
    };
    kpiMetrics: KpiMetrics;     // KPI 묶음
}

export interface DiagnosisApiResponse {
    status: 'success' | 'error';
    data: DiagnosisResult | null;
    message: string;
    timestamp: Date;
}