import { Request, Response } from 'express';
import { MusicGeneratorService } from '../services/MusicGeneratorService';

/**
 * @description 콘텐츠의 핵심 데이터와 전환 지점을 받아 최종 사운드트랙 생성 파라미터를 관리하고 응답합니다.
 * 이 컨트롤러는 서비스 계층과 API 규격 사이의 접점(Integration Point) 역할을 합니다.
 */
export const generateSoundtrack = async (req: Request, res: Response): Promise<void> => {
    // 1. 입력 유효성 검사 (Guard Clause): 요청 바디와 파라미터가 필수인지 확인합니다.
    const { diagnosisData } = req.body;
    if (!diagnosisData || typeof diagnosisData !== 'object') {
        return res.status(400).json({ 
            error: "Invalid input", 
            message: "Request body must contain valid diagnosisData object." 
        });
    }

    try {
        // 2. 서비스 계층 호출: 순수 비즈니스 로직을 실행합니다.
        const audioParams = await MusicGeneratorService.generateSoundtrack(diagnosisData);

        if (!audioParams || audioParams.length === 0) {
            return res.status(500).json({ error: "Music generation failed", message: "Could not generate sound parameters." });
        }
        
        // 3. 표준화된 응답 포맷팅 (Contract Enforcement): 클라이언트가 기대하는 최종 형식으로 가공합니다.
        const standardizedResponse = {
            success: true,
            metadata: {
                generationTime: new Date().toISOString(),
                totalDurationSeconds: audioParams.reduce((acc, p) => acc + p.durationSec, 0),
                keyChangePointsCount: audioParams.filter(p => p.isKeyChange).length,
            },
            soundtrackSegments: audioParams // 이미 구조화되어 있으므로 직접 전달 가능
        };

        // 4. 응답 반환
        res.status(200).json(standardizedResponse);

    } catch (error) {
        console.error("Error in generateSoundtrack controller:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error", 
            message: (error as Error).message || "Failed to process sound generation request." 
        });
    }
};

export const getSoundtrack = {
    routerPath: "/api/v1/soundtrack",
    handler: generateSoundtrack,
    method: 'GET' // RESTful convention을 고려하여 GET으로 가정합니다.
};