import { DiagnosisResult, KpiMetrics } from '../types/diagnosisTypes';

/**
 * @description Raw diagnosis result 데이터를 영상 내러티브 단계별로 구조화하고 매핑하는 로직.
 * 이 함수는 API 호출 결과가 단순히 JSON으로 전달되는 것이 아니라,
 * '어떤 단계에서 어떤 메시지(Hook)를 보여줄지', '어떤 데이터(Proof)로 증명할지'를 결정합니다.
 * @param rawResult - 백엔드 API로부터 받은 원본 진단 결과 객체.
 * @returns {Array<{ stage: string, title: string, content: string, dataPoints: any[] }>} 내러티브 구조가 담긴 배열.
 */
export const mapDiagnosisToNarrativeSequence = (rawResult: DiagnosisResult): Array<{ 
    stage: 'HOOK' | 'PROOF' | 'GROWTH'; 
    title: string; 
    content: string; 
    dataPoints: any[] 
}> => {
    // [WHY] 데이터 흐름의 안정성 확보를 위해, 모든 단계에 대한 기본 가드 로직을 적용합니다.
    if (!rawResult || !rawResult.kpiMetrics) {
        return [{ stage: 'HOOK', title: "데이터 오류", content: "진단 데이터를 불러올 수 없습니다. 다시 시도해 주세요.", dataPoints: [] }];
    }

    const kpis = rawResult.kpiMetrics;
    let sequence: Array<{ 
        stage: 'HOOK' | 'PROOF' | 'GROWTH'; 
        title: string; 
        content: string; 
        dataPoints: any[] 
    }> = [];

    // --- [1] HOOK Stage (시청자의 Pain Point 자극) ---
    let hookTitle = "진단 분석 시작";
    let hookContent = `학생님의 현재 상태를 종합적으로 진단하여, 가장 시급하게 개선해야 할 부분을 찾아드립니다.`;
    
    if (kpis.growthScore < 30) { // 예시 조건: 성장 점수가 낮을 경우 Hook 강도 높임
        hookTitle = "🚨 위험 신호 포착!";
        hookContent = `현재 학습 습관과 성취도의 간극(Gap Score)이 예상보다 크다는 것이 진단 결과입니다. 이대로 방치하면 큰 문제가 발생할 수 있습니다.`;
    } else {
        hookContent = "전반적인 잠재력은 높지만, 목표 달성을 위한 구체적인 전략 설계가 필요합니다.";
    }

    sequence.push({ 
        stage: 'HOOK', 
        title: hookTitle, 
        content: hookContent, 
        dataPoints: [kpis] // KPI 전체를 Hook 단계에서 한 번 노출 (전체 상황 요약)
    });


    // --- [2] PROOF Stage (데이터 기반 증명 및 문제 제시) ---
    let proofTitle = "핵심 약점 분석 (Gap Score)";
    let proofContent = `진단된 데이터를 통해, 현재의 학습 패턴 중 가장 취약한 영역을 명확하게 짚어드립니다.`;
    
    // 예시 로직: Growth < Engagement < Monetization 순으로 문제점을 제시하는 흐름 구성
    const weaknesses = [];
    if (kpis.growthScore < kpis.engagementScore) { // 성장 vs 참여도 비교를 통해 Gap 발견
        weaknesses.push(`성장(Growth): ${Math.round(kpis.growthScore * 10)}점 / 참여도(Engagement): ${Math.round(kpis.engagementScore * 10)}점`);
    } else {
         weaknesses.push("전반적인 성과 지표의 편차가 적어, 특화된 목표 설정이 필요합니다.");
    }


    sequence.push({ 
        stage: 'PROOF', 
        title: proofTitle, 
        content: `현재 가장 큰 Gap은 '${kpis.growthScore < kpis.engagementScore ? "성장 가능성 대비 참여도가 낮음" : "특정 지표 간의 불균형"'}' 입니다.`, 
        dataPoints: weaknesses.map(w => ({ metric: w, type: 'GAP_ANALYSIS' }))
    });


    // --- [3] GROWTH Stage (해결책 제시 및 다음 단계 유도) ---
    let growthTitle = "성장 전략 설계";
    let growthContent = `위의 진단 결과를 바탕으로, 학생님의 잠재력을 극대화할 수 있는 맞춤형 학습 로드맵을 제안합니다.`;
    
    // 해결책은 항상 긍정적인 미래를 제시하며 끝내야 함 (Call To Action 유도)
    sequence.push({ 
        stage: 'GROWTH', 
        title: growthTitle, 
        content: "이 로드맵을 통해 데이터 기반의 명확한 목표 설정과 꾸준한 실행만이 최고의 성과를 만듭니다.", 
        dataPoints: [{ action: "상담 예약", description: "전문가와 함께 맞춤형 계획 수립" }] // CTA 지표 추가
    });


    return sequence;
};

/**
 * @description 진단 결과를 받아 각 KPI별 요약 정보를 추출하는 보조 함수.
 * (이 부분은 View나 Writer에게 전달될 최종 데이터 형태로 가공합니다.)
 */
export const extractKpiSummary = (kpis: KpiMetrics): { 
    growth: number, 
    engagement: number, 
    monetization: number 
} => ({
    growth: kpis.growthScore * 100, // 보기 좋게 백분율로 변환
    engagement: kpis.engagementScore * 100,
    monetization: kpis.monetizationScore * 100,
});

export default {
    mapDiagnosisToNarrativeSequence,
    extractKpiSummary
};