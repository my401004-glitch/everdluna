import { MusicDirective, EmotionalState, AudioDirectives } from './music-directives';

/**
 * @class MusicGeneratorService
 * @description 확정된 콘텐츠의 구조와 시각적 지침을 받아, AI 음악 합성 파이프라인에서 처리 가능한
 * 표준화된 오디오 디렉티브 스키마를 생성하는 핵심 비즈니스 로직 서비스.
 */
export class MusicGeneratorService {

    private final visualGuide: any; // Designer가 확정한 최종 Visual Execution Guide 데이터 (입력)

    /**
     * @param visualGuide - 콘텐츠의 전반적인 시각적 흐름과 지침이 담긴 객체.
     */
    constructor(visualGuide: any) {
        if (!visualGuide || !visualGuide.masterProductionGuide) {
            throw new Error("MusicGeneratorService requires a valid Master Production Guide (Visual Guide).");
        }
        this.visualGuide = visualGuide;
    }

    /**
     * 🚀 핵심 메소드: 전체 콘텐츠의 흐름을 분석하여 MusicDirective 배열을 생성합니다.
     * @returns {MusicDirective[]} 시간대별, 감정 상태별 오디오 지시사항 목록.
     */
    public generateDirectives(): MusicDirective[] {
        console.log("[Service]: Starting music directive generation based on visual guide...");

        // 1. Master Production Guide (MPG)를 섹션 단위로 분해합니다.
        const sections = this.visualGuide.masterProductionGuide.sections; 
        let directives: MusicDirective[] = [];

        for (const section of sections) {
            // 각 섹션의 내용을 분석하여 Directive 생성 로직 호출
            const directive = this.analyzeSection(section);
            if (directive) {
                directives.push(directive);
            }
        }

        return directives;
    }

    /**
     * @private
     * 콘텐츠 섹션을 받아서 가장 적절한 MusicDirective를 생성하는 내부 로직.
     * 이 부분이 핵심적인 '트랜스레이션 레이어'입니다.
     */
    private analyzeSection(section: any): MusicDirective | null {
        // TODO: 실제 비즈니스 로직 구현 필요 (예: 텍스트 내용 -> 감정 분석)

        let dominantState = EmotionalState.SETUP_STATE;
        if (section.containsKeyword("위험", "손실")) {
            dominantState = EmotionalState.PAIN_PEAK;
        } else if (section.containsKeyword("해결", "성공")) {
            dominantState = EmotionalState.GAIN_PEAK;
        }

        // 임시 Directive 생성 및 반환 (구현 후 대체)
        return {
            timeRange: { start: section.startTime, end: section.endTime },
            dominantState: dominantState,
            directives: this.createDefaultDirectives(dominantState),
        };
    }

    /**
     * @private
     * 주어진 Emotion State에 따라 기본 오디오 지시사항을 생성합니다.
     */
    private createDefaultDirectives(state: EmotionalState): AudioDirectives[] {
        let directives: AudioDirectives[] = [];

        switch (state) {
            case EmotionalState.PAIN_PEAK:
                directives.push({
                    tempoChangeHz: 0.5, // 서서히 빨라짐
                    rhythmComplexity: 'HIGH',
                    keySignature: 'A Minor',
                    instrumentFocus: ['Deep Strings', 'Low Synth'],
                    harmonicMovement: 'DISSOLVING',
                    intensityScore: 0.9,
                    soundEffectRequired: true, // 긴장감 SFX 필요
                    visualEmphasisMapping: 'RED_WARNING',
                    rationale: "위험 지표(Pain Score) 강조에 따른 청각적 압박 조성."
                });
                break;
            case EmotionalState.GAIN_PEAK:
                directives.push({
                    tempoChangeHz: 1.0, // 확 트이는 느낌으로 속도 증가
                    rhythmComplexity: 'MEDIUM',
                    keySignature: 'C Major',
                    instrumentFocus: ['Brass', 'Full Orchestra'],
                    harmonicMovement: 'ASCENDING',
                    intensityScore: 0.8,
                    soundEffectRequired: false,
                    visualEmphasisMapping: 'ACCENT_YELLOW', // 성공을 Yellow로 강조
                    rationale: "해결책 제시 및 성과를 극적으로 증폭시키기 위함."
                });
                break;
            // ... 나머지 상태별 로직 추가 필요
        }
        return directives;
    }
}