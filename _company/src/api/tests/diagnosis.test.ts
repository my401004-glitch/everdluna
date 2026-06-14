import { getDiagnosisScore } from '../controllers/diagnosisController';
import { Request, Response } from 'express';
// Mocking Express Request와 Response 객체가 필요합니다. 실제 테스트 환경에서는 jest-mock 등을 사용해야 합니다.

describe('GET /api/v1/diagnosis_score', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        // 가짜 Request와 Response 객체 설정 (테스트 환경 시뮬레이션)
        mockRequest = { 
            query: { userId: 'user123', diagnosisType: 'vocal_pop' } as any // 임시 타입 캐스팅
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as Response;
    });

    test('Should return 200 and mock diagnosis data when valid parameters are provided', async () => {
        // 실제 함수 호출 (Mocking된 환경에서 실행됨)
        await getDiagnosisScore(mockRequest as Request, mockResponse as Response);

        // 결과 검증: status 200이 호출되었고, json 데이터가 반환되어야 합니다.
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Should return 400 if required parameters (userId or diagnosisType) are missing', async () => {
        // 파라미터 누락 시나리오 테스트
        mockRequest = { query: {} } as any; // 빈 값으로 설정

        await getDiagnosisScore(mockRequest as Request, mockResponse as Response);

        // 결과 검증: status 400이 호출되어야 합니다.
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
});