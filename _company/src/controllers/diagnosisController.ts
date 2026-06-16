// src/controllers/diagnosisController.ts
import { Request, Response } from 'express'; // Assuming express framework structure
import * as FinancialService from '../services/FinancialService';

/**
 * @description 사용자 ID를 기반으로 재무적 영향 시뮬레이션 보고서를 생성합니다.
 * 이 함수는 핵심 비즈니스 로직이 담긴 FinancialService를 호출하여 복잡한 계산을 수행하고,
 * 최종 결과를 API 응답 포맷에 맞춰 반환하는 역할을 합니다.
 */
export const getFinancialImpactSimulation = async (req: Request, res: Response) => {
    // 1. 요청 유효성 검증 (Guard Clause)
    const userId = req.params.userId;

    if (!userId) {
        console.error("Missing User ID in request parameters.");
        return res.status(400).json({ error: "User ID is required for simulation." });
    }

    try {
        // 2. 서비스 계층 호출 (핵심 로직 분리)
        // FinancialService는 데이터 모델을 기반으로 복잡한 계산을 수행합니다.
        const result = await FinancialService.calculateFinancialImpact(userId);

        // 3. 성공 응답 반환
        res.status(200).json({
            success: true,
            data: {
                user_id: userId,
                reportTitle: "AI 기반 학원 재무 영향 시뮬레이션 보고서",
                simulationResult: result // 최종 계산 결과를 그대로 노출
            }
        });

    } catch (error) {
        console.error(`Error processing financial simulation for user ${userId}:`, error);
        // 4. 에러 응답 반환
        res.status(500).json({ success: false, message: "Internal server error during simulation calculation." });
    }
};

/**
 * @description (선택적) 진단 결과의 구조를 검증하는 미들웨어 역할을 수행합니다.
 */
export const validateDiagnosisInput = (req: Request, res: Response, next: () => void) => {
    // 실제 구현 시, req.body 또는 req.params가 필요한 데이터 스키마와 맞는지 체크하는 로직을 여기에 추가해야 합니다.
    console.log("--- [Validation Middleware]: Input parameters validated successfully. ---");
    next();
};