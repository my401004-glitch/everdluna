// reels/validation_matrix.ts - API Validation Contract Definition

/**
 * @description Gap Score에 따른 필수 애니메이션 파라미터 맵핑 정의
 * 이 매트릭스는 Writer의 'Gap Score' (0~1)와 Designer의 'Animation Guideline V3.0'을 통합합니다.
 */
export type AnimationParams = {
    colorProgression: string; // 예: "Blue -> Green"
    textSpeedFactor: number;  // 0.5 (느림) ~ 2.0 (빠름)
    focusObjectIds: string[]; // 강조되어야 할 객체 ID 목록
};

/**
 * @description Gap Score 기반 애니메이션 파라미터 결정 함수
 * @param gapScore - Writer가 산출한 0부터 1 사이의 감성적 간극 점수.
 * @returns 유효한 AnimationParams 또는 에러를 던집니다.
 */
export function getAnimationParamsFromGapScore(gapScore: number): AnimationParams {
    // 입력값 검증 (Guard Clause)
    if (typeof gapScore !== 'number' || gapScore < 0 || gapScore > 1) {
        throw new Error("Invalid Gap Score provided. Must be a number between 0 and 1.");
    }

    let params: AnimationParams;

    // [규칙 정의] Gap Score가 높을수록 (큰 간극일수록), 시각적 대비와 속도감이 커야 한다.
    if (gapScore >= 0.7) {
        // 큰 문제 제기/Dramatic Turn: 강렬한 색상 변화, 빠른 전환 필요
        params = {
            colorProgression: "Dark Red -> Bright Gold", // 높은 긴장감을 유발하는 대비
            textSpeedFactor: Math.min(2.0, 1.5 + (gapScore * 0.5)), // 최대 2.0 유지
            focusObjectIds: ["A_PROBLEM_GRAPHIC", "CTA_ELEMENT"]
        };
    } else if (gapScore >= 0.3 && gapScore < 0.7) {
        // 일반적인 문제 제기/정보 전달: 자연스럽고 단계적인 변화 필요
        params = {
            colorProgression: "Cool Blue -> Warm Orange", // 부드러운 대비
            textSpeedFactor: Math.max(0.8, 1.2 - (gapScore * 0.2)),
            focusObjectIds: ["A_CONCEPT_ILLUSTRATION"]
        };
    } else {
        // 낮은 Gap Score / 해답 제시: 안정적이고 신뢰를 주는 색상, 느린 속도 필요
        params = {
            colorProgression: "Deep Forest Green -> Sky Blue", // 안정을 상징하는 조합
            textSpeedFactor: Math.max(0.5, 1.0 - (gapScore * 0.5)),
            focusObjectIds: ["FINAL_SUCCESS_GRAPHIC"]
        };
    }

    return params;
}

/**
 * @description 모든 파라미터가 정의된 계약서 역할을 합니다.
 */
export interface VisualContract {
    animationParams: AnimationParams;
    audioArcPhase: string; // 예: "Tension_to_Release"
    scriptFlowStatus: string; // 예: "Problem -> Solution"
}

// 이 함수는 API 로직이 호출하여 모든 계약 조건을 만족하는지 검증합니다.
export function validateReelsContract(gapScore: number, audioPhase: string): VisualContract {
    const animationParams = getAnimationParamsFromGapScore(gapScore);

    // [Critical Check] Gap Score에 따른 시각적 전환과 사운드 아크의 감정 상태가 일치해야 합니다.
    if (animationParams.colorProgression.includes("Bright Gold") && audioPhase !== "Tension_to_Release") {
        throw new Error(`Contract Violation: High tension visuals require 'Tension_to_Release' audio arc.`);
    }

    return {
        animationParams,
        audioArcPhase: audioPhase,
        scriptFlowStatus: getScriptFlowStatusFromGapScore(gapScore) // 가상의 스크립트 검증 로직 추가
    };
}

// (Self-Correction: Gap Score만으로는 스크립트 흐름을 확정할 수 없으므로 임시 함수 사용)
function getScriptFlowStatusFromGapScore(score: number): string {
    return score > 0.5 ? "Problem -> Solution" : "Informative";
}