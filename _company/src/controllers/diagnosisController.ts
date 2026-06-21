/**
 * API 게이트웨이 역할을 수행하며, 비즈니스 로직(Service)을 호출합니다.
 */

import { getDiagnosisService } from '../services/DiagnosisService';
import { ApiResponse } from '../types/schemas'; 

// 실제 환경에서는 Express나 FastAPI의 Request 객체를 받습니다.
interface ApiRequest {
    rawData: any[]; // 요청 본문에서 받아온 원본 데이터
    contextId: string; // 헤더 또는 파라미터로 받은 컨텍스트 ID
}


/**
 * GET /api/v1/diagnosis_score 엔드포인트 핸들러 (Mock)
 * 실제 API 호출 흐름을 시뮬레이션합니다.
 */
export const getDiagnosisScoreHandler = async (req: ApiRequest): Promise<ApiResponse> => {
    try {
        // 1. 데이터 유효성 검증 (Guard Clause)
        if (!req.rawData || req.rawData.length === 0) {
            return { status: 'error', data: undefined, message: "API Error: Raw data payload is missing or empty." };
        }
        if (!req.contextId) {
             return { status: 'error', data: undefined, message: "API Error: Context ID (session_id) must be provided." };
        }

        // 2. 서비스 로직 호출 및 트랜잭션 처리
        const service = getDiagnosisService();
        const diagnosisResult = service.calculateGapScore(req.rawData, req.contextId);

        // 3. 성공 응답 반환 (클라이언트/프론트엔드에 전달될 포맷)
        return { status: 'success', data: diagnosisResult, message: "Diagnosis score calculated successfully." };

    } catch (error: any) {
        console.error("Critical Error during diagnosis:", error.message);
        // 4. 오류 처리 및 로깅 (Logging/Monitoring Integration Point)
        return { status: 'error', data: undefined, message: `Internal Server Error: ${error.message}` };
    }
};