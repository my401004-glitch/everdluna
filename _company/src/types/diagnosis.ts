/**
 * @fileoverview AI 진단 테스트 환경에서 사용되는 핵심 데이터 모델 및 인터페이스 정의.
 * 이 파일을 통해 모든 API 호출과 서비스 레이어의 입출력 구조가 강제됩니다.
 */

// ------------------------------------
// 1. Input Types (API 요청 바디)
// ------------------------------------

/**
 * 사용자의 진단 세션 정보를 담는 DTO.
 * @param sessionId - 현재 진단에 사용된 유효한 세션 ID.
 * @param rawData - AI가 분석한 원본 음성/진단 데이터 (Pitch, Frequency Stability 등).
 */
export interface DiagnosisInput {
    sessionId: string;
    rawData: {
        pitchStabilityScore: number; // 0.0 ~ 1.0
        frequencyRangeCoverage: number; // 예: C3-C5 범위 커버리지 점수
        harmonicRatioDeviation: number; // 배음 비율 편차 (낮을수록 좋음)
    };
}

// ------------------------------------
// 2. Output Types (API 응답 바디 및 내부 로직 결과)
// ------------------------------------

/**
 * 핵심 진단 점수(Gap Score Gauge)의 최종 측정 결과를 정의합니다.
 * 이 값은 비즈니스 가치와 직결되므로 정확한 타입을 유지해야 합니다.
 */
export interface DiagnosisScore {
    gapScoreValue: number; // 종합 Gap Score (0 ~ 100점). 낮을수록 개선 필요.
    riskArea: 'Pitch' | 'Range' | 'Harmony'; // 가장 취약한 영역
    recommendationLevel: 'Beginner' | 'Intermediate' | 'Advanced'; // 추천 학습 레벨
}

/**
 * 진단 결과를 종합하고, 비즈니스 KPI를 포함하여 최종 사용자에게 제공할 데이터 구조.
 */
export interface DiagnosisResult {
    userId: string;
    diagnosisScore: DiagnosisScore;
    kpis: {
        growthIndex: number; // 성장 지표 (Improvement Potential)
        engagementIndex: number; // 몰입도/지속성 지표
        monetizationPotential: number; // 유료화 잠재력 지표
    };
    // 시스템 내부 추적용 필드
    contextId: string; 
    timestamp: Date;
}

/**
 * 서비스에서 처리할 모든 진단 결과의 최종 포맷입니다.
 */
export type DiagnosisOutput = DiagnosisResult & {
    message: string; // 사용자 친화적인 메시지
};