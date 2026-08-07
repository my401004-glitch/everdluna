import { DiagnosisRequest, DiagnosisResponse, ApiError } from '../src/api_contracts/diagnosis_v1_contract';

// NOTE: 실제 테스트에서는 Mock API Client를 사용합니다. 
// 여기서는 함수 시그니처와 구조만 정의하여 테스트의 로직 흐름을 검증합니다.
declare const callValidateDiagnosisAPI: (request: DiagnosisRequest) => Promise<DiagnosisResponse>;


describe('E2E Test Suite: POST /api/v1/validate_diagnosis', () => {

    // ------------------------------------------
    // SCENARIO 1: Happy Path - 모든 조건 충족 시 성공 검증
    // ------------------------------------------
    it('should successfully validate diagnosis and return full KPI metrics (Happy Path)', async () => {
        const mockRequest: DiagnosisRequest = {
            userId: 'user-premium-123',
            contextId: 'lesson-045',
            diagnosisType: 'PitchStability',
            rawData: { averagePitchHz: 120.5, pitchJitterSeconds: 0.02, frequencyStabilityScore: 85 },
            userRoleLevel: 'PREMIUM' // Premium user should have access to all features
        };

        // Mock API가 성공적인 데이터를 반환한다고 가정하고 실행합니다.
        const response = await callValidateDiagnosisAPI(mockRequest);

        expect(response.isValid).toBe(true);
        expect(typeof response.data).toBe('object');
        expect(response.data!.kpiMetrics).toHaveProperty('growthScore');
        // KPI 점수가 유효한 범위에 있는지 확인하는 로직 추가 필요 (예: 0 <= score <= 100)
    });

    // ------------------------------------------
    // SCENARIO 2: RBAC Failure - 권한 부족 검증 (Failure Path A)
    // ------------------------------------------
    it('should fail validation if user role level is insufficient for the diagnosis type', async () => {
        const mockRequest: DiagnosisRequest = {
            userId: 'user-free-456',
            contextId: 'lesson-099',
            diagnosisType: 'FrequencyRange', // 이 진단은 Premium 이상만 접근 가능하다고 가정
            rawData: { averagePitchHz: 120.5, pitchJitterSeconds: 0.02, frequencyStabilityScore: 85 },
            userRoleLevel: 'FREE' // 권한 부족!
        };

        // Mock API가 에러 응답을 반환한다고 가정하고 실행합니다.
        const response = await callValidateDiagnosisAPI(mockRequest);

        expect(response.isValid).toBe(false);
        expect(response.errorCode).toBe('AUTH_FORBIDDEN'); // 계약에 정의된 오류 코드 사용
        expect(response.errorMessage).toContain('Premium 이상의 권한이 필요합니다.'); 
    });

    // ------------------------------------------
    // SCENARIO 3: Data Integrity Failure - 데이터 범위 이탈 검증 (Failure Path B)
    // ------------------------------------------
    it('should fail validation if KPI raw data exceeds defined boundaries', async () => {
        const mockRequest: DiagnosisRequest = {
            userId: 'user-premium-123',
            contextId: 'lesson-045',
            diagnosisType: 'PitchStability',
            rawData: { averagePitchHz: 120.5, pitchJitterSeconds: -0.5, frequencyStabilityScore: 150 }, // 주파수 안정화 점수가 너무 높음 (예외)
            userRoleLevel: 'PREMIUM'
        };

        // Mock API가 데이터 유효성 오류를 반환한다고 가정하고 실행합니다.
        const response = await callValidateDiagnosisAPI(mockRequest);

        expect(response.isValid).toBe(false);
        expect(response.errorCode).toBe('DATA_SCHEMA_INVALID'); // 계약에 정의된 오류 코드 사용
        expect(response.errorMessage).toContain('Frequency Stability Score는 0~100 사이여야 합니다.');
    });
    
     // ------------------------------------------
    // SCENARIO 4: Input Format Failure - 필수 필드 누락 검증 (Failure Path C)
    // ------------------------------------------
    it('should fail validation if essential input fields are missing', async () => {
        const mockRequest: DiagnosisRequest = {
            userId: 'user-premium-123',
            contextId: undefined as any, // contextId 누락 가정 (타입 강제 불가 시나리오 대비)
            diagnosisType: 'PitchStability',
            rawData: { averagePitchHz: 120.5, pitchJitterSeconds: 0.02, frequencyStabilityScore: 85 },
            userRoleLevel: 'PREMIUM'
        };

        // Mock API가 요청 파싱 단계에서 에러를 반환한다고 가정하고 실행합니다.
        const response = await callValidateDiagnosisAPI(mockRequest);

        expect(response.isValid).toBe(false);
        // 이 경우는 시스템 자체 오류 또는 입력 유효성 검사 오류로 분류할 수 있습니다.
        expect(response.errorCode).toBe('SYSTEM_ERROR'); 
    });
});