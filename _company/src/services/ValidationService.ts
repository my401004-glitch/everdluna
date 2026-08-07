/**
 * src/services/ValidationService.ts
 * 
 * @description 진단 데이터 입력값에 대한 비즈니스 규칙 및 스키마 유효성 검증을 담당하는 서비스 레이어.
 * 디자인 QA 체크포인트를 코드로 강제 적용하여 데이터 무결성을 확보한다.
 */

export interface ValidationRule {
    field: string; // 검사할 필드 이름 (예: pitchStability)
    ruleType: 'RANGE' | 'ENUM' | 'REQUIRED' | 'CUSTOM'; // 규칙 타입 정의
    params: any[]; // 규칙에 필요한 파라미터 (예: [0.5, 1.0] for RANGE)
    errorMessage: string; // 실패 시 반환할 에러 메시지
}

export interface ValidationResult {
    isValid: boolean;
    errors: { field: string, message: string }[];
}

// 디자인 QA 체크포인트가 정의된 Rule Set (이곳에 모든 규칙을 모듈화함)
const DIAGNOSIS_RULES: ValidationRule[] = [
    { 
        field: 'sessionDurationMinutes', // 예시 필드
        ruleType: 'RANGE', 
        params: [5, 120], // 최소 5분 ~ 최대 120분
        errorMessage: "세션 지속 시간은 최소 5분 이상이어야 합니다." 
    },
    { 
        field: 'diagnosisType', 
        ruleType: 'ENUM', 
        params: ['Pitch', 'Rhythm', 'Timbre'], // 허용되는 진단 타입 목록
        errorMessage: "유효하지 않은 진단 유형입니다. (Pitch, Rhythm, Timbre 중 선택 필요)" 
    },
    // TODO: Data_Input_Mockup.json의 모든 필수 필드에 대한 규칙을 추가해야 합니다.
];

/**
 * 입력된 데이터가 정의된 QA 규칙 세트를 통과하는지 검증합니다.
 * @param data - 유효성 검사를 수행할 진단 데이터 객체.
 * @returns ValidationResult - 유효성 및 에러 목록.
 */
export const validateDiagnosisData = (data: Record<string, any>): ValidationResult => {
    const errors: { field: string, message: string }[] = [];

    for (const rule of DIAGNOSIS_RULES) {
        const value = data[rule.field];

        // 1. REQUIRED 체크 로직
        if (rule.ruleType === 'REQUIRED' && (value === undefined || value === null)) {
            errors.push({ field: rule.field, message: rule.errorMessage });
            continue; // 필수값이 없으면 다른 검사는 건너뜀
        }

        // 2. RANGE 체크 로직 (숫자 범위)
        if (rule.ruleType === 'RANGE' && typeof value === 'number') {
            const [min, max] = rule.params as [number, number];
            if (value < min || value > max) {
                errors.push({ field: rule.field, message: rule.errorMessage });
            }
        }

        // 3. ENUM 체크 로직 (열거형 목록)
        if (rule.ruleType === 'ENUM' && Array.isArray(rule.params)) {
            const allowedValues = rule.params as string[];
            if (!allowedValues.includes(String(value))) {
                errors.push({ field: rule.field, message: rule.errorMessage });
            }
        }

        // TODO: 'CUSTOM' 규칙 (예: 피치 안정성 지수 계산 로직 검증) 구현 필요
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};