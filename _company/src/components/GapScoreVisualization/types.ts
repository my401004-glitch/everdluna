export interface DiagnosisResult {
  contextId: string; // 진단 컨텍스트 ID
  timestamp: number; // 결과 기록 시간 (Unix Timestamp)
  // 핵심 KPI 데이터 구조 (Writer의 3가지 지표 + Gap Score)
  kpis: {
    growthScore: number;      // 성장 잠재력 점수 (0-100)
    engagementScore: number;  // 몰입도/지속성 점수 (0-100)
    monetizationScore: number;// 수익화 연관성 점수 (0-100)
  };
  // Gap Score를 위한 구체적인 데이터 포인트 배열 (시간별 변화 추이 시각화용)
  gapScoreHistory: {
    timestamp: number; // 측정 시간
    score: number;     // 해당 시점의 Gap Score 값
    contextId?: string; // 특정 컨텍스트와 연결될 수 있음
  }[];
}

export interface VisualizationProps {
  data: DiagnosisResult | null; // 데이터가 로딩 중일 경우를 대비해 Null 허용
  isLoading: boolean;          // 로딩 상태 플래그
  isFirstLoad: boolean;        // 첫 진단 시점인지 여부 (애니메이션 시작 조건)
}

export type ScoreMetricKey = 'growthScore' | 'engagementScore' | 'monetizationScore';