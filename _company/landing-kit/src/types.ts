// 🎨 디자인 시스템 및 데이터 모델 정의 파일
export interface DiagnosisResult {
  growthScore: number; // Growth KPI 값 (0-100)
  engagementScore: number; // Engagement KPI 값 (0-100)
  monetizationScore: number; // Monetization KPI 값 (0-100)
  gapScoreDepth: number; // Gap Score Depth 지표
  trendData: {
    date: string;
    growth: number;
    engagement: number;
    monetization: number;
  }[];
}

export interface ApiDiagnosisResponse {
  diagnosisId: string;
  resultData: DiagnosisResult;
  contextId: string;
  timestamp: string;
}

export interface ApiResponseError {
  success: boolean;
  message: string;
  errorCode?: string;
}