import { validateDiagnosisData } from '../utils/dataValidator'; // Assume dataValidator is in src/utils/

// --- Mocking 환경 설정 및 가상 데이터 정의 ---

/**
 * 시뮬레이션할 사용자 진단 결과 데이터 구조 (Frequency Deviation 포함)
 */
interface DiagnosisPayload {
    context_id: string;       // 현재 컨텍스트를 식별하는 ID (사용자 세션 등)
    diagnosis_type: 'FREQUENCY_DEVIATION' | 'GENERAL_SCORE'; // 새로운 진단 타입 명시
    score_result: {
        gap_score: number;          // 신규 지표 1: Gap Score (0-100)
        frequency_deviation_avg: number; // 신규 지표 2: 평균 주파수 편차 (Hz 단위)
        suggested_next_step: string;  // 시스템 추천 액션
    };
    kpi_metrics: {
        growth_score: number;      // 기존 KPI: 성장 점수
        engagement_score: number;  // 기존 KPI: 참여도 점수
        monetization_potential: number; // 기존 KPI: 유료 전환 잠재력
    };
}

/**
 * 가상의 API 호출 시뮬레이션 함수
 */
const simulateApiCall = (data: DiagnosisPayload) => {
    console.log(`\n======================================================`);
    console.log(`[TEST START] 진단 데이터 계약 검증 시작 (Type: ${data.diagnosis_type})`);
    console.log(`[DATA INPUT]`, JSON.stringify(data, null, 2));

    try {
        // 핵심 검증 로직 호출 (여기서 dataValidator가 동작한다고 가정)
        const isValid = validateDiagnosisData(data);

        if (isValid) {
            console.log("✅ [SUCCESS]: 모든 데이터 계약 필드와 타입이 유효합니다. DB 삽입 준비 완료.");
        } else {
            // 실제 구현에서는 더 상세한 에러 메시지를 반환해야 함
            throw new Error("❌ [FAILURE]: 데이터 계약 검증 실패. 필수 필드를 확인하세요.");
        }

    } catch (error) {
        console.error(`\n🔥 [FATAL ERROR] 테스트 실행 중 치명적인 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 에러'}`);
    }
};


// --- 🧪 테스트 케이스 정의 ---

/**
 * Case 1: 모든 데이터가 완벽하게 들어온 경우 (Happy Path)
 */
const happyPathData: DiagnosisPayload = {
    context_id: "user-abc-20260519",
    diagnosis_type: 'FREQUENCY_DEVIATION', // 새로운 진단 타입 테스트
    score_result: {
        gap_score: 78.5,
        frequency_deviation_avg: 4.2, // 신규 지표 사용
        suggested_next_step: "공명 영역 훈련 모듈 레벨 2 시작",
    },
    kpi_metrics: {
        growth_score: 65,
        engagement_score: 80,
        monetization_potential: 40,
    }
};

/**
 * Case 2: 핵심 필드(Gap Score)가 누락된 경우 (Failure Path - 필수값 검증)
 */
const missingFieldData: DiagnosisPayload = {
    context_id: "user-def-20260519",
    diagnosis_type: 'FREQUENCY_DEVIATION',
    score_result: {
        // gap_score가 누락됨. 필수값으로 지정해야 함.
        frequency_deviation_avg: 3.8,
        suggested_next_step: "재점검 필요",
    },
    kpi_metrics: {
        growth_score: 70,
        engagement_score: 90,
        monetization_potential: 50,
    }
};

/**
 * Case 3: 데이터 타입이 잘못된 경우 (Failure Path - Type Checking)
 */
const wrongTypeData: DiagnosisPayload = {
    context_id: "user-ghi-20260519",
    diagnosis_type: 'FREQUENCY_DEVIATION',
    score_result: {
        gap_score: 82.0,
        frequency_deviation_avg: "4.2Hz", // 실수(Number)여야 하는데 문자열임! (Type Mismatch)
        suggested_next_step: "정확한 데이터 분석 필요",
    },
    kpi_metrics: {
        growth_score: 50,
        engagement_score: 60,
        monetization_potential: 'low', // 숫자가 아닌 문자열!
    }
};


// --- 실행 로직 ---

console.log("=======================================================");
console.log("✨ 데이터 계약 연동 테스트 스크립트 실행 시작 ✨");

simulateApiCall(happyPathData);
simulateApiCall(missingFieldData);
simulateApiCall(wrongTypeData);

console.log("\n=======================================================");
console.log("🚀 모든 테스트 시나리오가 완료되었습니다.");