/**
 * DiagnosisService: Gap Score 계산 및 진단 데이터 처리 핵심 로직
 * 
 * 이 서비스는 Raw 데이터를 KPI(Key Performance Indicators)로 변환하고,
 * 이를 기반으로 사용자의 현재 상태와 목표 간의 격차(Gap Score)를 산출합니다.
 * @param rawData - 원본 측정 데이터 (예: Pitch Deviation, Frequency Stability 등)
 * @param contextId - 진단 컨텍스트 ID (어떤 세션에 대한 분석인지 추적)
 * @returns DiagnosisResult 객체
 */

import { KPI_Metrics } from '../types/kpi'; // 가정된 타입 정의 파일
import { DiagnosisResultSchema, GapScore } from '../types/schemas'; 

/**
 * Raw 데이터를 기반으로 핵심 지표(KPI)를 계산합니다.
 * 이 로직은 실제 AI 분석 결과를 반영하는 가장 중요한 부분입니다.
 * @param rawData - 원본 측정 데이터 배열
 * @returns KPI_Metrics 객체
 */
function calculateKpisFromRawData(rawData: any[]): KPI_Metrics {
    // TODO: 실제 복잡한 ML/통계 로직이 들어갈 영역 (예: Regression Analysis, Feature Extraction)
    // 현재는 Mock 데이터로 대체합니다.
    console.log("--- [INFO] Running complex KPI calculation logic...");

    const mockKPIs: KPI_Metrics = {
        growth: Math.random() * 0.8 + 0.2, // 0.2 ~ 1.0 사이 값 가정
        engagement: (Math.random() * 0.7 + 0.3).toFixed(4) as string,
        monetization: (Math.random() * 0.5 + 0.1).toFixed(4) as string,
    };

    return mockKPIs;
}

/**
 * Gap Score를 계산하는 메인 로직입니다.
 * Growth 지표가 가장 중요한 변수이며, 나머지 KPI들은 이를 보조합니다.
 * @param rawData - 원본 데이터
 * @param contextId - 컨텍스트 ID
 * @returns 최종 진단 결과 객체
 */
export const calculateGapScore: (rawData: any[], contextId: string): DiagnosisResultSchema => {
    if (!rawData || rawData.length === 0) {
        throw new Error("Validation Failed: Raw data cannot be empty.");
    }

    // 1. KPI 계산 (데이터 변환 단계)
    const kpis = calculateKpisFromRawData(rawData);

    // 2. Gap Score 산출 (핵심 비즈니스 로직)
    // 공식 예시: GapScore = Weight_G * Growth - Weight_E * Engagement + Weight_M * Monetization
    // 가중치와 수학적 관계는 비즈니스 목표에 따라 결정되어야 합니다.
    const gapScore: GapScore = Math.max(0, (kpis.growth * 3.5) - (parseFloat(kpis.engagement) * 2) + (parseFloat(kpis.monetization) * 1));

    // 3. 최종 결과 구조화
    return {
        contextId: contextId,
        score: parseFloat(gapScore.toFixed(4)), // Gap Score는 소수점 4자리까지 제한
        reportData: {
            growth_metric: kpis.growth.toFixed(4),
            engagement_metric: kpis.engagement,
            monetization_metric: kpis.monetization,
            gap_score_description: gapScore > 1.5 ? "High Potential Gap" : "Needs Improvement",
        }
    };
}

// 테스트용 Mock 함수 (실제 환경에서는 DB 커넥션이 필요)
export const getDiagnosisService = () => {
    return {
        calculateGapScore,
    };
}