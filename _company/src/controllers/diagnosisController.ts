// src/controllers/diagnosisController.ts
import { Request, Response } from 'express';
import { DiagnosisService } from '../services/DiagnosisService';
import { ApiResponse } from '../utils/responseHandler';

/**
 * @description Gap Score 진단 점수 및 핵심 KPI 데이터를 제공하는 컨트롤러
 * E2E 테스트 통과 필수. 모든 데이터는 안정적인 JSON 스키마를 따라야 함.
 */
export class DiagnosisController {

    private diagnosisService: DiagnosisService;

    constructor(diagnosisService: DiagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    /**
     * GET /api/v1/diagnosis_score
     * Gap Score 계산 로직을 실행하고, 이를 KPI 구조에 매핑하여 반환합니다.
     * @param req - 요청 객체 (사용자 ID, 진단 타입 등)
     * @param res - 응답 객체
     */
    public async getDiagnosisScore(req: Request, res: Response): Promise<void> {
        try {
            // 1. 필수 입력값 검증 (가드 문)
            const userId = req.query.userId as string;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required for diagnosis." });
            }

            console.log(`[DiagnosisController] Starting diagnosis process for user: ${userId}`);

            // 2. 서비스 레이어 호출 (비즈니스 로직 실행)
            const result = await this.diagnosisService.calculateScoreAndKPI(userId);

            if (!result || !result.score) {
                return res.status(500).json({ message: "Failed to calculate diagnosis score or KPI." });
            }

            // 3. 결과 구조 검증 및 응답 전처리 (Designer가 요구하는 안정적인 형태 유지)
            const finalResponse = {
                diagnosisId: result.id,
                score: result.score, // Gap Score (0-100)
                message: result.interpretationMessage, // 해석 메시지
                kpis: {
                    growthScore: result.kpis?.growth || 0,         // Growth KPI
                    engagementScore: result.kpis?.engagement || 0, // Engagement KPI
                    monetizationPotential: result.kpis?.monetization || 0 // Monetization KPI
                },
                dataContext: {
                    // 데이터 추적에 필요한 추가 컨텍스트 정보 (e.g., 진단 유형)
                    contextType: 'MusicCareerGap',
                    timestamp: new Date().toISOString()
                }
            };

            res.status(200).json({ 
                success: true, 
                data: finalResponse 
            });

        } catch (error) {
            console.error("[DiagnosisController] Error during diagnosis:", error);
            // 내부 오류는 500으로 처리하고, 클라이언트에게는 상세 정보 노출 최소화
            res.status(500).json({ message: "Internal Server Error while processing diagnosis." });
        }
    }
}

// NOTE: 실제 프로젝트에서는 Dependency Injection을 통해 DiagnosisService 인스턴스를 주입받아야 합니다.