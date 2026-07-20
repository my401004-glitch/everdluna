import { DynamicContent, DiagnosisScore } from '../types/adcard';

/**
 * 가상의 백엔드 API 호출을 시뮬레이션합니다.
 * 주어진 A/B 그룹 컨텍스트에 따라 동적 콘텐츠를 생성하여 반환하는 핵심 로직입니다.
 * @param abTestGroup 'A' (손실 회피), 'B' (권위 지향), 'Control' 기본값
 * @returns DynamicContent 객체
 */
export const fetchDynamicAdCardData = async (abTestGroup: 'A' | 'B' | 'Control'): Promise<DynamicContent> => {
  // 딜레이를 주어 비동기 API 호출처럼 보이게 합니다.
  await new Promise(resolve => setTimeout(resolve, 300));

  let dynamicData: DynamicContent;

  switch (abTestGroup) {
    case 'A': // 손실 회피 그룹 (Loss Aversion) - 가장 높은 불안감 조성
      dynamicData = {
        headlineVariation: "⚠️ 지금 이 기회를 놓치면, OOO를 잃을 수 있습니다.",
        mainCopy: "경쟁사보다 앞서 나가기 위한 핵심 지표가 부족합니다. 저희 시스템은 데이터 기반의 'Gap'을 즉시 채워줍니다.",
        lossAreaMessage: { text: "놓치는 기회 = 시간적 손실", colorClass: "bg-red-100 border-red-300" },
        ctaButton: { text: "🚨 Gap 점수 진단 받고 시작하기", link: "/diagnosis/ab_a" }
      };
      break;
    case 'B': // 권위 지향 그룹 (Authority Bias) - 전문가적 신뢰 강조
      dynamicData = {
        headlineVariation: "🥇 업계 최고가 선택한, 검증된 AI 학습 커리큘럼.",
        mainCopy: "수많은 입시생들이 신뢰하는 데이터 기반의 성장 서사. 명확하게 증명된 방법론으로 최고의 결과를 만드세요.",
        lossAreaMessage: { text: "검증된 시스템을 통해 확실한 성공 경로 확보", colorClass: "bg-blue-100 border-blue-300" },
        ctaButton: { text: "🎓 전문가 진단 받기 (선착순)", link: "/diagnosis/ab_b" }
      };
      break;
    case 'Control': // 기본 그룹 또는 테스트 불가 시의 안전장치
    default:
      dynamicData = {
        headlineVariation: "AI 기반 맞춤 학습으로 최고의 실력을 경험하세요.",
        mainCopy: "본 서비스는 사용자의 잠재적 Gap을 진단하고, 가장 효율적인 성장 로드맵을 제시합니다.",
        lossAreaMessage: { text: "당신의 성장을 위한 최적의 시작점", colorClass: "bg-gray-100 border-gray-300" },
        ctaButton: { text: "✨ 서비스 체험하기", link: "/diagnosis/default" }
      };
  }

  // 모든 API 응답은 성공적인 데이터 구조를 가져야 합니다.
  return dynamicData; 
};


/**
 * A/B 테스트 시뮬레이션을 위한 Mock 데이터 로직을 포함한 최종 API 서비스입니다.
 * 이 함수는 실제 백엔드(FastAPI 등)의 GET /api/v1/adcard_data 엔드포인트에 해당합니다.
 */
export const simulateApiCall = async (group: 'A' | 'B' | 'Control'): Promise<DynamicContent> => {
    console.log(`[API Simulation] Running A/B Test for group: ${group}`);
    return fetchDynamicAdCardData(group);
};

export type ABTestGroupContext = {
    ab_test_group: 'A' | 'B' | 'Control';
    conversion_flag: boolean; // 이 사용자가 이미 진단 결과에 만족했는지 여부 (추가 로직 검증용)
}