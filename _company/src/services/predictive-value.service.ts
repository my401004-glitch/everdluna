import { DiagnosisResult } from '../models/diagnosis-result.model';
import { UserSubscriptionTier } from '../types/subscription.type';

/**
 * @description 진단 결과를 기반으로 사용자에게 제공할 '예측 가치(Predictive Value)'를 산출합니다.
 * 예측 가치는 사용자가 현재 티어에서 다음 단계로 업그레이드했을 때 얻을 수 있는 잠재적 학습 효과의 경제적/학습적 가치를 반영해야 합니다.
 * @param diagnosisResult - AI 진단 결과 객체 (KPI 포함)
 * @param userTier - 현재 사용자 구독 등급 정보
 * @returns 산출된 예측 가치 금액 (Decimal)
 */
export class PredictiveValueService {

    /**
     * 현빈이 정의한 3가지 모델을 기반으로 예측 가치를 계산합니다.
     * @param diagnosisResult 진단 결과 데이터
     * @param userTier 현재 사용자 구독 등급 ('Free', 'Basic', 'Pro')
     */
    public static calculatePredictiveValue(diagnosisResult: DiagnosisResult, userTier: UserSubscriptionTier): number {
        let baseScore = this.calculateWeightedBaseScore(diagnosisResult);
        let predictedValue = 0;

        // [근거: sessions/2026-06-14] CEO 지시사항 및 현빈 모델 기반
        if (userTier === 'Free') {
            // Free 사용자에게는 가장 낮은 진입 장벽의 가치를 보여주어 Basic으로 유도합니다.
            predictedValue = Math.round(baseScore * 0.5 + 100) / 100; // 예: 최소 ₩100 이상의 가치 부여
        } else if (userTier === 'Basic') {
            // Basic 사용자는 Pro 업그레이드 시의 명확한 차별점을 보여주어 Pro로 유도합니다.
            predictedValue = Math.round(baseScore * 0.8 + 39000) / 100; // 예: 기본가(₩39,000)와 점수 기반 가치 조합
        } else if (userTier === 'Pro') {
            // Pro 사용자는 가장 높은 LTV를 보여주지만, 추가적인 목표 달성을 위한 동기 부여가 필요합니다.
            predictedValue = Math.round(baseScore * 1.2 + 5000) / 100; // 현재 가치에 보너스 붙여 다음 목표 설정 유도
        } else {
             // 알 수 없는 티어는 기본값 또는 에러 처리 필요 (Guard Clause 추가)
            predictedValue = baseScore;
        }

        return predictedValue;
    }

    /**
     * 진단 결과의 KPI를 가중치 기반으로 점수화합니다. (가장 중요한 지표에 높은 가중치를 부여함)
     * @param result - DiagnosisResult 객체
     */
    private static calculateWeightedBaseScore(result: DiagnosisResult): number {
        // Weighting Example: Growth > Engagement > Monetization (비즈니스 중요도 기반 가정)
        const growthWeight = 0.5;
        const engagementWeight = 0.3;
        const monetizationWeight = 0.2;

        return (result.growth * growthWeight +
                result.engagement * engagementWeight +
                result.monetization * monetizationWeight);
    }
}

// 자가 검증을 위한 더미 모듈 정의 (실제 환경에 맞게 수정 필요)
export type DiagnosisResult = {
    growth: number; // Growth KPI Score
    engagement: number; // Engagement KPI Score
    monetization: number; // Monetization KPI Score
    // ... 기타 필드
};

export type UserSubscriptionTier = 'Free' | 'Basic' | 'Pro';

// 🛠️ 테스트 코드를 위한 임시 실행 (가상 컴파일)
const testResult = PredictiveValueService.calculatePredictiveValue({ growth: 70, engagement: 85, monetization: 60 }, 'Basic');
console.log(`[Test Score]: ${testResult}`);