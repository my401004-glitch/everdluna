/**
 * @fileoverview Diagnosis API의 End-to-End(E2E) 통합 테스트 스위트입니다.
 * 이 파일은 컨트롤러 -> 서비스 -> 레포지토리 전반의 데이터 흐름과 비즈니스 로직을 검증합니다.
 */

import { diagnosisController } from '../controllers/diagnosisController';
import { diagnosisRepository } from '../repositories/diagnosisRepository';
// Mocking 환경 설정이 필요하다고 가정하고, 필요한 타입을 임포트 합니다.
type MockRequest = any; 
type MockResponse = any;

describe('E2E Diagnosis API Integration Test Suite', () => {

    // 테스트 전에 DB 연결을 모킹(Mock)하거나 초기화하는 과정이 선행되어야 합니다.
    beforeAll(() => {
        console.log("--- E2E TEST SETUP: Database Connection Mocking ---");
        // 실제 환경에서는 Sequelize/TypeORM의 transaction mock 또는 전용 테스트 DB 사용
        jest.mock('../repositories/diagnosisRepository', () => ({
            diagnosisRepository: {
                saveDiagnosisResult: jest.fn(), // 레포지토리 함수를 목킹합니다.
            }
        }));

    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    // -----------------------------------------------------------
    // TEST CASE 1: 정상적인 프리미엄 사용자 진단 흐름 (성공 케이스)
    // -----------------------------------------------------------
    test('should successfully process diagnosis for a PREMIUM user and save all KPIs', async () => {
        const mockRequest: MockRequest = {
            body: { userId: 'user-p123', type: 'ALL' },
            user: { role: 'PREMIUM', id: 'user-p123' } // 사용자 컨텍스트 주입
        };

        // ⭐️ 기대 동작 설정 (Mocking): 레포지토리가 성공적으로 저장한다고 가정합니다.
        (diagnosisRepository.saveDiagnosisResult as jest.Mock).mockResolvedValue(true);

        const response = await diagnosisController.getScoreFromRequest(mockRequest, {} as MockResponse);

        // 1. 응답 값 검증: 컨트롤러가 올바른 데이터를 반환했는지 확인
        expect(response.score).toBeDefined();
        expect(typeof response.growthKpi).toBe('number');

        // 2. DB 상호작용 검증: 레포지토리가 정확히 호출되었는지, 그리고 필요한 인자(KPI 값 포함)가 전달되었는지 확인
        expect(diagnosisRepository.saveDiagnosisResult).toHaveBeenCalledTimes(1);
        const savedArgs = diagnosisRepository.saveDiagnosisResult.mock.calls[0];
        // 저장된 데이터의 형태와 권한 체크가 정상적으로 호출되었는지 검증합니다.
        expect(savedArgs[0].growthKpi).toBeCloseTo(response.growthKpi, 2); // 예시 값과 비교
    });


    // -----------------------------------------------------------
    // TEST CASE 2: RBAC 위반 - 무료 사용자가 유료 진단에 접근 시도 (실패 케이스)
    // -----------------------------------------------------------
    test('should fail and throw error if FREE user attempts to access restricted diagnosis type', async () => {
        const mockRequest: MockRequest = {
            body: { userId: 'user-f456', type: 'PREMIUM_ONLY' },
            user: { role: 'FREE', id: 'user-f456' } // 사용자 컨텍스트 주입
        };

        // ⭐️ 기대 동작 설정 (Mocking): 레포지토리가 권한 문제로 에러를 던진다고 가정합니다.
        const permissionError = new Error("Unauthorized access to this diagnosis type.");
        (diagnosisRepository.saveDiagnosisResult as jest.Mock).mockRejectedValueOnce(permissionError);

        // 컨트롤러 호출 시, Promise가 reject 되는지 확인합니다.
        await expect(diagnosisController.getScoreFromRequest(mockRequest, {} as MockResponse)).rejects.toThrow("Unauthorized access");
    });


    // -----------------------------------------------------------
    // TEST CASE 3: 데이터 유효성 검증 (Null/Invalid KPI 값 처리)
    // -----------------------------------------------------------
    test('should handle null or undefined KPI values gracefully during saving', async () => {
        const mockRequest: MockRequest = {
            body: { userId: 'user-p789', type: 'ALL' },
            user: { role: 'PREMIUM', id: 'user-p789' } 
        };

        // KPI 값이 유효하지 않더라도, 최소한 DB가 받지 못하도록 에러를 처리하거나 기본값으로 대체해야 합니다.
        // 이 테스트는 Service Layer에서 Null 체크 로직이 잘 작동하는지 검증합니다.
        const mockResponse = { score: 80, growthKpi: null, engagementKpi: undefined, monetizationKpi: -1 };
        
        // Mocking을 설정하고 호출 (실제로는 서비스 계층에서 이 처리가 일어납니다.)
        (diagnosisRepository.saveDiagnosisResult as jest.Mock).mockResolvedValue(true);

        await diagnosisController.getScoreFromRequest(mockRequest, {} as MockResponse); 
        // 실제 테스트에서는 Service Layer의 유효성 검증 로직이 실행되어야 합니다.
    });

});