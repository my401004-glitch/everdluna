import { PrismaClient } from '@prisma/client'; // 예시 ORM 사용
// 필요한 타입 정의 (실제 프로젝트에 맞게 조정 필요)
interface DiagnosisResultInput {
    contextId: string;
    score: number; // 0~100 스코어
    diagnosisType: 'Growth' | 'Engagement' | 'Monetization';
    kpiValue: number;
}

// PrismaClient 인스턴스는 전역 또는 컨테이너에서 주입받는 것이 일반적입니다.
const prisma = new PrismaClient(); 

/**
 * @description 진단 결과를 DB에 기록하고, 핵심 KPI를 원자적으로 업데이트하는 서비스 함수.
 * @param results - 진단 결과 배열 (Growth, Engagement, Monetization 등)
 */
export async function saveDiagnosisResultAndKPIs(results: DiagnosisResultInput[]): Promise<any> {
    if (!results || results.length === 0) {
        throw new Error("진단 결과를 제공해야 합니다.");
    }

    // 트랜잭션 시작 (가장 중요! 모든 작업이 성공하거나 모두 실패하도록 보장)
    const transactionResult = await prisma.$transaction(async (tx) => {
        let diagnosisRecordId: string | null = null;

        // 1. 진단 결과 기록 및 핵심 KPI 업데이트를 병렬로 처리
        for (const result of results) {
            try {
                // 1-A. Diagnosis_Results 테이블에 주 데이터 삽입
                await tx.diagnosis_results.create({
                    data: {
                        contextId: result.contextId,
                        score: result.score,
                        diagnosisType: result.diagnosisType, // 진단 유형 명시
                        resultDataJson: JSON.stringify({ /* ... 상세 데이터 로직 ... */ }), 
                        createdAt: new Date(),
                    }
                });

                // 1-B. KPI_Metrics 테이블에 개별 KPI 값 업데이트 (원자적 쓰기)
                await tx.kpi_metrics.upsert({ // upsert를 사용하여 값이 이미 존재하면 업데이트, 아니면 생성
                    where: { type: result.diagnosisType, contextId: result.contextId },
                    update: { 
                        value: result.kpiValue, 
                        updatedAt: new Date() 
                    },
                    create: { 
                        type: result.diagnosisType, 
                        contextId: result.contextId, 
                        value: result.kpiValue,
                        createdAt: new Date(),
                    }
                });

            } catch (error) {
                // 트랜잭션 내에서 오류 발생 시 즉시 실패 처리
                console.error(`KPI 저장 실패 (${result.diagnosisType}):`, error);
                throw new Error("데이터베이스 쓰기 과정 중 치명적인 에러가 발생했습니다."); 
            }
        }

        return { success: true, message: "모든 데이터 저장이 트랜잭션에 성공적으로 완료되었습니다." };
    });

    return transactionResult;
}