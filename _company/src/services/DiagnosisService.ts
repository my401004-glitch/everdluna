import { DiagnosisInput, GapScoreResult } from "../types"; // 가상의 타입 정의 파일 가정
import { UserContext } from "../../models/UserContext";

/**
 * @description 사용자의 진단 데이터(경험, 지식)를 기반으로 핵심 KPI와 Gap Score를 계산합니다.
 * 이 서비스는 시스템의 가장 중요한 비즈니스 로직을 담고 있습니다.
 * [근거: 2026-05-18T14-39/developer.md (API 연동 로직 구현)]
 * @param input - 사용자의 진단 요청 데이터와 컨텍스트를 포함합니다.
 * @returns 계산된 Gap Score 및 결과를 담은 객체입니다.
 */
export class DiagnosisService {

    /**
     * 핵심 KPI(Growth, Engagement, Monetization)와 목표 대비 격차 점수를 산출하는 메서드.
     * 이 로직은 외부 데이터 소스나 복잡한 알고리즘에 의존할 수 있습니다.
     * @param input - 사용자 입력 및 컨텍스트 정보 (예: quiz_results).
     * @returns GapScoreResult 객체.
     */
    public static async calculateGapScore(input: DiagnosisInput): Promise<GapScoreResult> {
        console.log("--- [DiagnosisService] 핵심 KPI 계산 시작 ---");

        // 1. 입력 데이터 유효성 검사 (가드)
        if (!input || !input.quiz_results || input.quiz_results.length === 0) {
            throw new Error("진단에 필요한 quiz 결과 데이터가 누락되었습니다.");
        }

        // 2. Growth Score 계산 로직 (예: 학습량 기반)
        const growthScore = await this.calculateGrowth(input.quiz_results); // 실제 API 호출 또는 복잡한 계산 가정

        // 3. Engagement Score 계산 로직 (예: 참여 빈도 및 깊이 기반)
        const engagementScore = input.userContext?.last_interaction_depth || 0;

        // 4. Monetization Potential 계산 로직 (예: 특정 모듈 관심도 기반)
        let monetizationPotential = this.calculateMonetization(input.quiz_results);

        // 5. 최종 Gap Score 및 결과 구조화
        const gapScore = Math.max(0, 100 - growthScore * 0.2); // 예시 공식: 성장 점수가 높을수록 격차는 줄어듦

        const result: GapScoreResult = {
            gap_score: parseFloat(gapScore.toFixed(2)),
            growth_kpi: Math.min(100, growthScore),
            engagement_kpi: Math.min(100, engagementScore * 10), // 가중치 적용 예시
            monetization_kpi: parseFloat(monetizationPotential.toFixed(2)),
            summary_message: `현재 격차 점수는 ${gapScore}점입니다. 목표 달성을 위해 다음 모듈을 추천합니다.`
        };

        console.log("--- [DiagnosisService] KPI 계산 완료 ---");
        return result;
    }

    // **************************************************
    // Private Helper Methods (실제 복잡한 로직이 들어갈 곳)
    // **************************************************

    private static async calculateGrowth(results: any[]): Promise<number> {
        // [WHY] 이 부분은 실제 교육 과정 데이터와 연동되어야 합니다.
        // 예시로 간단히 평균 점수의 제곱근을 사용합니다.
        const average = results.reduce((sum, result) => sum + (result.score || 0), 0) / results.length;
        return Math.sqrt(average * 10);
    }

    private static calculateMonetization(results: any[]): number {
        // [WHY] 특정 키워드 노출 빈도나 '유료' 관련 질문에 대한 응답 강도를 분석합니다.
        let score = 0;
        for (const result of results) {
            if (result.topic === 'Premium Feature') {
                score += 15; // 가중치 부여
            } else if (result.confidence > 0.8) {
                score += 5;
            }
        }
        return score;
    }
}

export * from "./types";