/**
 * @fileoverview Media Contract: API Simulation 결과에 따른 사운드 및 비주얼 전환 로직의 데이터 계약.
 * 이 인터페이스는 모든 미디어 재생 의존성을 중앙에서 관리하여, 개발팀과 디자인팀 간의 싱크를 맞춥니다.
 */

// 🎵 사운드 자산 식별자 (Sound Asset ID)
export type SoundId = 's_success_jingle' | 's_failure_buzz' | 's_neutral_ambient' | 's_progress_alert';

// 🖼️ 시각 요소 전환 정의 (Visual Transition Definition)
export interface VisualTransition {
    elementId: string; // 변화가 발생하는 UI 요소의 고유 ID (e.g., score-gauge, status-text)
    animationKeyframe: 'fade-in' | 'scale-up' | 'none'; // 적용할 애니메이션 타입
    durationMs: number; // 전환 지속 시간 (밀리초)
}

// 🎬 미디어 이벤트 정의 (Single Media Event)
export interface MediaEvent {
    type: 'SOUND' | 'VISUAL_TRANSITION' | 'PAUSE';
    value?: SoundId; // SOUND 타입일 때만 사용
    transition?: VisualTransition; // VISUAL_TRANSITION 타입일 때만 사용
    delayMs?: number; // 이전 이벤트로부터의 지연 시간 (선택적)
}

// 🔄 전체 시뮬레이션 플로우 정의 (State Flow Contract)
export interface SimulationFlowContract {
    /**
     * API 호출 성공 후 이어지는 미디어 경험.
     */
    onApiSuccess: MediaEvent[];
    /**
     * API 호출 실패(네트워크 에러 또는 데이터 검증 실패) 시의 미디어 경험.
     */
    onApiFailure: MediaEvent[];
    /**
     * 기본 진단 과정 중 발생하는 지속적인 배경 사운드/진행 표시.
     */
    onInitialLoading: MediaEvent[];
}

/**
 * [DEFAULT] 가상의 Mock API 계약 데이터 예시
 * 실제 디자인과 개발 단계에서 이 값을 조정해야 합니다.
 */
export const DEFAULT_MEDIA_CONTRACT: SimulationFlowContract = {
    // 🟢 성공 시 (진단 점수 산출 및 결과 제시)
    onApiSuccess: [
        { type: 'PAUSE', delayMs: 500 }, // 잠시 멈춤 (긴장감 조성)
        { type: 'SOUND', value: 's_success_jingle' }, // 성공 사운드 재생
        { type: 'VISUAL_TRANSITION', transition: { elementId: 'score-gauge', animationKeyframe: 'scale-up', durationMs: 500 } }, // 점수 게이지 확정 애니메이션
        { type: 'SOUND', value: 's_neutral_ambient', delayMs: 1500 }, // 배경 사운드 전환 (Ambient)
    ],

    // 🔴 실패 시 (API 호출 에러 또는 데이터 계약 위반)
    onApiFailure: [
        { type: 'VISUAL_TRANSITION', transition: { elementId: 'status-text', animationKeyframe: 'scale-up', durationMs: 300 } }, // 상태 메시지 강조 애니메이션
        { type: 'SOUND', value: 's_failure_buzz' }, // 실패 버즈 사운드 재생 (경고)
        { type: 'PAUSE', delayMs: 1000 }, // 에러 메시지를 읽을 시간 부여
    ],

    // 🟡 초기 로딩/진행 과정 중
    onInitialLoading: [
        { type: 'SOUND', value: 's_neutral_ambient' }, // 배경 사운드 유지
        { type: 'VISUAL_TRANSITION', transition: { elementId: 'loader-spinner', animationKeyframe: 'fade-in', durationMs: 100 } }, // 로딩 스피너 활성화
    ],
};