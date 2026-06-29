// 기존 내용에 아래와 같이 재무적 손실 계산 로직 추가 및 export 합니다.
import { DiagnosisInput, DiagnosisResult } from '../types/diagnosis';
import { getDiagnosisScoreFromFinancialLoss } from '../services/scoreService'; 

export class DiagnosisController {
    /**
     * GET /api/v1/diagnosis_score
     * 사용자의 진단 점수를 계산하고 결과를 반환합니다.
     * @param req - 요청 객체 (user id, context 등 포함)
     * @param res - 응답 객체
     */
    public static async getDiagnosisScore(req: any, res: any): Promise<void> {
        try {
            // 1. 권한 및 유효성 검증 (RBAC & Input Validation)
            const userId = req.user?.id; // 사용자 ID가 반드시 있어야 합니다.
            if (!userId) return res.status(403).json({ message: "권한 부족 또는 사용자 정보 누락." });

            // 2. 진단 데이터 로드 (실제 DB에서 가져와야 하지만, 테스트를 위해 Mocking 가정)
            const diagnosisInput = req.body; // { type: 'financial_risk', data: {...} } 형태의 입력 예상

            if (!diagnosisInput || !['basic', 'engagement', 'monetization', 'financial_risk'].includes(diagnosisInput.type)) {
                return res.status(400).json({ message: "유효하지 않은 진단 타입입니다." });
            }

            // 3. 핵심 로직 호출 (Video 3의 새로운 서비스 레이어 이용)
            const scoreData = await getDiagnosisScoreFromFinancialLoss(diagnosisInput);

            if (!scoreData) {
                return res.status(500).json({ message: "진단 점수 계산에 실패했습니다." });
            }

            // 4. 결과 저장 및 반환 (DB Write & API Response)
            const result = await DiagnosisResultService.saveScore(userId, diagnosisInput.type, scoreData);

            res.status(200).json({ 
                success: true, 
                result: result 
            });

        } catch (error) {
            console.error("Diagnosis API Error:", error);
            res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
        }
    }
}