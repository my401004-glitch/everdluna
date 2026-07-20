/**
 * A/B 테스트 그룹에 따라 동적으로 생성되는 AdCard의 Props 인터페이스입니다.
 * 이 구조는 백엔드 API 계약(API Contract)과 일치해야 합니다.
 */
export interface DynamicContent {
  // A/B 테스트 그룹 변수에 따라 달라지는 메인 카피 (예: '손실 회피' vs '권위 지향')
  headlineVariation: string; 
  mainCopy: string;
  
  // Loss Area에 표시될 동적 메시지 및 색상 정보
  lossAreaMessage: {
    text: string;
    colorClass: string; // Tailwind CSS class 등 (e.g., 'bg-red-50')
  };

  // CTA 버튼의 텍스트와 액션 URL
  ctaButton: {
    text: string;
    link: string;
  };
}

/**
 * AdCard 컴포넌트에 전달될 최종 props 구조입니다.
 */
export interface AdCardProps {
  dynamicData: DynamicContent;
  // A/B 그룹을 수동으로 오버라이드하거나, 런타임에 컨텍스트를 주입할 때 사용합니다.
  abTestGroupOverride?: 'A' | 'B' | 'Control'; 
}

/**
 * 백엔드 API가 반환해야 하는 진단 점수 구조의 간소화 버전입니다.
 */
export interface DiagnosisScore {
    growth: number; // Growth KPI
    engagement: number; // Engagement KPI
    monetization: number; // Monetization KPI
}