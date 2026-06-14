/**
 * DiagnosisRepository: 진단 결과의 데이터베이스 저장 및 조회 책임을 전담합니다.
 * 이 클래스는 실제 DB ORM(TypeORM, Prisma 등) 호출 로직이 들어갈 자리입니다.
 * [원칙] 비즈니스 로직을 포함하지 않고, 오직 CRUD와 트랜잭션 관리에만 집중해야 합니다.
 */

import { DiagnosisResultDto } from '../controllers/diagnosisController';
import { UserContext } from '../../types/userContext'; // 가정된 사용자 컨텍스트 타입

export class DiagnosisRepository {

    /**
     * 진단 결과를 DB에 트랜잭션으로 저장합니다.
     * @param resultData - 최종 진단 결과 DTO
     * @param userContext - 요청을 보낸 사용자의 정보 (권한 체크용)
     * @returns 성공적으로 저장된 레코드 ID 또는 Boolean
     */
    public async saveDiagnosisResult(resultData: DiagnosisResultDto, userContext: UserContext): Promise<boolean> {
        console.log(`[DB START] 진단 결과 저장을 시도합니다. Context-ID: ${userContext.userId}`);

        // 1. 권한 기반 접근 제어 (RBAC) 체크 - 필수 로직!
        if (!this.hasAccess(resultData.diagnosisType, userContext.role)) {
            console.error(`[DB ERROR] User Role [${userContext.role}] is unauthorized to access type: ${resultData.diagnosisType}`);
            // 권한이 없으면 DB 저장을 실패시키고 에러를 던집니다.
            throw new Error("Unauthorized access to this diagnosis type.");
        }

        // 2. 트랜잭션 시작 (가정)
        try {
            // Diagnosis_Results 테이블에 기본 결과 저장 로직 (context_id, result_data 등)
            // await db.diagnosis_results.create({...});

            // KPI 기록 및 연관 관계 처리 (Growth/Engagement/Monetization는 별도 트랜잭션으로 분리하여 관리)
            await this.saveKpiMetrics(resultData.growthKpi, resultData.engagementKpi, resultData.monetizationKpi);

            console.log("[DB SUCCESS] 진단 결과 및 KPI가 성공적으로 저장되었습니다.");
            return true;

        } catch (error) {
            // 트랜잭션 롤백 처리 로직
            console.error(`[DB FAILURE] 데이터 저장 중 오류 발생: ${error.message}`);
            throw error; // 상위 계층(Service/Controller)로 에러 전파
        }
    }

    /**
     * 내부적으로 사용자 권한을 확인하는 헬퍼 함수입니다.
     */
    private hasAccess(diagnosisType: string, role: string): boolean {
        // 실제로는 DB 조회 또는 Role Matrix 체크가 필요합니다.
        if (role === 'ADMIN' || diagnosisType === 'GLOBAL') return true;
        if (role === 'PREMIUM' && ['ALL', 'BASIC'].includes(diagnosisType)) return true;
        return false; // 기본적으로 접근 불가 처리
    }

    /**
     * KPI 메트릭을 별도 테이블에 저장하는 로직입니다.
     */
    private async saveKpiMetrics(growth: number, engagement: number, monetization: number): Promise<void> {
        // await db.kpi_metrics.create({ growth, engagement, monetization });
        console.log(`[DB INFO] KPI Metrics (G:${growth}, E:${engagement}, M:${monetization}) 저장 완료.`);
    }
}

export const diagnosisRepository = new DiagnosisRepository(); // 싱글톤 패턴 적용 가정