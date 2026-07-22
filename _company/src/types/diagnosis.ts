export interface KpiMetrics {
  growthScore: number; // 성취도 증가율 (학습 진도)
  engagementScore: number; // 참여 빈도 및 깊이
  monetizationPotential: number; // 유료 기능 전환 가능성 지표
}

export interface DiagnosisResult {
  userId: string;
  diagnosisType: 'Pitch' | 'Rhythm' | 'Tone'; // 진단 유형 (예시)
  gapScore: number; // 핵심 Gap Score 값
  kpiMetrics: KpiMetrics;
  monetizationTriggers: {
    triggerId: string; // 유료 기능 ID (e.g., Premium_Rhythm_Analysis)
    condition: 'HIGH' | 'MEDIUM' | 'LOW'; // 트리거 활성화 조건
    description: string; // 사용자에게 보여줄 문구
  }[];
}

export interface DiagnosisInput {
  userId: string;
  sessionId: string;
  rawDataPoints: any[]; // 실제 진단에 사용되는 raw 데이터 포인트 배열 (예: 음높이, 시간 간격 등)
}