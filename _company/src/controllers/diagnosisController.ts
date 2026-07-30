/**
 * @description GET /api/v1/diagnosis_score - 사용자 진단 점수 및 Gap Score를 산출하여 반환하는 컨트롤러
 * [WHY] 모든 수익화 퍼널의 출발점이자 가장 중요한 API 엔드포인트임.
 */
import { Request, Response, NextFunction } from 'express';
import { getDiagnosisScoreService } from '../services/diagnosisService';

/**
 * 1. 요청 유효성 검증 및 권한 체크 (Middleware 역할 수행)
 * @param req - Express Request 객체
 * @returns Promise<void>
 */
export const validateAndAuthorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRole = req.user?.role; // 인증 미들웨어가 사용자 정보를 주입했다고 가정
    const diagnosisType = req.query.diagnosis_type as string;

    if (!userRole || !['FREE', 'PREMIUM'].includes(userRole)) {
        return res.status(403).json({ message: "Unauthorized access or user role invalid." }); // [근거: sessions/2026-05-18T13-43/developer.md]
    }

    if (!diagnosisType) {
         return res.status(400).json({ message: "Missing required 'diagnosis_type' query parameter." });
    }
    
    // TODO: 이 부분에 더 복잡한 권한 체크 로직 추가 (예: PREMIUM만 접근 가능한 Diagnosis Type 제한)

    next(); 
};


/**
 * @description 핵심 진단 점수 산출 로직 호출 (P0 기능)
 * @param req - Express Request 객체 (사용자 ID, Context ID 등을 포함)
 * @param res - Express Response 객체
 */
export const getDiagnosisScore = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // 가정
        const contextId = req.query.context_id as string; // 요청 파라미터에서 Context ID 추출

        if (!userId || !contextId) {
            return res.status(400).json({ message: "Missing User ID or Context ID in request." });
        }

        // 서비스 레이어 호출 (비즈니스 로직 분리)
        const scoreData = await getDiagnosisScoreService(userId, contextId); 

        if (!scoreData) {
             return res.status(404).json({ message: "Could not generate diagnosis score for the provided context." });
        }

        // 성공적인 진단 결과 반환 (Gap Score 포함된 JSON 구조 확정)
        res.status(200).json({
            success: true,
            data: {
                user_id: userId,
                diagnosis_score: scoreData.overall_score, // 전체 점수
                gap_details: scoreData.gap_details,     // Gap Score 상세 내역 (JSONB)
                recommendation: scoreData.recommendation // 추천 로직 결과
            }
        });

    } catch (error) {
        console.error("Error in getDiagnosisScore:", error);
        res.status(500).json({ message: "Internal server error during diagnosis processing." });
    }
};