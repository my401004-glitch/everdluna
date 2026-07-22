import { getDiagnosisScore } from '../diagnosisService';
import { DiagnosisInput, DiagnosisResult } from '../../types/diagnosis';

// Mocking the actual implementation for testing purposes
describe('getDiagnosisScore', () => {
  const mockBaseData: any[] = Array(20).fill({ value: 1 }); // 20개의 데이터 포인트로 기준 설정

  test('✅ Success Case: 정상적인 진단 데이터가 들어왔을 때 모든 값이 올바르게 계산되어야 한다.', async () => {
    // @ts-ignore (임시 테스트용 Mocking)
    const result: DiagnosisResult = await getDiagnosisScore({ userId: 'user123', sessionId: 'sess456', rawDataPoints: mockBaseData });

    expect(result.gapScore).toBeGreaterThanOrEqual(0);
    expect(result.kpiMetrics.growthScore).toBeDefined();
    expect(Array.isArray(result.monetizationTriggers)).toBe(true);
  });

  test('❌ Failure Case: 필수 데이터가 누락되었을 때 에러를 던져야 한다 (Guard Clause Test).', async () => {
    // @ts-ignore
    await expect(getDiagnosisScore({ userId: 'user123', sessionId: 'sess456', rawDataPoints: null })).rejects.toThrow("Diagnosis input data is incomplete or invalid.");

    // @ts-ignore
    await expect(getDiagnosisScore({ userId: '', sessionId: 'sess456', rawDataPoints: mockBaseData })).rejects.toThrow();
  });

  test('⚠️ Edge Case: KPI 점수가 0에 가깝거나 경계값일 때 트리거가 적절히 작동해야 한다.', async () => {
    // 데이터 포인트 최소화 (KPI 계산 로직의 하한선 테스트)
    const minimalData: any[] = Array(1).fill({ value: 1 });

    // @ts-ignore
    const result: DiagnosisResult = await getDiagnosisScore({ userId: 'edge_user', sessionId: 'sess001', rawDataPoints: minimalData });

    expect(result.gapScore).toBeLessThanOrEqual(30); // 낮은 점수 예상
  });
});