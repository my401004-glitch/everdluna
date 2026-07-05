// src/controllers/diagnosisController.ts

import { Request, Response, NextFunction } from 'express';
import { DiagnosisService } from '../services/DiagnosisService';
import { validateKpiPayload, DiagnosisRequestDto } from '../utils/validationUtils'; // 🛠️ 가상의 유효성 검증 유틸리티

// Global Dependency Injection (DI)를 통해 Service 인스턴스를 주입받는다고 가정합니다.
const diagnosisService = new DiagnosisService();


/**
 * @description POST /api/v1/diagnosis_score - KPI 진단 결과를 저장하고 처리하는 엔드포인트
 * 
 * [Flow]: 요청 수신 -> (1) 사용자 권한 확인 -> (2) Payload 유효성 검증 -> (3) 서비스 레이어 전달 -> DB 저장.
 * @param req {DiagnosisRequestDto} Body에 KPI 데이터가 포함되어야 함.
 * @param res Express Response 객체
 */
export const postDiagnosisScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. 사용자 Context 및 권한 확인 (RBAC 체크 필수)
        // Middleware를 통해 이미 사용자의 Role과 User ID가 request에 붙어있다고 가정합니다.
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId || !userRole) {
            return res.status(401).json({ message: "Authentication required: User ID or Role missing." });
        }

        // 2. 요청 Payload 유효성 검사 (DTO와 스키마 준수 확인)
        const payload = req.body as DiagnosisRequestDto;
        if (!validateKpiPayload(payload)) {
            return res.status(400).json({ message: "Invalid KPI payload structure or missing required fields." });
        }

        // 3. 핵심 로직 실행 (Service Layer 호출)
        const result = await diagnosisService.processAndStoreScore(userId, userRole, payload);

        if (!result) {
            return res.status(422).json({ message: "Failed to process score due to validation or system error." });
        }

        // 4. 성공 응답
        return res.status(201).json({
            message: "Diagnosis score processed and stored successfully.",
            data: result,
        });

    } catch (error) {
        console.error("Error in postDiagnosisScore:", error);
        // 다음 미들웨어로 에러 전파
        next(error); 
    }
};