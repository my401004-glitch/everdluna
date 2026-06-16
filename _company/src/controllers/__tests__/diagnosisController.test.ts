// src/controllers/__tests__/diagnosisController.test.ts
import { getFinancialImpactSimulation } from '../diagnosisController';
import * as FinancialService from '../../services/FinancialService';

// Mocking the entire FinancialService module to isolate testing of the controller logic
jest.mock('../../services/FinancialService'); 

describe('GET /financial_impact_simulation/:userId', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
        // Mock Request object (simulating params)
        mockRequest = { params: { userId: 'user123' } }; 
        
        // Mock Response object (tracking status and JSON calls)
        mockResponse = {
            status: jest.fn().mockReturnThis(), // Allows chaining like .status(200).json({})
            json: jest.fn(),
        };

        // Mock Next function if middleware was involved, but not needed here.
    });

    it('should return 400 error if userId is missing', async () => {
        mockRequest = { params: {} }; // Simulate missing user ID
        await getFinancialImpactSimulation(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "User ID is required for simulation." });
    });

    it('should call FinancialService with the correct userId and return 200 success status', async () => {
        const mockResult = {
            financialGainScore: 85,
            riskAssessment: 'Low-Medium',
            recommendedAction: 'Content Upgrade'
        };
        // Mocking the successful service call result
        (FinancialService.calculateFinancialImpact as jest.Mock).mockResolvedValue(mockResult);

        await getFinancialImpactSimulation(mockRequest, mockResponse);

        // 1. Service 호출 검증 (가장 중요)
        expect(FinancialService.calculateFinancialImpact).toHaveBeenCalledWith('user123');
        
        // 2. 응답 상태 및 데이터 구조 검증
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        const responseBody = mockResponse.json.mock.calls[0][0];

        expect(responseBody).toEqual({
            success: true,
            data: {
                user_id: 'user123',
                reportTitle: "AI 기반 학원 재무 영향 시뮬레이션 보고서",
                simulationResult: mockResult // Mock된 결과가 정확히 들어와야 함
            }
        });
    });

    it('should handle internal server errors gracefully and return 500 status', async () => {
        // Mocking the service call to intentionally fail (e.g., DB connection error)
        (FinancialService.calculateFinancialImpact as jest.Mock).mockRejectedValue(new Error("DB Connection Failed"));

        await getFinancialImpactSimulation(mockRequest, mockResponse);

        // 1. 에러 핸들링 검증
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });
});