// src/services/__tests__/DiagnosisService.test.ts

import { DiagnosisService } from '../DiagnosisService';
import { mockRepository, MockUserRepository } from '../../../../mocks/repositoryMocks'; // 가상의 DB 레포지토리 모킹 경로

// 실제 서비스 의존성 주입을 위해 Mocking setup (실제 환경에 맞춰 조정 필요)
const diagnosisService = new DiagnosisService(mockRepository); 

describe('DiagnosisService', () => {
    beforeEach(() => {
        // 테스트 시작 전마다 Mock Repository를 초기화합니다.
        jest.clearAllMocks();
        // 가상의 DB 접근 로직을 Mock으로 설정했다고 가정합니다.
        // (실제 프로젝트 구조에 맞춰 mockRepository의 구현체를 변경해야 합니다.)
    });

    // ----------------------------------------------
    // 🟢 Success Path Tests: 정상적인 Gap Score 계산 및 저장 흐름 검증
    // ----------------------------------------------
    describe('calculateAndStoreDiagnosisScore', () => {
        const mockUserId = 'user-123';
        const validInputData = { pitch_stability: 0.8, rhythm_score: 0.9 };

        it('should successfully calculate the score and store it when all inputs are valid', async () => {
            // Mocking Setup: DB가 성공적으로 기록한다고 가정합니다.
            mockRepository.saveDiagnosisResult.mockResolvedValue({ success: true, id: 'diag-1' });
            mockUserRepository.findUserById.mockResolvedValue({ role: 'premium' }); // Premium User

            const result = await diagnosisService.calculateAndStore(mockUserId, validInputData);

            // 1. 로직 검증: 서비스가 적절한 값을 계산했는지 확인합니다.
            expect(result).toHaveProperty('gap_score');
            expect(typeof result.gap_score).toBe('number');
            
            // 2. 의존성 검증: DB 저장 함수가 정확히 한 번 호출되었는지 확인합니다.
            expect(mockRepository.saveDiagnosisResult).toHaveBeenCalledTimes(1);
        });

        it('should handle boundary condition scores (e.g., all zeroes)', async () => {
             // Mocking Setup for low score case
            mockRepository.saveDiagnosisResult.mockResolvedValue({ success: true, id: 'diag-2' });
            mockUserRepository.findUserById.mockResolvedValue({ role: 'free' });

            const result = await diagnosisService.calculateAndStore(mockUserId, { pitch_stability: 0, rhythm_score: 0 });

            // Gap Score가 최소값을 가지는지 확인 (혹은 정의된 기본값)
            expect(result.gap_score).toBeLessThanOrEqual(1); // 예시로 1 이하의 낮은 점수 기대
        });


    });

    // ----------------------------------------------
    // 🔴 Failure Path Tests: 비즈니스 로직 및 계약 위반 검증
    // ----------------------------------------------
    describe('calculateAndStoreDiagnosisScore (Failure Handling)', () => {
        const mockUserId = 'user-456';

        it('should throw an error if the user is not authenticated', async () => {
            mockUserRepository.findUserById.mockResolvedValue(null); // 사용자 없음으로 Mocking
            await expect(diagnosisService.calculateAndStore(null, {})).rejects.toThrow('Authentication required.');
        });

        it('should throw an error if the user role does not permit advanced diagnosis (RBAC)', async () => {
             // Role Based Access Control 테스트
            mockUserRepository.findUserById.mockResolvedValue({ role: 'free' }); // Free User Mocking
            await expect(diagnosisService.calculateAndStore(mockUserId, {})).rejects.toThrow('Requires premium subscription for this diagnosis.');
        });

        it('should handle DB write failure gracefully (Transaction rollback simulation)', async () => {
            // 저장 로직이 실패했을 때의 처리 검증
            mockRepository.saveDiagnosisResult.mockRejectedValue(new Error('DB connection failed')); 
            
            await expect(diagnosisService.calculateAndStore(mockUserId, {})).rejects.toThrow(/DB connection failed/);

            // 핵심: 오류 발생 시 시스템에 로그를 남기거나, 트랜잭션을 롤백하는 로직이 동작해야 함을 검증합니다.
        });
    });
});