/**
 * @fileoverview KPI Aggregation Service PoC - Gap Score 기반 데이터 통합 및 검증
 * 이 서비스는 프론트엔드에서 발생한 상호작용 이벤트(A1, A2, A3)를 받아,
 * 최종적으로 Diagnosis_Results와 KPI_Metrics에 기록할 데이터를 구조화합니다.
 */

import { Logger } from '../utils/logger';

/**
 * @typedef {object} InteractionEventPayload
 * @description 프론트엔드에서 발생한 단일 상호작용 이벤트 (A1, A2, A3 등)의 원본 데이터.
 * @property {string} userId - 사용자 식별자.
 * @property {string} contextId - 현재 진단 테스트 세션 ID.
 * @property {'A1_BEFORE'|'A2_GAP_CURVE'|'A3_PROCESS_FLOW'} eventType - 발생한 상호작용 유형.
 * @property {object} data - 이벤트별 상세 데이터 (예: A2의 경우, Gap Score 값).
 */

/**
 * 1. 원본 상호작용 이벤트를 KPI 로깅 스키마로 변환하고 검증합니다.
 * @param {InteractionEventPayload[]} events - 여러 개의 연속된 상호작용 이벤트 배열.
 * @returns {{success: boolean, aggregatedData?: object}} 처리 결과.
 */
export const processAndAggregateKpi = (events) => {
    if (!Array.isArray(events) || events.length === 0) {
        Logger.warn("⚠️ KPI Aggregation Failed: No valid interaction events provided.");
        return { success: false };
    }

    let totalGrowthPoints = 0;
    let engagementScoreSum = 0;
    const processedEvents = [];

    for (const event of events) {
        let kpiData = {}; // 해당 이벤트에서 추출된 KPI 데이터

        switch (event.eventType) {
            case 'A1_BEFORE':
                // A1: Pain Point 제시 단계 - 초기 Gap Score 측정 및 Engagement 기록
                kpiData = { 
                    growth_impact: event.data.initial_gap_score || 0, // 초기 진단 점수 (낮을수록 문제점 심각)
                    engagement_metric: Math.min(1, event.data.user_focus_level), // 사용자의 몰입도 (0~1)
                };
                totalGrowthPoints += kpiData.growth_impact * 0.5;
                engagementScoreSum += kpiData.engagement_metric;
                break;

            case 'A2_GAP_CURVE':
                // A2: Gap Curve 애니메이션 - 가장 중요한 핵심 데이터 로깅 지점
                kpiData = {
                    growth_impact: event.data.gap_score_value, // 실제 측정된 격차 점수 (가장 중요)
                    engagement_metric: 1, // 그래프를 보는 순간 집중도가 높다고 가정
                };
                totalGrowthPoints += kpiData.growth_impact * 2; // Gap Score는 가중치가 높음
                engagementScoreSum += 1;
                break;

            case 'A3_PROCESS_FLOW':
                // A3: Solution 제시 - 학습 의지 및 전환 동인 측정
                kpiData = {
                    growth_impact: event.data.solution_adherence_score || 0, // 솔루션에 대한 수용도 (높을수록 성장 잠재력 높음)
                    engagement_metric: Math.max(0.5, event.data.time_on_page / 3); // 체류 시간 기반 가중치
                };
                totalGrowthPoints += kpiData.growth_impact * 1;
                engagementScoreSum += kpiData.engagement_metric;
                break;

            default:
                Logger.warn(`⚠️ Unknown event type encountered: ${event.eventType}`);
        }
        processedEvents.push({ event, kpiData });
    }

    // 최종 Aggregation
    const finalKpis = {
        total_growth_potential_score: parseFloat(totalGrowthPoints.toFixed(2)), // Growth
        average_engagement_index: parseFloat((engagementScoreSum / events.length).toFixed(2)), // Engagement
        last_interaction_timestamp: new Date().toISOString(),
    };

    Logger.info(`✅ Successfully aggregated KPIs for Context ${events[0]?.contextId}.`);
    return { 
        success: true, 
        aggregatedData: finalKpis, 
        processedEvents: processedEvents 
    };
};


/**
 * [Mock API Call] 데이터베이스에 로깅하는 모의 함수 (실제 백엔드 구현 필요)
 * @param {object} aggregatedData - 최종 KPI 객체.
 */
export const logKpiToDatabase = async (aggregatedData) => {
    Logger.info(`\n--- DB LOGGING SIMULATION START ---`);
    // 1. Diagnosis_Results 테이블에 결과 로깅 (contextId, resultData 포함)
    console.log(`[DB Write] Context ID: ${aggregatedData.contextId} | Result Data Schema Validated.`);
    // 2. KPI_Metrics 테이블에 Growth/Engagement 기록
    console.log(`[DB Write] KPI_Metrics: Growth=${aggregatedData.total_growth_potential_score}, Engagement=${aggregatedData.average_engagement_index}`);
    Logger.info(`--- DB LOGGING SIMULATION END ---\n`);
};

/**
 * 테스트 실행 예시 함수 (실제 API 호출 시 대체됨)
 */
export const runValidationTest = async () => {
    // 1. 가상의 상호작용 이벤트 데이터 생성 (A2_GAP_CURVE에 초점)
    const mockEvents = [
        { userId: "user-123", contextId: "test-session-001", eventType: 'A1_BEFORE', data: { initial_gap_score: 75, user_focus_level: 0.8 } },
        { userId: "user-123", contextId: "test-session-001", eventType: 'A2_GAP_CURVE', data: { gap_score_value: 92, segment: '화성학' } }, // 핵심 데이터
        { userId: "user-123", contextId: "test-session-001", eventType: 'A3_PROCESS_FLOW', data: { solution_adherence_score: 0.7, time_on_page: 90 } }
    ];

    console.log("=== Starting KPI Aggregation Validation Test ===");
    const aggregated = processAndAggregateKpi(mockEvents);

    if (aggregated.success) {
        // 2. 로깅 시뮬레이션 실행
        await logKpiToDatabase({ ...aggregated.aggregatedData, contextId: mockEvents[0].contextId });
        return "✅ KPI Aggregation 및 DB 로깅 파이프라인 테스트 성공.";
    } else {
        return "❌ KPI Aggregation 실패. 로그를 확인하세요.";
    }
};

// module export는 실제 환경에 맞춰 조정 필요