export interface DiagnosisInput {
  userId: string;
  testData: any;
  contextId: string;
}

export interface DiagnosisResultSchema {
  diagnosisId: string;
  contextId: string;
  timestamp: string;
  kpis: {
    growthScore: number;
    engagementScore: number;
    monetizationPotential: number;
  };
  diagnosisResult: {
    score: number;
    summaryText: string;
    recommendation: string;
  };
}
