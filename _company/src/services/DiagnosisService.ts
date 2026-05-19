// src/services/DiagnosisService.ts

import { User, DiagnosisContext } from '../types/diagnosisTypes';

/**
 * @description 사용자 진단 컨텍스트와 데이터를 기반으로 시각화에 적합한 Gap Score 추이 데이터를 계산합니다.
 * 이 로직은 DB에서 가져온 Raw Log를 가공하여 트렌드 차트에 최적화된 형태로 만듭니다.
 * @param user - 현재 사용자의 정보 (권한 체크용)
 * @param diagnosisContext - 진단을 수행할 때의 컨텍스트 데이터 (진단 유형, 목표 등)
 * @returns {Promise<{ timeSeriesData: Array<DiagnosisScorePoint>, summaryScore: number }>} 시각화에 필요한 구조화된 데이터
 */
export const calculateGapScoreHistory = async (user: User, diagnosisContext: DiagnosisContext): Promise<{ timeSeriesData: Array<DiagnosisScorePoint>, summaryScore: number }> => {
    // [WARN] 실제 구현에서는 여기서 DB를 조회하여 사용자별 진단 로그(Diagnosis_Results)를 가져와야 합니다.
    console.log(`[Service Logic] Calculating Gap Score history for User ${user.id}...`);

    // --- MOCK DATA GENERATION (실제 데이터 로직이 들어갈 자리입니다.) ---
    // 시각화는 시간 흐름에 따른 변화(Time-Series)가 핵심이므로, 가상의 3개 세션 데이터를 만듭니다.
    const mockData: Array<{ date: Date; score: number }> = [
        { date: new Date('2026-05-10'), score: Math.round(Math.random() * (80 - 50 + 1)) + 50 }, // 낮은 점수 시작
        { date: new Date('2026-05-17'), score: Math.round(Math.random() * (90 - 60 + 1)) + 60 }, // 중간 개선
        { date: new Date('2026-05-24'), score: Math.round(Math.random() * (100 - 80 + 1)) + 80 }  // 높은 목표 달성 점수
    ];

    const timeSeriesData: Array<DiagnosisScorePoint> = mockData.map((item, index) => ({
        date: item.date.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 통일
        score: item.score,
        // 기타 시각화에 필요한 메트릭 추가 가능 (예: trend_change: calculateChange(item))
    }));

    // 최종 요약 점수는 가장 최근 데이터를 반영하거나 가중 평균합니다.
    const summaryScore = timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1].score : 0;

    return {
        timeSeriesData: timeSeriesData,
        summaryScore: summaryScore
    };
};

// 시각화에 필요한 데이터 포인트를 정의하는 인터페이스 (types/diagnosisTypes.ts와 연동되어야 함)
export type DiagnosisScorePoint = {
    date: string; // YYYY-MM-DD
    score: number;
};