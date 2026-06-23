import { DiagnosisResult, GapScoreMetrics } from '../api/gapScore';

/**
 * @class GapScoreService
 * KPI Aggregation Service의 핵심 로직을 담당합니다. 
 * 외부 데이터(DB 조회)를 받아 정제하고, 비즈니스 규칙에 따라 Gap Score를 산출하여 DTO를 생성합니다.
 */
export class GapScoreService {

    /**
     * Mock Data Source (실제로는 DB Repository 계층이 이 역할을 수행해야 함)
     * @param rawData - 진단 테스트 결과를 담은 가상의 원시 데이터 객체.
     */
    public async calculate(rawData: Record<string, any>, contextId: string): Promise<DiagnosisResult> {
        console.log(`[Service] Calculating Gap Score for Context ID: ${contextId}`);

        // 1. Input Validation & RBAC Check (최우선 검증)
        if (!this.isValidContext(rawData)) {
            throw new Error("Invalid or incomplete raw data provided.");
        }

        // 2. Core KPI Calculation Logic (Business Rule Application)
        const metrics = this.calculateMetrics(rawData);

        // 3. Storytelling Hint Generation (Writer/Designer 요구 반영)
        const hints = this.generateHints(metrics);
        
        // 4. Final DTO Assembly
        return {
            metadata: {
                contextId: contextId,
                userRole: rawData.userRole || 'free', // 안전하게 기본값 사용
            },
            metrics: {
                ...metrics,
                storytellingHints: hints
            },
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Mock Validation Logic
     */
    private isValidContext(rawData: Record<string, any>): boolean {
        // 예시: 필수 필드가 누락되었는지 확인하는 로직 (Edge Case 처리)
        return !!rawData.pitchDeviation && !!rawData.resonanceFrequency;
    }

    /**
     * 핵심 KPI 산출 로직
     */
    private calculateMetrics(rawData: Record<string, any>): GapScoreMetrics {
        // 가상의 복잡한 계산 로직을 단순화하여 구현합니다. 
        // 실제로는 통계적 모델링이나 머신러닝 결과가 사용될 것입니다.

        const pitchDev = rawData.pitchDeviation || 0;
        const resFreqGap = rawData.resonanceFrequency || 0;

        // Gap Score는 기술적 결함(Pitch)과 잠재력 부족(Resonance)의 가중 평균으로 정의합니다.
        const overallScore = Math.min(1.0, (pitchDev * 0.4 + resFreqGap * 0.6) / 10);

        // Warning State 결정: Pitch Deviation이 임계치를 넘을 때 경고 상태로 설정합니다.
        const isWarningState = pitchDev > 5; // 예시 기준

        return {
            growthScore: rawData.growth || 0,
            engagementScore: rawData.engagement || 0,
            monetizationScore: rawData.money || 0,
            overallGapScore: parseFloat(overallScore.toFixed(4)),
            technicalGaps: {
                pitchDeviationPercent: parseFloat(pitchDev.toFixed(2)),
                resonanceFrequencyGapRatio: parseFloat(resFreqGap.toFixed(2)),
                isWarningState: isWarningState,
            },
            storytellingHints: {} as any, // 나중에 채워질 예정
            dataSourcesVerified: true, // 일단 임시로 True 처리
        };
    }

    /**
     * 스토리텔링 힌트 생성 로직 (Writer/Designer 협업 영역)
     */
    private generateHints(metrics: GapScoreMetrics): { painPointMessage: string; improvementArea: string; suggestedModule: 'Pitching' | 'Rhythm' | 'Harmony'; } {
        let suggestion: 'Pitching' | 'Rhythm' | 'Harmony';
        let message: string;

        if (metrics.technicalGaps.pitchDeviationPercent > 5) {
            suggestion = 'Pitching';
            message = "음정 편차(Pitch Deviation)가 높습니다. 가장 먼저 기초 음정 훈련에 집중해야 합니다.";
        } else if (metrics.overallGapScore < 0.3) {
             suggestion = 'Harmony';
             message = "전반적인 구조적 이해도가 낮습니다. 화성학 기본 개념부터 복습이 필요합니다.";
        } else {
            suggestion = 'Rhythm';
            message = "리듬과 박자의 정확성을 높이는 훈련이 다음 단계의 핵심입니다.";
        }

        return {
            painPointMessage: `당신의 노력은 아직 객관적인 수치로 증명되지 않고 있습니다. (Gap Score: ${metrics.overallGapScore * 100}%)`,
            improvementArea: message,
            suggestedModule: suggestion,
        };
    }
}

// 간단한 테스트 코드 추가 및 모듈 익스포트
export const gapScoreServiceInstance = new GapScoreService();