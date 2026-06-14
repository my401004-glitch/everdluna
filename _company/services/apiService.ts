// API Service Layer - Diagnosis Scoring Simulation (Mock Implementation)
/**
 * @description 진단 점수를 계산하는 백엔드 API의 모킹 서비스 레이어입니다.
 * 실제 배포 시에는 axios 등을 이용해 FastAPI/Node.js 백엔드를 호출하게 됩니다.
 */

interface ScoreResult {
    diagnosisType: string; // 예: 'Growth', 'Engagement'
    scoreValue: number;   // 0-100 사이의 점수
    explanation: string;  // 점수에 대한 설명
}

/**
 * @description 모킹 API 호출을 시뮬레이션합니다. 데이터 전송 지연 시간을 포함하여 UX를 개선합니다.
 * @param contextData 사용자가 진단 과정에서 입력한 컨텍스트 데이터 (예: 취약점, 강점)
 * @returns Promise<ScoreResult> 계산된 점수 결과
 */
export const fetchDiagnosisScore = async (contextData: Record<string, any>): Promise<ScoreResult> => {
    // 1. 네트워크 지연 시간 시뮬레이션 (가장 중요한 UX 요소 중 하나)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 500));

    const diagnosisType = contextData.diagnosisType || 'Unknown';
    let scoreValue: number;
    let explanation: string;

    // 2. 시나리오 기반 점수 계산 로직 (Hardcoded Mock Logic)
    if (contextData.isHighPotential && diagnosisType === 'Growth') {
        scoreValue = Math.min(95, 70 + Math.random() * 20); // 높은 잠재력 -> 높음
        explanation = "매우 높은 성장 가능성을 보입니다. 초기 투자가 필요한 단계입니다.";
    } else if (contextData.hasWeakness && diagnosisType === 'Engagement') {
        scoreValue = Math.max(30, 40 - Math.random() * 15); // 약점 발견 -> 보통 이하로 하락 가능성 반영
        explanation = "현재 참여도 점수가 평균 수준입니다. 동기 부여 요소가 필요해 보입니다.";
    } else {
        scoreValue = Math.floor(Math.random() * 60) + 40; // 기본 랜덤값 (평균치 주변)
        explanation = `${diagnosisType} 관련하여 안정적인 점수를 보여주고 있습니다.`;
    }

    // 3. Mock API 응답 구조 확정
    return {
        diagnosisType: diagnosisType,
        scoreValue: parseFloat(scoreValue.toFixed(1)),
        explanation: explanation
    };
};