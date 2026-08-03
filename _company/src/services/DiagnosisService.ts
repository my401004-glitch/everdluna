/**
 * @fileoverview DiagnosisService: 사용자 진단 점수를 계산하는 핵심 서비스 로직.
 * Critical Failure Point(Zero Input, Out-of-Range Data)를 방어하기 위해 모든 입력과 출력을 검증합니다.
 */

import { DiagnosisInput } from '../types/diagnosisTypes'; // 가상의 타입 파일 임포트 가정

/**
 * 진단 점수를 계산하는 핵심 서비스 함수입니다.
 * 이 함수의 안정성 확보가 최우선 목표입니다.
 * @param input - 진단에 필요한 모든 입력 데이터 (음원, 컨텍스트 ID 등).
 * @returns {DiagnosisResult} 검증된 진단 결과 객체 또는 안전한 기본값.
 */
export function calculateDiagnosisScore(input: DiagnosisInput): DiagnosisResult {
    // --------------------
    // 1. Input Validation & Zero Input Handling (최우선 방어)
    // --------------------
    if (!input || !input.audioData || !input.contextId) {
        console.error("DiagnosisService Critical Failure: 필수 입력 데이터가 누락되었습니다.");
        // 안전한 기본값 반환 (Fallback Mechanism)
        return createSafeDefaultResult(errorMessage = "진단에 필요한 데이터가 불완전합니다.", contextId = input?.contextId || 'UNKNOWN');
    }

    try {
        // --------------------
        // 2. Core Calculation Logic (실제 비즈니스 로직이 들어갈 곳)
        // --------------------
        console.log(`[DiagnosisService] Context ${input.contextId}에 대한 진단 시작.`);
        
        // 가상의 핵심 KPI 계산 함수 호출
        const rawMetrics = runAIVoiceAnalysis(input.audioData);

        if (!rawMetrics) {
             throw new Error("AI 분석 모듈에서 유효한 메트릭을 반환받지 못했습니다.");
        }

        let growthScore = calculateGrowth(rawMetrics); // 가상 함수 호출
        let engagementScore = calculateEngagement(rawMetrics); // 가상 함수 호출
        let monetizationScore = calculateMonetization(rawMetrics); // 가상 함수 호출

        // --------------------
        // 3. Output Validation & Out-of-Range Handling (최종 방어)
        // --------------------
        const safeGrowthScore = clampValue('Growth', growthScore, 0, 100);
        const safeEngagementScore = clampValue('Engagement', engagementScore, 0, 100);
        const safeMonetizationScore = clampValue('Monetization', monetizationScore, 0, 100);

        // 최종 결과 구조 생성
        return {
            contextId: input.contextId,
            timestamp: new Date().toISOString(),
            scores: {
                Growth: safeGrowthScore,
                Engagement: safeEngagementScore,
                Monetization: safeMonetizationScore,
            },
            // 여기에 나머지 리포팅 데이터를 추가합니다.
        };

    } catch (error) {
        console.error("DiagnosisService Critical Failure: 핵심 로직 실행 중 예외 발생.", error);
        // 예측 불가한 에러가 발생했을 경우에도 안전하게 실패 처리
        return createSafeDefaultResult(errorMessage = `시스템 오류로 진단에 실패했습니다. (${error instanceof Error ? error.message : 'Unknown Error'})`, contextId = input.contextId);
    }
}


/**
 * KPI 값을 지정된 범위 내로 클램핑하여 Out-of-Range Data를 방지합니다.
 * @param key - KPI 이름 (Growth, Engagement 등)
 * @param value - 검증할 값
 * @param min - 최소 허용값
 * @param max - 최대 허용값
 * @returns {number} 클램핑된 안전한 값
 */
function clampValue(key: string, value: number, min: number, max: number): number {
    // Math.max와 Math.min을 사용하여 강제로 범위를 맞춥니다.
    return Math.min(Math.max(value, min), max);
}

/**
 * 안전하고 예측 가능한 기본값(Fallback)의 진단 결과를 생성합니다.
 */
function createSafeDefaultResult({ errorMessage = "데이터 부족", contextId }: { errorMessage: string, contextId?: string}): DiagnosisResult {
    return {
        contextId: contextId || 'FALLBACK_UNKNOWN',
        timestamp: new Date().toISOString(),
        scores: {
            Growth: 0, // 가장 안전한 기본값은 0점입니다.
            Engagement: 0,
            Monetization: 0,
        },
        errorMessage: errorMessage,
    };
}

// ========================================================
// MOCK 함수들 (실제 로직 대체 필요)
// ========================================================

function runAIVoiceAnalysis(audioData: any): { rawPitch: number; rawFrequencyStability: number } | null {
    if (!audioData || audioData.length === 0) return null;
    // 실제로는 복잡한 AI 분석 로직이 돌아갑니다. 여기서는 테스트용 목업 반환.
    return { rawPitch: Math.random() * 3 + 1, rawFrequencyStability: Math.random() };
}

function calculateGrowth(rawMetrics: any): number { return (Math.random() * 50) + 20; } // 가짜 계산 로직
function calculateEngagement(rawMetrics: any): number { return (Math.random() * 40) + 10; }
function calculateMonetization(rawMetrics: any): number { return (Math.random() * 30) + 5; }