// src/controllers/diagnosisController.ts
import { Request, Response } from 'express'; // Assuming Express or similar framework context
import { DiagnosisInput } from '../core/diagnosis.interface';
import { diagnosisService } from '../core/diagnosis.service';

/**
 * @description 핵심 진단 로직을 수행하는 컨트롤러.
 * 요청의 유효성을 검증하고, 서비스 레이어를 호출하여 결과를 응답합니다.
 */
export class DiagnosisController {

    public async getDiagnosisScore(req: Request, res: Response): Promise<void> {
        try {
            // 1. 요청 바디에서 입력 데이터 추출 및 타입 체크 (Validation)
            const diagnosisInput: DiagnosisInput = req.body; // Assume request body contains the required structure

            if (!diagnosisInput || !diagnosisInput.contextId) {
                res.status(400).json({ message: "Missing required parameters for diagnosis." });
                return;
            }

            // 2. RBAC 체크 (권한 검증): 이 부분은 실제 DB/미들웨어가 처리해야 하지만, 컨트롤러에서 한번 더 방어 코드를 넣습니다.
            if (diagnosisInput.userContext?.role === 'Free' && diagnosisInput.testData['monetization'] > 0) {
                res.status(403).json({ message: "Permission Denied: Free users cannot run advanced monetization diagnostics." });
                return;
            }

            // 3. 서비스 레이어 호출 (Core Business Logic)
            const scoreResult = await diagnosisService.calculateScore(diagnosisInput);

            // 4. 요약 보고서 생성 및 반환 준비
            const summaryReport = await diagnosisService.generateReportSummary(scoreResult);

            // 5. 최종 응답 전송
            res.status(200).json({
                success: true,
                data: scoreResult,
                reportSummary: summaryReport,
                message: "Diagnosis completed successfully."
            });

        } catch (error) {
            console.error("Error in DiagnosisController:", error);
            // 500 Internal Server Error 처리
            res.status(500).json({ message: "Internal server error during diagnosis processing.", details: error instanceof Error ? error.message : 'Unknown Error' });
        }
    }
}

export const diagnosisController = new DiagnosisController(); // 인스턴스화하여 사용 편의성 확보