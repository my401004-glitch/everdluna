// src/api/ai-music/musicSynthesisApiContract.ts

/**
 * @interface MusicSynthesisRequestPayload
 * AI 음악 합성 API 호출 시 필요한 입력 데이터 규격입니다.
 * 진단 결과(Diagnosis)와 콘텐츠 콘텍스트를 기반으로 합니다.
 */
export interface MusicSynthesisRequestPayload {
    /** 전체 스크립트의 요약된 감성 키워드 (예: '좌절', '희망', '긴장') */
    contextSummaryKeywords: string[]; 

    /** 진단 테스트에서 도출된 핵심 KPI (Growth, Engagement 중 하나) */
    primaryKpiFocus: 'Growth' | 'Engagement' | 'Monetization';

    /** 음악이 주로 사용될 영상의 분위기/장르 (예: Cinematic, Lo-fi HipHop, Epic Orchestral) */
    targetMoodAndGenre: string; 

    /** 필요한 최소 길이와 최대 길이 (초 단위) */
    requiredDurationSeconds: { min: number; max: number };

    /** 추가로 강조할 리듬 패턴이나 악기 구성을 요청할 수 있습니다. (선택 사항) */
    optionalInstrumentFocus?: 'Piano' | 'Synth Pad' | 'Drums'; 
}

/**
 * @interface MusicSynthesisResponsePayload
 * API 호출 성공 시 예상되는 출력 데이터 규격입니다.
 */
export interface MusicSynthesisResponsePayload {
    /** 음악 ID (추적용) */
    musicId: string; 
    
    /** 최종 합성된 오디오 파일의 URL (임시 또는 영구 저장소 링크) */
    audioUrl: string; 

    /** 음악이 어떤 분위기와 특징을 가지는지 설명하는 메타데이터 */
    metadata: {
        genre: string;
        moodTags: string[]; // 예: ['Tense', 'Uplifting']
        tempoBPM: number;
        keySignature: string;
    };

    /** 합성 성공 여부 및 처리 시간 정보 */
    status: 'SUCCESS' | 'PROCESSING_PENDING' | 'ERROR';
    estimatedCompletionTimeSeconds?: number; 
}

export type SynthesisResult = {
    request: MusicSynthesisRequestPayload;
    response: MusicSynthesisResponsePayload;
};

/**
 * @constant API 엔드포인트 상수 정의
 */
export const MUSIC_SYNTHESIS_ENDPOINT = '/api/v1/ai-music/synthesize';