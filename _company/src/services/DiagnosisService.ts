// src/services/diagnosisService.ts

/**
 * @typedef {Object} DiagnosisInputData
 * @description 진단 시스템에 입력되는 원시 데이터 구조 (실제 사용자 피드백 또는 API 연동 값)
 * @property {string} contextId - 진단 결과의 컨텍스트를 식별하는 ID (e.g., session_id).
 * @property {'Growth'|'Engagement'|'Monetization'} diagnosisType - 수행된 진단의 유형.
 * @property {Object.<string, number>} rawMetrics - 다양한 지표명과 수치 값의 맵.
 */

/**
 * DiagnosisService는 핵심 비즈니스 로직을 담고 있는 서비스 레이어입니다.
 * 데이터베이스 접근이나 외부 API 호출 등 Side Effect를 격리하여 테스트 용이성을 높였습니다.
 */
export class DiagnosisService {

    private readonly dbClient: any; // 실제 DB 클라이언트 (TypeORM/Prisma 등을 사용한다고 가정)

    constructor(dbClient) {
        this.dbClient = dbClient; 
        // 초기화 시점에 필요한 의존성 주입 및 연결 검증 로직 수행
    }

    /**
     * 진단 프로세스의 핵심 흐름을 관리하는 트랜잭션 함수입니다.
     * @param {DiagnosisInputData} input - 사용자로부터 받은 원시 입력 데이터.
     * @returns {Promise<{score: number, results: any}>} 계산된 최종 점수와 결과 객체.
     */
    public async runDiagnosis(input) {
        // 1. Input Validation & RBAC Check (가장 먼저 수행되어야 하는 게이트)
        if (!this.isUserAuthorized(input.diagnosisType, input.contextId)) {
            throw new Error("UnauthorizedAccess: 해당 진단 유형에 접근할 권한이 없습니다.");
        }

        // 2. 핵심 스코어 계산 (순수 로직)
        const calculatedScore = this.calculateGapScore(input);

        // 3. 결과 저장 및 트랜잭션 커밋 (Side Effect)
        await this.saveDiagnosisResult(input, calculatedScore);

        return {
            score: calculatedScore,
            results: { /* ... 최종 구조화된 리포트 데이터 ... */ }
        };
    }

    /** 
     * RBAC 검증 로직 (가정)
     * @param {'Growth'|'Engagement'|'Monetization'} type - 진단 유형.
     * @param {string} contextId - 사용자 ID 또는 컨텍스트 ID.
     * @returns {boolean} 권한 유무.
     */
    private isUserAuthorized(type, contextId) {
        // TODO: 실제로는 DB에서 UserRole을 조회하여 권한 체크 수행 필요.
        console.log(`[DEBUG] Checking RBAC for type: ${type}, Context: ${contextId}`);
        // 예시: 'Monetization'은 유료 사용자만 접근 가능하게 설정
        if (type === 'Monetization') {
            return contextId.includes('premium'); // 임시 Mock 체크 로직
        }
        return true; 
    }

    /** 
     * Gap Score 계산 알고리즘의 핵심 구현부 (Pure Function)
     * 이 함수는 외부 DB나 API 호출 없이, 오직 입력된 데이터를 기반으로 점수를 산출해야 합니다.
     */
    private calculateGapScore(input) {
        const rawMetrics = input.rawMetrics;

        // [가설 1] 핵심 지표 A와 B의 표준편차 차이를 계산하여 가중치 부여
        const varianceA = rawMetrics['variance_a'] || 0; // 예시 키
        const varianceB = rawMetrics['variance_b'] || 0;

        // [가설 2] 진단 유형별 기본 점수 설정 (예: Growth는 Engagement보다 높은 가중치)
        let baseScore = 50; 
        if (input.diagnosisType === 'Growth') {
            baseScore = 70;
        } else if (input.diagnosisType === 'Engagement') {
            baseScore = 60;
        }

        // 최종 스코어 계산: 기본 점수 + 가중치 * 지표 간 차이
        const score = baseScore + Math.floor((varianceA * 0.5) - (varianceB * 0.3));
        return Math.max(1, score); // 최소 1점 보장
    }

    /** 
     * DB에 결과 데이터를 저장하는 Side Effect 함수 (가정)
     */
    private async saveDiagnosisResult(input, score) {
        console.log(`[DB] Saving Diagnosis Result: Context ${input.contextId}, Score ${score}`);
        // TODO: await this.dbClient.diagnosisResults.create({ ... });
    }
}

export { DiagnosisService };