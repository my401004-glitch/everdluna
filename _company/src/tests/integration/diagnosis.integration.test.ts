// src/tests/integration/diagnosis.integration.test.ts
import { RequestMock, ResponseMock } from 'supertest'; // Mocking library 가정
import { calculateAndSavePredictiveValue } from '../../controllers/diagnosisController'; 
import { PredictiveValueService } from '../../services/predictive-value.service';
import { DiagnosisDAO } from '../../data/DiagnosisDAO';

// =========================================================
// MOCKING SETUP: 외부 의존성을 격리하여 테스트 환경 구축
// =========================================================

// 1. Mock PredictiveValueService (로직 검증)
jest.mock('../../services/predictive-value.service', () => ({
    PredictiveValueService: {
        calculate: jest.fn(),
    },
}));

// 2. Mock DiagnosisDAO (DB 저장 검증)
jest.mock('../../data/DiagnosisDAO', () => ({
    DiagnosisDAO: {
        savePredictiveMetrics: jest.fn(),
    },
}));

describe('E2E Integration Test: Predictive Value Calculation and Persistence', () => {
    // 테스트 전에 Mock 함수 초기화
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('✅ [SUCCESS] 성공적인 예측 가치 계산 및 DB 저장 플로우 검증 (Happy Path)', async () => {
        // 1. Mock 데이터 정의: 성공 시 예상 결과 값
        const mockPredictiveData = { totalScore: 85, growthIndex: 0.7, engagementIndex: 0.9 };
        const mockSavedResult = { resultId: "xyz-123", status: "SAVED" };

        // Mocking Sequence Setup:
        (PredictiveValueService.calculate as jest.Mock).mockResolvedValue(mockPredictiveData); // 서비스 로직 성공 모방
        (DiagnosisDAO.savePredictiveMetrics as jest.Mock).mockResolvedValue(mockSavedResult); // DB 저장 성공 모방

        // 2. Mock Request/Response Setup (Supertest 시뮬레이션)
        const mockReq: Partial<Request> = { body: { diagnosisContextId: "CTX-100", userRole: "PREMIUM" } };
        const mockRes: ResponseMock = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockNext: NextFunction = jest.fn();

        // 3. 실행 및 검증
        await calculateAndSavePredictiveValue(mockReq as Request, mockRes as Response, mockNext as NextFunction);

        // Assertion Checks (검증):
        expect(PredictiveValueService.calculate).toHaveBeenCalledWith("CTX-100", "PREMIUM"); // 서비스가 정확히 호출되었는지 확인
        expect(DiagnosisDAO.savePredictiveMetrics).toHaveBeenCalledWith("CTX-100", "PREMIUM", mockPredictiveData); // DAO가 정확한 데이터를 받아서 호출했는지 확인
        expect(mockRes.status).toHaveBeenCalledWith(200); // HTTP Status 200 반환 여부
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Predictive value successfully calculated and saved." }));
    });

    it('❌ [FAILURE] PredictiveService 로직 실패 시 DB 저장 없이 에러 처리 검증', async () => {
        // 1. Mock 데이터 정의: 서비스 로직이 null을 반환하는 실패 상황
        (PredictiveValueService.calculate as jest.Mock).mockResolvedValue(null);

        // 2. Mock Request/Response Setup
        const mockReq: Partial<Request> = { body: { diagnosisContextId: "CTX-101", userRole: "FREE" } };
        const mockRes: ResponseMock = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockNext: NextFunction = jest.fn();

        // 3. 실행 및 검증
        await calculateAndSavePredictiveValue(mockReq as Request, mockRes as Response, mockNext as NextFunction);

        // Assertion Checks (검증):
        expect(DiagnosisDAO.savePredictiveMetrics).not.toHaveBeenCalled(); // DB 저장 로직이 호출되지 않아야 함
        expect(mockRes.status).toHaveBeenCalledWith(500); // 500 에러 반환 여부 확인
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Failed to calculate predictive value data." }));
    });

    it('❌ [FAILURE] DB 트랜잭션 실패 시 Rollback 및 오류 전파 검증', async () => {
        // 1. Mock 데이터 정의: 서비스 로직은 성공했으나, DB가 에러를 반환하는 상황
        const mockPredictiveData = { totalScore: 50, growthIndex: 0.1, engagementIndex: 0.2 };
        const dbError = new Error("Database connection timeout.");

        // Mocking Sequence Setup:
        (PredictiveValueService.calculate as jest.Mock).mockResolvedValue(mockPredictiveData); // 서비스 로직 성공
        (DiagnosisDAO.savePredictiveMetrics as jest.Mock).mockRejectedValue(dbError); // DB 저장 실패 모방

        // 2. Mock Request/Response Setup
        const mockReq: Partial<Request> = { body: { diagnosisContextId: "CTX-102", userRole: "PREMIUM" } };
        const mockRes: ResponseMock = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockNext: NextFunction = jest.fn();

        // 3. 실행 및 검증
        await calculateAndSavePredictiveValue(mockReq as Request, mockRes as Response, mockNext as NextFunction);

        // Assertion Checks (검증):
        expect(mockRes.status).toHaveBeenCalledWith(500); // HTTP Status 500 반환 여부
        expect(mockNext).toHaveBeenCalledWith(expect.any(Error)); // 다음 미들웨어로 에러를 명시적으로 전파했는지 확인
    });
});