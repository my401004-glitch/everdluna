/** 
 * 시스템에서 사용되는 모든 데이터 스키마와 타입을 정의합니다. 
 */

export type GapScore = number;

/** DiagnosisService가 반환하는 최종 진단 결과 구조체입니다. */
export interface DiagnosisResultSchema {
    contextId: string;          // 분석 대상 컨텍스트의 고유 ID (세션, 곡 등)
    score: GapScore;            // 계산된 최종 격차 점수 (0 ~ 10 사이로 정규화될 수 있음)
    reportData: {
        growth_metric: string;           // Growth KPI 값 (소수점 문자열)
        engagement_metric: string;      // Engagement KPI 값 (소수점 문자열)
        monetization_metric: string;    // Monetization KPI 값 (소수점 문자열)
        gap_score_description: string;  // 점수를 기반으로 한 설명적 라벨
    }
}

/** KPI 테이블 구조체 */
export interface KPI_Metrics {
    growth: number;         // 성장 지표 (ex: 기술 숙련도 증가율)
    engagement: string;     // 몰입도 지표 (ex: 학습 지속률)
    monetization: string;   // 수익화 잠재력 지표 (ex: 콘텐츠 활용 범위)
}

/** 
 * API 응답 데이터의 최종 구조체입니다. 
 */
export interface ApiResponse {
    status: 'success' | 'error';
    data?: DiagnosisResultSchema;
    message: string;
}