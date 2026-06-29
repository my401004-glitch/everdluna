// src/types/interfaces.ts
/**
 * @description Funnel 추적에 사용되는 모든 공통 타입을 정의합니다. 
 */

export type UserContext = {
    userId: string;
    userType: 'FREE' | 'PREMIUM'; // RBAC (Role-Based Access Control) 기준
};

/**
 * Funnel의 각 단계(Stage)와 사용자 행동(Action), 그리고 추가 메타데이터를 포함하는 이벤트 객체.
 */
export type FunnelEvent = {
    stage: 'HERO_VIEW' | 'FEATURES_REVIEW' | 'PRICING_CHECKOUT' | 'ANALYSIS_REPORT';
    action: string; // 예: click_cta, scroll_depth_70%, video_play_complete
    metadata: Record<string, any>; 
}

export type FunnelStage = {
    name: string;
    funnelOrder: number;
}