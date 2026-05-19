/**
 * @fileoverview Diagnosis 시스템의 모든 데이터 구조를 정의하는 타입 파일입니다.
 * 이 인터페이스는 클라이언트(FE)와 서버(BE) 간의 API 계약 역할을 수행합니다.
 */

// 1. 사용자가 테스트에 응답할 때 전송할 입력값 (Input Schema)
export interface UserDiagnosisInputs {
  /** 사용자 식별자 (로그인 유저 ID 등) */
  userId: string;
  /** 진단이 어떤 주제로 이루어졌는지 (예: 화성학, 음정) */
  diagnosisType: 'Harmony' | 'PitchDeviation' | 'Rhythm';
  /** 테스트를 완료한 시간 스탬프 */
  timestamp: number;
  /** 사용자가 직접 입력한 정답/선택지 배열. 객체 구조는 실제 테스트 항목에 따라 조정될 수 있습니다. */
  userAnswers: Array<{
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    confidenceScore?: number; // 사용자 자신이 느끼는 확신도 (0~1)
  }>;
}

// 2. KPI 지표를 위한 상세 구조체 (KPI Metrics)
export interface KPIMetric {
  /** 성장성 지수: 학습 진도 및 습득률 */
  growthScore: number; // 0.0 ~ 1.0 사이의 값
  /** 참여도 지수: 테스트 지속 시간, 질문당 체류 시간 등 (Engagement) */
  engagementScore: number; // 0.0 ~ 1.0 사이의 값
  /** 수익화 잠재력 지표: 유료 모듈 필요성/접근 빈도 (Monetization) */
  monetizationPotential: number; // 0.0 ~ 1.0 사이의 값
}

// 3. 핵심 진단 결과 구조체 (Diagnosis Result Schema - 최종 출력값)
export interface DiagnosisResult {
  /** 전체 Gap Score (핵심 지표): L1 vs L2 간의 격차를 종합적으로 수치화한 점수 */
  overallGapScore: number; // 0부터 100까지의 정규화된 점수 (높을수록 위험/개선 필요)
  /** 진단이 성공적으로 처리되었는지 여부 */
  isSuccessful: boolean;
  /** AI가 분석한 주요 문제점 요약. 사용자에게 보여줄 핵심 메시지입니다. */
  summaryMessage: string;
  /** Gap Score를 구성하는 세부 KPI 지표 */
  kpis: KPIMetric;
  /** 상세 진단 보고서 JSON (추가 정보 포함) */
  detailedReportData: {
    // 예시 필드: 어떤 영역에서 문제가 발생했는지에 대한 구체적인 데이터
    weakestAreas: Array<{ areaName: string, score: number, recommendation: string }>;
    scoreBreakdown: Record<string, number>; // 예: 'Harmony': 75, 'PitchDeviation': 80
  };
}

// API 응답의 전체 구조 (Wrapper)
export interface DiagnosisApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: DiagnosisResult;
}