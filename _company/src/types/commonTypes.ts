export interface UserContext {
  userId: string;
  role: 'Free' | 'Premium';
  isLoggedIn: boolean;
}

export interface DiagnosisResultSchema {
  gapScore: number;
  diagnosisType: string;
  kpis: {
    growthScore: number;
    engagementScore: number;
    monetizationPotential: number;
  };
}
