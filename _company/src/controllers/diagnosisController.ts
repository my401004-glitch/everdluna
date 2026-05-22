import { Request, Response } from 'express'; // Assuming Express framework for simplicity
import { DiagnosisResult, KpiMetric } from '../types/diagnosisTypes'; 
import { processDiagnosisScore } from '../services/DiagnosisService';

// Mock DB Interaction Layer (실제로는 ORM/DB Client를 사용)
const mockDbSave = async (result: DiagnosisResult, kpis: KpiMetric[]) => {
    console.log("--- [DB Write Simulation] ---");
    // 실제 트랜잭션 처리 로직이 들어갈 자리입니다.
    console.log(`✅ ${result.contextId}의 진단 결과를 성공적으로 저장했습니다.`);
    kpis.forEach(kpi => {
        console.log(`   - KPI 기록: ${kpi.metricName} (${kpi.value})`);
    });
    return true;
};

/**
 * @description Diagnosis Score API Endpoint Handler
 * 진단 점수 계산 및 결과를 반환하는 핵심 비즈니스 로직을 수행합니다.
 * [근거: sessions/2026-05-19T09:57, sessions/2026-05-18T14-34/developer.md]
 */
export const getDiagnosisScore = async (req: Request, res: Response) => {
    // 1. 필수 입력값 검증 및 추출
    const { contextId, diagnosisType, userId } = req.body; // POST 방식 또는 Body 파라미터 가정

    if (!contextId || !diagnosisType) {
        return res.status(400).json({ message: "Context ID와 Diagnosis Type이 필수입니다." });
    }

    const targetUserId = userId || "mock-user-123";

    // 2. [RBAC] 권한 기반 접근 제어 체크 (가장 먼저 실행되어야 함)
    // 실제로는 req.user 객체에서 Role을 가져와서 검사합니다.
    const userRole = "Premium"; // Mocking: 임시로 프리미엄 역할 부여
    if (!['Basic', 'Premium'].includes(userRole) || (diagnosisType === 'Monetization' && userRole !== 'Premium')) {
        return res.status(403).json({ message: `권한 부족: ${diagnosisType} 진단은 ${userRole} 사용자에게 제한됩니다.` });
    }

    try {
        // 3. 실제 DiagnosisService 호출
        const serviceResult = await processDiagnosisScore(targetUserId, { contextId, diagnosisType });

        // 4. 서비스 레이어의 결과를 컨트롤러 API 계약 형식으로 매핑
        const resultData: DiagnosisResult = {
            contextId,
            score: serviceResult.overallGapScore,
            analysisSummary: serviceResult.summaryMessage,
            recommendation: serviceResult.detailedReportData.weakestAreas[0]?.recommendation || "추천 사항이 없습니다."
        };

        const kpis: KpiMetric[] = [
            { metricName: 'Growth', value: Math.round(serviceResult.kpis.growthScore * 100), description: '성장 지수' },
            { metricName: 'Engagement', value: Math.round(serviceResult.kpis.engagementScore * 100), description: '참여도' },
            { metricName: 'Monetization', value: Math.round(serviceResult.kpis.monetizationPotential * 100), description: '수익화 점수' }
        ];

        // 5. DB 저장 시뮬레이션
        await mockDbSave(resultData, kpis);

        // 6. 최종 응답 반환
        return res.status(200).json({
            success: true,
            diagnosisResult: resultData,
            kpiMetrics: kpis
        });

    } catch (error) {
        console.error("Diagnosis API 처리 중 치명적인 오류 발생:", error);
        return res.status(500).json({ success: false, message: (error as Error).message || "진단 점수 계산 및 저장에 실패했습니다." });
    }
};