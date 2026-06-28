/**
 * @fileoverview 진단 점수 계산을 위한 FastAPI/Express 스타일의 컨트롤러 레이어.
 * HTTP 요청 처리를 담당하며, 비즈니스 로직 호출 및 응답 포맷팅에 집중합니다.
 */

import { Request, Response } from 'express'; // Assuming Express framework usage
import { DiagnosisRequestInput, ApiErrorResponse } from '../../types/DiagnosisTypes';
import { calculateDiagnosisScore } from '../../services/DiagnosisService';

/**
 * POST /api/v1/diagnosis_score
 * 클라이언트의 진단 요청을 받아 점수를 계산하고 결과물을 반환합니다.
 * @param req - Express Request 객체 (body에서 DiagnosisRequestInput 추출)
 * @param res - Express Response 객체
 */
export const getDiagnosisScore = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. 입력 값 유효성 검증 및 데이터 계약 확인
        const inputData: DiagnosisRequestInput = req.body; // 실제 환경에서는 body 파싱이 필요함

        if (!inputData || !inputData.diagnosisType || !inputData.contextId) {
            return res.status(400).json({
                errorCode: 400,
                message: "Missing required parameters (diagnosisType or contextId)."
            } as ApiErrorResponse);
        }

        // 2. 비즈니스 로직 호출 및 실행 가능성 검증 (핵심)
        const scoreResult = await calculateDiagnosisScore(inputData);

        // 3. 성공 응답 포맷팅
        return res.status(200).json(scoreResult);

    } catch (error) {
        // 4. 에러 핸들링 및 클라이언트에게 친화적인 오류 메시지 반환
        console.error("API Error during score calculation:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown internal error occurred.";

        return res.status(500).json({
            errorCode: 500,
            message: `Failed to process diagnosis request. Check logs for details. (${errorMessage})`
        } as ApiErrorResponse);
    }
};