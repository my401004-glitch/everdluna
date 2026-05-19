// src/types/diagnosisTypes.ts - API 계약을 정의하는 곳입니다.

export interface User {
    id: string;
    role?: string;
}

export interface DiagnosisContext {
    id: string;
    type: string;
}

/**
 * KPI 지표의 세부 구조를 정의합니다. (Growth, Engagement, Monetization)
 * 각 수치는 0~100 사이로 정규화되어야 합니다.
 */
export interface KpiMetric {
    // Frontend fields
    score?: number; // 해당 KPI 점수 (예: Growth Score)
    description: string; // 이 점수가 의미하는 바
    level?: 'Low' | 'Medium' | 'High'; // 시각화 레벨

    // Backend controller fields
    metricName?: string;
    value?: number;
}

/**
 * 종합 진단 결과를 담는 메인 데이터 구조입니다.
 */
export interface DiagnosisResult {
    // Frontend fields
    overallScore?: number; // 0-100점
    grade?: 'Needs Improvement' | 'Developing' | 'Advanced'; // 종합 레벨
    title?: string; // 진단 결과 제목
    kpiMetrics?: KpiMetric[]; // 핵심 KPI 데이터 배열
    painPointSummary?: string; // 취약점 요약
    gainPotentialStatement?: string; // 잠재적 이득 문구

    // Backend controller fields
    contextId?: string;
    score?: number;
    analysisSummary?: string;
    recommendation?: string;
}

/**
 * API 요청 본문 타입 정의
 */
export interface DiagnosisRequest {
    diagnosisType: DiagnosisType;
    userId: string;
    contextId: string; // 어떤 컨텍스트에 대한 식별자
}

// 진단 타입 유니온 타입 정의
export type DiagnosisType = 'Vocal' | 'Rhythm' | 'Other' | 'Growth' | 'Monetization';