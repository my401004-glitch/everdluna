/**
 * src/services/diagnosisService.ts
 * 핵심 진단 로직(KPI 계산)을 담당하는 서비스 레이어입니다.
 * 비즈니스 규칙과 복잡한 계산이 이곳에 위치해야 합니다.
 */

import { RawPerformanceData, DiagnosisScore, DiagnosisResult } from '../types/diagnosis';

/**
 * @description Raw 데이터를 받아 3가지 핵심 KPI 점수를 산출합니다.
 * @param rawData 진단에 필요한 원시 사용자 데이터
 * @returns 계산된 진단 점수 객체
 * [근거: sessions/2026-05-18T14-34/developer.md] (Growth, Engagement, Monetization KPI를 분리 설계)
 */
export const calculateDiagnosisScore = (rawData: RawPerformanceData): DiagnosisScore => {
    // ------------------------------------------
    // ⚠️ 중요 경고: 이 로직은 비즈니스 가설을 기반으로 합니다.
    // 실제 구현 시에는 통계 모델(ML/AI) 또는 정밀한 수작업 계산이 필요합니다.
    // 여기서는 예시적인 '가중치'와 'Threshold Check'로 대체합니다.
    // ------------------------------------------

    let growthScore: number = 0;
    let engagementScore: number = 0;
    let monetizationScore: number = 0;

    // --- 1. Growth Score 계산 (기술적/객관적 발전) ---
    // 음정 편차(Pitch Deviation)가 낮을수록 점수가 높다고 가정합니다.
    const deviationPenaltyFactor = Math.max(0, 1 - rawData.averagePitchDeviationHz / 10); // 예시 가중치
    growthScore = Math.min(100, Math.round(60 * deviationPenaltyFactor + 20));

    // --- 2. Engagement Score 계산 (노력/지속성) ---
    // 세션 시간이 길고, 프리미엄 사용자일수록 점수가 높다고 가정합니다.
    let engagementBase = rawData.sessionDurationMinutes * 5; // 기본 가중치
    if (rawData.userRole === 'premium') {
        engagementBase += 20; // 추가 보너스 점수
    }
    engagementScore = Math.min(100, Math.round(engagementBase));

    // --- 3. Monetization Score 계산 (시장 가치/잠재력) ---
    // 진단 유형과 역할에 따라 점수를 부여합니다. (가설적 로직)
    if (rawData.diagnosisType === 'monetization' && rawData.userRole === 'premium') {
        monetizationScore = 85; // 최상의 조건이라고 가정하고 높은 값 부여
    } else if (rawData.diagnosisType === 'growth') {
        monetizationScore = Math.min(70, Math.round(growthScore * 0.8)); // 성장 점수의 일부를 반영
    } else {
        monetizationScore = Math.max(20, Math.min(60, rawData.averagePitchDeviationHz / 5 + 30));
    }

    // --- 4. 최종 종합 및 피드백 생성 ---
    const totalScore = (growthScore * 0.4) + (engagementScore * 0.3) + (monetizationScore * 0.3); // 가중치 적용
    const overallScore = Math.round(Math.min(100, Math.max(0, totalScore)));

    let feedbackSummary: string;
    if (overallScore < 40) {
        feedbackSummary = "🚨 경고: 현재는 '노력'만 하고 있을 뿐입니다. 객관적인 진단 수치 분석이 필요합니다.";
    } else if (overallScore >= 85) {
        feedbackSummary = "✅ 우수: 목표 지점에 근접했습니다. 다음 단계로의 발전 방향을 설계하세요.";
    } else {
        feedbackSummary = `💡 잠재력 확인: ${Math.round(growthScore)}점(${rawData.diagnosisType})과 ${Math.round(monetizationScore)}점을 종합하여 로드맵이 필요합니다.`;
    }

    return {
        growthScore,
        engagementScore,
        monetizationScore,
        overallScore,
        feedbackSummary
    };
};


/**
 * @description Diagnosis API의 핵심 엔드포인트 역할을 수행하는 함수입니다.
 * 서비스 사용 전에 필수적인 권한 체크(RBAC)를 수행합니다.
 * @param rawData 사용자 진단 원시 데이터
 * @returns 최종 결과 객체
 * [근거: sessions/2026-05-18T13:43] (권한 기반 접근 제어, RBAC 구현 필요성)
 */
export const runDiagnosisPipeline = async (rawData: RawPerformanceData): Promise<DiagnosisResult> => {
    // 1. [RBAC 체크]: 진단 유형에 대한 접근 권한을 확인합니다.
    if (rawData.userRole === 'free' && rawData.diagnosisType === 'monetization') {
        throw new Error("Access Denied: 무료 사용자는 '수익화 가능성' 분석에 접근할 수 없습니다. 프리미엄 구독이 필요합니다.");
    }

    // 2. [로직 실행]: 실제 점수를 계산합니다.
    const score = calculateDiagnosisScore(rawData);

    // 3. [결과 포장]: DB 저장 및 반환을 위한 최종 결과 구조를 만듭니다.
    return {
        resultData: score,
        contextId: 'mock-user-session-123', // 실제로는 세션 ID가 와야 함
        timestamp: new Date()
    };
};

// 테스트용 Mock 실행 예시 (실제 API 라우팅에서는 필요 없음)
/*
async function testService() {
    try {
        const freeUserRawData: RawPerformanceData = {
            userRole: 'free', 
            sessionDurationMinutes: 15, 
            diagnosisType: 'growth', 
            averagePitchDeviationHz: 6
        };
        const result = await runDiagnosisPipeline(freeUserRawData);
        console.log("--- Free User Diagnosis Result ---");
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("진단 서비스 실행 오류:", error.message);
    }
}
// testService();
*/