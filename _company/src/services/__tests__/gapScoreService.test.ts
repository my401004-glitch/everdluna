// src/services/__tests__/gapScoreService.test.ts

import { calculateGapScore, fetchMockDiagnosisResult } from '../gapScoreService';
import { GapScoreData, DiagnosisResult } from '../../components/GapScoreVisualization/types'; 

// Mocking external dependencies (e.g., API calls) is good practice for unit tests.
jest.mock('../gapScoreService', () => ({
    calculateGapScore: jest.fn(),
    fetchMockDiagnosisResult: jest.fn(),
}));


describe('--- Gap Score Service Unit Tests ---', () => {

    // 🟢 TEST CASE 1: Stable Scenario (가장 높은 점수)
    test('Should correctly calculate a STABLE gap score when all KPIs are high', async () => {
        const mockResult: DiagnosisResult = {
            id: 1, contextId: "mock-stable", timestamp: new Date().toISOString(),
            kpiMetrics: { growth: 90, engagement: 85, monetization: 75 } // (90*0.4) + (85*0.4) + (75*0.2) = 36 + 34 + 15 = 85
        };

        const scoreData = calculateGapScore(mockResult);
        expect(scoreData).not.toBeNull();
        expect(scoreData?.status).toBe('Stable'); // 기대 결과: Stable
        expect(scoreData?.score).toBeCloseTo(85.0, 1); // (90*0.4 + 85*0.4 + 75*0.2) = 85
    });

    // 🔴 TEST CASE 2: Critical Scenario (가장 낮은 점수)
    test('Should correctly calculate a CRITICAL gap score when all KPIs are low', async () => {
        const mockResult: DiagnosisResult = {
            id: 2, contextId: "mock-critical", timestamp: new Date().toISOString(),
            kpiMetrics: { growth: 10, engagement: 20, monetization: 30 } // (10*0.4) + (20*0.4) + (30*0.2) = 4 + 8 + 6 = 18
        };

        const scoreData = calculateGapScore(mockResult);
        expect(scoreData).not.toBeNull();
        expect(scoreData?.status).toBe('Critical'); // 기대 결과: Critical
        expect(scoreData?.score).toBeCloseTo(18.0, 1); // (10*0.4 + 20*0.4 + 30*0.2) = 18
    });

     // 🟡 TEST CASE 3: Potential Scenario (중간 점수)
    test('Should correctly calculate a POTENTIAL gap score when KPIs are moderate', async () => {
        const mockResult: DiagnosisResult = {
            id: 3, contextId: "mock-potential", timestamp: new Date().toISOString(),
            kpiMetrics: { growth: 50, engagement: 60, monetization: 40 } // (50*0.4) + (60*0.4) + (40*0.2) = 20 + 24 + 8 = 52
        };

        const scoreData = calculateGapScore(mockResult);
        expect(scoreData).not.toBeNull();
        expect(scoreData?.status).toBe('Potential'); // 기대 결과: Potential
        expect(scoreData?.score).toBeCloseTo(52.0, 1); // (50*0.4 + 60*0.4 + 40*0.2) = 52
    });

    // ⚫ TEST CASE 4: Boundary Condition - Null Input (가드 로직 검증)
    test('Should return null and handle errors when diagnosis result is null', () => {
        const scoreData = calculateGapScore(null as unknown as DiagnosisResult); // 강제 캐스팅으로 null 전달
        expect(scoreData).toBeNull();
    });

    // ⚫ TEST CASE 5: Boundary Condition - Missing KPI (필수 필드 검증)
    test('Should return null and handle errors when required KPI metrics are missing', () => {
        const incompleteResult: DiagnosisResult = {
            id: 4, contextId: "incomplete", timestamp: new Date().toISOString(),
            kpiMetrics: { growth: 50 } // engagement과 monetization이 누락됨
        };

        const scoreData = calculateGapScore(incompleteResult);
        expect(scoreData).toBeNull();
    });

    // ⭐ TEST CASE 6: API Mocking Test (실제 데이터 흐름 시뮬레이션)
     test('Should simulate fetching data and passing it through the calculation service', async () => {
        const contextId = "mock-stable"; // Stable 데이터를 반환하도록 설정된 ID
        
        // 1. mock fetch API call
        const result: any = await fetchMockDiagnosisResult(contextId);

        // 2. calculate score using the fetched data
        const finalScore = calculateGapScore(result);

        expect(result).not.toBeNull();
        expect(finalScore).not.toBeNull();
        expect(finalScore?.status).toBe('Stable'); // 최종적으로 Stable로 계산되었는지 확인
    });
});