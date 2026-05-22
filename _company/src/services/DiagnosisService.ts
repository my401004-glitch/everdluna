import { PerformanceHistory, UserContext } from '../models';
import * as db from '../db'; // DB 연결 모듈 가정
import { DiagnosisResult } from '../types/diagnosis';

/**
 * @description 진단 점수 계산 및 사용량 로직을 통합 처리하는 서비스 레이어 함수.
 * @param userId - 현재 사용자 ID (인증 필요)
 * @param audioData - 분석할 오디오 데이터
 * @returns Promise<DiagnosisResult>
 */
export async function processDiagnosisScore(userId: string, audioData: any): Promise<DiagnosisResult> {
    // 1. [RBAC/Billing] 사용자 권한 및 사용량 확인 (핵심 로직)
    const userContext = await db.getUserContext(userId); // DB에서 구독 레벨, 할당 횟수 조회
    
    if (!checkQuotaAvailable(userContext)) {
        // 과도한 사용 시도를 기록하고 에러 발생
        await recordUsageAttempt(userId, 'Diagnosis', 'QUOTA_EXCEEDED');
        throw new Error("사용량 제한에 도달했습니다. Pro/Enterprise로 업그레이드하세요.");
    }

    // 2. [Core Logic] 진단 점수 계산 (기존 로직 유지)
    const diagnosisResult = await calculateDiagnosis(audioData); // 실제 분석 API 호출

    // 3. [Data Persistence] 결과 및 사용량 기록
    await db.saveDiagnosisResult(userId, diagnosisResult);
    await recordUsageAttempt(userId, 'Diagnosis', null); // 성공적으로 사용했으므로 기본 기록

    return diagnosisResult;
}


/**
 * @description 사용량 시도 및 제한 여부를 Performance_History에 기록합니다. (원자성 필수)
 */
async function recordUsageAttempt(userId: string, contextType: string, limitedKpi: string | null): Promise<void> {
    const historyEntry: PerformanceHistory = {
        history_id: undefined, // DB가 UUID 생성 가정
        user_id: userId,
        context_type: contextType,
        attempted_access_kpi: limitedKpi || null,
        is_restricted: !!limitedKpi,
        metric_value: { /* ... */ },
        recorded_at: new Date(),
    };

    // 트랜잭션 처리 필수! 기록 실패 시 데이터 불일치 발생 가능.
    await db.insertPerformanceHistory(historyEntry); 
}

/**
 * @description 사용자의 구독 레벨과 남은 횟수를 확인하는 가상 함수 (비즈니스 로직).
 */
function checkQuotaAvailable(userContext: UserContext): boolean {
    // 예시: Basic은 월 5회 제한. 현재 차감된 횟수가 5회를 넘으면 false 반환
    if (userContext.tier === 'Basic' && userContext.usage_count >= 5) {
        return false;
    }
    return true; // Pro/Enterprise는 무제한 또는 더 많은 할당량 가정
}

/**
 * @description 실제 오디오 분석 API를 호출하여 진단 결과를 계산하는 내부 헬퍼 함수.
 */
async function calculateDiagnosis(audioData: any): Promise<DiagnosisResult> {
    // 임시 Mock 구현: 실제 환경에 맞춤
    return {
        overallGapScore: 45,
        isSuccessful: true,
        summaryMessage: "오디오 파일 분석 및 진단이 완료되었습니다.",
        kpis: {
            growthScore: 0.75,
            engagementScore: 0.82,
            monetizationPotential: 0.61
        },
        detailedReportData: {
            weakestAreas: [
                { areaName: "Harmony", score: 60, recommendation: "기본 화성학 진행 분석 훈련 필요" }
            ],
            scoreBreakdown: {
                "Harmony": 60,
                "PitchDeviation": 75,
                "Rhythm": 80
            }
        }
    };
}