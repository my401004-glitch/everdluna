// src/types/diagnosisTypes.ts - API 계약을 정의하는 곳입니다.

/**
 * KPI 지표의 세부 구조를 정의합니다. (Growth, Engagement, Monetization)
 * 각 수치는 0~100 사이로 정규화되어야 합니다.
 */
export interface KpiMetric {
    score: number; // 해당 KPI 점수 (예: Growth Score)
    description: string; // 이 점수가 의미하는 바 (예: "현재 콘텐츠 트렌드에 대한 이해도")
    level: 'Low' | 'Medium' | 'High'; // 시각화 레벨
}

/**
 * 종합 진단 결과를 담는 메인 데이터 구조입니다.
 */
export interface DiagnosisResult {
    // 전반적인 점수 및 등급
    overallScore: number; // 0-100점
    grade: 'Needs Improvement' | 'Developing' | 'Advanced'; // 최종 사용자에게 보여줄 종합 레벨
    title: string; // 진단 결과의 제목 (예: "보컬 아티스트 성장 잠재력 분석")

    // 핵심 KPI 데이터 배열
    kpiMetrics: KpiMetric[];

    // 시각화에 필요한 추가 정보 (Pain -> Gain 구조를 위한 텍스트)
    painPointSummary: string; // 현재 가장 취약한 지점 요약
    gainPotentialStatement: string; // 개선을 통해 얻을 수 있는 잠재적 이득 강조 문구
}

/**
 * API 요청 본문 타입 정의 (필요하다면 추가될 수 있습니다.)
 */
export interface DiagnosisRequest {
    diagnosisType: 'Vocal' | 'Rhythm' | 'Other';
    userId: string;
    contextId: string; // 어떤 컨텍스트(교육 과정)에 대한 진단인지 식별자
}

// 진단 타입 유니온 타입 정의
export type DiagnosisType = 'Vocal' | 'Rhythm' | 'Other';