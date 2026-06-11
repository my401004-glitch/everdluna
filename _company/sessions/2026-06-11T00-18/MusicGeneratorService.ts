// MusicGeneratorService.ts - 진단 데이터를 음악 지시자로 변환하는 핵심 서비스 레이어
import { DiagnosisResult } from './types'; // Assume this type is available

/**
 * @description 진단 결과를 받아서 AI 음악 합성기에 필요한 구조화된 파라미터 셋을 생성합니다.
 * Pain -> Gain 전환 시나리오가 가장 중요하므로, 이를 최우선으로 고려하여 로직을 설계합니다.
 * @param diagnosisResult - DB에서 조회한 Diagnosis_Results 객체 (KPI 및 Score 포함).
 * @returns AudioDirectives에 매핑될 파라미터 셋.
 */
export class MusicGeneratorService {

    /**
     * 진단 점수를 기반으로 핵심 감성 지표를 계산합니다.
     * @param score - Gap Score (0.0 ~ 1.0).
     * @returns {tensionLevel: number, emotionalValence: number}
     */
    private calculateEmotionalMetrics(score: number): { tensionLevel: number, emotionalValence: number } {
        // Gap Score가 높을수록 불안감(Tension)이 높고, 긍정적 가치(Valence)는 낮아집니다.
        const tension = Math.round(score * 9) + 1; // 0.1 -> 1 (최소), 1.0 -> 10 (최대).
        const valence = Math.max(-0.5, score - 0.8); // Score가 높을수록 마이너스 경향 부여.
        return { tensionLevel: tension, emotionalValence: valence };
    }

    /**
     * 진단 결과를 분석하여 통합된 음악 지침(Directive)을 생성합니다.
     * @param diagnosisResult - 입력 데이터 (DiagnosisResults).
     * @returns MusicDirectives 객체.
     */
    public generateDirectives(diagnosisResult: DiagnosisResult): any {
        // 1. 초기 진단 분석 (Pain Stage Simulation)
        const initialScore = parseFloat(diagnosisResult.score);
        let metrics = this.calculateEmotionalMetrics(initialScore);

        // 2. 핵심 파라미터 설정
        let directive = {
            tension_level: metrics.tensionLevel,
            emotional_valence: metrics.emotionalValence,
            urgency_score: parseFloat((diagnosisResult.kpi.growth / (1 + Math.random()))).toFixed(2), // 예시 로직: Growth KPI를 기반으로 시급성 부여
            tempo_modifier: 0.9, // 초기에는 약간 느리게 시작하여 긴장감을 고조
            key_shift: -3,      // 마이너 키 (불안감)로 설정
            harmonic_complexity: 0.6,
            trend_direction: "DECREASING", // 일반적으로 진단 결과가 나오면 '개선 추세'를 기대함
            is_critical: true
        };

        // --- [Pain -> Gain 전환 로직 (핵심 비즈니스 로직)] ---
        // 만약 이 지침이 '해결책 제시(Gain)' 시퀀스에서 사용된다는 가정이 들어간다면, 파라미터가 반전되어야 합니다.
        // 이는 프론트엔드/컨트롤러 레벨에서 트랜잭션으로 처리하는 것이 적절합니다.
        if (diagnosisResult.context_id === "SUCCESSFUL_INTERVENTION") { 
            directive = this.invertDirectives(directive);
        }

        return directive;
    }

    /**
     * 지침 파라미터를 Pain -> Gain으로 역전시키는 함수입니다.
     */
    private invertDirectives(currentDirective: any): any {
        // 1. Tension 감소, Valence 증가 (긍정적 변화)
        const newTension = Math.max(3, currentDirective.tension_level - 4); // 최소 긴장도 3 유지
        const newValence = Math.min(0.9, currentDirective.emotional_valence + 0.5); // 최대 0.9로 제한
        // 2. Tempo 증가 (희망), Key Shift 상향 조정 (Major Key)
        return {
            tension_level: newTension,
            emotional_valence: newValence,
            urgency_score: currentDirective.urgency_score * 0.7, // 시급성은 약간 완화됨
            tempo_modifier: Math.min(1.15, parseFloat((currentDirective.tempo_modifier + 0.1).toFixed(2))), // 최대 15% 증가
            key_shift: currentDirective.key_shift + 6,   // 마이너 -> 메이저 키 이동 (장조화)
            harmonic_complexity: Math.min(1.0, currentDirective.harmonic_complexity + 0.2),
            trend_direction: "INCREASING",
            is_critical: true
        };
    }
}