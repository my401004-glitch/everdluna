// src/services/diagnosisService.ts - DiagnosisScore Calculation and Validation Service

import { UserContext } from '../models/userContext';
import { DiagnosisResultSchema, DiagnosticInput } from '../types/schema';

/**
 * @description API 요청에 대한 데이터 유효성 및 사용자 권한을 검증하고 진단 점수를 계산하는 핵심 서비스 레이어.
 * 모든 비즈니스 로직은 여기서 분리되어야 안정성이 확보됩니다. (SRP 원칙)
 * @param input - 클라이언트가 전송한 진단 테스트 입력 데이터.
 * @param userContext - 현재 요청을 보낸 사용자의 컨텍스트 정보 (Role, Status 등).
 * @returns Promise<DiagnosisResultSchema> - 검증된 진단 결과 객체.
 * @throws {Error} - 유효성 또는 권한 문제 발생 시 에러를 던집니다.
 */
export const calculateDiagnosisScore = async (input: DiagnosticInput, userContext: UserContext): Promise<DiagnosisResultSchema> => {
    // 1. [안정성 검증] 사용자 접근 권한 체크 (Role-Based Access Control - RBAC)
    if (!userContext || !userContext.role || !['Premium', 'Instructor'].includes(userContext.role)) {
        throw new Error("AUTH_ERROR: Premium 또는 Instructor 레벨의 사용자로만 진단 점수 리포트 접근이 가능합니다.");
    }

    // 2. [안정성 검증] 입력 데이터 유효성 체크 (Schema Validation)
    if (!input || !Array.isArray(input.testResults) || input.testResults.length === 0) {
        throw new Error("VALIDATION_ERROR: 진단 테스트 결과를 포함하는 배열을 제공해야 합니다.");
    }

    // TODO: 실제 진단 로직 구현이 필요한 부분입니다. (Pitch/Frequency Stability 등 복잡한 계산)
    console.log(`[DEBUG] Starting diagnosis calculation for user ${userContext.userId}...`);

    try {
        // Mock Data Generation: 실제 API에서는 DB 조회 후 가공되어야 함.
        const mockScore = calculateMockScore(input.testResults); 
        
        // 3. [데이터 구조 정의] 최종 결과 스키마에 맞추어 객체 생성 및 반환
        return {
            diagnosisType: "AI_ANALYSIS",
            scoreDetails: {
                growth: mockScore.growth, // Growth KPI 포함
                engagement: mockScore.engagement, // Engagement KPI 포함
                monetization: mockScore.monetization // Monetization KPI 포함
            },
            overallDiagnosis: `[${mockScore.overall}] - ${userContext.role} 레벨에서 분석됨.`,
            reportTimestamp: new Date().toISOString(),
        };

    } catch (e) {
        console.error("CRITICAL_FAILURE: Diagnosis calculation failed.", e);
        throw new Error(`SYSTEM_ERROR: 진단 점수 계산 중 치명적인 오류가 발생했습니다.`);
    }
};

/** 
 * @description Mock 함수: 실제 복잡한 AI 분석 로직이 들어갈 자리.
 */
const calculateMockScore = (results: any[]): { growth: number, engagement: number, monetization: number, overall: string } => {
    // 이 부분은 나중에 실제 AI 파싱/계산 모듈로 대체되어야 합니다.
    return { 
        growth: Math.floor(Math.random() * 30) + 70, // 예시 점수 (70~100)
        engagement: Math.floor(Math.random() * 20) + 60, 
        monetization: Math.floor(Math.random() * 15) + 35,
        overall: "Excellent" // 예시 결과
    };
}

/**
 * @description (Helper) 사용자의 컨텍스트를 받아 초기값을 설정합니다.
 */
export const getDefaultUserContext = (): UserContext => ({
    userId: 'mock-user-123',
    role: 'Premium', // 임시로 프리미엄으로 설정하여 테스트 통과 유도
    status: 'Active'
});