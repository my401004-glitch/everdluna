// TypeScript Interface Definition - 프론트엔드 및 서비스 간 데이터 통일성 유지 목적
export type DiagnosisScore = {
    Growth: number; // 성장 잠재력 (0.0 ~ 1.0)
    Engagement: number; // 참여도 (0.0 ~ 1.0)
    Monetization: number; // 수익화 가능성 (0.0 ~ 1.0)
};

export interface DiagnosisResult {
    resultId: string;
    contextId: string;
    score: DiagnosisScore;
    analysisData: any;
    isProcessed: boolean;
}

export interface MusicSynthesisParams {
    resultId: string;
    genre: 'Pop Ballad' | 'Jazz Swing' | 'Rock';
    mood: 'Optimistic' | 'Tense' | 'Calm';
    tempoRange: [number, number]; // 예: [80, 120] BPM
}