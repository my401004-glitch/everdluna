// src/controllers/diagnosisController.ts
import { Request, Response, NextFunction } from 'express';
import { PredictiveValueService } from '../services/predictive-value.service';
import { DiagnosisDAO } from '../data/DiagnosisDAO';

/**
 * @desc     진단 점수 기반 예측 가치를 계산하고 DB에 저장하는 API 엔드포인트 (POST)
 * @route    /api/v1/diagnosis/predictive-value
 * @access   Private (사용자 인증 및 권한 필요)
 */
export const calculateAndSavePredictiveValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // 1. 입력 데이터 추출 및 기본 검증
        const { diagnosisContextId, userRole } = req.body;

        if (!diagnosisContextId || !userRole) {
            return res.status(400).json({ message: "Missing required context ID or user role." });
        }

        // 2. 비즈니스 로직 실행 (PredictiveValueService)
        console.log(`[Controller] Starting predictive value calculation for Context ID: ${diagnosisContextId}`);
        const predictiveData = await PredictiveValueService.calculate(diagnosisContextId, userRole);

        if (!predictiveData || predictiveData.totalScore === null) {
            return res.status(500).json({ message: "Failed to calculate predictive value data." });
        }

        // 3. DB 트랜잭션 관리 및 저장 (DAO 계층 호출)
        try {
            const savedResult = await DiagnosisDAO.savePredictiveMetrics(
                diagnosisContextId,
                userRole,
                predictiveData
            );
            
            console.log(`[Controller] Successfully saved metrics for Context ID: ${diagnosisContextId}`);
            res.status(200).json({ 
                message: "Predictive value successfully calculated and saved.",
                data: savedResult
            });

        } catch (dbError) {
            console.error("[Controller Error] DB transaction failed:", dbError);
            // DB 레벨의 에러는 비즈니스 실패로 간주하여 500 반환
            next(new Error("Database persistence error during saving metrics."));
        }

    } catch (error) {
        // 서비스 로직 또는 초기 검증 단계에서 발생한 오류 처리
        console.error("[Controller Fatal Error]:", error);
        res.status(500).json({ message: "Internal server error during prediction process." });
        next(error);
    }
};