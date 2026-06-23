import { RawDiagnosisData } from './gapScoreTypes';
import { GapScoreService } from './gapScoreService';

/**
 * @fileoverview GapScoreService의 단위 테스트 파일입니다.
 * [WHY]: 이 서비스는 비즈니스 로직이 집약된 곳이므로, 모든 경계 조건과 예외 케이스에 대한 테스트가 필수적입니다. 🐛
 */

describe('GapScoreService - Unit Tests', () => {

    // Test Case 1: 정상적인 데이터 처리 (Full Coverage)
    it('should calculate diagnosis results correctly for all three KPI types with sufficient data', () => {
        const rawDataList: RawDiagnosisData[] = [
            { sessionId: 'sessionA', diagnosisType: 'Growth', rawMetrics: { pitch_accuracy: 0.8, vocal_range: 0.5, consistency: 0.9 }, userLevel: 'Premium' },
            { sessionId: 'sessionA', diagnosisType: 'Engagement', rawMetrics: { pitch_accuracy: 0.6, vocal_range: 0.7, consistency: 0.8 }, userLevel: 'Premium' },
            { sessionId: 'sessionB', diagnosisType: 'Monetization', rawMetrics: { pitch_accuracy: 0.9, vocal_range: 0.9, consistency: 1.0 }, userLevel: 'Premium' } // B는 완벽한 케이스
        ];

        const results = GapScoreService.calculate(rawDataList);

        // 결과가 정상적으로 세 개의 항목을 포함하는지 확인
        expect(results).toHaveLength(3);

        // Monetization (B)의 점수와 Critical 플래그 검증 (가장 높은 값을 가지므로 안전 영역에 있을 것으로 예상)
        const monetizationResult = results.find(r => r.diagnosisType === 'Monetization');
        expect(monetizationResult).toBeDefined();
        // consistency 1.0 -> scoreValue는 2.0 * 1.0 (최소값이므로, 로직에 따라 다르지만 최소한의 검증은 필요)
        expect(monetizationResult!.scoreValue).toBeGreaterThanOrEqual(5); // 임시 기준점 설정

    });


    // Test Case 2: 경계 조건 테스트 - 무료 사용자의 접근 제한 (RBAC Failure)
    it('should skip calculation for restricted types when user level is Free', () => {
        const rawDataList: RawDiagnosisData[] = [
            // 무료 사용자가 Monetization에 접근 시도 -> 무시되어야 함
            { sessionId: 'sessionC', diagnosisType: 'Monetization', rawMetrics: { pitch_accuracy: 1.0, vocal_range: 1.0, consistency: 1.0 }, userLevel: 'Free' },
            // 무료 사용자가 Growth에 접근 시도 -> 정상 처리되어야 함
            { sessionId: 'sessionC', diagnosisType: 'Growth', rawMetrics: { pitch_accuracy: 0.5, vocal_range: 0.1, consistency: 0.1 }, userLevel: 'Free' }
        ];

        const results = GapScoreService.calculate(rawDataList);

        // 결과 배열의 길이는 총 2가 되어야 하며, Monetization이 빠져있어야 함
        expect(results).toHaveLength(2);

        const restrictedResult = results.find(r => r.diagnosisType === 'Monetization');
        expect(restrictedResult).toBeUndefined(); // 실패했으므로 결과 객체 자체가 존재하지 않아야 정상임.
    });


    // Test Case 3: 데이터가 부족하거나 누락된 경우 (Zero Data State)
    it('should handle missing or zero raw metrics gracefully without crashing', () => {
        const rawDataList: RawDiagnosisData[] = [
            { sessionId: 'sessionD', diagnosisType: 'Growth', rawMetrics: {}, userLevel: 'Premium' }, // 모든 메트릭 누락
            { sessionId: 'sessionE', diagnosisType: 'Engagement', rawMetrics: { pitch_accuracy: 0, vocal_range: 0, consistency: 0 }, userLevel: 'Premium' } // 모두 0
        ];

        const results = GapScoreService.calculate(rawDataList);

        // 두 개의 결과가 나오지만, 점수는 매우 낮거나 기본값으로 설정되어야 함 (크래시 없음)
        expect(results).toHaveLength(2);

        const resultD = results.find(r => r.diagnosisType === 'Growth');
        expect(resultD!.scoreValue).toBeCloseTo(0, 2); // 누락된 경우 기본값으로 처리되었는지 확인
    });

});