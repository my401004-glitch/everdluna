// Assuming a Jest-like environment for unit testing
import { calculateGrowthRatio, calculateEngagementScore } from '../utils/kpiCalculator';

describe('KPI Calculator Utility Tests', () => {

    // 🧪 시나리오: 기본 성장률 계산 (Normal Growth)
    it('should correctly calculate growth ratio when metrics increase steadily', () => {
        const data = { week1: 10, week2: 15, week3: 25 };
        // Expecting a linear progression calculation that handles multiple points.
        expect(calculateGrowthRatio(data)).toBeGreaterThan(1.5); 
    });

    // 🧪 시나리오: 정체기 (Plateau) 처리 - 성장률이 0 또는 감소하는 경우 검증
    it('should handle zero or negative growth rate correctly', () => {
        const data = { week1: 30, week2: 30, week3: 25 }; // Plateau then decline
        // The function must gracefully handle non-positive change without throwing errors.
        expect(calculateGrowthRatio(data)).toBeLessThanOrEqual(1.0);
    });

    // 🧪 시나리오: 데이터 누락 처리 (Missing Data) - 가장 중요함
    it('should throw an error or return a safe default if input data is incomplete', () => {
        const partialData = { week1: 50, week3: 70 }; // Week2 missing
        // We must validate that the function fails safely and alerts us to bad data.
        expect(() => calculateGrowthRatio(partialData)).toThrow('Incomplete data set');
    });

    // 🧪 시나리오: Engagement Score 계산 검증 (Edge Case)
    it('should correctly compute engagement score for high activity', () => {
        const score = calculateEngagementScore({ practiceCount: 15, feedbackCount: 8 });
        expect(score).toBeGreaterThan(20);
    });

});