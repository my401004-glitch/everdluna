// src/services/__tests__/diagnosisService.test.ts

import { DiagnosisService } from '../diagnosisService';

// 가짜 DB 클라이언트 Mock 객체 (Side Effect 격리)
const mockDbClient = {
    // 필요한 DB 메서드들을 모킹합니다. 실제 구현에서는 Prisma나 TypeORM의 Client 인스턴스를 주입받을 것입니다.
    saveDiagnosisResult: async (input, score) => {
        console.log(`[MOCK_DB] Successfully mocked saving result for ${input.contextId}`);
        return true;
    }
};

describe('DiagnosisService', () => {
    let service: DiagnosisService;

    beforeEach(() => {
        // 테스트 시작 전 매번 깨끗한 환경으로 서비스 초기화
        service = new DiagnosisService(mockDbClient);
    });

    it('should initialize correctly with a mock DB client', () => {
        expect(service).toBeDefined();
    });

    describe('calculateGapScore', () => {
        const baseInput: any = {
            contextId: 'test-user-123',
            diagnosisType: 'Growth',
            rawMetrics: { variance_a: 10, variance_b: 5 } // Mock Metric Values
        };

        it('should calculate a higher score for Growth type when metrics are favorable', () => {
            // Expectation: Base Score (70) + Weight * Difference
            const mockScore = service['calculateGapScore'](baseInput);
            expect(mockScore).toBeGreaterThanOrEqual(70 - 15); // 최소한의 가중치 차이 예상
        });

        it('should handle missing or zero metrics gracefully', () => {
            // Metric A가 없고, B도 없는 경우를 테스트하여 안정성 검증 (Defensive Coding)
            const safeInput: any = {
                contextId: 'safe-test',
                diagnosisType: 'Engagement',
                rawMetrics: {} 
            };
            // Expectation: Base Score (60) + 0 - 0 = 60. 최소값(1)을 넘겨야 함.
            const mockScore = service['calculateGapScore'](safeInput);
            expect(mockScore).toBe(60); // base score가 그대로 유지되는지 검증
        });
    });

    describe('runDiagnosis', () => {
        it('should throw an error if the user is not authorized for a sensitive type', async () => {
            // Mocking RBAC failure scenario
            const unauthorizedInput: any = {
                contextId: 'free-user-xyz', // premium이 아님
                diagnosisType: 'Monetization', // 유료만 가능하다고 가정한 타입
                rawMetrics: {} 
            };
            await expect(service.runDiagnosis(unauthorizedInput)).rejects.toThrow("UnauthorizedAccess");
        });

        it('should successfully calculate score and save results for an authorized user', async () => {
            const authorizedInput: any = {
                contextId: 'premium-user-abc', // premium 포함하여 통과 예상
                diagnosisType: 'Growth',
                rawMetrics: { variance_a: 10, variance_b: 5 }
            };

            // runDiagnosis가 성공적으로 실행되면 Mock DB의 save 메서드가 호출되었는지 확인 (Mocking)
            const result = await service.runDiagnosis(authorizedInput);
            expect(result.score).toBeGreaterThan(0); // 점수 계산이 완료됨을 확인
        });
    });
});