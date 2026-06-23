/**
 * @fileoverview Gap Score Service에서 사용되는 모든 데이터 구조 및 인터페이스 정의.
 * API 계약의 근거가 되므로 정확성이 최우선입니다.
 */

export type DiagnosisType = 'Growth' | 'Engagement' | 'Monetization';

/**
 * Raw Input Data 구조체. 클라이언트 또는 외부 시스템에서 받은 원본 진단 데이터를 담습니다.
 */
export interface RawDiagnosisData {
    sessionId: string;
    diagnosisType: DiagnosisType; // 예: 'Growth'
    rawMetrics: Record<string, number>; // 'vocal_range', 'pitch_accuracy' 등 실제 측정값 매핑
    userLevel: 'Free' | 'Premium'; // RBAC 관점에서 사용자 레벨
}

/**
 * 최종 진단 점수 결과 구조체. API 응답의 핵심입니다.
 */
export interface DiagnosisResult {
    diagnosisType: DiagnosisType;
    scoreValue: number; // 0~100 사이의 종합 점수 (예측형 경고 지표)
    kpiMetrics: Record<DiagnosisType, number>; // Growth, Engagement, Monetization 개별 KPI 값
    isCritical: boolean; // Critical Failure 여부 (시각화에 사용될 핵심 플래그)
    suggestedAction: string; // 사용자에게 제시할 다음 액션 가이드
}

/**
 * 서비스가 처리할 수 있는 모든 진단 점수 결과의 배열.
 */
export type AllDiagnosisResults = DiagnosisResult[];