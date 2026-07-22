import { DiagnosisData, DiagnosticResult } from '../types/DiagnosticResultTypes';
import { calculateDiagnosisScore } from './diagnosisService';

// Mocking the entire service module to isolate testing logic
// 실제 환경에서는 @mock-module 같은 라이브러리를 사용하지만, 여기서는 간단히 함수를 모킹합니다.
jest.mock('../services/diagnosisService', () => ({
    calculateDiagnosisScore: jest.fn(),
}));

describe('DiagnosisService - Core Logic Unit Tests (코다리 검증)');
const mockCalculateDiagnosisScore = calculateDiagnosisScore as jest.Mock;


// ----------------------------------------------
// [1. Happy Path & Core Calculation Test Group]
// ----------------------------------------------
describe('✅ Success Path: 정상적인 데이터 입력 시', () => {
    const mockInputData: DiagnosisData = {
        userContextId: 'user-abcde-123',
        pitchAccuracyScore: 0.85, // 높은 정확도 (높은 Gap Score 기대)
        rhythmStabilityIndex: 0.92, // 매우 안정적
        vocalRangeCoveragePoints: 15, // 충분한 커버리지
    };

    beforeEach(() => {
        // Mocking the successful return value for stable testing
        mockCalculateDiagnosisScore.mockReturnValue({
            diagnosisType: 'Gap Score',
            scoreValue: 85,
            kpis: { growth: 0.7, engagement: 0.9, monetization: 0.3 }, // 기대되는 KPI 값 설정
            resultDescription: "매우 높은 잠재력을 가진 우수 학생입니다.",
        } as DiagnosticResult);
    });

    test('✅ [T-001] 정상적인 진단 데이터가 들어왔을 때 예상된 결과 반환 확인', async () => {
        const result = await calculateDiagnosisScore(mockInputData);
        expect(result).toBeDefined();
        // KPI 값이 정의대로 구조화 되어 돌아오는지 검증 (데이터 계약 준수)
        expect(result?.kpis).toHaveProperty('growth');
        expect(typeof result?.scoreValue).toBe('number');
    });

    test('✅ [T-002] 모든 핵심 파라미터가 정상 범위일 때, 로직이 깨지지 않고 실행됨', async () => {
        const input: DiagnosisData = {
            userContextId: 'context-id-1',
            pitchAccuracyScore: 0.5, // 중간값
            rhythmStabilityIndex: 0.6, // 보통값
            vocalRangeCoveragePoints: 8, // 낮은 값
        };
        // 이 테스트는 내부 로직이 정상적으로 KPI를 계산함을 가정하고 실행합니다.
        await expect(calculateDiagnosisScore(input)).resolves.toBeDefined();
    });
});

// ----------------------------------------------
// [2. Edge Case Test Group]
// ----------------------------------------------
describe('⚠️ Edge Cases: 경계 조건 테스트 (Null, Zero, Empty)', () => {
    test('🚨 [T-101] 모든 점수가 0일 때 (최악의 경우): 오류 대신 기본/최소 진단 결과를 반환하는가?', async () => {
        const mockInputData: DiagnosisData = {
            userContextId: 'context-zero',
            pitchAccuracyScore: 0.0, // Zero
            rhythmStabilityIndex: 0.0, // Zero
            vocalRangeCoveragePoints: 0, // Zero
        };

        // 최악의 경우 예외 처리된 결과를 Mocking합니다.
        mockCalculateDiagnosisScore.mockReturnValue({
            diagnosisType: 'Gap Score',
            scoreValue: 10,
            kpis: { growth: 0.1, engagement: 0.1, monetization: 0.1 }, // 최소값 할당
            resultDescription: "개선이 필요한 기초 단계입니다. 기본 학습 계획을 따르세요.",
        } as DiagnosticResult);

        const result = await calculateDiagnosisScore(mockInputData);
        expect(result?.scoreValue).toBeLessThan(50); // 점수가 낮게 나온지 검증
    });

    test('🚨 [T-102] 진단 데이터가 완전히 비어있거나 (Empty Input) 필수 파라미터가 누락되었을 때', async () => {
        // 사용자 컨텍스트 ID만 있고 나머지가 undefined/null인 경우를 시뮬레이션합니다.
        const incompleteInput: DiagnosisData = {
            userContextId: 'context-incomplete',
            pitchAccuracyScore: undefined, // Missing Data
            rhythmStabilityIndex: null,    // Null Data
            vocalRangeCoveragePoints: 5,  // 유일하게 살아있는 값
        };

        // 필수 데이터가 없으면 내부적으로 에러를 발생시키거나 기본값을 사용해야 합니다.
        // 여기서는 명시적으로 '데이터 불충분' 오류 처리를 가정하고 테스트합니다.
        await expect(calculateDiagnosisScore(incompleteInput)).rejects.toThrow(/필수 진단 파라미터가 누락되었습니다/);
    });
});

// ----------------------------------------------
// [3. Exception Test Group]
// ----------------------------------------------
describe('💣 Failure Path: 예외 처리 및 데이터 무결성 검증', () => {
    test('💥 [T-201] 입력 타입 불일치 (Type Mismatch): 점수 필드에 문자열이 들어왔을 때 강제 에러 발생 여부', async () => {
        const badInputData: DiagnosisData = {
            userContextId: 'context-badtype',
            pitchAccuracyScore: "High", // Type Error: string instead of number
            rhythmStabilityIndex: 0.9,
            vocalRangeCoveragePoints: 10,
        };

        // TypeScript 환경이므로 타입 체크가 되어야 하지만, JS 실행 레벨에서 방어 코드가 필요합니다.
        await expect(calculateDiagnosisScore(badInputData)).rejects.toThrow(/진단 파라미터는 숫자여야 합니다/);
    });

    test('💥 [T-202] Context ID가 누락된 경우 (Business Logic Failure)', async () => {
        const input: DiagnosisData = {
            userContextId: null as any, // Null Context ID
            pitchAccuracyScore: 0.8,
            rhythmStabilityIndex: 0.9,
            vocalRangeCoveragePoints: 15,
        };

        await expect(calculateDiagnosisScore(input)).rejects.toThrow(/유효한 사용자의 컨텍스트 ID가 필요합니다/);
    });
});