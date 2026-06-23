import { Request, Response, NextFunction } from 'express';
import { GapScoreService } from '../services/GapScoreService';
// 🚨 실제 환경에서는 사용자 인증(User) 및 권한 체크 로직이 추가되어야 합니다.

/**
 * @desc    사용자 진단 점수 계산 API 엔드포인트 (GET /api/v1/diagnosis_score)
 * @route   /api/v1/diagnosis_score
 * @access  Private (인증된 사용자만 접근 가능해야 함)
 */
export const getDiagnosisScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // 1. 요청 파라미터 유효성 검사 (Validation Layer)
        const { diagnosisType } = req.query;
        if (!diagnosisType || typeof diagnosisType !== 'string') {
            return res.status(400).json({ message: '진단 유형(diagnosisType)이 필수입니다.' });
        }

        // 2. 비즈니스 로직 호출 (Service Layer)
        const scoreData = await GapScoreService.calculateGapScore(String(diagnosisType));
        
        if (!scoreData) {
            // Service가 null이나 undefined를 반환하는 경우 (예: 데이터 없음)
            return res.status(404).json({ message: '요청된 진단 유형에 대한 데이터를 찾을 수 없습니다.' });
        }

        // 3. 응답 포맷팅 및 전송 (Response Layer)
        res.status(200).json({
            success: true,
            data: scoreData, // 확정된 JSON 구조의 결과 데이터 반환
        });

    } catch (error) {
        // 4. 예외 처리 (Global Error Handler 사용 권장)
        console.error("Diagnosis Score API Error:", error);
        // 사용자에게는 상세 에러를 노출하지 않고 일반적인 실패 메시지 제공
        res.status(500).json({ message: '서버에서 진단 점수를 계산하는 중 오류가 발생했습니다.' });
    }
};

/** 
 * 이 컨트롤러는 Express 라우터에 등록되어야 합니다.
 * 예시: router.get('/', getDiagnosisScore); 
 */