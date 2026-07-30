/**
 * @description 진단 점수 산출 및 DB 로직 처리를 담당하는 서비스 계층 (비즈니스 로직)
 * [WHY] 컨트롤러와 DB 접근 로직을 분리하여 테스트 가능성(Testability) 확보.
 */
import { Pool } from 'pg'; // 가정: PostgreSQL 사용

// 실제 DB 연결 풀 객체는 환경 변수에서 가져온다고 가정합니다.
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); 

/**
 * 사용자 ID와 Context ID를 기반으로 복합적인 진단 점수 및 Gap Score를 산출합니다.
 * @param userId - 현재 로그인한 사용자 ID
 * @param contextId - 진단이 발생한 특정 컨텍스트의 ID (예: 체험 만료 시점)
 * @returns Promise<{ overall_score: number, gap_details: object, recommendation: string }>
 */
export const getDiagnosisScoreService = async (userId: string, contextId: string): Promise<any> => {
    console.log(`[SERVICE] Starting diagnosis score calculation for User ${userId} at Context ${contextId}`);

    // 1. 데이터 검증 및 권한 확인 로직 실행 (DB 트랜잭션 시작 전)
    // 여기서 사용자의 구독 레벨을 조회하여 접근 가능한 진단 타입을 체크합니다. [근거: sessions/2026-05-18T13:43/developer.md]

    // 2. DB에서 필요한 모든 과거 로그 및 KPI 데이터를 가져옵니다.
    const result = await pool.query(`
        SELECT * FROM diagnosis_results dr JOIN kpi_metrics km ON dr.id = km.diagnosis_result_id WHERE dr.context_id = $1 AND dr.user_id = $2;
    `, [contextId, userId]);

    if (result.rows.length === 0) {
        // 데이터가 없으면 최소한의 기본 점수를 반환하거나 에러 처리합니다.
        return { overall_score: 0.0, gap_details: {}, recommendation: "No data found." };
    }

    // 3. 핵심 비즈니스 로직 (Gap Score 계산) 수행 - 이 부분이 가장 복잡함.
    let totalGapScore = 0;
    const gapDetails: any = { growth: 0, engagement: 0, monetization: 0 };

    // 임시로 DB에서 가져온 데이터를 바탕으로 점수 산출 (실제로는 AI/ML 모델이나 정교한 가중치 계산 필요)
    for (const row of result.rows) {
        // 예시 로직: Growth KPI가 낮을수록 성장 Gap이 크다고 가정
        if (row.growth_score < 0.5) {
            gapDetails.growth += (1 - row.growth_score);
        }
    }

    // 최종 점수 합산 및 정규화
    totalGapScore = Math.min(10, gapDetails.growth + gapDetails.engagement + gapDetails.monetization) * 10; // 최대 10점 (가정)


    // 4. DB에 새로운 진단 결과와 Gap Score를 기록합니다. [근거: sessions/2026-05-18T43/developer.md]
    const writeResult = await pool.query(`
        INSERT INTO diagnosis_results (user_id, context_id, gap_score, ...) 
        VALUES ($1, $2, $3) RETURNING *;
    `, [userId, contextId, totalGapScore]);


    // 5. 최종 결과 반환
    return {
        overall_score: parseFloat(totalGapScore.toFixed(2)),
        gap_details: gapDetails,
        recommendation: `차별화된 맞춤 학습 플랜을 제공합니다. (${totalGapScore > 7 ? 'PREMIUM' : 'FREE'})`
    };
};