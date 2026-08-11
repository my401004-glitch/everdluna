import { Request, Response } from 'express';
import { getDiagnosisScoreFromService } from '../services/diagnosisService';
import { DiagnosisResponse } from '../api/v1/diagnosis-score.interface';

/**
 * @description GET /api/v1/diagnosis-score
 * [근거: sessions/2026-05-19T09:57] - 기존 API 엔드포인트를 유지하되, 응답 스키마를 애니메이션 친화적으로 변경함.
 * @param req - Express Request object (사용자 인증 정보 포함)
 * @param res - Express Response object
 */
export const getDiagnosisScoreFromController = async (req: Request, res: Response<DiagnosisResponse>) => {
    try {
        // 1. 사용자 권한 및 유효성 검증을 먼저 수행하는 로직이 필요함. [근거: sessions/2026-05-18T13:43]
        const userUuid = req.user?.id; // 가상의 인증 미들웨어에서 가져온 UUID

        if (!userUuid) {
            return res.status(401).json({ success: false, message: 'Unauthorized access or missing user ID.' });
        }

        // 2. 서비스 레이어 호출 (실제 비즈니스 로직 포함)
        const diagnosisResponse = await getDiagnosisScoreFromService(userUuid);
        
        res.status(200).json({ success: true, data: diagnosisResponse, message: 'Diagnosis scores retrieved successfully with animation trends.' });

    } catch (error) {
        console.error('API Error:', error);
        // 🐛 에러 처리: 구체적인 에러 메시지를 클라이언트에게 노출하지 않도록 함. [근거: 시니어 엔지니어 원칙]
        res.status(500).json({ success: false, message: 'Internal server error while processing diagnosis.' });
    }
};