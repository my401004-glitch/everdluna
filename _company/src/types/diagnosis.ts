/**
 * src/types/diagnosis.ts
 * 진단 서비스의 핵심 데이터 타입을 정의합니다.
 */

export interface RawPerformanceData {
    /** 사용자의 기본 정보 (예: 유료 구독 여부, 사용자 레벨) */
    userRole: 'free' | 'premium'; 
    /** 테스트에 사용된 원시 녹음 파일의 길이 또는 세션 수 (분 단위 예상치) */
    sessionDurationMinutes: number; 
    /** 진단 유형 (예: 'Growth', 'Engagement', 'Monetization') */
    diagnosisType: 'growth' | 'engagement' | 'monetization';
    /** 사용자가 입력한 원시 음정 편차 데이터 (Hz 단위) */
    averagePitchDeviationHz: number; 
}

export interface DiagnosisScore {
    """
    각 KPI별로 계산된 점수와 해당 점수가 의미하는 핵심 피드백을 담는 구조체.
    점수는 0에서 100 사이의 백분율(%) 값으로 가정합니다.
    """
    growthScore: number; // 성장의 잠재력 (주요 기술적 발전)
    engagementScore: number; // 참여도/지속성 (연습 루틴 준수, 꾸준함)
    monetizationScore: number; // 수익화 가능성/시장 적합성 (상업적 가치)
    overallScore: number; // 종합 점수
    feedbackSummary: string; // 이 점수를 해석한 핵심 메시지.
}

export interface DiagnosisResult {
    /** API를 통해 받아 처리할 최종 결과 객체 */
    resultData: DiagnosisScore;
    contextId: string; 
    timestamp: Date;
}