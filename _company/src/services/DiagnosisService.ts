/**
 * @fileoverview 진단 점수 계산 및 분석을 담당하는 핵심 비즈니스 로직 (Diagnosis Service Layer).
 * 이 서비스는 외부 API 호출의 '백본'이 되며, 모든 기술적 안정성 검증이 여기서 일어납니다.
 */

import { DiagnosisRequest, DiagnosisResult, UserRole } from '../types/diagnosis';

// 가상의 데이터베이스 연결 및 KPI 계산 함수 (실제 구현 필요)
const fetchDiagnosisDataFromDB = async (userId: string, diagnosisType: string): Promise<any> => {
    console.log(`[DB]: ${diagnosisType} 관련 데이터를 사용자 ${userId}의 권한으로 조회합니다.`);
    // TODO: 실제 DB 쿼리 로직 구현 (SQL/ORM 사용)
    return { /* ... db data ... */ };
};

/**
 * 핵심 진단 분석 서비스 엔드포인트.
 * 모든 비즈니스 로직과 데이터 유효성 검증을 담당합니다.
 * @param request - 클라이언트로부터 받은 진단 요청 객체.
 * @returns DiagnosisResult 타입의 Promise.
 */
export const calculateDiagnosisScore = async (request: DiagnosisRequest): Promise<DiagnosisResult> => {
    const { userId, role, diagnosisType: requestedType, testResultSnapshot } = request;

    // 1. [핵심 검증] 권한 기반 접근 제어 (RBAC Check) - 가장 먼저 실패할 수 있는 지점
    if (!checkUserAccess(role, requestedType)) {
        return {
            success: false,
            message: `권한 오류: 사용자님의 레벨(${role})에서는 '${requestedType}' 리포트를 볼 수 없습니다.`,
            data: null
        };
    }

    try {
        // 2. [데이터 파이프라인] 필수 데이터 유효성 검증 (Schema Validation)
        if (!testResultSnapshot || !testResultSnapshot.score) {
             return {
                success: false,
                message: "필수 진단 테스트 점수가 누락되었습니다. 다시 시도해주세요.",
                data: null
            };
        }

        // 3. [비즈니스 로직] 데이터 수집 및 분석 (KPI Calculation)
        const kpiData = await Promise.all([
             fetchDiagnosisDataFromDB(userId, 'Growth'),
             fetchDiagnosisDataFromDB(userId, 'Engagement'),
             fetchDiagnosisDataFromDB(userId, 'Monetization')
             // 필요한 모든 KPI를 병렬로 가져와야 합니다.
        ]);

        const finalResult: DiagnosisResult = {
            success: true,
            message: "성공적으로 진단 점수를 계산했습니다.",
            data: {
                overallScore: testResultSnapshot.score * 0.9 + (Math.random() * 10), // 간단한 통합 로직 시뮬레이션
                overallDiagnosisType: 'Overall',
                kpis: {
                    'Growth': { score: testResultSnapshot.keyIndicators['Growth'] || 0, potentialGapScore: Math.max(5, (testResultSnapshot.keyIndicators['Growth'] || 0) * 0.8), recommendation: ["구체적인 개념 복습 루틴 확립"] },
                    'Engagement': { score: testResultSnapshot.keyIndicators['Engagement'] || 0, potentialGapScore: Math.max(5, (testResultSnapshot.keyIndicators['Engagement'] || 0) * 0.9), recommendation: ["학원 내 커뮤니티 활동 참여"] },
                    'Monetization': { score: testResultSnapshot.keyIndicators['Monetization'] || 0, potentialGapScore: Math.max(5, (testResultSnapshot.keyIndicators['Monetization'] || 0) * 0.7), recommendation: ["추가 학습 자료에 대한 접근 권한 확보"] }
                },
                technicalMetadata: {
                    sourceApiVersion: 'v1',
                    processedTimestamp: new Date().toISOString(),
                    accessGrantedByRBAC: true // RBAC 검증이 통과했으므로 true
                }
            }
        };

        return finalResult;

    } catch (error) {
        console.error("진단 점수 계산 중 치명적 오류 발생:", error);
        // 4. [에러 처리] 예측 불가능한 시스템 에러는 구체적인 메시지를 반환하여 프론트엔드에서 대응하게 합니다.
         return {
            success: false,
            message: "서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요.",
            data: null
        };
    }
};

/**
 * 사용자의 권한 레벨과 요청 진단 타입 간의 접근 가능 여부를 검증하는 로직 (RBAC).
 * @param role - 사용자의 현재 Role.
 * @param requestedType - 요청된 Diagnosis Type.
 */
const checkUserAccess = (role: UserRole, requestedType: string): boolean => {
    // 예시 정책: FreeUser는 Growth 리포트만 접근 가능하다고 가정
    if (role === UserRole.FreeUser && requestedType !== 'Growth') {
        return false; // RBAC 실패
    }
    return true; // 접근 허용
};

export { calculateDiagnosisScore };