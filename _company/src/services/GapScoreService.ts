// src/services/gapScoreService.ts

import { GapScoreData, DiagnosisResult } from '../components/GapScoreVisualization/types';

/**
 * @description 진단 결과를 기반으로 실시간 Gap Score를 계산하고 시각화에 필요한 데이터를 반환합니다.
 * 이 함수는 비즈니스 로직의 핵심이며, 모든 경계 조건 테스트가 필요합니다.
 * @param diagnosisResult - 백엔드에서 받은 전체 진단 결과 객체
 * @returns GapScoreData | null - 계산된 점수 데이터 또는 실패 시 null
 */
export const calculateGapScore = (diagnosisResult: DiagnosisResult): GapScoreData | null => {
    if (!diagnosisResult || !diagnosisResult.kpiMetrics) {
        console.error("Diagnosis Result is invalid or missing KPI metrics.");
        return null; 
    }

    const kpis = diagnosisResult.kpiMetrics;
    let totalGapScore: number = 0;
    
    // 예외 처리: 필요한 KPI가 부족할 경우, 기본값으로 설정하거나 로직을 중단해야 합니다.
    if (typeof kpis.growth === 'undefined' || typeof kpis.engagement === 'undefined') {
        console.warn("Missing critical KPI metrics (Growth or Engagement). Cannot calculate Gap Score.");
        return null; // 데이터 불충분으로 계산 실패 처리
    }

    // 핵심 로직: 각 지표에 가중치를 부여하여 총 Gap Score를 산출합니다.
    // 예시 가중치: Growth (40%), Engagement (40%), Monetization (20%)
    const growthWeight = 0.4;
    const engagementWeight = 0.4;
    const monetizationWeight = 0.2;

    totalGapScore = (kpis.growth * growthWeight) + 
                     (kpis.engagement * engagementWeight) + 
                     (kpis.monetization * monetizationWeight);

    // Gap Score의 상태를 정의하고 경계값 처리를 합니다.
    let status: 'Critical' | 'Potential' | 'Stable';
    if (totalGapScore < 30) {
        status = 'Critical'; // 점수가 낮으면(갭이 크면) 위험도가 높음 -> Critical
    } else if (totalGapScore >= 30 && totalGapScore < 70) {
        status = 'Potential'; // 중간 범위
    } else {
        status = 'Stable'; // 점수가 높으면(갭이 작으면) 안정적임
    }

    // 시각화에 필요한 최종 데이터를 구조화하여 반환합니다.
    return {
        score: parseFloat(totalGapScore.toFixed(2)),
        status: status,
        message: getStatusMessage(status), // 상태별 메시지 함수 호출
        kpisUsed: kpis 
    };
};

// 내부 도우미 함수 (비즈니스 로직 분리)
const getStatusMessage = (status: 'Critical' | 'Potential' | 'Stable'): string => {
    switch(status) {
        case 'Critical': return "경고: 핵심 영역의 격차가 큽니다. 즉각적인 개입이 필요합니다.";
        case 'Potential': return "주의: 개선 여지가 있습니다. 추가 분석을 통해 전략을 수립하세요.";
        case 'Stable': return "안정적: 현재 목표 대비 충분한 성과를 보이고 있습니다.";
    }
};

/**
 * @description Mock API 호출 시뮬레이션 함수 (실제 백엔드 연동 시 대체 필요)
 */
export const fetchMockDiagnosisResult = async (contextId: string): Promise<any> => {
    // 이 부분은 실제 네트워크 지연 및 에러 처리를 포함해야 함.
    console.log(`[API Mock] Context ID ${contextId} 기반 진단 결과 요청 중...`);
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay simulation

    // Mock Data Set: Stable (가장 좋은 경우)
    if (contextId === "mock-stable") {
        return {
            id: 123,
            contextId: contextId,
            kpiMetrics: { growth: 85, engagement: 90, monetization: 75 }, // High scores = Stable Gap
            timestamp: new Date().toISOString()
        };
    } 
    // Mock Data Set: Critical (가장 나쁜 경우)
    else if (contextId === "mock-critical") {
        return {
            id: 456,
            contextId: contextId,
            kpiMetrics: { growth: 20, engagement: 15, monetization: 30 }, // Low scores = Critical Gap
            timestamp: new Date().toISOString()
        };
    }
     // Mock Data Set: Potential (중간 경우)
    else if (contextId === "mock-potential") {
         return {
            id: 789,
            contextId: contextId,
            kpiMetrics: { growth: 50, engagement: 60, monetization: 40 }, // Medium scores = Potential Gap
            timestamp: new Date().toISOString()
        };
    } else {
        // 실패 케이스 시뮬레이션 (Null/Undefined 처리 테스트용)
         return null;
    }
};