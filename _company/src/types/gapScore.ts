/**
 * @fileoverview Gap Score KPI 데이터 API Contract Definition
 * 코다리 (Codari)가 정의한 핵심 인터페이스입니다. 
 * 프론트엔드(TS/React)와 백엔드(FastAPI/Express 등)의 통신 규약으로 사용됩니다.
 */

/**
 * Time series data point for trend tracking.
 * @param date - 날짜 (ISO format: YYYY-MM-DD).
 * @param score - 해당 시점의 점수 값 (0.0 ~ 1.0 사이).
 */
export interface TrendDataPoint {
    date: string;
    score: number;
}

/**
 * 핵심 KPI 지표 구조체. Growth, Engagement, Monetization을 포함합니다.
 * 모든 진단 결과는 이 스키마를 따릅니다.
 */
export interface KPIScoreMetrics {
    growthScore: number; // 성장 가능성 (0~1)
    engagementScore: number; // 몰입도/참여율 (0~1)
    monetizationScore: number; // 수익화 잠재력 (0~1)
}

/**
 * Gap Score 진단 결과의 핵심 데이터 구조. 
 * 시각화에 필요한 모든 정보를 포함해야 합니다.
 */
export interface DiagnosisResult {
    /** 사용자가 받은 고유 ID 또는 Context ID. */
    contextId: string; 
    /** 최종 계산된 'Gap Score' (전체적인 위기/성장 점수). */
    gapScore: number; // 0.0 (안정) ~ 1.0 (위험 최대)

    /** 1차 진단 결과 메트릭. */
    metrics: KPIScoreMetrics;

    /** 시각화에 사용될 주요 위험 메시지 객체. */
    warningSignal?: {
        isWarningActive: boolean; // 경고 활성화 여부 (true/false)
        primaryMetric: 'Growth' | 'Engagement' | 'Monetization'; // 가장 심각한 지표
        scoreValue: number; // 예: 0.85
        description: string; // 사용자에게 보여줄 설명 텍스트 (예: "92일 후 이탈 위험")
    };

    /** 시간 흐름에 따른 KPI 추이 데이터 배열. */
    kpiTrendHistory?: {
        metrics: KPIScoreMetrics[]; // 여러 시점의 KPI 조합
        trendPoints: TrendDataPoint[]; // 전체 트렌드 라인용 (시간 vs 점수)
    }[];

    /** 진단 결과가 도출된 시간 스탬프. */
    generatedAt: string; 
}