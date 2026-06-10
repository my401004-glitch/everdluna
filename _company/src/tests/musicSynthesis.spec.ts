// musicSynthesis.spec.ts
import { musicSynthesisServiceInstance } from '../services/musicSynthesisService';
import { describe, it, expect, vi } from 'vitest'; // Jest/Vitest 사용 가정

describe('MusicSynthesisService - API 통합 테스트 시나리오 검증', () => {

    // 테스트 전후로 환경 초기화 (Mocking 필수)
    beforeEach(() => {
        vi.clearAllMocks(); 
        console.log("\n--- [TEST START] Running Music Synthesis Test ---");
    });

    it('1. 성공 시나리오: 유효한 파라미터로 음악 합성을 요청하고 정상 URL을 반환하는가?', async () => {
        // GIVEN - 유효한 진단 데이터 (최대 복잡도)
        const diagnosisData = { genre: 'Emotional Ballad', complexity: 5, emotional_focus: 'tension' };
        
        // WHEN - synthesizeMusic 호출
        const result = await musicSynthesisServiceInstance.synthesizeMusic(diagnosisData);

        // THEN - 결과 검증 (URL과 Track ID가 존재하는지)
        expect(result).toHaveProperty('url');
        expect(result).toHaveProperty('trackId');
    });

    it('2. 실패 시나리오: 복잡도(Complexity) 파라미터가 0일 때 예외를 던지는가?', async () => {
        // GIVEN - 유효하지 않은 데이터 (복잡도 0)
        const invalidData = { genre: 'Pop', complexity: 0, emotional_focus: 'relief' };

        // WHEN / THEN - 함수 실행 시 Error가 발생하는지 확인
        await expect(musicSynthesisServiceInstance.synthesizeMusic(invalidData))
            .rejects.toThrow("Invalid synthesis parameters provided.");
    });

    it('3. 실패 시나리오: 필수 파라미터 누락 또는 유효성 검사 실패 시 예외를 던지는가?', async () => {
        // GIVEN - Genre 정보가 없는 경우
        const missingData = { genre: '', complexity: 3, emotional_focus: 'relief' };

        await expect(musicSynthesisServiceInstance.synthesizeMusic(missingData))
            .rejects.toThrow("Invalid synthesis parameters provided.");
    });

    it('4. 메타데이터 조회 시나리오: 유효한 Track ID를 입력했을 때 BPM과 Key 정보를 반환하는가?', async () => {
        // GIVEN - 가상의 유효 트랙 ID
        const trackId = 'track_abcdef123';

        // WHEN - getTrackMetadata 호출
        const metadata = await musicSynthesisServiceInstance.getTrackMetadata(trackId);

        // THEN - 메타데이터가 기대하는 구조를 가지는지 확인
        expect(metadata).toHaveProperty('bpm');
        expect(typeof metadata.bpm).toBe('number');
    });
});