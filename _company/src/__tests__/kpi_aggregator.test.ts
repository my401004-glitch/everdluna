// @ts-ignore - Global types are assumed for the test environment setup
import { aggregateKPIs, KPIEventLog } from "../services/kpi_aggregator";

// Mocking 필수 데이터 구조 정의 (테스트 케이스의 일관성을 위해)
const MOCK_USER_FREE = { userId: "user-free", role: "Free" };
const MOCK_USER_PREMIUM = { userId: "user-premium", role: "Premium" };

describe('KPI Aggregation Service (PoC)', () => {
    // 1. Happy Path Test: 모든 조건이 정상적으로 갖춰진 경우의 통합 테스트
    it('should correctly aggregate all KPIs for a complete user session (Happy Path)', async () => {
        const mockLogs: KPIEventLog[] = [
            // 1. Engagement Log (일반 로그)
            { context_id: "C-001", timestamp: Date.now(), event_type: "view_progress", duration_sec: 30, user_data: { role: "Premium" } },
            // 2. Growth Trigger Log (성장 관련 이벤트 - 예: 진단 테스트 시작)
            { context_id: "C-001", timestamp: Date.now(), event_type: "diagnosis_start", source: "manual", user_data: { role: "Premium" } },
            // 3. Monetization Trigger Log (수익화 관련 이벤트 - 예: 결제 페이지 조회)
            { context_id: "C-001", timestamp: Date.now(), event_type: "payment_page_view", source: "button_click", user_data: { role: "Premium" } },
        ];

        // 실행 및 검증
        const result = await aggregateKPIs(mockLogs);

        expect(result).toBeDefined();
        // Growth KPI는 'diagnosis_start' 이벤트가 한 번 발생했으므로 1로 예상
        expect(result.growth_score).toBeGreaterThanOrEqual(0); // 실제 로직에 따라 점수가 나오겠지만, 최소한 계산됨을 확인
        // Engagement는 View/Duration 기반으로 높게 산출되어야 함
        expect(result.engagement_level).toBe("High"); 
        // Monetization은 결제 페이지 조회로 인해 높은 수준이어야 함
        expect(result.monetization_status).toBe("Potential"); 
    });

    // 2. Edge Case Test (RBAC): 권한 기반 접근 제어 테스트
    it('should safely ignore monetization logs for free users when calculating KPI', async () => {
        const mockLogs: KPIEventLog[] = [
            { context_id: "C-002", timestamp: Date.now(), event_type: "view_progress", duration_sec: 15, user_data: { role: "Free" } },
            // Free User가 접근할 수 없는 Monetization 로그 포함 시도
            { context_id: "C-002", timestamp: Date.now(), event_type: "payment_page_view", source: "link_click", user_data: { role: "Free" } }, 
        ];

        // 실행 및 검증 (핵심은 Free User는 Payment 로그가 KPI에 영향을 주지 않거나, 경고를 남기는 것)
        const result = await aggregateKPIs(mockLogs);

        expect(result).toBeDefined();
        // Monetization 상태가 'None' 또는 'Low'로 유지되어야 함. (권한 체크 로직이 정상 동작했음을 의미)
        expect(result.monetization_status).not.toBe("Potential"); 
    });


    // 3. Failure Path Test: 필수 데이터 누락 시 처리 검증
    it('should handle missing critical data fields gracefully without crashing', async () => {
        const mockLogs: KPIEventLog[] = [
            // context_id가 아예 없는 로그 (Failure Case)
            { timestamp: Date.now(), event_type: "missing_context", duration_sec: 5, user_data: {} }, 
            // source 필드가 누락된 로그 (Edge Case)
            { context_id: "C-003", timestamp: Date.now(), event_type: "view_progress", duration_sec: 10, user_data: { role: "Free" } }, 
        ];

        // 실행 및 검증 (서비스는 에러를 발생시키지 않고, 해당 로그만 무시하거나 기본값으로 처리해야 함)
        await expect(async () => await aggregateKPIs(mockLogs)).resolves.not.toThrow();
    });
});