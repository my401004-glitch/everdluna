/**
 * @file API Contract Definition for POST /api/v1/validate_diagnosis
 * @description 진단 결과 데이터 유효성 검증 및 통합 리포팅을 위한 공통 스키마를 정의합니다.
 * 이 계약은 프론트엔드(FE)와 백엔드(BE) 모두가 반드시 준수해야 합니다.
 */

// ==============================================
// 1. INPUT SCHEMA: POST /api/v1/validate_diagnosis
// ==============================================

/**
 * 사용자의 진단 세션 데이터를 서버에 전송하는 요청 본문 스키마입니다.
 */
export interface DiagnosisRequest {
    /** 사용자 고유 ID (RBAC 및 데이터 추적의 기본 키) */
    userId: string;
    /** 진단을 수행한 컨텍스트 ID (특정 강의, 과제 등) */
    contextId: string;
    /** 진단 테스트 유형 (예: 'PITCH_STABILITY', 'FREQUENCY_RANGE') */
    diagnosisType: 'PitchStability' | 'FrequencyRange' | 'RhythmPattern';

    /** 획득된 원본 측정 데이터 (API 호출 시 실시간으로 들어오는 값) */
    rawData: {
        // 예시 필드: 실제 구현에 따라 확장 필요
        averagePitchHz: number;
        pitchJitterSeconds: number; // 피치 불안정성 지표
        frequencyStabilityScore: number; // 주파수 안정화 점수 (0~100)
    };

    /** 사용자의 현재 유료 구독/접근 권한 레벨 */
    userRoleLevel: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
}


// ==============================================
// 2. OUTPUT SCHEMA: POST /api/v1/validate_diagnosis Response
// ==============================================

/**
 * 진단 결과의 세부 KPI 지표를 정의합니다. (Growth, Engagement, Monetization)
 */
export interface KpiMetrics {
    /** 성취도 성장률 점수 (0-100). 학습 과정에서 얼마나 발전했는가? */
    growthScore: number; 
    /** 참여도/몰입도 지표 (0-100). 과제 수행의 지속성 및 깊이. */
    engagementScore: number;
    /** 상업적 가치 추정 지표 (0-100). 유료화 모델 적용 가능성/수익 잠재력. */
    monetizationScore: number;
}

/**
 * 최종 진단 결과를 담는 핵심 리포트 데이터 구조입니다.
 * 이 필드는 DB의 Diagnosis_Results 테이블에 저장됩니다.
 */
export interface DiagnosisResult {
    // API 호출 시점에 계산되어 확정되는 핵심 점수
    overallDiagnosisScore: number; 

    /** 상세 KPI 지표 집합체 */
    kpiMetrics: KpiMetrics; 

    /** 시스템이 진단한 핵심 Pain Point (예: "피치 불안정성", "리듬 패턴 부족") */
    primaryPainPoint: string;
    /** 개선을 위한 구체적인 학습 추천 로직 ID 또는 메시지 */
    recommendedModuleId: string;
}


/**
 * 최종 API 응답 구조입니다. 성공/실패 케이스를 명확히 분리합니다.
 */
export interface DiagnosisResponse {
    // 필수 필드: 요청이 유효했는지 여부 (Validation Gateway)
    isValid: boolean; 
    /** 에러가 발생했을 경우, 시스템에서 정의한 표준 코드 반환 (예: 'AUTH_FORBIDDEN') */
    errorCode?: string;
    /** 에러 메시지. FE에 보여줄 사용자 친화적 메시지 */
    errorMessage?: string;

    /** 유효성 검증이 성공했을 경우에만 포함되는 최종 결과 데이터 */
    data?: DiagnosisResult;
}


// ==============================================
// 3. ERROR HANDLING: API 응답 예시 (Failure Case)
// ==============================================

/**
 * 권한 또는 필수 로직 실패 시 반환될 에러 구조입니다.
 */
export interface ApiError {
    errorCode: 'AUTH_FORBIDDEN' | 'DATA_SCHEMA_INVALID' | 'SYSTEM_ERROR';
    message: string; // 상세 오류 설명
}

// ==============================================
// 4. 타입 추론 및 유효성 검증 (Helper)
// ==============================================
export type ValidationResult = DiagnosisResponse | ApiError;