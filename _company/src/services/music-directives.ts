/**
 * @fileoverview Visual Execution Guide를 AI Music Directive로 변환하기 위한 스키마 정의.
 * 시각적 이벤트(Visual Event)가 오디오 파라미터(Audio Param)에 어떻게 매핑되는지 명시한다.
 */

import { TimeRange } from '../utils/time-range'; // Assuming a utility for time ranges

/**
 * 🚨 [필수 타입] 진단 과정에서 포착된 핵심 감정 변화를 정의하는 열거형.
 * 이 상태들은 MusicGeneratorService의 주요 입력값이 됩니다.
 */
export enum EmotionalState {
    SETUP_STATE = "Setup", // 배경 정보 제공 (차분함, 낮은 텐션)
    PAIN_PEAK = "PainPeak",   // 위험 지표 노출 (긴장감 최대, 빠른 비트, 불협화음)
    INSIGHT_TRANSITION = "InsightTransition", // 깨달음의 순간 (급격한 사운드 변화, 톤 반전)
    GAIN_PEAK = "GainPeak",   // 해결책 제시/성공 (웅장함, 밝은 코드 진행, 볼륨 상승)
    CTA_CLOSING = "CallToAction", // 마무리/액션 유도 (희망적, 깔끔한 아웃트로)
}

/**
 * 📊 [핵심 스키마] 시간대별로 발생할 수 있는 오디오 지시사항의 종합 구조.
 */
export interface MusicDirective {
    timeRange: TimeRange; // 예: { start: 0s, end: 30s }
    dominantState: EmotionalState; // 현재 구간을 대표하는 감정 상태
    directives: AudioDirectives[]; // 이 시간대에서 적용되어야 할 구체적인 명령 목록
}

/**
 * 🎵 [핵심 스키마] 하나의 지시사항이 포함해야 하는 모든 오디오 파라미터.
 */
export interface AudioDirectives {
    // 1. 속도 및 리듬 (Pacing & Rhythm)
    tempoChangeHz: number;       // BPM 변화율 (ex: 0.1은 점진적 증가)
    rhythmComplexity: 'LOW' | 'MEDIUM' | 'HIGH'; // 비트의 복잡성

    // 2. 음색 및 분위기 (Timbre & Mood)
    keySignature: string;        // 음악 키 (ex: "C Major", "A Minor")
    instrumentFocus: string[];   // 강조되어야 할 악기군 (ex: ["Piano", "Strings"])
    harmonicMovement: 'DISSOLVING' | 'ASCENDING' | 'STEADY'; // 화성 진행 방향

    // 3. 극적 효과 (Dramatic Effect)
    intensityScore: number;      // 0.0 ~ 1.0 사이의 전반적인 강도 지표
    soundEffectRequired: boolean; // 특정 사운드 이펙트(SFX)가 필요한지 여부
    visualEmphasisMapping?: 'ACCENT_YELLOW' | 'RED_WARNING'; // 시각적 강조와 연동되는 오디오 톤

    /**
     * @description 이 지시사항이 발생해야 하는 이유 (기술 검증 및 로깅 목적).
     */
    rationale: string;
}

/**
 * 💡 [유틸리티] 시간 범위를 관리하는 타입.
 */
export type TimeRange = {
    start: number; // 초 단위
    end: number;   // 초 단위
};