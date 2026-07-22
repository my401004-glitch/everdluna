// src/core/diagnosis.interface.ts
/**
 * @description 진단 점수 계산 및 결과를 담는 핵심 인터페이스 정의
 * 모든 API 요청과 응답의 타입 안전성을 위해 필수적으로 정의합니다.
 */

export interface DiagnosisRequestPayload {
    userId: string; // 인증된 사용자 ID (RBAC 검증에 사용)
    diagnosisType: 'Growth' | 'Engagement' | 'Monetization'; // 진단 유형
    inputData: Record<string, any>; // 실제 진단에 필요한 사용자 행동 데이터 (예: 시청 시간, 클릭률 등)
}

export interface DiagnosisResult {
    contextId: string; // 어떤 콘텐츠/상황을 기준으로 했는지 식별자
    score: number; // 계산된 최종 점수 (0.0 ~ 10.0 범위 권장)
    kpis: {
        growthScore: number;
        engagementScore: number;
        monetizationScore: number;
    };
    analysisSummary: string; // LLM을 통해 생성될 요약 분석 리포트 (진단 결과 기반)
}

/**
 * @description DB에 저장할 Diagnosis_Results 테이블의 스키마를 반영한 구조체
 */
export interface DbDiagnosisRecord {
    id: number;
    userId: string;
    contextId: string;
    diagnosisType: 'Growth' | 'Engagement' | 'Monetization';
    score: number; // 최종 점수
    createdAt: Date;
    // KPI_Metrics 테이블에 연관될 핵심 메트릭들 (추적용)
    metrics: {
        growthValue: number;
        engagementValue: number;
        monetizationValue: number;
    };
}