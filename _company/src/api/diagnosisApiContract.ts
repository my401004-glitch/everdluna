/**
 * @fileoverview Diagnosis Score API Contract (v1.0)
 * 진단 보고서의 성공 및 실패 시나리오를 위한 데이터 구조 정의
 */

export interface DiagnosisResult {
  /// 사용자의 ID 또는 세션 정보
  userId: string;
  /// 진단을 수행한 날짜와 시간 스탬프
  timestamp: Date;
  /** 
   * Core Metrics (핵심 지표): Growth, Engagement, Monetization의 핵심 값.
   * 모든 값이 필수적으로 존재해야 함.
   */
  kpiMetrics: {
    growthScore: number;     // 예: 10점 만점에 8점 (높을수록 좋음)
    engagementScore: number; // 예: 50% 달성 (높을수록 좋음)
    monetizationPotential: number; // 예: 30만원 예상 수입
  };

  /**
   * 진단 결과의 종합적인 해석 점수 (Gap Score).
   * 이 값이 Mockup의 핵심 시각화 요소가 됩니다.
   */
  gapScore: {
    score: number; // 최종 점수 (0~100)
    description: string; // 예: "잠재력이 매우 높은 단계입니다."
    severityLevel: 'High' | 'Medium' | 'Low'; // 보고서의 톤을 결정하는 요소
  };

  /**
   * Mockup에 필요한 세부 진단 항목 리스트 (Pain/Gain 분석 근거)
   */
  detailAnalysis: {
    painPoints: Array<{
      area: string;          // 예: '운지 정확도'
      riskLevel: number;     // 0.0 ~ 1.0 (위험도가 높을수록 가깝다)
      explanation: string;   // 위험 요소에 대한 구체적 설명
    }>;
    opportunities: Array<{
      area: string;          // 예: '리듬 패턴 확장'
      opportunityScore: number; // 0.0 ~ 1.0 (기회가 클수록 가깝다)
      actionPlan: string;    // 기회를 포착할 액션 플랜 제시
    }>;
  };
}

/**
 * API 호출 시 발생 가능한 모든 예외(Failure) 구조 정의
 */
export interface DiagnosisError {
  /// 사용자에게 보여줄 오류 코드 (프론트엔드에서 분기 처리 가능하도록)
  errorCode: 'AUTH_ERROR' | 'DATA_NOT_FOUND' | 'INVALID_INPUT' | 'SYSTEM_FAILURE';
  /// 상세한 에러 메시지. 개발자만 볼 수 있는 로그 레벨의 정보도 포함 가능.
  message: string;
  /** 
   * 예외 상황에 따른 사용자 안내 메시지 (프론트엔드에서 직접 사용) 
   */
  userFriendlyMessage: string;
}

// =========================================================
// [Example Implementation Check]
// API 응답 구조는 Union Type을 사용하여 성공과 실패를 모두 처리할 수 있도록 합니다.
export type DiagnosisApiResponse<T> = {
    success: boolean;
    data: T | null; // success가 true일 경우에만 데이터가 채워집니다.
    error?: DiagnosisError; // success가 false일 경우 이 필드가 사용됩니다.
};

// 성공 시 응답 타입 (T는 DiagnosisResult)
export type SuccessResponse = DiagnosisApiResponse<DiagnosisResult>;
// 실패 시 응답 타입 (T는 void로 처리하거나, error만 포함하게 함)
export type FailureResponse = DiagnosisApiResponse<null & { success: false; error: DiagnosisError }>;