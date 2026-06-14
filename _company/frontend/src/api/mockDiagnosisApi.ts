/**
 * @fileoverview Diagnosis API 호출을 위한 Mocking Layer입니다.
 * 실제 백엔드와 연결되기 전, 데이터 구조와 비동기 흐름을 검증하는 용도로 사용합니다.
 */

// ---------------------------------------------
// 1. Data Contract Definition (진단 결과 스키마 재정의)
// [근거: sessions/2026-06-14T09-53/developer.md]
export interface DiagnosisResult {
  diagnosisType: 'Pitch' | 'FrequencyStability' | 'Rhythm'; // 진단 유형
  score: number; // 전체 점수 (0~100)
  isPassingGrade: boolean; // 합격 여부
  detailedScores: {
    [key: string]: number; // 상세 스코어 예시: pitchScore, rhythmScore 등
  };
  kpiMetrics: {
    growthScore?: number; // Growth (성장) KPI 점수
    engagementScore?: number; // Engagement (참여) KPI 점수
    monetizationPotential?: number; // Monetization (수익화 잠재력) KPI 점수
  };
  // 에러 화면 표시용 데이터 필드 (이것들이 핵심입니다!)
  errorMessage: string | null;
  contextId: string; // 진단에 사용된 컨텍스트 ID
}

/**
 * Mock Diagnosis API 호출 함수.
 * 실제 백엔드(FastAPI/Express)의 GET /api/v1/diagnosis_score를 대체합니다.
 * @param contextId - 진단을 수행한 세션 또는 콘텐츠 ID.
 * @returns Promise<DiagnosisResult> - 가상의 진단 결과를 담은 Promise.
 */
export const mockDiagnosisApi = async (contextId: string): Promise<DiagnosisResult> => {
  console.log(`[Mock API] Calling diagnosis endpoint for context ID: ${contextId}`);

  // 비동기 지연 효과 추가 (네트워크 레이턴시 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

  // --- 테스트 케이스 분기 처리 ---

  if (!contextId || contextId.length < 10) {
    console.error("[Mock API Error] Invalid Context ID provided.");
    return {
      diagnosisType: 'N/A',
      score: 0,
      isPassingGrade: false,
      detailedScores: {},
      kpiMetrics: {},
      errorMessage: "유효하지 않은 세션 데이터입니다. 진단을 수행할 수 없습니다.", // 핵심 에러 메시지 테스트
      contextId: contextId || 'UNKNOWN',
    };
  }

  // 1. Passing Grade (성공 케이스) 시뮬레이션
  if (contextId.includes('SUCCESS')) {
    return {
      diagnosisType: 'Pitch',
      score: Math.floor(Math.random() * 30 + 70), // 높은 점수
      isPassingGrade: true,
      detailedScores: { pitchScore: 95, rhythmScore: 88 },
      kpiMetrics: { growthScore: 80, engagementScore: 75, monetizationPotential: 60 },
      errorMessage: null, // 에러 메시지 없음
      contextId: contextId,
    };
  }

  // 2. Failure Grade (실패 케이스) 시뮬레이션 - 가장 중요한 테스트 대상
  return {
    diagnosisType: 'FrequencyStability',
    score: Math.floor(Math.random() * 40 + 10), // 낮은 점수
    isPassingGrade: false,
    detailedScores: { pitchScore: 32, rhythmScore: 55 },
    kpiMetrics: { growthScore: 10, engagementScore: 15, monetizationPotential: 5 },
    errorMessage: `진단 실패: ${contextId} 컨텍스트에서 음정 불안정(Frequency Instability)이 감지되었습니다. 개선 영역은 [음정 안정성]입니다.`, // 상세 에러 메시지 테스트
    contextId: contextId,
  };
};

/**
 * 데이터 흐름 검증 함수 (실제 테스트 케이스 역할).
 * @param testContextId - Mock API에 전달할 가상의 Context ID.
 */
export const runDataFlowValidationTest = async (testContextId: string): Promise<DiagnosisResult> => {
    console.log("\n=============================================");
    console.log(`[테스트 시작] 진단 데이터 흐름 검증 모듈 실행 (${testContextId})`);
    console.log("=============================================");

    try {
        // 1. API 호출 시뮬레이션 (가장 먼저 Mocking 레이어 통과)
        const diagnosisData = await mockDiagnosisApi(testContextId);
        
        // 2. 데이터 구조 검증 및 로직 실행 (이곳에서 ErrorStateScreen의 로직을 테스트합니다.)
        if (!diagnosisData.isPassingGrade && !diagnosisData.errorMessage) {
             throw new Error("Mock API가 실패 상태임에도 불구하고, 명시적인 에러 메시지를 반환하지 않았습니다. 데이터 계약 위반!");
        }

        console.log("\n✅ [테스트 성공] Mock API 호출 및 데이터 구조 검증 통과.");
        return diagnosisData;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`\n❌ [테스트 실패] E2E Data Flow Validation Failed: ${errorMessage}`);
        // 실패 시, 명확한 오류 데이터 구조를 강제로 반환하여 다음 컴포넌트가 깨지지 않게 함
        return {
            diagnosisType: 'Error',
            score: 0,
            isPassingGrade: false,
            detailedScores: {},
            kpiMetrics: {},
            errorMessage: `[SYSTEM_ERROR] 데이터 흐름 검증 실패: ${errorMessage}`,
            contextId: testContextId,
        };
    }
};