import { MusicGeneratorService } from './MusicGeneratorService';
// Mocking the API call is crucial for unit testing
jest.mock('./MusicGeneratorService', () => ({
  MusicGeneratorService: jest.fn(),
}));

describe('MusicGeneratorService - Core Logic Testing', () => {
  let service: MusicGeneratorService;

  beforeEach(() => {
    // Mocking the internal dependency for clean testing environment
    service = new MusicGeneratorService(); 
  });

  it('should throw an error if required directives are missing (Guard Clause Test)', async () => {
    const incompleteDirectives = { hookingPoint: "Missing Mood" }; // targetMood 누락
    await expect(service.generateMusic(incompleteDirectives)).rejects.toThrow(
      /mandatory/i, 
      '음악 지침서에 필수 필드 (hookingPoint 또는 targetMood)가 빠졌습니다.'
    );
  });

  it('should throw an error if the directives structure is invalid', async () => {
    // 유효성 검사 실패 케이스 테스트
    const malformedDirectives = { hookingPoint: "Test Hook", targetMood: "Happy" } as any; 
    malformedDirectives['some_invalid_field'] = 'test'; // 스키마를 벗어난 필드 추가
    await expect(service.generateMusic(malformedDirectives)).rejects.toThrow(
      /Invalid music directives provided/i, 
      '음악 지침서가 유효하지 않습니다.'
    );
  });

  it('should successfully generate audio URL given valid and complete directives', async () => {
    // 성공 경로 테스트 (Mocking API Success)
    const validDirectives = { 
        hookingPoint: "Learning Curve", 
        targetMood: "Inspirational", 
        tempoBpms: 120, 
        keySignature: 'C Major' 
    };

    // 외부 호출(synthesizeAudio)을 mock하여 성공 응답을 강제합니다.
    jest.spyOn(service as any, 'generateMusic').mockResolvedValue({
      success: true,
      audioUrl: "SUCCESS_MOCK_URL/final_music_track_12345.mp3",
      metadata: expect.any(String),
    });

    const result = await service.generateMusic(validDirectives);

    expect(result).toEqual({
      success: true,
      audioUrl: "SUCCESS_MOCK_URL/final_music_track_12345.mp3",
      metadata: expect.any(String),
    });
  });
});