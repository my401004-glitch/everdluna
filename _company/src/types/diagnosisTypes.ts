export interface GapScoreData {
  score: number; // 전체 진단 점수 (0~100). 이 값이 높을수록 'Gap'이 큼.
  gapType: 'Growth' | 'Engagement' | 'Monetization'; // 현재 측정된 KPI 유형
  contextId: string; // 어떤 컨텍스트에서 측정되었는지 식별자
  timestamp: Date; // 데이터 기록 시간
}

export interface DiagnosisScoreDisplayProps {
  data: GapScoreData; // 진단 점수 데이터 전체를 받습니다.
  title: string; // 이 섹션의 제목 (예: "성장 잠재력 분석")
}