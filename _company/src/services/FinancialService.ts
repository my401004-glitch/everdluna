/**
 * FinancialService: 학원 운영자의 리스크 및 수익 기회 시뮬레이션 로직을 담당하는 서비스 계층.
 * 이 함수는 실제 DB 호출을 모킹(Mocking)하여 비즈니스 계산에만 집중합니다.
 */

import { UserContext, DiagnosisResult } from '../types/common'; // 가정된 타입 정의 경로

/**
 * 특정 사용자 ID를 기반으로 재무적 임팩트를 시뮬레이션합니다.
 * @param userId - 분석 대상 사용자(학원 운영자)의 고유 ID.
 * @returns 시뮬레이션 결과를 담은 객체.
 */
export async function calculateFinancialImpactSimulation(userId: string): Promise<any> {
    console.log(`[FinanceService] Starting financial impact simulation for user: ${userId}`);

    // 🚨 중요: 실제 환경에서는 이 부분에서 DB를 통해 marketing_activities, user_subscription_history 등을 조회해야 합니다.
    // 여기서는 안정적인 개발을 위해 모킹(Mocking)된 데이터를 사용합니다.

    const mockMarketingActivities = [
        { campaignId: 'C001', type: 'Google Ads', spend: 500, reach: 3000, conversionRate: 0.02 }, // 초기 리스크 구간 (비효율적 광고)
        { campaignId: 'C002', type: 'Instagram Reels', spend: 800, reach: 12000, conversionRate: 0.04 }, // 개선된 활동 (고효율)
        { campaignId: 'C003', type: 'Local Partnership', spend: 100, reach: 500, conversionRate: 0.10 } // 최적화된 활동 (가장 효율적)
    ];

    const mockSubscriptionHistory = [
        { period: 'Q1', count: 10, averageRevenue: 3000 },
        { period: 'Q2', count: 15, averageRevenue: 4500 } // 성장의 지표
    ];

    // --- 💰 핵심 로직 구현 시작 ---

    // 1. 리스크(Risk) 측정: 비효율적 마케팅 활동 및 낮은 전환율 기반 비용 증가 예측
    let totalCostOverrun = 0;
    let highRiskScore = 0;

    mockMarketingActivities.forEach((activity, index) => {
        if (index === 0 && activity.conversionRate < 0.025) { // 첫 번째 활동(가장 낮은 효율성 가정)을 리스크로 간주
            const costOverrun = activity.spend * 0.1; // 예: 비용의 10%가 손실될 가능성
            totalCostOverrun += costOverrun;
            highRiskScore += Math.min(1, (0.025 - activity.conversionRate) / 0.02);
        }
    });

    // 2. 기회(Opportunity) 측정: 높은 효율성과 구독 성장 기반 예상 수익 증가 예측
    const currentRevenue = mockSubscriptionHistory[mockSubscriptionHistory.length - 1].averageRevenue;
    let projectedGrowthAmount = 0;

    if (mockMarketingActivities.some(a => a.conversionRate >= 0.04)) { // 효율적인 캠페인이 존재할 경우
        // 지난 분기 대비 평균 성장률을 계산하여 다음 분기 목표 설정
        const growthRate = ((mockSubscriptionHistory[1].averageRevenue - mockSubscriptionHistory[0].averageRevenue) / mockSubscriptionHistory[0].averageRevenue);
        projectedGrowthAmount = currentRevenue * (1 + growthRate) * 1.2; // 성장률에 추가적인 기대치(1.2) 반영
    }

    // 3. 최종 지표 계산
    const netImpactValue = projectedGrowthAmount - totalCostOverrun;
    const financialRiskScore = Math.min(10, highRiskScore * 10); // 점수 스케일 조정 (0-10)

    // --- 📈 결과 구조화 및 반환 ---
    return {
        userId: userId,
        timestamp: new Date().toISOString(),
        financialImpactSummary: {
            risk_description: `현재 마케팅 활동의 비효율성(최대 ${Math.round(totalCostOverrun)} 예상 손실)으로 인한 잠재적 리스크가 존재합니다.`,
            opportunity_description: `고효율 캠페인과 구독 성장을 기반으로 다음 분기 약 ${Math.round(projectedGrowthAmount - currentRevenue)}원의 추가 수익 기회가 포착됩니다.`,
            net_impact_value: parseFloat(netImpactValue.toFixed(2)), // 최종 순수 이익 기여도
            financial_risk_score: Math.round(financialRiskScore), // 0~10점 (높을수록 리스크)
        },
        // 추가적인 세부 지표를 포함하여 프론트엔드에 풍부한 컨텍스트 제공
        detailedMetrics: {
            totalCostOverrunEstimate: parseFloat(totalCostOverrun.toFixed(2)),
            projectedRevenueIncrease: parseFloat((projectedGrowthAmount - currentRevenue).toFixed(2)),
            bestPerformingCampaignId: mockMarketingActivities.find(a => a.conversionRate === 0.10)?.campaignId || 'N/A',
        }
    };
}

export { calculateFinancialImpactSimulation };