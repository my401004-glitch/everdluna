import { UserContext, PerformanceHistory } from './models';

/**
 * 사용자 정보 및 구독 등급 조회 (Mock)
 */
export async function getUserContext(userId: string): Promise<UserContext> {
    console.log(`[DB Mock] Get UserContext for user: ${userId}`);
    return {
        userId,
        tier: 'Basic',
        usage_count: 2, // 가상 사용량
    };
}

/**
 * 진단 결과 저장 (Mock)
 */
export async function saveDiagnosisResult(userId: string, diagnosisResult: any): Promise<void> {
    console.log(`[DB Mock] Save diagnosis result for user: ${userId}`, diagnosisResult);
}

/**
 * 사용량 시도 및 기록 로그 저장 (Mock)
 */
export async function insertPerformanceHistory(historyEntry: PerformanceHistory): Promise<void> {
    console.log('[DB Mock] Insert Performance History:', historyEntry);
}
