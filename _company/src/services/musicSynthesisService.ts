// MusicSynthesisService.ts
/**
 * @description AI 음악 합성 파이프라인과의 인터페이스를 정의하고, 실제 외부 API 호출을 담당하는 서비스 레이어입니다.
 * 이 클래스는 비즈니스 로직과 외부 시스템(AI API)의 의존성을 분리하여 테스트 용이성을 높입니다.
 */
export class MusicSynthesisService {

    private readonly API_BASE_URL: string = process.env.MUSIC_API_ENDPOINT || 'https://api.ai-music-synth.com/v1';

    /**
     * @description 진단 결과에 기반하여 적절한 음악 스타일과 파라미터를 합성 요청합니다.
     * @param diagnosisData - 사용자 진단 데이터 (예: { genre: string, complexity: number, emotional_focus: 'tension' | 'relief' })
     * @returns 성공 시 API 응답 구조를 가진 Promise<SynthesisResult>
     * @throws 외부 API 호출 실패 또는 파라미터 검증 실패 예외
     */
    async synthesizeMusic(diagnosisData: { genre: string; complexity: number; emotional_focus: 'tension' | 'relief' }): Promise<{ url: string; trackId: string }> {
        if (!diagnosisData || !diagnosisData.genre || diagnosisData.complexity < 1 || diagnosisData.complexity > 5) {
            throw new Error("Invalid synthesis parameters provided.");
        }

        // [Core Logic] 실제로는 axios.post를 사용하여 외부 API를 호출합니다.
        console.log(`[API CALL MOCK]: Calling ${this.API_BASE_URL}/synthesize`);
        console.log(`[Parameters]: Genre=${diagnosisData.genre}, Complexity=${diagnosisData.complexity}, Focus=${diagnosisData.emotional_focus}`);

        // --- Mocking Logic Start ---
        if (diagnosisData.complexity === 0) {
            throw new Error("Synthesis Failed: Invalid complexity level."); // 예외 테스트 케이스 1
        }
        if (!this.API_BASE_URL.includes('api-music')) {
             // API 키 누락 또는 엔드포인트 오류 시뮬레이션
             throw new Error("Authentication Failed: Missing required API key or endpoint.");
        }

        // 성공적인 응답 구조 모의
        await new Promise(resolve => setTimeout(resolve, 50)); // 네트워크 지연 시뮬레이션
        return { url: `https://mock-cdn.com/tracks/${Date.now()}.mp3`, trackId: `track_${Math.random().toString(36).substring(7)}` };
        // --- Mocking Logic End ---
    }

    /**
     * @description 합성된 트랙의 메타데이터를 가져와 진단 과정에 활용 가능한 정보를 추출합니다.
     * @param trackId - 요청된 트랙 ID
     * @returns 트랙 관련 정보 (예: Key, BPM 등)
     */
    async getTrackMetadata(trackId: string): Promise<{ bpm: number; key: string }> {
        if (!trackId || trackId.length < 10) throw new Error("Invalid Track ID.");

        // Mocking Metadata Retrieval
        await new Promise(resolve => setTimeout(resolve, 20));
        return { bpm: 128, key: 'C Major' };
    }
}

export const musicSynthesisServiceInstance = new MusicSynthesisService();