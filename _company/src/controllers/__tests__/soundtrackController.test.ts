import { generateSoundtrack } from '../soundtrackController';
import * as MusicGeneratorService from '../../services/MusicGeneratorService';

// Mocking the entire service layer to isolate controller logic testing
jest.mock('../../services/MusicGeneratorService', () => ({
    MusicGeneratorService: {
        generateSoundtrack: jest.fn(),
    },
}));

describe('soundtrackController (Integration Test)', () => {
    // Mock Express Request and Response objects for isolated testing
    const mockRequest = (body: any) => ({ body });
    const mockResponse = (): { status: jest.Mock, json: jest.Mock } => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('✅ 200 OK - Valid data input and successful service call', async () => {
        const mockAudioParams = [
            { durationSec: 5, isKeyChange: false },
            { durationSec: 3, isKeyChange: true }
        ];
        (MusicGeneratorService.generateSoundtrack as jest.Mock).mockResolvedValue(mockAudioParams);

        const req = mockRequest({ diagnosisData: { growthScore: 80, contextId: "A123" } });
        const res = mockResponse();

        await generateSoundtrack(req, res);

        // 검증 1: 서비스가 올바른 인풋을 받았는지 확인 (Dependency Check)
        expect(MusicGeneratorService.generateSoundtrack).toHaveBeenCalledWith({ growthScore: 80, contextId: "A123" });
        
        // 검증 2: 응답 코드가 200인지 확인
        expect(res.status).toHaveBeenCalledWith(200);
        
        // 검증 3: 클라이언트에게 전달되는 데이터가 표준화되었는지 (Format Check)
        const responseJson = res.json.mock.calls[0][0];
        expect(responseJson.success).toBe(true);
        expect(typeof responseJson.metadata.totalDurationSeconds).toBe('number');
    });

    it('❌ 400 Bad Request - Missing required input data', async () => {
        const req = mockRequest({ diagnosisData: null }); // 실패 케이스
        const res = mockResponse();

        await generateSoundtrack(req, res);

        // 검증: 서비스 호출 없이 바로 에러를 처리했는지 확인
        expect(MusicGeneratorService.generateSoundtrack).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('🚨 500 Internal Error - Service layer fails unexpectedly', async () => {
        // 서비스가 에러를 던지도록 Mock 설정
        (MusicGeneratorService.generateSoundtrack as jest.Mock).mockRejectedValue(new Error("Database connection lost"));

        const req = mockRequest({ diagnosisData: { growthScore: 80, contextId: "A123" } });
        const res = mockResponse();

        await generateSoundtrack(req, res);

        // 검증: 에러를 잡고 적절한 상태 코드를 반환했는지 확인
        expect(res.status).toHaveBeenCalledWith(500);
    });
});