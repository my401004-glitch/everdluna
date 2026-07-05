// src/services/DiagnosisService.ts

import { DiagnosisRequestDto } from '../utils/validationUtils';
import { Logger } from '../utils/Logger'; // 가상의 로거 유틸리티

/**
 * @description 진단 점수 처리 및 DB 저장 로직을 담당하는 서비스 클래스 (비즈니스 로직 집중)
 */
export class DiagnosisService {

    // 🚨 실제로는 DB Repository를 주입받아야 합니다. (예: private dbRepo: IDiagnosisRepository)
    constructor() {}


    /**
     * @description KPI 데이터를 받아 최종 유효성 검사 및 데이터베이스 저장 로직을 실행합니다.
     * @param userId - 진단을 수행한 사용자 ID.
     * @param userRole - 사용자의 역할 (RBAC).
     * @param kpiPayload - {DCR: number, LT: number, ACC: number, ...} 형태의 KPI 데이터 객체.
     * @returns 성공 시 처리된 결과 객체.
     */
    public async processAndStoreScore(userId: string, userRole: string, kpiPayload: DiagnosisRequestDto): Promise<any | null> {
        Logger.log(`[${userRole}] User ${userId}가 KPI 데이터를 전송했습니다. 데이터 검증 시작.`);

        // 1. RBAC (Role-Based Access Control) 재검토 및 강제화
        if (!this.checkAccessLevel(userRole, kpiPayload)) {
            Logger.warn(`[${userRole}] 사용자 권한이 부족하여 KPI 처리를 거부합니다.`);
            return null; // 접근 거부
        }

        // 2. 최종 비즈니스 로직 검증 (KPI 범위 체크 등)
        if (!this.validateKpiRange(kpiPayload)) {
             Logger.warn("전송된 KPI 값이 시스템이 허용하는 범위를 벗어났습니다.");
            return null; // 데이터 무효화
        }

        // 3. DB 트랜잭션 시작 (실제 구현 시)
        try {
            // A. Diagnosis_Results 테이블에 메타 정보 저장: 누가, 언제, 어떤 진단을 했는지.
            const diagnosisResultRecord = this.createDiagnosisSummary(userId, kpiPayload);

            // B. KPI_Metrics 테이블에 개별 지표 기록 (Growth/DCR 등)
            await this.saveKpiToMetrics(kpiPayload);

            Logger.log(`✅ 사용자 ${userId}의 진단 점수 처리가 성공적으로 완료되었습니다.`);
            return { 
                status: "SUCCESS", 
                diagnosis_id: diagnosisResultRecord.id, 
                message: "KPI 데이터가 성공적으로 기록되었습니다." 
            };

        } catch (e) {
            Logger.error("DB 저장 중 치명적인 에러 발생:", e);
            // 트랜잭션 롤백 로직 필요
            return null;
        }
    }


    /**
     * @private
     * @description 사용자의 역할에 따라 KPI 접근 권한을 검사합니다. (RBAC 핵심)
     */
    private checkAccessLevel(role: string, payload: DiagnosisRequestDto): boolean {
        // 예시 로직: 'Premium' 역할만 DCR 지표를 쓸 수 있다.
        if (payload.DCR !== undefined && role !== "Premium") {
            return false; 
        }
        // 다른 KPI는 기본적으로 모두 허용한다고 가정
        return true;
    }

    /**
     * @private
     * @description KPI 값들이 비즈니스 상의 유효 범위를 벗어나는지 확인합니다. (Data Integrity)
     */
    private validateKpiRange(payload: DiagnosisRequestDto): boolean {
        // 예시 로직: DCR은 0에서 100 사이여야 함.
        if (payload.DCR !== undefined && (payload.DCR < 0 || payload.DCR > 100)) {
            return false;
        }
        // 모든 KPI에 대한 유효성 검증 로직 추가 필요...
        return true;
    }

    /**
     * @private
     * @description 진단 결과를 요약하여 메인 결과 테이블에 저장합니다.
     */
    private createDiagnosisSummary(userId: string, payload: DiagnosisRequestDto) {
        // 실제 DB insert 로직이 들어갈 자리입니다.
        return { id: Math.floor(Math.random() * 1000) }; // 가짜 ID 반환
    }

    /**
     * @private
     * @description KPI 데이터를 별도의 Metrics 테이블에 저장합니다. (추적 용이성 확보)
     */
    private async saveKpiToMetrics(payload: DiagnosisRequestDto): Promise<void> {
        // 실제 DB bulk insert 또는 ORM 로직 구현 필요
        console.log("-> [DB] KPI_Metrics 테이블에 DCR, LT, ACC 기록 요청 완료.");
    }
}

// Logger와 ValidationUtils는 별도의 유틸리티 파일로 분리됩니다.