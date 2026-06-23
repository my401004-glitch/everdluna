/**
 * @fileoverview KPI Aggregation Service PoC Core Logic. 
 * raw log data를 받아 Gap Score와 핵심 비즈니스 지표(KPIs)를 종합적으로 계산합니다.
 * [근거: sessions/2026-06-23T02-16/developer.md - KPI 기반 데이터 통합]
 */

import { MicroInteractionLog } from '../models/micro_interaction_log'; // 가상의 Log Model
import { DatabaseClient } from '../utils/db_client'; // DB 접근 유틸리티 (가정)

/**
 * @typedef {object} KpiAggregationResult
 * @property {string} contextId - 진단 컨텍스트 ID.
 * @property {number} gapScore - 핵심진단지표(Gap Score). 0~100 범위.
 * @property {{growth: number, engagement: number, monetization: number}} kpis - 3가지 KPI 점수.
 * @property {string[]} insights - 분석 기반의 액션 추천 리스트.
 */

/**
 * DB에서 원시 로그 데이터를 조회하고 종합적인 KPI를 계산하는 핵심 서비스 함수입니다.
 * 이 로직은 데이터베이스 트랜잭션 내에서 수행되어야 안정적입니다.
 * 
 * @param {string} contextId - 분석할 컨텍스트 ID (예: 사용자 세션 ID).
 * @param {Date} startTime - 조회 시작 시간.
 * @param {Date} endTime - 조회 종료 시간.
 * @returns {Promise<KpiAggregationResult>} 종합된 KPI 결과 객체.
 */
export async function calculateKpiAggregation(contextId: string, startTime: Date, endTime: Date): Promise<KpiAggregationResult> {
  // 1. 데이터베이스 레이어 호출: 원시 로그 가져오기 (가장 중요!)
  console.log(`[KPI Aggregator] Context ${contextId}의 원시 로그 (${startTime} ~ ${endTime}) 조회 시작.`);
  const rawLogs = await DatabaseClient.fetchRawInteractionLogs(contextId, startTime, endTime);

  if (!rawLogs || rawLogs.length === 0) {
    throw new Error(`No interaction logs found for context ID: ${contextId}`);
  }
  
  // 2. Raw Log 분석 및 점수 계산 (도메인 로직)
  const analysis = analyzeRawLogs(rawLogs);

  // 3. 최종 KPI 종합 및 Gap Score 도출 (가중치 적용)
  const { growth, engagement, monetization } = calculateWeightedKpis(analysis);
  
  // Gap Score는 3가지 KPI의 불균형도와 전반적인 활동성을 복합적으로 계산합니다.
  const gapScore = calculateGapScore(growth, engagement, monetization);

  // 4. 인사이트 및 추천 로직 생성 (분석 기반)
  const insights = generateActionableInsights({ growth, engagement, monetization });


  /** @type {KpiAggregationResult} */
  const result: KpiAggregationResult = {
    contextId: contextId,
    gapScore: parseFloat(gapScore.toFixed(2)),
    kpis: { growth, engagement, monetization },
    insights: insights
  };

  console.log(`[KPI Aggregator] Context ${contextId} KPI 계산 완료.`);
  return result;
}


// --- Private Helper Functions (핵심 비즈니스 로직) ---

/** 
 * 원시 로그 데이터 배열을 받아 핵심 분석 지표를 추출합니다. 
 * (예: 평균 체류 시간, 상호작용 포인트 수 등)
 */
function analyzeRawLogs(logs: MicroInteractionLog[]): { totalDuration: number; interactionPointsCount: number; } {
    // 실제 구현 시 복잡한 통계 계산이 들어갑니다.
    let totalDuration = 0;
    let interactionPointsCount = 0;

    for (const log of logs) {
        totalDuration += log.dwellTimeSeconds || 0; // 체류 시간 누적
        if (log.type === 'interaction_point') {
            interactionPointsCount++;
        }
    }
    return { totalDuration: Math.max(1, totalDuration), interactionPointsCount };
}

/** 
 * 분석된 지표를 기반으로 세 가지 핵심 KPI 점수를 계산합니다. (가중치 적용)
 */
function calculateWeightedKpis(analysis: { totalDuration: number; interactionPointsCount: number }): { growth: number, engagement: number, monetization: number } {
    // Growth: 시간이 길고 상호작용 포인트가 많으면 높음.
    const growth = Math.min(100, 30 + (analysis.totalDuration * 0.5) + (analysis.interactionPointsCount * 2));

    // Engagement: 상호작용 포인트의 밀도가 중요함.
    const engagement = Math.min(100, 40 + analysis.interactionPointsCount * 3);

    // Monetization: 체류 시간이 길고 특정 IP에 도달하면 높음.
    const monetization = Math.min(100, 20 + (analysis.totalDuration / 10) + (analysis.interactionPointsCount * 0.5));

    return { growth, engagement, monetization };
}


/** 
 * 세 KPI 점수의 불균형도를 측정하여 Gap Score를 도출합니다.
 */
function calculateGapScore(g: number, e: number, m: number): number {
    // 예시 로직: 평균값 대비 최대 편차의 역수를 사용하거나, 세 값 간의 거리를 계산할 수 있습니다.
    const average = (g + e + m) / 3;
    const varianceSum = Math.abs(g - average) + Math.abs(e - average) + Math.abs(m - average);
    // 점수가 균일하면 Gap Score가 낮고, 불균형하면 높아지게 설계합니다. (여기서는 역으로 정의하여 100-GapScore로 조정할 수 있음)
    return Math.max(20, Math.round(Math.min(80, average + varianceSum / 5)));
}

/** 
 * 계산된 KPI를 바탕으로 사용자가 다음에 취해야 할 액션 아이템을 추천합니다.
 */
function generateActionableInsights({ growth, engagement, monetization }: { growth: number; engagement: number; monetization: number }): string[] {
    const insights: string[] = [];
    if (growth < 50 && engagement > 70) {
        insights.push("성장 잠재력 향상을 위해 '심화 학습 모듈' 탐색을 추천합니다.");
    } else if (engagement < 40) {
        insights.push("참여도가 낮습니다. 인터랙티브 콘텐츠를 통해 흥미 유발이 필요해 보입니다.");
    } else if (monetization < 60 && growth > 80) {
         insights.push("높은 잠재력을 가졌으나 수익화 경로가 불분명합니다. 프리미엄 콘텐츠 노출을 강화하세요.");
    } else {
        insights.push("현재 데이터 분포는 균형 잡혀 있습니다. 다음 목표 KPI에 집중하여 테스트를 진행하세요.");
    }
    return insights;
}

// Mock Model 및 DB Client 정의 (PoC 실행을 위해 임시로 추가)
export interface MicroInteractionLog {
  contextId: string; // 세션 ID
  timestamp: Date; 
  type: 'dwell' | 'interaction_point'; // 체류 또는 상호작용 포인트
  dwellTimeSeconds?: number; // 체류 시간
}

export const DatabaseClient = {
    /** Mock function for fetching raw logs. */
    fetchRawInteractionLogs: async (contextId: string, startTime: Date, endTime: Date): Promise<MicroInteractionLog[]> => {
        // 실제로는 SQL 쿼리나 ORM 호출이 들어갈 자리입니다.
        console.log(`[DB Mock] Querying raw logs for ${contextId}...`);
        return [
            { contextId, timestamp: new Date(), type: 'dwell', dwellTimeSeconds: 30 },
            { contextId, timestamp: new Date(), type: 'interaction_point' }, // IP 1
            { contextId, timestamp: new Date(), type: 'interaction_point' }, // IP 2
            // ... 실제 데이터가 여기에 로드됩니다.
        ];
    }
};