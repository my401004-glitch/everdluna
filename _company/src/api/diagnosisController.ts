import { Request, Response } from 'express'; // 예시 프레임워크 임포트
import { DiagnosisResult, DiagnosisApiResponse } from './types/DiagnosisTypes';
import * as diagnosisService from '../services/diagnosisService';

/**
 * GET /api/v1/diagnosis_score
 * 진단 점수 및 KPI 데이터를 조회하는 엔드포인트 핸들러.
 * @param req {userId: string, contextId: string} - 요청 객체 (인증된 사용자 정보 포함)
 * @returns Promise<DiagnosisApiResponse> - 표준화된 API 응답 구조를 반환합니다.
 */
export const getDiagnosisScore = async (req: Request, res: Response): Promise<void> => {
    const { userId, contextId } = req.params; // 예시: 경로 변수에서 추출

    try {
        // 1. 입력 유효성 검증 (Guard Clause)
        if (!userId || !contextId) {
            return res.status(400).json({ status: 'error', message: 'Missing required parameters: userId and contextId.' });
        }

        // 2. 서비스 계층 호출 (실제 로직은 여기서 분리됨)
        const diagnosisResult = await diagnosisService.fetchDiagnosisData(userId, contextId);

        if (!diagnosisResult) {
             return res.status(404).json({ status: 'error', message: `No diagnosis result found for User ${userId} in Context ${contextId}.` });
        }

        // 3. 표준화된 성공 응답 반환
        res.status(200).json({
            status: 'success',
            data: diagnosisResult,
            message: 'Diagnosis data retrieved successfully.',
            timestamp: new Date(),
        });

    } catch (error) {
        // 4. 에러 핸들링 및 로깅 (필수)
        console.error("Error fetching diagnosis score:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error while processing diagnosis data.' });
    }
};