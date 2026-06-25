// API 응답 및 데이터 구조 정의 (TypeScript Type Definition)
export interface DiagnosisResultSchema {
    contextId: string; // 사용자를 식별하는 ID
    timestamp: string; // 결과 생성 시점 (ISO 8601 Format)
    diagnosisType: 'InitialAssessment' | 'FollowUp'; // 진단 유형
    
    // 핵심 KPI 지표 (Designer Spec 반영)
    growthScore: number; // 성장 점수 (0~100)
    engagementRatio: number; // 참여도 비율 (0.0 ~ 1.0)
    monetizationIndex: number; // 수익화 잠재력 지수 (0.0 ~ 1.0)

    // 시각화를 위한 상세 데이터 구조 (기술적 확장성 확보 목적)
    detailedMetrics: {
        pitchStability: number; // 피치 안정도 계수
        frequencyDeviation: number; // 주파수 편차 (Hz)
        targetRangeHitRate: number; // 목표 범위 도달률 (0.0 ~ 1.0)
    };
}