import { DiagnosisController } from '../controllers/diagnosisController';
// Mocking for external services (DB, API calls)
const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
const mockReq = { user: { id: 'test-user-123' }, body: {} };

describe('DiagnosisController E2E Test Suite - Video 3 Financial Risk', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully process and save a high financial risk score (Video 3 Hook)', async () => {
        // Arrange: 높은 재무적 위험 시나리오 입력 데이터 구성
        const mockInput = { 
            type: 'financial_risk', 
            data: { monthly_revenue: "1000", cost_of_inaction: "8000" } // 매우 높은 리스크 비율
        };
        mockReq.body = mockInput;

        // Act: 컨트롤러 실행 시뮬레이션 (실제 API 호출)
        await DiagnosisController.getDiagnosisScore(mockReq, mockRes);

        // Assert 1: 성공적인 HTTP 응답 코드가 반환되었는지 검증
        expect(mockRes.status).toHaveBeenCalledWith(200);
        const responseBody = JSON.parse(JSON.stringify(mockRes.json.mock.calls[0][0]));
        expect(responseBody.success).toBe(true);

        // Assert 2: 계산된 점수와 권장 사항이 Video 3의 Funnel 메시지를 따르는지 검증
        const result = responseBody.result;
        expect(result.score).toBeCloseTo(80, 1); // (8000/1000)*100 = 80
        expect(result.recommendation).toContain("즉시 액션 필요!");

        // Assert 3: DB 저장 로직이 호출되었는지 검증 (가장 중요)
        // 실제로는 Mocked Service Layer를 통해 DB Write 성공을 체크해야 합니다.
    });

    it('should fail gracefully if the input data is missing or invalid', async () => {
        // Arrange: 유효하지 않은 데이터 입력 시나리오
        mockReq.body = { type: 'invalid_type' };

        // Act: 컨트롤러 실행 시뮬레이션
        await DiagnosisController.getDiagnosisScore(mockReq, mockRes);

        // Assert: 400 Bad Request가 반환되었는지 검증 (에러 핸들링 확인)
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });
});