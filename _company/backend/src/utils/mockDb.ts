// mockDb.ts - Mock DB Client for Testing Purposes (실제 환경에서 Replace 필요)

type DiagnosisResult = { contextId: string; resultJson: string; timestamp: Date };
type KPIMetrics = { growth: number; engagement: number; monetization: number };

export class MockDBTransaction {
    private records: Record<string, any> = {};

    constructor() {}

    async saveDiagnosisResult(data: DiagnosisResult): Promise<void> {
        console.log(`[MOCK DB] Saving Diagnosis Result for ${data.contextId}`);
        this.records['diagnosis'] = data;
    }

    async saveKPIMetrics(metrics: KPIMetrics): Promise<void> {
        console.log('[MOCK DB] Saving KPI Metrics');
        // 실제로는 이 데이터를 별도의 테이블에 저장하고 외래 키를 연결합니다.
        this.records['kpi'] = metrics; 
    }

    async commit(): Promise<void> {
        console.log('--- Transaction Committed: Data successfully saved to the simulated DB ---');
    }

    async rollback(): Promise<void> {
        console.warn('!!! Transaction Rolled Back: No changes applied !!!');
    }
}

export const mockDbClient = {
    beginTransaction: async (): Promise<MockDBTransaction> => new MockDBTransaction(),
    clearAllTables: async (): Promise<void> => console.log('[MOCK DB] All test tables cleared.'),
    setRole: async (role: 'FreeUser' | 'Premium'): Promise<void> => {
        console.log(`[MOCK DB] User Role set to ${role}`);
    }
};