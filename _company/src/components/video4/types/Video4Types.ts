/**
 * @fileoverview Video 4 마케팅 비주얼 에셋의 데이터 타입을 정의합니다.
 * @author Cody (Senior Fullstack Engineer)
 * @description DesignSpec V1.0을 기반으로 하는 기술적 계약(Technical Contract).
 */

// -------------------------------------------------
// 1. 공명 주파수 그래프 관련 타입 (Frequency Graph Data)
// -------------------------------------------------

/**
 * 특정 시간 스탬프에서의 발성 데이터 포인트입니다.
 * @param time - 측정 시간 (초 단위)
 * @param frequencyHz - 해당 시점의 평균 공명 주파수 (헤르츠)
 * @param deviationHz - 이상적인 주파수 대비 편차 크기 (절대값)
 */
export interface FrequencyDataPoint {
    time: number; // 예: 0.5초, 1.2초...
    frequencyHz: number;
    deviationHz: number;
}

/**
 * 전체 진단 결과를 요약하는 공명 주파수 그래프 데이터입니다.
 */
export interface ResonanceGraphData {
    title: string; // 예: "A4 음역대 평균 공명 주파수 분석"
    dataPoints: FrequencyDataPoint[];
    averageDeviation: number; // 전체 평균 편차를 강조하기 위해 추가
}


// -------------------------------------------------
// 2. 핵심 성과 지표(KPI) 카드 관련 타입 (KPI Card Data)
// -------------------------------------------------

/**
 * 개별 KPI 측정 항목의 데이터 구조입니다.
 */
export interface KpiMetric {
    name: string; // 예: 'Growth', 'Engagement', 'Monetization'
    currentValue: number; // 현재 수치 (예: 75)
    targetValue: number | null; // 목표값 (null일 경우 없음)
    changePercentage?: number; // 전 대비 변화율 (%)
}

/**
 * Video 4에 표시될 종합 KPI 데이터입니다.
 */
export interface DiagnosisKpiData {
    metrics: KpiMetric[];
    summaryTitle: string; // 예: "종합 분석 결과"
}


// -------------------------------------------------
// 3. 최종 진단 로드맵/결과 컴포넌트 타입 (CTA Flow Data)
// -------------------------------------------------

/**
 * 사용자에게 보여줄 구체적인 개선 프로세스 단계입니다.
 */
export interface RemedialStep {
    stepNumber: number; // 순서 번호
    title: string; // 예: "1단계: 주파수 측정", "2단계: 호흡 근육 강화"
    description: string; // 상세 설명 (스크립트 내용 활용)
    priorityLevel: 'Low' | 'Medium' | 'High'; // 중요도에 따른 강조
}

/**
 * 최종 진단 및 CTA 섹션 전체 데이터 모델입니다.
 */
export interface Video4DiagnosisResult {
    diagnosisType: string; // 예: "공명 주파수 불균형"
    isQualifiedForPremiumTest: boolean; // 유료 테스트 자격 여부 (최상위 플래그)
    resonanceGraph: ResonanceGraphData;
    kpis: DiagnosisKpiData;
    remedialSteps: RemedialStep[];
}

export type Video4DiagnosisResultType = Video4DiagnosisResult;