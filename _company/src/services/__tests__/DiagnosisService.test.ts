// src/services/__tests__/DiagnosisService.test.ts
import { DiagnosisService } from '../DiagnosisService';
import { UserContext, SessionLog } from '../../types/diagnosis-types';

describe('DiagnosisService', () => {
    const mockContext: UserContext = { 
        id: 'user_123', 
        isPremiumUser: true, 
        currentTier: 'Gold' 
    };

    it('should throw an error if required inputs are missing', () => {
        // Context 누락 테스트
        expect(() => DiagnosisService.calculateScore(null as any, [])).toThrow("필수 Context 및 세션 로그 데이터가 누락되었습니다.");
        // Logs 누락 테스트
        expect(() => DiagnosisService.calculateScore(mockContext, null as any)).toThrow("필수 Context 및 세션 로그 데이터가 누락되었습니다.");
    });

    it('should calculate a reasonable score when logs are provided (Happy Path)', () => {
        const mockLogs: SessionLog[] = [
            { timestamp: 't1', duration: 60, feature: 'BasicPitch' },
            { timestamp: 't2', duration: 90, feature: 'PremiumPitch' }, // Monetization 기여
            { timestamp: 't3', duration: 45, feature: 'VocalWarmup' },
            // ... 충분한 로그를 넣어 점수 계산에 영향을 주게 함
        ];

        const result = DiagnosisService.calculateScore(mockContext, mockLogs);

        // 테스트 검증 포인트: 총점이 유효 범위 내에 들어와야 합니다.
        expect(result).toHaveProperty('totalScore');
        expect(result.totalScore).toBeGreaterThanOrEqual(0);
        expect(result.totalScore).toBeLessThanOrEqual(100);

        // 테스트 검증 포인트: KPI 필드가 누락되어서는 안 됩니다.
        expect(result.kpiMetrics).toHaveProperty('growth');
    });

    it('should calculate low score if logs are minimal (Edge Case)', () => {
        const mockLogs: SessionLog[] = [
            { timestamp: 't1', duration: 5, feature: 'BasicPitch' },
        ];
        // 매우 짧은 세션에 대한 점수 계산이 정상적으로 작동하는지 확인합니다.
        const result = DiagnosisService.calculateScore(mockContext, mockLogs);

        // 점수가 0점보다는 높지만, 최대치와는 거리가 먼 적절한 값이어야 합니다.
        expect(result.totalScore).toBeLessThan(50);
    });
});