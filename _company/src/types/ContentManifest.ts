/**
 * @description 콘텐츠 업로드 및 시스템 추적을 위한 단일 진실 공급원 (Single Source of Truth).
 * 이 Manifest는 Writer, Designer가 확정한 모든 메타데이터를 통합하며, uploader 스크립트의 유효성 검증 대상입니다.
 */
export interface ContentManifest {
  // 1. 기본 식별자 및 콘텐츠 정보
  videoTitle: string; // 필수: [근거: Writer 제안 제목]
  videoDescription: string; // 필수: [근거: Writer 설명 전략]
  targetKeywords: string[]; // 필수: 핵심 해시태그 배열

  // 2. 디자인/비주얼 정보 (Designer가 확정한 사양)
  thumbnailPath: string; // 필수: 최종 이미지 파일 경로
  designSpecs: {
    colorPalette: 'Dark Blue' | 'Accent Yellow';
    visualizationConcept: string;
  };

  // 3. 핵심 데이터/KPI 추적 정보 (Writer가 확정한 진단 로직)
  diagnosisContextId: string; // 필수: 어떤 진단을 기반으로 했는지 식별자
  primaryGapScoreMetric: 'Growth' | 'Engagement' | 'Monetization'; // 필수: 이번 영상이 집중적으로 다룰 KPI
  gapVisualizationDataPointA: number; // 예: -8Hz (Pain)
  gapVisualizationDataPointB: number; // 예: +10Hz (Gain)

  // 4. A/B 테스트 관련 정보 (가장 중요, 지속적인 개선을 위한 핵심 메타데이터)
  abTestVariables?: {
    platform: 'YouTube' | 'Instagram Reels' | 'Landing Page';
    variableName: string; // 테스트하는 변수 이름 예: "Title_V1"
    hypothesizedMetric: string; // 예측 KPI 예: "CTR 6% 이상"
  }[];

  // 5. 기타 시스템 메타데이터
  creationDate: Date;
}