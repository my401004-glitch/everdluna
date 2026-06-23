// src/core/diagnostics/gapScoreService.ts
import { DiagnosisInputData, GapScoreResult } from './gapScoreTypes';

/**
 * @description 주어진 사용자 데이터로부터 실시간 진단 점수와 변화 추이(Context)를 계산합니다.
 * 이 서비스는 비즈니스 로직의 핵심이며, 모든 예외 및 경계 조건을 처리해야 합니다.
 * 
 * @param userData - 진단을 수행하는 사용자의 기본 정보 (예: 사용자 타입, 구독 레벨 등).
 * @param diagnosisData - 분석할 기간 동안 수집된 KPI 데이터 (Growth, Engagement, Monetization).
 * @returns 계산된 Gap Score 결과 객체.
 */
export const getDiagnosisScore = async (userData: { role: 'free' | 'premium'; subscriptionLevel: 'none' | 'basic' | 'pro' }, diagnosisData: DiagnosisInputData): Promise<GapScoreResult> => {
    // 1. 입력 유효성 검증 (Guard Clauses)
    if (!diagnosisData || Object.keys(diagnosisData).length === 0) {
        throw new Error("Diagnosis data cannot be empty.");
    }

    let score = 0;
    const result: GapScoreResult = {
        score: 0,
        status: 'Stable', // Default status
        details: { growth: 0, engagement: 0, monetization: 0 },
        contextMessage: "데이터 분석을 위한 충분한 데이터가 수집되었습니다.",
        isCritical: false,
    };

    // 2. 권한 기반 접근 제어 (RBAC) 로직 구현
    const canAccessDiagnosis = checkUserRole(userData);
    if (!canAccessDiagnosis) {
        result.status = 'Restricted';
        result.contextMessage = `현재 계정 (${userData.role})으로는 진단 분석에 필요한 데이터에 접근할 수 없습니다.`;
        return result;
    }

    // 3. KPI 기반 점수 계산 로직 (가상의 복잡한 비즈니스 규칙)
    try {
        const growthScore = calculateMetric(diagnosisData, 'growth');
        const engagementScore = calculateMetric(diagnosisData, 'engagement');
        const monetizationScore = calculateMetric(diagnosisData, 'monetization');

        // 가중치 적용 및 종합 점수 산출 (Example: Growth가 가장 중요하다고 가정)
        score = Math.round((growthScore * 0.5 + engagementScore * 0.3 + monetizationScore * 0.2));

        result.details.growth = growthScore;
        result.details.engagement = engagementScore;
        result.details.monetization = monetizationScore;
        result.score = score;
        
        // 4. 상태 판별 및 메시지 생성 (Critical/Potential/Stable)
        const statusMap = determineStatus(score, growthScore);
        result.status = statusMap.status;
        result.contextMessage = statusMap.message;

        if (statusMap.isCritical) {
            result.isCritical = true;
        }
    } catch (error) {
        // 런타임 오류 처리: 데이터 포맷 불일치 등
        console.error("Error during score calculation:", error);
        result.status = 'Failed';
        result.contextMessage = "데이터 계산 중 기술적 오류가 발생했습니다. 관리자에게 문의하세요.";
    }

    return result;
};

/**
 * @description 사용자의 역할과 구독 레벨을 기반으로 데이터 접근 권한을 확인합니다. [근거: sessions/2026-05-18T13:43]
 */
const checkUserRole = (userData: { role: 'free' | 'premium'; subscriptionLevel: 'none' | 'basic' | 'pro' }): boolean => {
    // 예시 로직: 무료 사용자는 특정 진단 유형에 접근 불가
    if (userData.role === 'free' && userData.subscriptionLevel !== 'none') {
        return false; // 가상의 권한 제한 시나리오
    }
    return true;
};

/**
 * @description 단일 KPI 메트릭을 계산합니다. (실제로는 복잡한 통계 모델이 들어갑니다.)
 */
const calculateMetric = (data: DiagnosisInputData, type: 'growth' | 'engagement' | 'monetization'): number => {
    // 실제 구현에서는 데이터의 추세(Trend)와 변화율을 분석합니다. 
    // 여기서는 간단히 합산된 평균값을 사용한다고 가정합니다.
    const metricValues = data[type];
    if (!metricValues || typeof metricValues !== 'number') return 0;

    return Math.round(metricValues); // 임시 반환 값
};


/**
 * @description 종합 점수와 주요 KPI를 바탕으로 시각화 상태 (Critical/Potential)를 결정합니다.
 */
const determineStatus = (score: number, growthScore: number): { status: 'Critical' | 'Potential' | 'Stable'; message: string; isCritical: boolean } => {
    if (score < 30 && growthScore < 5) {
        return { status: 'Critical', message: "⚠️ 경고: 성장이 정체되고 있습니다. 주요 학습 영역의 재점검이 필요합니다.", isCritical: true };
    } else if (score >= 30 && score <= 60) {
        return { status: 'Potential', message: "📈 잠재력 발견: 특정 분야에 강점이 보입니다. 이 부분을 강화해 보세요.", isCritical: false };
    } else {
        return { status: 'Stable', message: "✅ 안정적 성장 추세가 유지되고 있습니다. 현재의 학습 루틴을 지속하는 것이 좋습니다.", isCritical: false };
    }
};