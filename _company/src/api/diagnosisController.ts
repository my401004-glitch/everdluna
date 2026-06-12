import { DiagnosisInput, DiagnosisResult, ApiResponse } from '../types/diagnosis';

/**
 * @description [Core Logic] 진단 점수 계산 로직을 담당하는 핵심 컨트롤러 파일.
 * 비즈니스 규칙(Writer가 정의)과 데이터 구조(Designer가 요구)를 통합합니다.
 */

// TODO: 실제 DB나 외부 API 호출 로직이 여기에 들어갑니다. (현재는 Mockup)

/**
 * @description 진단 점수를 계산하는 핵심 함수.
 * 입력된 데이터를 기반으로 종합적인 스코어와 KPI를 산출합니다.
 * @param input 사용자로부터 받은 원본 데이터.
 * @returns DiagnosisResult 객체.
 */
const calculateDiagnosisScore = (input: DiagnosisInput): DiagnosisResult => {
    // 1. 기본 점수 계산 로직 (가중치 적용)
    // [근거: sessions/2026-05-18T14-34/developer.md] KPI를 종합적으로 산출하는 원리 적용
    let baseScore = 0;
    baseScore += input.vocalRangeConsistencyScore * 0.4; // 일관성이 가장 중요함
    baseScore += input.emotionalExpressivenessIndex * 0.35; // 감성적 후킹 요소 반영
    baseScore += (input.practiceDurationMinutes / 60) * 25; // 시간당 가중치 부여

    // 점수 클리핑 및 정규화
    const finalScore = Math.min(100, Math.max(0, Math.round(baseScore)));

    // 2. KPI 산출 (진단 로직의 핵심)
    const metrics: { growthPotentialScore: number; engagementLevel: number; monetizationValueEstimate: number } = {
        growthPotentialScore: finalScore * 0.6 + input.technicalSkillLevel === 'advanced' ? 10 : 0, // 성장은 기술과 연관
        engagementLevel: Math.min(100, (input.emotionalExpressivenessIndex * 0.7) + 20), // 몰입도는 감성적 표현에 좌우됨
        monetizationValueEstimate: finalScore * 0.8 - input.vocalRangeConsistencyScore * 0.5 // 가치는 객관적인 데이터(일관성)에서 나옴
    };

    // 3. 카테고리 및 추천 로직 (가장 낮은 KPI를 기반으로 진단)
    let category: string;
    let recommendation: string;

    if (metrics.growthPotentialScore < 40 || input.vocalRangeConsistencyScore < 50) {
        category = "Technical Deficit";
        recommendation = "기본적인 음역대 일관성 확보에 집중하고, 연습 패턴을 구조화하는 것이 시급합니다.";
    } else if (metrics.engagementLevel < 60) {
        category = "Emotional Gap";
        recommendation = "기술적 완성도를 넘어, 감정의 깊이와 표현력을 연결하는 스토리텔링 코칭이 필요합니다.";
    } else {
        category = "Optimal Trajectory";
        recommendation = "현재 궤도 유지 및 단계별 목표 설정을 통해 잠재 가치를 극대화하세요. 다음 레벨로의 도약을 준비하십시오.";
    }

    return {
        score: finalScore,
        category: category,
        recommendation: recommendation,
        metrics: metrics
    };
};


/**
 * @description 메인 API 핸들러 함수 (FastAPI/Next.js API Route 형태 가정)
 * 데이터를 받고 검증하며 점수를 계산하고 구조화된 결과를 반환합니다.
 */
export const getDiagnosisScore = async (inputData: DiagnosisInput): Promise<ApiResponse> => {
    try {
        // 1. 입력값 유효성 검사 (Guard Clause)
        if (!inputData || inputData.practiceDurationMinutes < 0 || inputData.vocalRangeConsistencyScore < 0 || inputData.emotionalExpressivenessIndex < 0) {
            return { success: false, message: "필수 진단 입력값(연습 시간, 일관성 점수 등)이 누락되었거나 유효하지 않습니다." };
        }

        // 2. 핵심 로직 실행 및 결과 계산
        const result = calculateDiagnosisScore(inputData);

        // 3. 성공적인 응답 구조화
        return {
            success: true,
            message: "진단 점수 계산이 성공적으로 완료되었습니다.",
            data: result
        };

    } catch (error) {
        console.error("Diagnosis Score Calculation Failed:", error);
        // 4. 에러 핸들링 및 클라이언트에게는 일반적인 메시지 제공
        return { success: false, message: "서버 내부 오류가 발생했습니다. 데이터를 재확인 후 다시 시도해 주세요." };
    }
};

// [테스트 코드 주석] 이 파일은 반드시 단위 테스트(Unit Test)를 거쳐야 합니다.