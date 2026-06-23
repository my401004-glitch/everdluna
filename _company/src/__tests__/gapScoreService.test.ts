import { GapScoreService } from '../services/GapScoreService';

const service = new GapScoreService();

describe('GapScoreService', () => {
    it('should calculate metrics and adhere to the defined contract structure', async () => {
        // 1. 정상 케이스 (성장 가능성이 있는 중간 수준의 데이터)
        const rawData: Record<string, any> = { 
            pitchDeviation: 3.5, // 경고 아님
            resonanceFrequency: 0.6, // 잠재력 부족도 중간
            growth: 0.7,
            engagement: 0.8,
            money: 0.5,
        };

        const result = await service['calculate'](rawData, 'test-success');

        // Assertions for contract adherence and logic validation
        expect(result).toHaveProperty('metadata');
        expect(result.metadata).toHaveProperty('contextId', 'test-success');
        expect(result).toHaveProperty('metrics');
        expect(typeof result.metrics).toBe('object');

        // Key Logic Check: Warning State가 false여야 함
        expect(result.metrics.technicalGaps.isWarningState).toBe(false); 
        
        // Key Metric Check: Gap Score와 Hint가 적절한 값을 가져왔는지 확인
        expect(typeof result.metrics.overallGapScore).toBe('number');
        expect(result.metrics.storytellingHints).toHaveProperty('painPointMessage');

    });

    it('should handle extreme edge case (High Pitch Deviation -> Warning State)', async () => {
        // 2. 경계 케이스: 음정 편차 임계치 초과 (Warning)
        const rawData: Record<string, any> = { 
            pitchDeviation: 7.2, // 높음! 경고 상태 유도
            resonanceFrequency: 0.1,
            growth: 0.3,
            engagement: 0.1,
            money: 0.1,
        };

        const result = await service['calculate'](rawData, 'test-warning');
        
        // Key Logic Check: Warning State가 true여야 함
        expect(result.metrics.technicalGaps.isWarningState).toBe(true);
    });

    it('should fail gracefully if required raw data is missing (Validation Check)', async () => {
        // 3. 실패 케이스: 필수 데이터 누락
        const rawData: Record<string, any> = { 
            pitchDeviation: undefined, // 필수 필드 누락
            resonanceFrequency: 0.5,
            growth: 1.0,
            engagement: 1.0,
            money: 1.0,
        };

        // Service의 isValidContext가 실패를 감지하고 throw 하는지 확인
        await expect(service['calculate'](rawData, 'test-fail')).rejects.toThrow("Invalid or incomplete raw data provided.");
    });
});