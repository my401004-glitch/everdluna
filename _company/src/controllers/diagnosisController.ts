/**
 * @fileoverview API 게이트웨이 역할을 수행하며, 진단 점수 계산을 위한 엔드포인트 핸들링 로직을 정의합니다.
 */

import { Request, Response } from 'express';
import { calculateDiagnosisScore, handleDiagnosisError } from '../services/diagnosisService';
import { DiagnosisInput, UserContext } from '../types'; 


/**
 * GET /api/v1/diagnosis_score 엔드포인트 핸들러.
 * 요청 데이터를 받아 진단 서비스 레이어를 호출하고 결과를 응답합니다.
 */
export const getDiagnosisScoreHandler = async (req: Request, res: Response) => {
    try {
        // 1. 요청 데이터 추출 및 유효성 검증
        const inputData: DiagnosisInput = req.body; // 실제로는 쿼리 파라미터나 경로 변수일 수 있음
        const userContext: UserContext = { subscriptionLevel: 'Premium' }; // 실제는 토큰 기반으로 가져와야 함

        // [Pre-flight Check] 필수 데이터 유무 검사
        if (!inputData || !inputData.studyHours) {
            return res.status(400).json({ error: "요청 파라미터가 누락되었습니다. studyHours, practiceCount를 포함해야 합니다." });
        }

        // 2. 핵심 비즈니스 로직 호출 (서비스 레이어 사용)
        const result = await calculateDiagnosisScore(inputData, userContext);

        // 3. 성공적인 응답 반환
        return res.status(200).json({
            score: result.score,
            kpis: result.kpis,
            message: "진단 점수 계산이 완료되었습니다."
        });

    } catch (error) {
        // 4. 에러 처리 및 사용자 친화적인 메시지 반환
        const errorMessage = error instanceof Error ? error.message : "알 수 없는 서버 오류";
        const friendlyMessage = handleDiagnosisError(new Error(errorMessage));
        
        console.error(`API 호출 실패: ${friendlyMessage}`);
        return res.status(403).json({ 
            error: friendlyMessage, 
            code: 'DIAGNOSIS_ERROR' 
        });
    }
};