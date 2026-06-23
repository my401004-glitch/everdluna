/**
 * API Contract: Gap Score Visualization Data Transfer Object (DTO)
 * 
 * 이 DTO는 프론트엔드(영상 시각화 컴포넌트)가 필요한 모든 객관적 지표를 정의합니다.
 * Writer와 Designer의 요구사항을 모두 만족시키기 위해 'Gap' 개념과 그 원인을 추적하는 필드가 포함되어야 합니다.
 */

export interface PerformanceData {
    /** 
     * 진단 테스트 실행에 사용된 기본 데이터셋 ID (FK)
     */
    contextId: string;
    /** 
     * 사용자 인증 정보 또는 구독 레벨 (RBAC 검증용)
     */
    userRole: 'free' | 'premium' | 'institutional';
}

export interface GapScoreMetrics {
    /**
     * 핵심 지표: 진단 결과의 전체적인 성과(Growth), 몰입도(Engagement), 수익 잠재력(Monetization) 점수.
     * [근거: sessions/2026-05-18T14-34/developer.md]
     */
    growthScore: number; 
    engagementScore: number;
    monetizationScore: number;

    /**
     * Gap Score 자체의 최종 산출 값 (예: 0.78)
     */
    overallGapScore: number;

    /**
     * 시각화에 필요한 경고/위험 영역 정보
     * - 음정 편차(Pitch Deviation): 사용자의 가장 큰 기술적 결함 지표.
     * - 공명 주파수 범위(Resonance Frequency Range): AI 진단이 포착한 잠재력의 부족 정도.
     */
    technicalGaps: {
        pitchDeviationPercent: number; // (%)
        resonanceFrequencyGapRatio: number; // (0.0 ~ 1.0)
        isWarningState: boolean; // 현재 상태가 경고(빨간색 강조 필요)인지 여부
    };

    /**
     * 시각화에 필요한 스토리텔링 요소 (Hook 1의 구체적 설명 자료)
     */
    storytellingHints: {
        painPointMessage: string; // "당신의 노력은 측정되지 않고 있다." 등 후킹 문구
        improvementArea: string;  // "음정 편차 보정이 최우선입니다."
        suggestedModule: 'Pitching' | 'Rhythm' | 'Harmony'; // 다음에 봐야 할 모듈 유도
    };

    /**
     * 데이터의 신뢰성 및 검증 정보 (기술적 객관성을 강조)
     */
    dataSourcesVerified: boolean; 
}

/**
 * 최종 결과 DTO 구조 정의.
 */
export interface DiagnosisResult {
    metadata: PerformanceData;
    metrics: GapScoreMetrics;
    timestamp: string; // ISO Date String
}