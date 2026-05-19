// src/api/diagnosisController.ts

import { Request, Response } from 'express';

export interface DiagnosisResult {
    score: number;
    levelName: string;
    recommendationText: string;
    kpis: {
        growth: number;
        engagement: number;
        monetization: number;
    };
}

/**
 * @desc    진단 점수를 계산하고 결과를 반환하는 API 엔드포인트
 * @route   GET /api/v1/diagnosis_score
 * @access  Public (로그인 여부와 관계없이 진단은 가능하나, 상세 데이터 접근 시 RBAC 체크 필요)
 */
export const getDiagnosisScore = async (req: Request, res: Response): Promise<void> => {
    // 1. 입력값 유효성 검증 및 추출
    const { diagnosis_type } = req.query;

    if (!diagnosis_type) {
        res.status(400).json({ message: "진단 유형(diagnosis_type)이 필요합니다." });
        return;
    }

    try {
        // 2. (Self-RAG 검증 지점) RBAC 체크 및 사용자 권한 확인 로직 실행
        // 실제 환경에서는 JWT 토큰 등을 통해 현재 사용자의 Role을 추출하고,
        // 해당 diagnosis_type에 접근할 권한이 있는지 DB를 통해 검증해야 합니다. [근거: sessions/2026-05-18T13:43]
        const userRole = "Free"; // Mocking: 현재 사용자는 무료 사용자라고 가정
        
        if (userRole === "Free" && diagnosis_type !== "general") {
             res.status(403).json({ message: `[${diagnosis_type}]: 이 진단 유형에 대한 접근 권한이 없습니다. Premium 구독이 필요합니다.` });
             return;
        }

        // 3. 핵심 비즈니스 로직 실행 (점수 계산 및 데이터 조합)
        const mockDiagnosisResult: DiagnosisResult = {
            score: Math.floor(Math.random() * (90 - 40 + 1)) + 40, // 임의 점수 생성 (40~90점)
            levelName: "준비 단계", // 실제 로직에 따라 결정됨
            recommendationText: `현재 ${diagnosis_type} 영역에서는 기초를 탄탄히 다지는 것이 중요합니다. 꾸준한 연습이 필요해요!`,
            kpis: {
                growth: Math.floor(Math.random() * 30) + 5, // Growth KPI (5~35점)
                engagement: Math.floor(Math.random() * 40) + 10, // Engagement KPI (10~50점)
                monetization: Math.floor(Math.random() * 20) + 1, // Monetization KPI (1~21점)
            }
        };

        // 4. 성공적인 결과 반환
        res.status(200).json({
            success: true,
            data: mockDiagnosisResult,
            message: "진단 점수 데이터를 성공적으로 불러왔습니다."
        });

    } catch (error) {
        console.error("진단 API 처리 중 에러 발생:", error);
        res.status(500).json({ message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    }
};