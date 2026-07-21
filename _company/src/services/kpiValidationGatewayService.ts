// src/services/kpiValidationGatewayService.ts
import { DiagnosisResultSchema } from '../types/schema'; // 가정: 진단 결과 스키마가 정의된 곳
import { validateKpiData, KpiValidationError } from './kpiValidator'; // 가정: KPI 검증 모듈

/**
 * @description 모든 진단 데이터는 반드시 이 게이트웨이를 통과해야 합니다. 
 * 사용자에게 노출되는 어떤 결과도 원시(Raw) 데이터를 사용해서는 안 됩니다.
 * 이 서비스는 데이터 무결성, 권한, 범위 검증을 보장합니다.
 * @param rawResult - 클라이언트로부터 받은 원시 진단 결과 객체.
 * @returns 유효성이 검증된 구조화된 DiagnosisScore 또는 실패 오류.
 */
export async function validateDiagnosisWorkflow(rawResult: Omit<DiagnosisResultSchema, 'kpi_metrics'>): Promise<{ score: number; kpis: any[] }> {
    try {
        // 1. 기본 스키마 유효성 검사 (가장 먼저 실패 가능성이 높은 부분을 가드)
        if (!rawResult || typeof rawResult.diagnosis_type !== 'string') {
            throw new Error("Invalid input: Diagnosis type is required.");
        }

        // 2. KPI 데이터 통합 검증 실행
        const validatedKpis = await validateKpiData(rawResult); // 이 함수가 kpi_validator 로직을 포함한다고 가정합니다.
        
        if (!validatedKpis) {
            throw new Error("KPI Validation Failed: Data does not meet minimum growth/engagement criteria.");
        }

        // 3. 최종 점수 계산 (필요하다면 추가 로직)
        const finalScore = calculateCompositeScore(rawResult, validatedKpis); // 가상의 복합 점수 계산 함수
        
        return { score: finalScore, kpis: validatedKpis };

    } catch (error) {
        console.error("KPI Validation Gateway Error:", error);
        // 에러를 사용자 친화적이고 기술적으로 유용한 형태로 재포장하여 던집니다.
        throw new KpiValidationError(`진단 프로세스 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
}

/** 
 * @description 복합 점수 계산 (예시)
 * 실제 비즈니스 로직에 따라 구현되어야 합니다.
 */
function calculateCompositeScore(rawResult: any, kpis: any[]): number {
    // Growth KPI가 가장 중요하다고 가정하고 가중치를 부여합니다.
    const growthWeight = 0.6; 
    const engagementWeight = 0.3;
    let score = (kpis[0]?.growth || 0) * growthWeight + (kpis[1]?.engagement || 0) * engagementWeight;
    return Math.min(10, Math.max(0, score)); // 점수를 0~10 사이로 제한
}

export type KpiValidationError = Error & { name: 'KpiValidationError' };
// [필요한 타입 정의는 별도로 관리되어야 함]