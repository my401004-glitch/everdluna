/**
 * 💡 DiagnosisResult Payload Definition (V2 - Module Ready)
 * 모든 콘텐츠 모듈이 재사용할 수 있는 유연한 구조를 목표로 합니다.
 */
export interface PainPoint {
    id: string; // Unique ID for the pain point
    description: string; // e.g., "현실적인 보컬 레슨의 부재" [근거: Designer's Need]
    impact_score: number; // 0-100 scale score of impact
}

export interface KeyGain {
    id: string;
    metric: string; // e.g., "발성 범위 확장", "지속적인 피드백"
    value: number; // 측정 가능한 개선 수치 (예: +5톤) [근거: Template A]
}

export interface ContentStep {
    step_number: number;
    title: string;
    description: string;
    icon_key: string; // For visualization mapping
}

/**
 * 🏆 최종 통합 진단 결과 구조 (Union Type 사용)
 * 어떤 모듈이든 이 객체 하나로 받을 수 있도록 설계합니다.
 */
export type DiagnosisResultPayload = {
    diagnosis_type: 'general' | 'pain_gain' | 'how_to' | 'comparison'; // 콘텐츠 유형을 명시적으로 받음
    timestamp: string;
    // 공통 필드: 사용자 ID, 컨텍스트 등...

    /** @type {PainPoint[]} Template A (Pain/Gain) 전용 데이터 */
    painPoints?: PainPoint[]; 

    /** @type {KeyGain[]} Template A (Pain/Gain) 후 Gain 전용 데이터 */
    keyGains?: KeyGain[]; 

    /** @type {ContentStep[]} Template B (Listicle/How-To) 순차 단계별 데이터 */
    steps?: ContentStep[]; 
    
    /** @type {{a: any, b: any}} Template C (Comparison) 비교 대상 속성 리스트 */
    comparisonMetrics?: { a: Record<string, string>; b: Record<string, string> };
};

export interface DiagnosisResult {
    result_data: DiagnosisResultPayload; // 핵심 로직이 이 Payload를 반환하도록 변경
    context_id: string; 
}