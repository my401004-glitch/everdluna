import { Request, Response } from 'express';
import * as diagnosisService from '../services/diagnosisService';
// Mocking the dependency (DiagnosisService) for isolated integration testing of the Controller layer logic.
jest.mock('../../services/diagnosisService', () => ({
    calculateDiagnosisScore: jest.fn(),
}));

// 타입 정의는 실제 프로젝트 구조를 따라가야 하지만, 테스트 용이성을 위해 단순화합니다.
type MockResponse = {
    status: jest.Mock;
    json: jest.Mock;
};
type MockRequest = {
    query: any;
};

describe('DiagnosisController Integration Test Suite', () => {
    let mockService: jest.Mock;
    let mockReq: MockRequest;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        // 1. Mocking Setup
        mockService = diagnosisService.calculateDiagnosisScore as jest.Mock;
        mockReq = { query: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(), // .status(200).json(...) 체이닝을 위해 mockReturnThis() 사용
            json: jest.fn(),
        };
    });

    // --- Test Case 1: 성공적인 진단 로직 호출 및 응답 검증 (Happy Path) ---
    it('should successfully calculate and return the diagnosis score with valid parameters', async () => {
        // Mock Service Response Data (Expected Output Schema)
        const mockResult = {
            gapScore: 75.2,
            monetizationTriggers: ['premium_lesson_pack'], // Gap Score 기반으로 트리거 발생
            diagnosisDetails: { growth: 'Good', engagement: 'Needs Improvement' },
            contextId: 'test-abc-123'
        };

        // Service Layer Mocking: 성공적인 계산 결과를 반환하도록 설정
        mockService.mockResolvedValue(mockResult);

        // Request Data Setup
        mockReq.query = { studentId: ['S001'], contextType: 'test_score' };

        // Execution
        await (async () => {
            try {
                // 실제 컨트롤러 함수 호출 시뮬레이션
                await require('../diagnosisController').getDiagnosisScore(mockReq as Request, mockRes as Response);
            } catch (e) {
                console.error("Test failed during execution:", e);
            }
        })();

        // 2. Assertion & Verification
        expect(mockService).toHaveBeenCalledTimes(1);
        // Service가 올바른 인풋 파라미터를 받았는지 확인
        expect(mockService).toHaveBeenCalledWith({
            studentIds: ['S001'],
            contextType: 'test_score',
        });

        // 최종 API 응답이 200 상태 코드와 함께 성공 데이터를 담고 있는지 검증
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            data: mockResult,
        });
    });

    // --- Test Case 2: 필수 파라미터 누락 시 400 Bad Request 처리 검증 ---
    it('should return 400 status if required parameters (studentId) are missing', async () => {
        mockService.mockClear(); // 서비스 호출은 일어나면 안 됩니다.

        // Invalid Request Data Setup
        mockReq.query = {};

        await (async () => {
            await require('../diagnosisController').getDiagnosisScore(mockReq as Request, mockRes as Response);
        })();

        // Verification: Service가 호출되지 않아야 함
        expect(mockService).not.toHaveBeenCalled();

        // 400 응답 코드가 사용되었는지 확인
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "Invalid request parameters. studentId array is required." });
    });

    // --- Test Case 3: 서비스 로직 실패 시 (500 Internal Server Error) 처리 검증 ---
    it('should return 500 status if diagnosis service throws an error', async () => {
        // Service Layer Mocking: 오류 발생을 시뮬레이션
        mockService.mockRejectedValue(new Error("Database connection timeout"));

        // Request Data Setup
        mockReq.query = { studentId: ['S002'], contextType: 'test_score' };

        await (async () => {
            await require('../diagnosisController').getDiagnosisScore(mockReq as Request, mockRes as Response);
        })();

        // Verification
        expect(mockService).toHaveBeenCalledTimes(1);
        // 500 응답 코드가 사용되었는지 확인
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: "Internal server error while processing diagnosis score." });
    });
});