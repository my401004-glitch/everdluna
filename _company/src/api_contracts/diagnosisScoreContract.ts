// src/api_contracts/diagnosisScoreContract.ts

/**
 * @description 진단 점수 시각화 컴포넌트가 필요로 하는 모든 데이터를 정의하는 최종 API 응답 계약입니다.
 * 이 스키마는 프론트엔드의 데이터 바인딩과 백엔드의 데이터 검증(Validation)의 기준이 됩니다.
 */

/**
 * @interface DiagnosisResultData
 * 사용자의 진단 결과 상세 정보 (JSON 포맷).
 * - 'diagnosis_type': 어떤 테스트를 했는지 식별합니다. (예: "PitchStability", "RhythmicAccuracy")
 * - 'overallScore': 종합 점수입니다. (0~100)
 */
export interface DiagnosisResultData {
    diagnosisType: string; // ex: "Performance_History"
    timestamp: string;     // ISO 8601 format
    overallScore: number;  // 전체 진단 점수 (예: 종합 학습 성과).
    isProTierAccessRequired: boolean; // 이 리포트를 보려면 Pro 등급이 필요한가? (RBAC 체크)
}

/**
 * @interface KPI_Metrics
 * 핵심 성과 지표 세트. 'Pain -> Gain' 스토리텔링의 객관적 증거를 제공합니다.
 */
export interface KPI_Metrics {
    // 1. Growth (성장): 시간 경과에 따른 발전 추이
    growthScore: number; // 점수 변화량 또는 성장률.
    progressTrendIndex: string[]; // [근거] 진단 과정에서 포착된 구체적인 개선 포인트 목록 (예: ["A음계 정확도 +5%", "템포 유지력 120BPM 달성"])

    // 2. Engagement (몰입/참여): 시스템 사용 패턴을 통한 참여 정도
    engagementScore: number; // 활동 빈도, 세션 길이 등.
    featureUsageBreakdown: { [key: string]: number }; // 어떤 기능(예: "Warmup", "TheoryQuiz")을 얼마나 많이 썼는지 비율.

    // 3. Monetization (수익화/가치): 서비스의 가치를 이용한 지표
    monetizationScore: number; // 사용자가 얻은 잠재적 학습 가치 점수 (Gap Score와 연관).
    suggestedUpgradeTier: string | null; // 현재 데이터로 볼 때 추천되는 상위 티어.
}

/**
 * @interface DiagnosisScoreResponse
 * 진단 점수 API의 최종 응답 구조체입니다.
 */
export interface DiagnosisScoreResponse {
    success: boolean;
    error?: string;
    data: {
        resultData: DiagnosisResultData; // 핵심 진단 결과
        kpiMetrics: KPI_Metrics;       // 성과 지표 세트
        suggestedAction: string;      // 다음 단계로 취해야 할 행동 가이드 (CTA 텍스트)
    };
}