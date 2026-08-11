/**
 * @description Diagnosis API Response Schema (Animation Sequence Ready)
 * [근거: Master_Motion_Component_Manual_V2.0.md, api_asset_manifest.md] - 애니메이션 상태 변화를 수용하기 위해 구조 변경됨.
 */
export interface KPITrendData {
    /** 시퀀스 시간대별 KPI 스코어 배열 */
    history: Array<{ 
        timeCode: string; // 예: "00:00:05" (애니메이션 트리거 시점)
        scoreValue: number; // 해당 시점의 KPI 값
        changeDirection: 'UP' | 'DOWN'; // 변화 방향 ('Pain' -> 'Gain' 강조용)
    }>; 
}

export interface DiagnosisResult {
    finalScore: number;
    userUuid: string;
    diagnosisType: 'Growth' | 'Engagement' | 'Monetization';
    resultData: Record<string, any>; // 상세 진단 데이터 (JSONB)
    kpiTrends: {
        growth: KPITrendData;
        engagement: KPITrendData;
        monetization: KPITrendData;
    };
}

export interface DiagnosisResponse {
    success: boolean;
    data: DiagnosisResult | null;
    message: string;
}