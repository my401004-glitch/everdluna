import { Request, Response } from 'express';
import { ReelsService } from '../services/reelsService'; // 서비스 레이어 임포트

/**
 * POST /api/v1/reels/generate
 * 동적 마케팅 자산 세그먼트별 JSON 데이터를 생성하는 API 엔드포인트.
 * @param req - 요청 객체 (Query params 또는 Body에서 변수 받음)
 * @param res - 응답 객체
 */
export const generateReelsAssets = async (req: Request, res: Response) => {
    try {
        // 1. 필요한 입력 데이터 추출 (예시로 쿼리 파라미터 사용 가정)
        const inputVariables = req.query;

        if (!inputVariables || !inputVariables['colorProgression']) {
            return res.status(400).json({ success: false, message: "Missing required input variables (e.g., colorProgression)." });
        }

        // 2. 서비스 레이어를 통해 실제 로직 실행 및 JSON 데이터 생성 요청
        const reelsService = new ReelsService();
        const generatedAssets = await reelsService.generateDynamicAsset(inputVariables);

        if (!generatedAssets || generatedAssets.length === 0) {
            return res.status(500).json({ success: false, message: "Failed to generate assets." });
        }

        // 3. 성공적으로 생성된 자산 배열 반환 (HTTP 200 OK)
        res.status(200).json({
            success: true,
            message: "Reels dynamic assets generated successfully.",
            data: generatedAssets
        });

    } catch (error) {
        console.error("Error generating reels assets:", error);
        // 에러 핸들링 로직 추가 필요
        res.status(500).json({ success: false, message: "Internal server error during asset generation." });
    }
};