/**
 * 복잡한 비즈니스 로직 (KPI 계산, RBAC 체크)을 담당하는 서비스 계층
 */
import { Injectable } from '@nestjs/common';
import { DiagnosisResultDto } from '../dto/DiagnosisResultDto';

@Injectable()
export class DiagnosticService {
  /**
   * @description 진단 타입과 사용자 ID를 기반으로 점수를 계산하고 결과를 구조화합니다.
   * 핵심: 여기서 모든 비즈니스 규칙(RBAC, KPI 가중치)이 적용되어야 합니다.
   */
  async calculateScore(diagnosisType: string, userId?: string): Promise<DiagnosisResultDto> {
    console.log(`[Service] Running diagnosis for type: ${diagnosisType}, User: ${userId || 'N/A'}`);

    // [Mock 1: RBAC 체크] 만약 사용자가 특정 타입에 접근 권한이 없다면 에러 발생시키는 로직을 추가해야 함.
    if (diagnosisType === "PREMIUM_TEST" && !userId) {
        throw new Error("권한 부족: 프리미엄 진단 테스트는 로그인된 사용자만 이용 가능합니다.");
    }

    // [Mock 2: DB 데이터 조회 및 KPI Aggregation] - 실제로는 여기서 Repository를 통해 데이터를 가져옴.
    const rawData = this.fetchRawDiagnosisData(diagnosisType, userId);

    if (!rawData) {
        throw new Error("진단에 필요한 원본 데이터가 없습니다.");
    }

    // [Mock 3: 점수 계산 및 가공]
    const totalScore = Math.min(100, Math.floor(Math.random() * (85 - 60 + 1) + 60)); // 60~85점 사이 랜덤 값
    
    // KPI별 가중치 계산 로직 (가장 중요!)
    const kpis = {
        growthScore: Math.min(30, rawData.kpi_g * (totalScore / 100) * 1.2), // Growth에 높은 가중치 부여
        engagementScore: Math.min(40, rawData.kpi_e * 0.9 + 5),
        monetizationScore: Math.min(30, rawData.kpi_m * 1.1),
    };

    // 최종 결과 스키마 반환 (타입 안전성 확보)
    return {
      score: totalScore,
      analysisSummary: `전반적인 잠재력은 높으나, ${['Growth', 'Engagement', 'Monetization'][Math.floor(Math.random() * 3)]} 지표 보강이 시급합니다.`,
      kpis: kpis,
      recommendationSteps: [
        "1단계: A/B 그룹 비교 데이터를 확보하세요.",
        "2단계: 시스템을 활용하여 '취약점'에 대한 가설 검증 테스트를 진행하세요."
      ]
    };
  }

  /**
   * @description (Mock) 실제 DB에서 원본 진단 데이터셋을 조회하는 함수.
   */
  private fetchRawDiagnosisData(diagnosisType: string, userId?: string): any | null {
     // TODO: 실제로는 Repository를 통해 SQL 쿼리 실행 필요
    return {
        kpi_g: Math.random() * 10 + 5, // Mock Growth KPI (5~15)
        kpi_e: Math.random() * 20 + 10, // Mock Engagement KPI (10~30)
        kpi_m: Math.random() * 8 + 2,  // Mock Monetization KPI (2~10)
    };
  }
}