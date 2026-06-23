import { RawDiagnosisData, DiagnosisResult, AllDiagnosisResults } from './gapScoreTypes';

/**
 * Gap Score 계산 및 종합 진단 로직을 담당하는 서비스 레이어입니다.
 * [WHY]: 이 함수는 비즈니스 규칙(Business Rule)이 집약되어 있어 외부 노출 없이, 테스트 가능한 순수 로직으로 분리해야 합니다.
 */
export class GapScoreService {

    /**
     * 주어진 원본 데이터 배열을 받아 종합 진단 결과를 생성합니다.
     * @param rawDataList - 처리할 RawDiagnosisData 객체 리스트.
     * @returns AllDiagnosisResults - 각 유형별 최종 진단 결과 배열.
     */
    public static calculate(rawDataList: RawDiagnosisData[]): AllDiagnosisResults {
        if (!rawDataList || rawDataList.length === 0) {
            console.warn("GapScoreService: 처리할 원본 데이터가 없습니다.");
            return [];
        }

        const resultsMap = new Map<string, DiagnosisResult>(); // SessionId 기준 결과 통합 관리

        for (const rawData of rawDataList) {
            // 1. 권한 검증 및 필터링 (RBAC Check - 최우선 방어 로직)
            if (rawData.userLevel === 'Free' && rawData.diagnosisType === 'Monetization') {
                console.warn(`[${rawData.sessionId}] Free 사용자에게는 Monetization 진단 접근이 제한됩니다.`);
                // 에러를 던지기보다, 빈 결과 또는 경고 메시지를 반환하여 시스템이 멈추지 않게 합니다.
                continue;
            }

            // 2. 핵심 KPI 계산 및 로직 수행
            const result = this.calculateSingleDiagnosis(rawData);
            resultsMap.set(`${rawData.sessionId}_${rawData.diagnosisType}`, result);
        }

        return Array.from(resultsMap.values());
    }

    /**
     * 단일 진단 데이터에 대한 KPI 계산 및 종합 점수 도출 로직입니다. (핵심 비즈니스 로직)
     * @param rawData - 단일 RawDiagnosisData 객체.
     * @returns DiagnosisResult - 해당 유형의 최종진단결과.
     */
    private static calculateSingleDiagnosis(rawData: RawDiagnosisData): DiagnosisResult {
        // [가정] 실제 KPI 계산은 복잡한 통계 모델을 거치지만, 여기서는 로직 흐름만 구현합니다.

        let kpiGrowth = rawData.rawMetrics['pitch_accuracy'] || 0;
        let kpiEngagement = rawData.rawMetrics['vocal_range'] || 0;
        let kpiMonetization = rawData.rawMetrics['consistency'] || 0;

        // 진단 유형에 따라 어떤 KPI를 주력으로 볼지 결정
        let primaryScore: number;
        let suggestedAction: string;
        let isCritical: boolean;

        if (rawData.diagnosisType === 'Growth') {
            primaryScore = Math.min(100, kpiGrowth * 1.5 + kpiEngagement * 0.5); // Growth는 Pitch Accuracy가 중요
            suggestedAction = "개별 주파수 구간의 정밀한 트레이닝을 추천합니다.";
            isCritical = primaryScore < 40;
        } else if (rawData.diagnosisType === 'Engagement') {
            primaryScore = Math.min(100, kpiEngagement * 1.2 + kpiGrowth * 0.3); // Engagement는 Range가 중요
            suggestedAction = "다양한 난이도의 레퍼토리를 통해 음역 확장 연습을 병행하세요.";
            isCritical = primaryScore < 45;
        } else { // Monetization (또는 Default)
            primaryScore = Math.min(100, kpiMonetization * 2); // Consistency가 가장 중요
            suggestedAction = "일관성을 높이기 위해 매일 루틴한 연습을 습관화해야 합니다.";
            isCritical = primaryScore < 35;
        }

        return {
            diagnosisType: rawData.diagnosisType,
            scoreValue: parseFloat(primaryScore.toFixed(2)), // 최종 점수 (시각화용)
            kpiMetrics: { Growth: kpiGrowth, Engagement: kpiEngagement, Monetization: kpiMonetization },
            isCritical: isCritical,
            suggestedAction: suggestedAction
        };
    }
}