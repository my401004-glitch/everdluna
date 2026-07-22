import { Request, Response } from 'express';
import * as diagnosisService from '../services/diagnosisService';
import { DiagnosisInputParams, DiagnosisResultSchema } from '../types/diagnosisTypes';

/**
 * @description /api/v1/diagnosis_score 엔드포인트 핸들러.
 * 사용자 입력 데이터(params)를 받아 Gap Score 및 Monetization Trigger를 계산하고 JSON으로 반환합니다.
 * 이 함수는 비즈니스 로직 계층(Service)을 호출하는 컨트롤러의 역할을 합니다.
 */
export const getDiagnosisScore = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. 입력 파라미터 추출 및 유효성 검증 (Guard Clause)
        const params = req.query;

        if (!params || !Array.isArray(params.studentId)) {
            return res.status(400).json({ success: false, message: "Invalid request parameters. studentId array is required." });
        }

        // 타입 캐스팅 및 구조화
        const inputParams: DiagnosisInputParams = {
            studentIds: Array.isArray(params.studentId) ? params.studentId : [String(params.studentId)],
            contextType: String(params.contextType), // 예: 'lesson_completion', 'test_score' 등
        };

        // 2. 서비스 레이어 호출 (핵심 비즈니스 로직 실행)
        const diagnosisResult = await diagnosisService.calculateDiagnosisScore(inputParams);

        if (!diagnosisResult) {
            return res.status(500).json({ success: false, message: "Failed to calculate diagnosis score from the service layer." });
        }

        // 3. 성공 응답 반환 (Swagger/API Spec 준수)
        res.status(200).json({
            success: true,
            data: diagnosisResult as DiagnosisResultSchema, // 최종 스키마를 맞춰서 전달
        });

    } catch (error) {
        console.error("Diagnosis API Error:", error);
        // 500 에러는 내부 로직 문제로 간주하고 처리합니다.
        res.status(500).json({ success: false, message: "Internal server error while processing diagnosis score." });
    }
};