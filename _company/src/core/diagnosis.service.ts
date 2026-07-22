// src/core/diagnosis.service.ts
import { DiagnosisInput } from "./diagnosis.interface";
import { GapScoreResult } from "../types/score.interface"; // Assume this exists or will be created later

/**
 * @description 진단 점수를 계산하고 비즈니스 로직을 수행하는 핵심 서비스 레이어.
 * 컨트롤러가 호출할 순수(Pure)한 로직만 포함한다.
 */
export class DiagnosisService {
    // 이 메서드는 실제로는 복잡한 KPI 계산 및 데이터베이스 조회가 필요하다.
    public async calculateScore(input: DiagnosisInput): Promise<GapScoreResult> {
        console.log(`[DiagnosisService] Calculating score for context ID: ${input.contextId}`);

        if (!input.userContext || !input.testData) {
            throw new Error("Validation Error: User context and test data are required.");
        }

        // TODO: 실제 로직 구현 (DB 조회, KPI 계산 등)
        // 현재는 더미 데이터를 반환하며, 이 부분을 Gap Score Logic으로 채워야 함.
        const mockResult = {
            scoreLevel: "Medium", // High/Medium/Low
            gapScoreDepth: Math.floor(Math.random() * 50) + 30, // 30~80점 사이 랜덤 값
            kpis: {
                growth: Math.floor(Math.random() * 10) + 70, // 예시 KPI
                engagement: Math.floor(Math.random() * 10) + 65,
                monetization: Math.floor(Math.random() * 10) + 60,
            }
        };

        console.log("[DiagnosisService] Score calculation complete.");
        return mockResult;
    }

    /**
     * @description 진단 결과에 따른 후속 조치 (예: 추천 콘텐츠 매핑)를 수행한다.
     */
    public async generateReportSummary(scoreResult: GapScoreResult): Promise<string> {
        if (scoreResult.gapScoreDepth > 70) {
            return "🔥 고성장 잠재력 발견! 이 사용자에게는 [고급 기술 분석] 콘텐츠를 추천합니다.";
        } else if (scoreResult.gapScoreDepth < 40) {
            return "💡 기본기 다지기가 필요합니다. [초보자 가이드]로 학습 효율성을 높여 보세요.";
        }
        return "✅ 균형 잡힌 성장 패턴입니다. 꾸준한 실습을 통해 다음 레벨로 도약하세요.";
    }
}

// 서비스 인스턴스를 외부에 노출하여 의존성 주입(DI)에 용이하게 만듭니다.
export const diagnosisService = new DiagnosisService();