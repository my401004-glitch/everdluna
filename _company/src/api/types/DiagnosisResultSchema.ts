// src/api/types/DiagnosisResultSchema.ts

/**
 * @description DiagnosisReport의 최종 API 응답 스키마를 정의합니다.
 * 이 스키마는 Designer가 확정한 'Pain -> Gain' 논리를 코드로 구현한 계약입니다.
 */
export interface DiagnosticScore {
    // 1. 전체 종합 점수 및 등급 (Overall Score)
    overall_score: number; // 0 ~ 100점 사이의 합산 점수
    diagnosis_level: 'Low' | 'Moderate' | 'High' | 'Critical'; // 현재 상태 진단 레벨

    // 2. 세부 KPI 분석 (Core Metrics) - 이 부분이 시각화 핵심입니다.
    kpis: {
        growth: {
            metric_name: string; // 예: 주파수 범위 일관성
            score: number;       // 해당 영역의 점수 (0-100)
            deviation_hz: number; // 문제 지표 값 (예: 평균 ±8Hz)
            improvement_plan: string; // 개선 방향 제시 텍스트
        };
        engagement: {
            metric_name: string; // 예: 리듬 정확도
            score: number;
            deviation_ms: number; // 문제 지표 값 (예: 평균 오차 ms)
            improvement_plan: string;
        };
        monetization: {
            metric_name: string; // 예: 장르 특화 테크닉 숙련도
            score: number;
            deviation_percent: number; // 문제 지표 값 (예: 20% 부족)
            improvement_plan: string;
        };
    };

    // 3. 진단 결과 요약 및 시각적 근거 데이터
    summary: {
        pain_point_focus: string; // 현재 가장 취약한 핵심 Pain Point (Designer Accent Yellow 강조 영역에 사용)
        suggested_action: string; // 즉시 해야 할 액션(CTA 텍스트로 활용)
        confidence_score: number; // 시스템 분석의 신뢰도 점수 (높을수록 UI가 안정적임을 암시)
    };
}

/**
 * @description API 호출 시 필요한 사용자 컨텍스트 정보. RBAC 및 로깅에 사용됩니다.
 */
export interface DiagnosisContext {
    user_id: string;
    role: 'Free' | 'Premium' | 'Admin'; // Role-Based Access Control (RBAC) 필드
    context_id: string; // 현재 진단이 기반한 콘텐츠/학습 세션 ID
}

// 이 스키마를 통해 모든 프론트엔드는 일관된 구조로 데이터를 받게 됩니다.