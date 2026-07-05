// src/services/DiagnosisService.ts
import { DiagnosisResult, UserContext } from '../types/diagnosis-types';

/**
 * @description 핵심 비즈니스 로직: 입력 데이터와 KPI 지표를 기반으로 최종 진단 점수 및 리포트 구조를 산출합니다.
 * 이 서비스는 Pure Function에 가깝게 설계되어야 합니다. (외부 DB 접근은 Mocking하거나 Repository 패턴을 통해 분리)
 */
export class DiagnosisService {

    /**
     * @description 주어진 사용자 컨텍스트와 로그 데이터를 기반으로 진단 결과를 계산합니다.
     * @param context - 사용자 기본 정보 및 유료화 상태 등 Context 데이터.
     * @param sessionLogs - 사용자의 세션별 활동 기록 (Pitch, Frequency Stability 등의 Raw Data).
     * @returns 최종 진단 결과 객체 (DiagnosisResult)
     * @throws {Error} 필수 입력 값이 누락되었거나 비즈니스 규칙을 위반할 경우 예외를 발생시킵니다.
     */
    public static calculateScore(context: UserContext, sessionLogs: any[]): DiagnosisResult {
        // 1. Input Validation (가드 클로즈) - 가장 먼저 깨질 수 있는 지점을 막습니다.
        if (!context || !sessionLogs || sessionLogs.length === 0) {
            throw new Error("진단 계산을 위한 필수 Context 및 세션 로그 데이터가 누락되었습니다.");
        }

        // 2. KPI 연산 로직 (핵심 비즈니스 가치):
        // 실제 환경에서는 이 부분에서 DB를 조회하여 Growth, Engagement, Monetization 등의 원시 데이터를 가져와야 합니다.
        const kpiScores = this.calculateKpis(sessionLogs);

        // 3. 진단 점수 조합 및 구조화:
        let totalScore = (kpiScores.growth * 0.4) + (kpiScores.engagement * 0.4) + (kpiScores.monetization * 0.2); // 가중치 적용 예시

        // 4. 결과 객체 생성 및 반환
        const result: DiagnosisResult = {
            contextId: context.id,
            diagnosisType: "AI_VOCAL_ANALYSIS", // 현재 진단 타입 고정
            totalScore: Math.min(100, Math.max(0, totalScore)), // 0~100 사이로 클램프 처리
            kpiMetrics: {
                growth: kpiScores.growth,
                engagement: kpiScores.engagement,
                monetization: kpiScores.monetization,
            },
            // ... 기타 리포트 데이터 필드 채우기
        };

        return result;
    }


    /**
     * @description 세션 로그를 분석하여 Growth, Engagement, Monetization KPI 점수를 산출하는 내부 함수입니다.
     * 이 로직은 비즈니스 규칙에 따라 끊임없이 검증되어야 합니다.
     */
    private static calculateKpis(logs: any[]): { growth: number; engagement: number; monetization: number } {
        // Mock Implementation for now, 실제로는 복잡한 통계 분석이 들어갑니다.
        let totalDuration = logs.reduce((sum, log) => sum + (log['duration'] || 0), 0);

        // Growth Score: 시간 누적에 비례 (데이터가 많을수록 성장한다고 가정)
        const growthScore = Math.min(100, totalDuration * 2);

        // Engagement Score: 세션 횟수/다양성에 비례
        const engagementScore = logs.length > 5 ? 85 : Math.floor(logs.length * 15); // 예시 로직

        // Monetization Score: 프리미엄 기능 사용 여부에 따라 결정 (가장 가치 있는 지표)
        let premiumUsageCount = logs.filter(log => log['feature'] === 'PremiumPitch').length;
        const monetizationScore = Math.min(100, premiumUsageCount * 15);

        return {
            growth: growthScore,
            engagement: engagementScore,
            monetization: monetizationScore
        };
    }
}