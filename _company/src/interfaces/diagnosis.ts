/**
 * @fileoverview Diagnosis Score Calculation API Contract (Interface)
 * 이 파일은 E2E 테스트 스위트의 '진실의 근원지'가 될 핵심 데이터 구조를 정의합니다.
 * 모든 백엔드 서비스 레이어는 이 인터페이스를 따르도록 강제해야 합니다. [근거: sessions/2026-05-18T14-34/developer.md]
 */

// --------------------------
// 1. Request Body Interface (요청 데이터 스키마)
// --------------------------

/**
 * 사용자 진단에 필요한 최소한의 컨텍스트 정보.
 * @param {string} contextId - 현재 진단을 수행하는 세션 고유 ID. 필수 필드.
 */
export interface DiagnosisRequestInput {
    contextId: string; // UUID 또는 고유 식별자
    userId: string;     // 사용자 계정 ID
    diagnosisType: 'VOICE_TRAINING' | 'PIPING' | 'OTHER'; // 진단 유형 (RBAC 체크 기준)
    inputData: Record<string, any>; // 외부 시스템에서 받은 Raw 데이터 맵
}

/**
 * [필수] 권한 기반 접근 제어(RBAC)를 위한 요청 인터페이스.
 * 이 구조는 백엔드에서 반드시 수행해야 하는 첫 번째 게이트입니다.
 */
export interface DiagnosisRequestWithAuth {
    input: DiagnosisRequestInput;
    userRole: 'FREE' | 'PREMIUM' | 'STUDIO'; // 현재 사용자의 권한 레벨
}


// --------------------------
// 2. Core KPI 및 결과 데이터 스키마 (Response Body)
// --------------------------

/**
 * 핵심 성과 지표(KPI)를 구조화한 인터페이스. 이 값들이 비즈니스 가치를 결정합니다.
 */
export interface KPIScore {
    growthScore: number;         // 성장 가능성 점수 (0-100). 주력 지표.
    engagementScore: number;     // 몰입도/지속성 점수 (0-100).
    monetizationPotential: number;// 상업적 가치(유료 전환) 예상 점수 (0-100).
}

/**
 * 최종 진단 결과의 상세 스키마. DB에 저장될 주 데이터 구조입니다.
 */
export interface DiagnosisResult {
    id: string; // 결과 레코드 고유 ID
    contextId: string; // 관련 컨텍스트 ID (FK)
    timestamp: Date; // 진단 수행 시간 스탬프
    overallScore: number; // 종합 점수 (Growth * 0.5 + Engagement * 0.3 + Monetization * 0.2 등 가중치 적용)
    kpis: KPIScore; // 핵심 KPI 객체
    details: Record<string, any>; // 진단 로직에서 산출된 상세 분석 데이터 (예: 'pitch_deviation_index': 0.85)
}

/**
 * API 호출 성공 시 반환되는 최종 응답 스키마입니다.
 */
export interface DiagnosisResponse {
    success: boolean;
    message: string;
    result: DiagnosisResult | null; // 결과 데이터가 존재할 경우만 포함
    // 에러 발생 시, 여기를 통해 명확한 오류 코드를 반환해야 합니다.
}

// --------------------------
// 3. 예시 사용법 (Usage Example)
// --------------------------
/*
// 백엔드 API 함수 시그니처 예시:
async function calculateScore(request: DiagnosisRequestWithAuth): Promise<DiagnosisResponse> {
    // 1. [RBAC 검증] userRole과 diagnosisType을 비교하여 접근 권한을 체크하는 로직이 최우선으로 실행되어야 함.
    if (!checkAccessPermission(request.userRole, request.input.diagnosisType)) {
        return { success: false, message: "권한 부족", result: null };
    }

    // 2. [데이터 유효성 검증] inputData가 예상 JSON 스키마를 따르는지 검사 (Schema Validation).
    const validatedInput = validateSchema(request.input);

    // 3. [핵심 로직 실행] KPI 점수 산출 및 최종 결과를 생성합니다.
    const result: DiagnosisResult = await runDiagnosisLogic(validatedInput);

    return { success: true, message: "진단이 성공적으로 완료되었습니다.", result };
}
*/