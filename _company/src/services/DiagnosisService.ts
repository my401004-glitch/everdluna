import { DiagnosisResult, DiagnosisInput, KpiMetrics } from '../types/diagnosis';

/**
 * @description 진단 데이터를 기반으로 Gap Score 및 KPI를 계산하는 핵심 서비스 로직입니다.
 * 비즈니스 규칙과 데이터 흐름의 정확성을 책임집니다. [근거: sessions/2026-05-18T14-34/developer.md]
 * @param input - 진단에 필요한 사용자 ID, 세션 ID 및 원시 데이터를 포함합니다.
 * @returns 계산된 DiagnosisResult 객체.
 */
export const getDiagnosisScore = async (input: DiagnosisInput): Promise<DiagnosisResult> => {
  if (!input || !input.userId || !input.rawDataPoints) {
    // 필수 입력값 검증 (Guard Clause)
    throw new Error("Diagnosis input data is incomplete or invalid.");
  }

  // 1. Gap Score 계산 로직 (핵심 비즈니스 로직)
  // [추측] 실제 복잡한 ML/통계 모델이 들어가야 하나, 여기서는 가상의 로직으로 대체합니다.
  const baseScore = input.rawDataPoints.length * 0.8 + Math.random() * 10;
  const gapScore = Math.min(100, Math.max(0, Math.round(baseScore)));

  // 2. KPI 메트릭 산출 (Growth, Engagement, Monetization)
  let kpiMetrics: KpiMetrics;
  try {
    kpiMetrics = calculateKpis(input); // 내부 계산 함수 호출
  } catch (error) {
    console.error("KPI Calculation failed:", error);
    // KPI 산출 실패 시 안전한 기본값 반환
    kpiMetrics = { growthScore: 0, engagementScore: 0, monetizationPotential: 0 };
  }

  // 3. 유료 기능 트리거 감지 (Monetization Triggers)
  const triggers = detectMonetizationTriggers(kpiMetrics);

  // 4. 최종 결과 구조 반환
  return {
    userId: input.userId,
    diagnosisType: 'Pitch', // Mockup Spec에 따른 기본값 설정
    gapScore: gapScore,
    kpiMetrics: kpiMetrics,
    monetizationTriggers: triggers,
  };
};

/**
 * @description 원시 데이터를 기반으로 KPI를 계산하는 내부 함수. [근거: sessions/2026-05-18T43/developer.md]
 */
const calculateKpis = (input: DiagnosisInput): KpiMetrics => {
  // 실제 로직은 데이터 분석에 따라 복잡하게 구현되어야 합니다.
  const rawDataCount = input.rawDataPoints.length;

  // 예시 로직: Growth는 데이터 양에 비례, Engagement는 세션 빈도(가정)에 비례
  const growth = Math.min(100, rawDataCount * 2); // 가상의 성장 점수
  const engagement = Math.floor(rawDataCount / 5) + 1; // 가상의 참여 점수

  // Monetization은 Gap Score가 높고 Engagement가 일정 수준 이상일 때 증가하는 구조를 가정합니다.
  const monetizationPotential = (growth * 0.3) + (engagement * 2);

  return {
    growthScore: growth,
    engagementScore: engagement,
    monetizationPotential: Math.min(100, monetizationPotential),
  };
};


/**
 * @description KPI를 기반으로 유료 기능 활성화 여부를 판단하는 함수. [근거: sessions/2026-05-18T13:43]
 */
const detectMonetizationTriggers = (kpiMetrics: KpiMetrics): { triggerId: string; condition: 'HIGH' | 'MEDIUM' | 'LOW'; description: string }[] => {
  const triggers: any[] = [];

  // 트리거 1: Gap Score가 높으면, 심화 분석 기능(High) 권유
  if (kpiMetrics.growthScore > 70 && kpiMetrics.monetizationPotential > 50) {
    triggers.push({
      triggerId: 'Premium_AdvancedAnalysis',
      condition: 'HIGH',
      description: "현재 진단 점수 기반 심화 분석이 필요합니다. 프리미엄 모듈을 확인해 보세요.",
    });
  }

  // 트리거 2: Engagement가 낮으면, 동기 부여 콘텐츠(Medium) 권유
  if (kpiMetrics.engagementScore < 3 && kpiMetrics.growthScore > 10) {
     triggers.push({
      triggerId: 'Motivation_ContentPack',
      condition: 'MEDIUM',
      description: "진단 결과를 바탕으로, 부족한 부분을 채워줄 맞춤 콘텐츠를 추천합니다.",
    });
  }

  return triggers;
};