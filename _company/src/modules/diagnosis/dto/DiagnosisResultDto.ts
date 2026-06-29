/**
 * 진단 API 응답 바디 정의 (결과 스키마 준수)
 */
export interface DiagnosisResultDto {
  score: number; // 종합 점수 (0~100)
  analysisSummary: string; // 분석 요약 메시지
  kpis: {
    growthScore: number; // 성장에 대한 지표 (예: 트랙 수 증가율)
    engagementScore: number; // 참여도에 대한 지표 (예: 접속 빈도, 활동성)
    monetizationScore: number; // 수익화 잠재력에 대한 지표 (예: 유료 기능 사용률)
  };
  recommendationSteps: string[]; // 다음 행동 추천 목록
}