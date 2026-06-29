/**
 * @description 진단 점수 계산 로직을 담당하는 서비스 레이어.
 * 비즈니스 규칙(Business Rule)이 가장 먼저 적용되는 곳입니다.
 */
export const getDiagnosisScoreFromFinancialLoss = async (input: DiagnosisInput): Promise<DiagnosticScore | null> => {
    // Input Validation (강화된 가드 로직)
    if (!input || !input.data) {
        console.warn("Missing input data for financial diagnosis.");
        return null;
    }

    const monthlyRevenue = parseFloat(input.data.monthly_revenue);
    const estimatedCostOfInaction = parseFloat(input.data.cost_of_inaction); // Video 3의 핵심 지표
    const totalRiskScore = (estimatedCostOfInaction / Math.max(1, monthlyRevenue)) * 100;

    let score: number;
    let recommendation: string;

    if (totalRiskScore > 50) {
        score = totalRiskScore;
        recommendation = "즉시 액션 필요! 비효율 제거가 최우선입니다."; // Video 3 Hook 메시지 반영
    } else if (totalRiskScore > 20) {
        score = totalRiskScore * 0.8;
        recommendation = "주의 단계. 데이터 구조 개선을 고려해야 합니다.";
    } else {
        score = Math.random() * 10; // 낮은 점수일 경우 임의 할당
        recommendation = "안정적입니다. 유지 전략에 집중하세요.";
    }

    // DiagnosticScore 타입 정의 및 반환
    return { score: parseFloat(score.toFixed(2)), recommendation, type: 'financial_risk' };
};