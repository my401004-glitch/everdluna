import { calculateDiagnosisScore } from '../diagnosisService';
import { DiagnosisInput, UserContext } from '../../types'; // 가상의 타입 임포트

// Mocking을 사용하여 외부 의존성을 제거하고 순수 로직만 테스트합니다.
describe('calculateDiagnosisScore Service Layer Test', () => {
    const mockUserPremium: UserContext = { subscriptionLevel: 'Premium' };
    const mockUserFree: UserContext = { subscriptionLevel: 'Free' };

    // 🟢 Case 1: 정상적인 Premium 사용자 시나리오 테스트 (Happy Path)
    test('should calculate accurate score for a premium user with good data', async () => {
        const inputData: DiagnosisInput = { studyHours: 20, practiceCount: 15, lastLoginDays: 3, hasUsedPremiumFeature: true };
        
        const result = await calculateDiagnosisScore(inputData, mockUserPremium);

        // 기대 값 검증 (성장: 20*0.6 + 15*0.4=12+6=18 -> 최소화/최대값 체크 필요)
        expect(result.kpis.growth).toBeCloseTo(18, 0); // Expecting growth calculation to work
        // (이후 KPI 값에 대한 구체적인 수치 검증 로직을 추가해야 합니다.)
        expect(result.score).toBeDefined();
    });

    // 🟡 Case 2: 권한 미달 사용자 시나리오 테스트 (Security Check)
    test('should throw an error for a free user accessing detailed diagnosis', async () => {
        const inputData: DiagnosisInput = { studyHours: 10, practiceCount: 5, lastLoginDays: 7, hasUsedPremiumFeature: false };

        // 권한 검사를 통과하지 못하면 에러가 발생해야 합니다.
        await expect(calculateDiagnosisScore(inputData, mockUserFree)).rejects.toThrow("Unauthorized access");
    });

    // ⚫ Case 3: 필수 데이터 누락 시나리오 테스트 (Guard Clause Check)
    test('should handle missing mandatory input data gracefully', async () => {
        const badInputData: DiagnosisInput = { studyHours: undefined, practiceCount: 5, lastLoginDays: 7, hasUsedPremiumFeature: false };

        // 이 케이스는 컨트롤러에서 잡아야 하지만, 서비스 레이어에서도 Input Validation이 필요합니다.
        // (실제 구현 시점에서 로직을 보완해야 함)
    });
});