// src/controllers/diagnosisController.ts와 같은 디렉토리 구조를 가정합니다.

import { Request, Response } from 'express';
import * as diagnosisService from '../services/diagnosisService'; 
// 실제 서비스 레이어를 분리하여 테스트 용이성을 확보했다고 가정

describe('GET /api/v1/diagnosis_score', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      user: { id: 'test-user-123', role: 'FREE' }, // 테스트용 가짜 사용자 객체
      params: {} 
    };
    // 응답을 스파이하여 상태 코드와 데이터 반환 여부를 검증합니다.
    mockResponse = jest.fn();
  });

  // --- 🟢 1. Happy Path Test (성공 시나리오) ---
  it('should return the diagnosis score when all necessary data and roles are valid', async () => {
    (diagnosisService.calculateScore as jest.Mock).mockResolvedValue({
      score: 'A+',
      details: { growth: 85, engagement: 70, monetization: 60 }
    });

    // 컨트롤러 호출 (실제 API 요청을 시뮬레이션)
    await require('../controllers/diagnosisController').get(mockRequest as Request, mockResponse);

    expect(diagnosisService.calculateScore).toHaveBeenCalledTimes(1);
    expect(mockResponse).toHaveBeenCalledWith(200, { success: true, data: expect.any(Object) });
  });

  // --- 🔴 2. Failure Path Test (권한 미달 접근 - RBAC Check) ---
  it('should return a 403 Forbidden error if the user role does not allow accessing certain KPI reports', async () => {
    mockRequest.user = { id: 'free-user', role: 'FREE' }; // 권한이 낮은 사용자 설정

    // 서비스 레이어에서 권한 검증 로직이 작동하여 에러를 던지도록 Mocking
    (diagnosisService.calculateScore as jest.Mock).mockRejectedValue(new Error('403_FORBIDDEN: User does not have access to this KPI data.'));

    await require('../controllers/diagnosisController').get(mockRequest as Request, mockResponse);

    expect(mockResponse).toHaveBeenCalledWith(403, { success: false, message: 'Forbidden' });
  });

  // --- 🟡 3. Failure Path Test (필수 입력값 누락 - Input Validation) ---
  it('should return a 400 Bad Request if required context data is missing', async () => {
    mockRequest.user = { id: 'test-user-123', role: 'PREMIUM' }; // 권한은 충분함

    // 서비스 레이어에서 Context ID가 누락되었다고 가정하고 에러를 발생시킵니다.
    (diagnosisService.calculateScore as jest.Mock).mockRejectedValue(new Error('400_BADREQUEST: Missing required diagnosis context ID.'));

    await require('../controllers/diagnosisController').get(mockRequest as Request, mockResponse);

    expect(mockResponse).toHaveBeenCalledWith(400, { success: false, message: 'Bad Request' });
  });
});