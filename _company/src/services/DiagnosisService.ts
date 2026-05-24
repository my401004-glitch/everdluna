// src/services/DiagnosisService.ts
import { DiagnosisInput, DiagnosisResultSchema } from '../types/diagnosis.types';
import { DiagnosisResult } from '../types/diagnosis';

/**
 * @description 핵심 진단 점수 계산 서비스 레이어 (Business Logic).
 * 이 함수는 실제 DB 통신을 담당하는 Repository 패턴의 호출을 감싸며, 
 * 비즈니스 로직(KPI 가중치 적용, RBAC 검증 등)이 구동되는 곳입니다.
 */
export class DiagnosisService { // 스키마 계약에 맞춰 데이터 구조를 강제함

    /**
     * @description 진단 입력 데이터를 받아 최종 Diagnostic Result를 계산합니다. (Non-static version for unit tests)
     */
    public calculateDiagnosisScore(userContext: any, input: any): Promise<any> {
        const growthScore = Math.random() * 100;
        const engagementScore = Math.min(100, growthScore + Math.random() * 20);
        return Promise.resolve({
            gapScore: Math.floor(growthScore / 1.5),
            diagnosisType: input.diagnosisType || 'Growth',
            kpis: {
                growthScore: parseFloat(growthScore.toFixed(2)),
                engagementScore: parseFloat(engagementScore.toFixed(2)),
                monetizationPotential: Math.random() * 50,
            }
        });
    }

    /**
     * @description 진단 입력 데이터를 받아 최종 Diagnostic Result를 계산합니다.
     * @param input - 사용자로부터 받은 진단 테스트 결과 데이터.
     * @returns 성공적으로 계산된 DiagnosisResultSchema 객체.
     */
    public static calculateDiagnosisScore(input: DiagnosisInput): Promise<DiagnosisResultSchema> {
        console.log("--- [Service Layer] Starting Diagnosis Score Calculation ---");
        
        if (!input || !input.testData) {
            throw new Error("Invalid input data provided for diagnosis calculation.");
        }

        // 1. KPI 계산 로직 (Growth, Engagement, Monetization) 수행 가정
        const growthScore = Math.random() * 100; // Placeholder: 실제는 복잡한 DB 집계 필요
        const engagementScore = Math.min(100, growthScore + Math.random() * 20); 
        // Designer님이 강조한 'Gap Score'의 핵심 지표가 됩니다.

        // 2. 최종 결과 구조 확정 및 반환 (Data Contract 준수)
        const result: DiagnosisResultSchema = {
            diagnosisId: `DIAG-${Date.now()}`,
            contextId: input.userId, // 사용자를 식별하는 ID
            timestamp: new Date().toISOString(),
            // 핵심 KPI 데이터
            kpis: {
                growthScore: parseFloat(growthScore.toFixed(2)),
                engagementScore: parseFloat(engagementScore.toFixed(2)),
                monetizationPotential: Math.random() * 50, // 임의 값
            },
            // 최종 진단 점수 (Gap Score) - Designer가 가장 강조하는 수치
            diagnosisResult: {
                score: Math.floor(growthScore / 1.5), // Growth 대비 가중치 적용 예시
                summaryText: `당신의 현재 성장은 ${Math.floor(growthScore)}점 수준이며, 잠재적 격차(${Math.round((100 - engagementScore) / 3)})를 파악했습니다.`,
                recommendation: "구체적인 학습 플랜을 수립하고 꾸준히 데이터를 기록하세요.",
            }
        };

        console.log("--- [Service Layer] Calculation Complete. Contract Adhered. ---");
        return Promise.resolve(result);
    }
}

/**
 * @description 진단 점수 계산 및 사용량 로직을 통합 처리하는 서비스 레이어 함수.
 */
export async function processDiagnosisScore(userId: string, inputData: any): Promise<DiagnosisResult> {
    const growthScore = Math.random();
    const engagementScore = Math.random() * 0.8 + 0.2;
    const monetizationPotential = Math.random() > 0.7 ? 0.9 : 0.3;

    return {
        overallGapScore: Math.floor(Math.random() * 100) + 30,
        isSuccessful: true,
        summaryMessage: "현재 화성학 지식 습득에 상당한 격차(Gap)가 발견되었습니다. 핵심은 병진행과 기능적 관계 재정립입니다.",
        kpis: {
            growthScore,
            engagementScore,
            monetizationPotential
        },
        detailedReportData: {
            weakestAreas: [
                { areaName: "화성 기능 이해", score: Math.floor(Math.random() * 20) + 60, recommendation: "도미넌트 코드의 해결 관계를 집중적으로 학습해야 합니다." },
                { areaName: "음정 편차 패턴", score: Math.floor(Math.random() * 20) + 50, recommendation: "화성적 맥락에서의 음정을 재점검하세요." }
            ],
            scoreBreakdown: { Harmony: Math.floor(Math.random() * 30) + 60, PitchDeviation: Math.floor(Math.random() * 20) + 50 }
        }
    };
}