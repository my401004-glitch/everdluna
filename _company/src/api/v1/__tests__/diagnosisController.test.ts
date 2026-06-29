/**
 * @fileoverview Diagnosis Controller Unit Tests
 * 이 파일은 diagnosisController가 처리할 수 있는 모든 유효/무효 입력 케이스를 테스트합니다.
 */

import { diagnoseScore, DiagnosisInput } from '../diagnosisController'; 
// 실제 경로에 맞춰 임포트해야 함. (예: ./src/api/v1/diagnosisController)

describe('Diagnosis Score Calculation Logic', () => {
    // Test Case 1: 정상적인 핵심 입력값으로 진단 점수 계산 (Happy Path)
    it('should calculate a valid score given all required inputs', async () => {
        const mockInput: DiagnosisInput = {
            readingExperience: 'Advanced', // 예시 값
            rhythmSkillScore: 85,         // 예시 값
            vocalTonicLevel: 7.5          // 예시 값
        };

        const score = await diagnoseScore(mockInput);

        // 결과값이 필수적으로 존재하고 유효한 범위에 있는지 검증
        expect(score).toBeDefined();
        expect(score.overallGrade).toMatch(/A|B|C/); // Grade가 알파벳 형태여야 함 (비즈니스 규칙)
        expect(score.diagnosisScore).toBeGreaterThanOrEqual(0);
        expect(score.diagnosisScore).toBeLessThanOrEqual(100); 
    });

    // Test Case 2: 필수 필드 누락 시 처리 검증 (Missing Data - Edge Case)
    it('should throw an error if a mandatory field is missing from input', async () => {
        const incompleteInput: Partial<DiagnosisInput> = {
            readingExperience: 'Intermediate'
            // rhythmSkillScore나 vocalTonicLevel 누락 가정
        };

        // 비동기 함수가 에러를 던지는지 확인
        await expect(diagnoseScore(incompleteInput as DiagnosisInput)).rejects.toThrow('Mandatory field missing'); 
    });

    // Test Case 3: 데이터 타입 오류 검증 (Type Safety - Edge Case)
    it('should throw an error if non-numeric data is provided for score fields', async () => {
        const invalidTypeInput: DiagnosisInput = {
            readingExperience: 'Advanced',
            rhythmSkillScore: "EightyFive", // <-- 문자열을 넣음 (오류 유발 지점)
            vocalTonicLevel: 7.5
        };

        // 숫자가 아닌 값이 들어왔을 때, 타입 강제 오류를 던지는지 확인
        await expect(diagnoseScore(invalidTypeInput)).rejects.toThrow(/Invalid data type for score/); 
    });

    // Test Case 4: 경계 조건 테스트 (Boundary Condition) - 극단적인 값 입력 검증
    it('should handle boundary values (e.g., zero or max scores)', async () => {
        const boundaryInput: DiagnosisInput = {
            readingExperience: 'Beginner', // 최저 레벨로 가정
            rhythmSkillScore: 0,           // 최소 점수
            vocalTonicLevel: 0             // 최소 값
        };

        const score = await diagnoseScore(boundaryInput);
        
        // 가장 낮은 조합일 때도 시스템이 무한 루프나 에러 없이 예측 가능한 기본 점수를 반환하는지 검증
        expect(score.overallGrade).toBe('D'); 
    });
});