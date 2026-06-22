import { Request, Response } from 'express'; // Express 프레임워크 가정
import { saveDiagnosisResultAndKPIs } from '../services/diagnosisService';

/**
 * @description 진단 점수 API 엔드포인트 핸들러. 
 * 사용자의 권한 체크와 입력값 유효성 검증을 최우선으로 합니다.
 */
export const getDiagnosisScore = async (req: Request, res: Response) => {
    // [Step 2-1] 인증 및 인가(Authentication & Authorization) 확인
    const userRole = req.user?.role; // 가상의 사용자 권한 추출
    if (!userRole || !['Premium', 'Admin'].includes(userRole)) {
        // RBAC 체크: 무료 사용자는 특정 KPI 접근 제한 (미검증 지식 활용)
        return res.status(403).json({ 
            error: "접근 권한이 없습니다.", 
            message: "Premium 또는 Admin 등급의 사용자만 이 진단 점수 리포트를 확인할 수 있습니다." 
        });
    }

    // [Step 2-2] 입력값 유효성 검증 (Input Validation)
    const { contextId } = req.query;
    if (!contextId || typeof contextId !== 'string') {
        return res.status(400).json({ error: "유효하지 않은 요청입니다.", message: "Context ID를 반드시 제공해야 합니다." });
    }

    try {
        // 1. 가상의 데이터 로직 (실제로는 다른 서비스에서 호출)
        // 이 부분은 진단 점수 계산이 이루어지는 곳이라고 가정합니다.
        const mockDiagnosisResults = [
            { contextId: contextId, score: Math.random() * 100, diagnosisType: 'Growth', kpiValue: Math.random() * 5 },
            { contextId: contextId, score: Math.random() * 100, diagnosisType: 'Engagement', kpiValue: Math.random() * 3 },
            { contextId: contextId, score: Math.random() * 100, diagnosisType: 'Monetization', kpiValue: Math.random() * 7 }
        ];

        // 2. 안정화된 서비스 레이어 호출 (트랜잭션 및 KPI 저장)
        await saveDiagnosisResultAndKPIs(mockDiagnosisResults);

        return res.status(200).json({
            success: true,
            message: "진단 점수 계산 및 데이터 연동이 성공적으로 완료되었습니다.",
            data: mockDiagnosisResults // 클라이언트에게 보여줄 결과값 반환
        });

    } catch (error) {
        console.error("API 처리 중 오류 발생:", error);
        // 사용자에게는 내부 에러가 아닌 일반적인 메시지를 전달해야 합니다.
        return res.status(500).json({ 
            error: "서버 내부 오류", 
            message: (error as Error).message || "진단 점수 데이터를 처리할 수 없습니다." 
        });
    }
};