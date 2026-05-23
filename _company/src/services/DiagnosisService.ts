// DiagnosisService.ts: 진단 점수 계산의 핵심 로직 (Single Responsibility Principle 준수)

import { UserContext } from '../types'; // 가상의 타입 정의 파일
import { DataExtractorService } from './DataExtractorService';

/**
 * @description 사용자 컨텍스트와 원시 데이터를 받아 종합적인 3가지 KPI를 산출합니다.
 * 핵심: 모든 계산은 트랜잭션 환경 내에서 발생해야 합니다.
 */
export class DiagnosisService {

    // 상수 정의 (지표 가중치 조정 시 사용)
    private readonly WEIGHT_GROWTH = 0.4;
    private readonly WEIGHT_ENGAGEMENT = 0.3;
    private readonly WEIGHT_MONETIZATION = 0.2;
    private readonly WEIGHT_ATTRITION = 0.1; // 신규 가중치

    /**
     * 최종 종합 진단 점수를 계산합니다. (가장 중요한 로직)
     * @param context - 현재 사용자 컨텍스트 및 권한 정보
     * @param rawData - 데이터 추출 서비스에서 가져온 원시 학습 데이터 객체
     * @returns {object} KPI와 Attrition Risk를 포함하는 최종 진단 결과 객체.
     */
    public async calculateDiagnosisScore(context: UserContext, rawData: any): Promise<any> {
        // 1. [안정성 체크] RBAC 및 데이터 존재 유무 검사 (필수)
        if (!context.hasAccess('Growth')) {
            throw new Error("Unauthorized access to Growth KPI.");
        }
        // ... 기타 권한 체크 로직

        // 2. 원시 데이터 추출 (DataExtractorService가 실제 DB와 통신한다고 가정)
        const extractedMetrics = await DataExtractorService.extract(rawData);

        // 3. 개별 KPI 산출 및 가중치 부여
        const growthScore = this.calculateGrowth(extractedMetrics);
        const engagementScore = this.calculateEngagement(extractedMetrics);
        const monetizationScore = this.calculateMonetization(extractedMetrics);
        
        // 4. [핵심 추가] Attrition Risk Score 산출 (가장 높은 우선순위)
        const attritionRisk = this.calculateAttritionRisk(extractedMetrics); // <-- 신규 로직

        // 5. 최종 종합 점수 계산 (Weighted Average)
        const finalScore = (
            growthScore * this.WEIGHT_GROWTH +
            engagementScore * this.WEIGHT_ENGAGEMENT +
            monetizationScore * this.WEIGHT_MONETIZATION +
            attritionRisk * this.WEIGHT_ATTRITION
        ).toFixed(2);

        return {
            overallScore: parseFloat(finalScore),
            kpis: {
                growth: growthScore,
                engagement: engagementScore,
                monetization: monetizationScore,
                attritionRisk: attritionRisk // 새 지표 포함
            },
            // 원본 데이터와 함께 Context ID를 반환하여 추적성을 높임.
        };
    }

    /** Attrition Risk 계산 로직 (세부 구현 필요) */
    private calculateAttritionRisk(metrics: any): number {
        // *WHY*: 이탈 위험은 '시간'과 '활동량의 감소율'에 비례합니다.
        // 예시 로직: 최근 활동 빈도 / 평균 활동 빈도
        const recentSessions = metrics['recent_sessions'] || 0;
        const avgSessions = metrics['avg_sessions'] || 1;

        if (recentSessions < avgSessions * 0.5) {
            // 50% 이상 감소 시, 높은 위험 점수 부여 (최대치에 근접하게)
            return Math.min(100, (avgSessions - recentSessions) / avgSessions * 120);
        }
        return 10; // 기본값 또는 낮은 위험 점수
    }

    // 나머지 KPI 계산 함수는 생략...
    private calculateGrowth(metrics: any): number { /* ... */ return 75; }
    private calculateEngagement(metrics: any): number { /* ... */ return 85; }
    private calculateMonetization(metrics: any): number { /* ... */ return 60; }
}