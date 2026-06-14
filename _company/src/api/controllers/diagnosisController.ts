import { Request, Response } from 'express';
// 타입스크립트 환경을 가정하고 진단 로직의 핵심 타입을 정의합니다.
export interface DiagnosisResultDto {
    score: number; // 0~100점 범위의 종합 점수
    growthKpi: number; // Growth KPI (예상 성장 잠재력)
    engagementKpi: number; // Engagement KPI (현 활동성 지표)
    monetizationKpi: number; // Monetization KPI (구매 전환 가능성)
    suggestedAction: string; // 사용자가 취해야 할 가장 중요한 액션
}

/**
 * 핵심 진단 점수 계산 및 데이터 구조화 로직을 담당하는 컨트롤러.
 * [TODO] 실제 DB 호출과 복잡한 비즈니스 로직이 이 함수 내에 들어갈 예정입니다.
 */
export const getDiagnosisScore = async (req: Request, res: Response<DiagnosisResultDto>): Promise<void> => {
    // 1. 요청에서 필요한 데이터를 파싱합니다. (예: 사용자 ID, 진단 타입)
    const { userId, diagnosisType } = req.query;

    if (!userId || !diagnosisType) {
        return res.status(400).json({ error: "Required parameters missing: userId and diagnosisType are needed." });
    }

    try {
        // 2. (Mocking Point) 실제 DB/Service 호출 대신, 더미 데이터를 반환합니다.
        // 이는 프론트엔드 개발이 백엔드 API의 최종 확정 전에도 진행 가능하도록 합니다.
        const mockResult: DiagnosisResultDto = {
            score: Math.floor(Math.random() * (90 - 60 + 1)) + 60, // 임시 점수 범위 설정
            growthKpi: Math.random() * 30 + 5, // Growth KPI (5~35)
            engagementKpi: Math.random() * 20 + 10, // Engagement KPI (10~30)
            monetizationKpi: Math.random() * 40 + 10, // Monetization KPI (10~50)
            suggestedAction: `[${diagnosisType} 유형 분석 완료] 다음 단계는 ${Math.floor(Math.random() * 3)} 중 하나입니다.`,
        };

        // 3. 성공적으로 데이터를 반환합니다.
        res.status(200).json(mockResult);

    } catch (error) {
        console.error("Error calculating diagnosis score:", error);
        res.status(500).json({ error: "Internal Server Error during diagnosis calculation." });
    }
};