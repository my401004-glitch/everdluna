/**
 * @fileoverview TrackingService: Funnel 전반의 사용자 행동 이벤트를 수집하고,
 *             데이터 무결성을 검증하여 DB에 기록하는 핵심 서비스 계층입니다.
 * [WHY] 테스트 환경에서 운영 환경으로 전환하기 위해 추적 로직을 캡슐화합니다.
 */

import { UserContext, FunnelEvent } from '../types/interfaces';
import { dbClient } from '../config/database'; // 가상의 DB 클라이언트

/**
 * 사용자 컨텍스트를 기반으로 이벤트의 유효성을 검증하고 기록하는 메인 함수.
 * @param userContext 현재 접속한 사용자의 권한 및 정보를 포함합니다.
 * @param eventFunnelEvent Funnel에서 발생한 구체적인 이벤트 객체입니다.
 * @returns 트랜잭션 성공 여부 (boolean)
 */
export async function trackUserFunnelEvent(userContext: UserContext, funnelEvent: FunnelEvent): Promise<boolean> {
    // 1. 기본 유효성 검증 및 권한 체크
    if (!userContext || !funnelEvent) {
        console.warn("Tracking Attempt Failed: Missing context or event payload.");
        return false;
    }

    const { userType, userId } = userContext;
    const { stage, action, metadata } = funnelEvent;

    // RBAC 체크: 이 사용자가 기록하려는 단계(stage)에 대한 접근 권한이 있는지 확인합니다.
    if (userType === 'FREE' && !['HERO_VIEW', 'BASIC_INTERACT'].includes(stage)) {
        console.log(`[RBAC] Free user (${userId}) blocked from recording stage: ${stage}`);
        return false; // 권한 부족으로 로깅 차단
    }

    // 2. 데이터 스키마 유효성 검증 (KPI, Growth 등 핵심 지표 포함)
    const validationResult = validateFunnelPayload(funnelEvent);
    if (!validationResult.isValid) {
        console.error(`[Validation Error] Funnel event failed schema check: ${validationResult.reason}`);
        // 에러 로그만 남기고 DB 기록은 실패 처리합니다.
        return false; 
    }

    // 3. 트랜잭션 시작 및 다중 테이블 저장 (원자성 보장)
    const client = await dbClient.connect();
    try {
        await client.query('BEGIN');

        // A. Diagnosis_Results: 핵심 진단 결과 기록
        await saveDiagnosisResult(client, userId, funnelEvent); 
        
        // B. KPI_Metrics: Growth, Engagement, Monetization KPI 업데이트/추가
        await updateKPIs(client, userContext, funnelEvent);

        // C. Funnel_Log: 순수한 행동 로그 기록 (어떤 단계에 머물렀는지)
        await saveFunnelLog(client, userId, stage, action, metadata); 

        await client.query('COMMIT');
        console.log(`[SUCCESS] Tracking event ${stage}/${action} recorded successfully for user ${userId}.`);
        return true;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("[CRITICAL ERROR] Database transaction failed:", error);
        return false;
    } finally {
        client.release();
    }
}


/** 
 * Payload의 데이터 스키마를 검증합니다. 특히 KPI 값이나 필수 메타데이터 누락 여부를 체크합니다.
 */
function validateFunnelPayload(event: FunnelEvent): { isValid: boolean, reason?: string } {
    // [Placeholder Logic]: 실제로는 복잡한 JSON Schema Validation을 수행해야 합니다.
    if (!event.stage || !event.action) {
        return { isValid: false, reason: "Stage and Action are mandatory." };
    }
    // 추가 검증 로직 (예: metadata 필드에 필수 값이 있는지 확인)
    return { isValid: true }; 
}

async function saveDiagnosisResult(client: any, userId: string, event: FunnelEvent): Promise<void> {
    // [SQL 실행]: Diagnosis_Results 테이블에 데이터를 삽입/업데이트합니다.
    console.log(`[DB Operation] Inserting result into Diagnosis_Results for user ${userId}.`);
}

async function updateKPIs(client: any, context: UserContext, event: FunnelEvent): Promise<void> {
    // [SQL 실행]: KPI_Metrics 테이블을 업데이트하여 Growth/Engagement 지표를 반영합니다.
    console.log(`[DB Operation] Updating KPIs for user ${context.userId}.`);
}

async function saveFunnelLog(client: any, userId: string, stage: string, action: string, metadata: any): Promise<void> {
    // [SQL 실행]: Funnel_Log 테이블에 순수 행동 기록을 남깁니다.
    console.log(`[DB Operation] Logging raw funnel movement for user ${userId}.`);
}

/** 
 * (예시 타입 정의) 실제 프로젝트에서는 별도 파일로 분리해야 합니다. 
 */
export type UserContext = {
    userId: string;
    userType: 'FREE' | 'PREMIUM'; // RBAC 기준
};

export type FunnelEvent = {
    stage: 'HERO_VIEW' | 'FEATURES_REVIEW' | 'PRICING_CHECKOUT' | 'etc.';
    action: string; // 예: 'scroll_depth_70%', 'button_click_cta', 'time_spent_30s'
    metadata: Record<string, any>; // 추가적인 컨텍스트 데이터 (ex: scroll_depth)
}