// ---------------------------------------------------------
// src/controllers/diagnosisController.ts
// [Description] Hook 2 진단 점수 산출 및 검증 로직 (v3.0 통합 프로덕션 키트 기준)
// [Purpose] API 게이트웨이 역할을 하며, 비즈니스 규칙(RBAC, 데이터 유효성)을 강제합니다.
// ---------------------------------------------------------

import { DiagnosisInputData } from '../types/diagnosisTypes';
import { UserContext } from '../types/userContext';

/**
 * @typedef {Object} DiagnosisResult - API 응답에 사용되는 최종 진단 결과 구조.
 * @property {string} diagnosisType - 진단 유형 (예: "Vocal_Range", "Pitch_Stability")
 * @property {number} score - 핵심 점수 (0-100).
 * @property {Object.<string, number>} kpis - KPI 세부 지표.
 * @property {Array<{metric: string, value: number, context: string}>} suggestions - 개선 제안 목록.
 */

/**
 * 🌟 핵심 병목 구간 함수 1: RBAC 기반 접근 권한 검증 (Role-Based Access Control)
 * @param {UserContext} userCtx - 현재 사용자 컨텍스트 정보 (역할 포함).
 * @param {string} requiredScope - 요청된 데이터의 범위/스코프 (예: "MONETIZATION_REPORT").
 * @returns {boolean} 권한이 있으면 true, 아니면 false.
 */
export function checkAccessPermission(userCtx: UserContext, requiredScope: string): boolean {
    // [WHY] 민감 데이터에 대한 접근을 사용자 역할 레벨로 제한해야 합니다.
    if (!userCtx || !userCtx.role) {
        console.error("Authentication failed: User context missing.");
        return false; // 권한 정보 자체가 없으면 무조건 거절합니다.
    }

    // 예시 로직: 'MONETIZATION' 관련 리포트는 Premium 사용자에게만 허용한다고 가정.
    if (requiredScope === "MONETIZATION_REPORT" && userCtx.role !== "PREMIUM") {
        console.warn(`[RBAC Deny] User ${userCtx.userId} (${userCtx.role}) is denied access to ${requiredScope}.`);
        return false;
    }

    // 다른 모든 스코프는 기본적으로 허용 (Default Allow)
    return true;
}


/**
 * 🌟 핵심 병목 구간 함수 2: 진단 데이터 유효성 검사 및 정규화
 * @param {DiagnosisInputData} input - 사용자가 제출한 Raw Diagnosis Data.
 * @returns {{isValid: boolean, message: string}} 유효성 검증 결과 객체.
 */
export function validateAndNormalizeData(input: DiagnosisInputData): { isValid: boolean, message: string } {
    // [WHY] 입력 데이터가 스키마를 벗어나거나 비정상적인 값을 포함하면 계산 자체가 깨집니다.
    if (!input || !input.rawScores || input.rawScores.length === 0) {
        return { isValid: false, message: "Diagnosis data is empty or missing raw scores." };
    }

    // KPI 값의 유효성 검증 (예시: Growth 점수는 0~100 사이여야 함)
    const kpiGrowth = input.kpis?.growth ?? 0;
    if (typeof kpiGrowth !== 'number' || kpiGrowth < -1 || kpiGrowth > 101) {
        return { isValid: false, message: "Invalid Growth KPI value provided." };
    }

    // 모든 필수 필드 존재 여부 체크 등... (여기에 실제 복잡한 로직 추가)

    return { isValid: true, message: "Input data passed schema validation successfully." };
}


/**
 * @async
 * @param {UserContext} userCtx - 현재 사용자 컨텍스트.
 * @param {DiagnosisInputData} inputData - 진단에 사용된 원본 데이터.
 * @returns {Promise<DiagnosisResult>} 최종적으로 계산 및 검증이 완료된 진단 결과 객체.
 */
export async function getDiagnosisScore(userCtx: UserContext, inputData: DiagnosisInputData): Promise<DiagnosisResult> {
    // 1. [기술적 게이트] RBAC 체크 수행 (가장 먼저 실패 지점을 잡는다)
    if (!checkAccessPermission(userCtx, "CORE_DIAGNOSIS")) {
        throw new Error("Access Denied: Insufficient permissions for core diagnosis.");
    }

    // 2. [기술적 게이트] 데이터 유효성 검증 수행 (데이터가 깨지는 것을 막는다)
    const validationResult = validateAndNormalizeData(inputData);
    if (!validationResult.isValid) {
        throw new Error(`Validation Failed: ${validationResult.message}`);
    }

    // 3. [DB Mock] 원본 데이터와 사용자 프로필을 DB에서 조회하는 비동기 로직 시뮬레이션
    console.log("[DEBUG] Simulating database call to fetch user history...");
    await new Promise(resolve => setTimeout(resolve, 150)); // Simulate network latency

    // 4. [핵심 비즈니스 로직] 진단 점수 및 KPI 계산 (이 부분이 핵심)
    const score = calculateCoreScore(inputData);
    const kpis = {
        growth: inputData.kpis?.growth ?? 0,
        engagement: inputData.kpis?.engagement ?? 0,
        monetization: inputData.kpis?.monetization ?? 0, // RBAC에 따라 이 값이 제한될 수 있음
    };

    // 5. [결과 구조화] 최종 결과물을 규격화하여 반환
    const result: DiagnosisResult = {
        diagnosisType: "Vocal_Range",
        score: Math.round(score * 10) / 10, // 소수점 첫째 자리까지 반올림
        kpis: kpis,
        suggestions: generateSuggestions(inputData),
    };

    console.log("[SUCCESS] Diagnosis score successfully calculated and validated.");
    return result;
}


// ==============================================
// 🧪 Private Helper Functions (순수 로직)
// ==============================================

/**
 * 실제 계산 로직을 담당하는 순수 함수입니다. 사이드 이펙트가 없어 테스트하기 가장 좋습니다.
 */
function calculateCoreScore(input: DiagnosisInputData): number {
    // [WHY] 복잡한 가중치 기반의 점수 산출 알고리즘이 들어갑니다. (예: PitchStability * 0.4 + FrequencyRatio * 0.6)
    const rawAvg = input.rawScores.reduce((acc, score) => acc + score, 0) / input.rawScores.length;
    return Math.min(100, Math.max(0, rawAvg * 0.8 + (input.kpis?.growth ?? 0) * 0.2));
}

function generateSuggestions(input: DiagnosisInputData): Array<{metric: string, value: number, context: string}> {
    // [WHY] 진단 결과와 연관된 맞춤형 학습 제안을 생성합니다.
    if (input.kpis?.engagement < 50) {
        return [{ metric: "Engagement", value: input.kpis.engagement, context: "녹음 세션 수를 늘리세요." }];
    }
    return [];
}

// ---------------------------------------------------------
// End of diagnosisController.ts
// ---------------------------------------------------------