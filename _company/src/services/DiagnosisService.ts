/**
 * DiagnosisService: 진단 점수 계산 및 비즈니스 트리거 검증 로직 처리 (Core Business Logic)
 * @description 외부 API 요청으로부터 분리되어 핵심 도메인 규칙을 담당한다.
 */

import { UserContext } from '../types/UserContext';
import { DiagnosticResultInput } from '../types/DiagnosticResultTypes';

/**
 * 진단 점수를 계산하고, 사용자에게 제공할 추가 코칭 및 유료화 트리거를 산출합니다.
 * @param input - 사용자의 세션 데이터와 테스트 결과를 포함하는 입력 객체입니다.
 * @returns {object} 최종진단결과 (DiagnosisResult)
 */
export class DiagnosisService {

    /**
     * 핵심 진단 로직을 수행하고 Gap Score 및 Monetization Triggers를 계산합니다.
     * @param input - DiagnosticResultInput의 구조를 따르는 입력 데이터.
     * @returns Promise<any> 최종진단결과 객체.
     */
    public static calculateDiagnosis(input: DiagnosticResultInput): any {
        console.log(`[Service] DiagnosisService 호출됨. Context ID: ${input.contextId}`);

        // 1. 핵심 진단 점수 (Gap Score) 산출 로직 - [근거: sessions/2026-05-18T14-34/developer.md, Gap Score 개념]
        // 실제로는 복잡한 통계 모델이 들어가야 하지만, 현재는 가상의 계산을 수행합니다.
        const rawScore = Math.random() * 10 + (input.sessionData?.pitchAccuracy || 5); // 임시 점수 산출
        const gapScore = parseFloat(Math.min(10, rawScore).toFixed(2));

        // 2. 유료화 트리거 검증 로직 - [근거: sessions/2026-05-18T13:43/developer.md (RBAC), KPI_Metrics]
        // 진단 결과가 '중간' 이하이거나, 특정 KPI(예: Growth)가 낮을 경우 유료 기능 노출 트리거 발생 가정.
        const monetizationTriggers = this.checkMonetizationTriggers(input);

        // 3. 최종 결과 구조화 및 반환 (Schema adherence enforcement)
        return {
            diagnosisId: `D-${Date.now()}`,
            contextId: input.contextId,
            timestamp: new Date().toISOString(),
            scoreDetails: {
                gapScore: gapScore, // 핵심 지표 1
                pitchAccuracy: input.sessionData?.pitchAccuracy || null,
                frequencyStability: input.sessionData?.frequencyStability || null,
            },
            diagnosisType: 'Intermediate', // 실제 로직에서 결정되어야 함
            summaryReport: `당신의 Gap Score는 ${gapScore}로 측정되었습니다. 주력 개선점은 [음정 안정성]입니다.`,
            // 비즈니스 핵심 필드 2
            monetizationTriggers: monetizationTriggers,
        };
    }

    /**
     * 사용자의 진단 결과와 Context를 기반으로 유료 기능 노출 여부를 판단합니다.
     * @param input - 입력 데이터 객체.
     * @returns {object} 활성화된 트리거 목록 및 권장 액션.
     */
    private static checkMonetizationTriggers(input: DiagnosticResultInput): { isPremiumRequired: boolean, recommendedActions: string[] } {
        const triggers: { isPremiumRequired: boolean, recommendedActions: string[] } = {
            isPremiumRequired: false,
            recommendedActions: [],
        };

        // Rule 1: Gap Score가 매우 낮을 경우 (즉, 개선이 절실한 상태)
        if (input.sessionData?.pitchAccuracy && input.sessionData.pitchAccuracy < 5) {
            triggers.isPremiumRequired = true;
            triggers.recommendedActions.push("프리미엄 '커스텀 연습 세션'을 이용해 즉각적인 피드백을 받으세요.");
        }

        // Rule 2: Context가 특정 레벨(예: 심화 과정)에 도달했으나, 기록된 KPI가 부족한 경우 (Engagement 저하 감지)
        if (input.contextId && input.contextId.includes('ADVANCE') && !input.sessionData?.isTrackedKPI) {
             triggers.recommendedActions.push("전체 과정을 추적하는 '진도 관리 리포트'를 구독하여 학습 누수를 막으세요.");
        }

        return triggers;
    }
}