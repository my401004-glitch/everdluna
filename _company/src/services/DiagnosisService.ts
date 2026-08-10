/**
 * src/services/diagnosisService.ts
 * @description AI 보컬 진단 결과를 기반으로 사용자 성장 포인트를 계산하고,
 *              시스템의 핵심 로직을 담당합니다. (진단 점수 계산)
 */

import { DiagnosisResultDto, UserContextDto } from '../types';

/**
 * @typedef {Object} PerformanceMetrics
 * @property {number} growthScore - 성장의 정도를 나타내는 지표 (0-100)
 * @property {number} engagementScore - 참여도 및 활동성을 나타내는 지표 (0-100)
 * @property {number} monetizationScore - 수익화 가능성/잠재력을 나타내는 지표 (0-100)
 */

/**
 * 진단 결과 DTO를 기반으로 최종 성장 점수(Diagnosis Score)와 세부 KPI를 계산합니다.
 * 
 * 이 로직은 시스템의 핵심 병목 지점일 수 있으므로, 모든 입력값에 대한 유효성 검증이 필수적입니다.
 * 
 * @param {DiagnosisResultDto} diagnosisResult - DB에서 조회된 진단 결과 DTO.
 * @param {UserContextDto} userContext - 현재 사용자 컨텍스트 정보 (예: 구독 레벨).
 * @returns {{diagnosisScore: number, kpis: PerformanceMetrics}} 최종 계산된 점수 객체.
 * @throws {Error} 필수 데이터가 누락되었거나 유효성 검증에 실패했을 경우 에러 발생.
 */
export const calculateDiagnosisScore = (
    diagnosisResult: DiagnosisResultDto, 
    userContext: UserContextDto
): { diagnosisScore: number, kpis: PerformanceMetrics } => {
    // [Edge Case Check 1] 필수 진단 결과 누락 검증
    if (!diagnosisResult || !diagnosisResult.resultData) {
        throw new Error("DiagnosisResult DTO가 유효하지 않거나 resultData가 없습니다.");
    }

    const rawKpis = diagnosisResult.resultData;

    // [Edge Case Check 2] 필수 KPI 필드 누락 검증 (Growth, Engagement, Monetization)
    if (!rawKpis.growth || !rawKpis.engagement || !rawKpis.monetization) {
        throw new Error("진단 결과에 필수 KPI(Growth, Engagement, Monetization)가 모두 포함되어야 합니다.");
    }

    // 1. 데이터 타입 및 범위 검증 (Input Validation)
    const growth = Number(rawKpis.growth);
    const engagement = Number(rawKpis.engagement);
    const monetization = Number(rawKpis.monetization);

    if (isNaN(growth) || isNaN(engagement) || isNaN(monetization)) {
        throw new Error("KPI 값은 반드시 숫자로 변환 가능해야 합니다.");
    }

    // [Edge Case Check 3] KPI 범위 검증: 값이 예상 범위를 벗어나는 경우 처리 (예: -100 ~ 100)
    const validateKpi = (score: number, name: string): void => {
        if (score < -100 || score > 100) {
            throw new Error(`[${name}] 점수는 허용 범위(-100~100)를 벗어났습니다. 현재 값: ${score}`);
        }
    };

    validateKpi(growth, "Growth");
    validateKpi(engagement, "Engagement");
    validateKpi(monetization, "Monetization");


    // 2. 권한 기반 접근 제어 (RBAC) 로직 통합 검증
    const hasAccessToAllKpis = userContext.subscriptionLevel === 'Premium'; // Premium만 모든 KPI 조회 가능 가정

    if (!hasAccessToAllKpis && rawKpis.monetization > 0) {
        // 무료 사용자가 특정 유료 지표에 접근하려고 시도하는 경우 (비즈니스 로직)
        throw new Error("현재 구독 레벨에서는 'Monetization' 점수를 확인할 수 없습니다. Premium으로 업그레이드하세요.");
    }

    // 3. 최종 진단 점수 산출 (가중치 부여 예시)
    // 가중치는 비즈니스 의사결정 로그를 따름: Growth(40%) + Engagement(40%) + Monetization(20%)
    const diagnosisScore = Math.round((growth * 0.4 + engagement * 0.4 + monetization * 0.2) / 10); // 소수점 처리를 위해 10으로 나눈 후 반올림

    const kpis: PerformanceMetrics = {
        growthScore: growth,
        engagementScore: engagement,
        monetizationScore: monetization,
    };

    return {
        diagnosisScore: Math.max(0, Math.min(100, diagnosisScore)), // 점수는 0~100 사이로 클램핑
        kpis: kpis,
    };
}

// Mock DTO 및 Context 정의 (실제 환경에서는 별도 파일로 분리 필요)
export type DiagnosisResultDto = {
    resultData: {
        growth: number | string; // 숫자 또는 문자열 형태의 값 예상
        engagement: number | string;
        monetization: number | string;
    };
}

export type UserContextDto = {
    userId: string;
    subscriptionLevel: 'Free' | 'Basic' | 'Premium';
}