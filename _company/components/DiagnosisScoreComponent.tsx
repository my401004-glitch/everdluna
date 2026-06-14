// DiagnosisScoreComponent.tsx
import React, { useState, useCallback } from 'react';

// --- Typescript Definitions (Validation) ---
/**
 * 진단 점수 구조 정의: Growth, Engagement, Monetization KPI를 포함해야 함.
 * @param score - 각 KPI의 점수 값 (0~100)
 */
interface DiagnosisScore {
  growthScore: number; // 성장 가능성 (Growth)
  engagementScore: number; // 참여도/활용성 (Engagement)
  monetizationScore: number; // 수익화 잠재력 (Monetization)
}

/**
 * API 응답 구조를 모킹합니다.
 */
interface DiagnosisResponse {
    score: DiagnosisScore;
    summary: string;
    recommendation: string;
}

// --- Utility Functions ---

/**
 * Mock API 호출 함수: 실제 백엔드 대신 가상의 데이터를 반환하여 컴포넌트 테스트를 진행합니다.
 * @param diagnosisType - 진단 유형 (예: 'vocal_pitch')
 * @returns Promise<DiagnosisResponse>
 */
const fetchDiagnosisScoreMock = async (diagnosisType: string): Promise<DiagnosisResponse> => {
    console.log(`[MOCK API] Fetching score for type: ${diagnosisType}`);
    // 딜레이를 주어 실제 비동기 통신 환경을 시뮬레이션합니다.
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (diagnosisType === 'vocal_pitch') {
        return {
            score: {
                growthScore: Math.floor(Math.random() * (80 - 40 + 1)) + 40, // 40~80
                engagementScore: Math.floor(Math.random() * (70 - 30 + 1)) + 30, // 30~70
                monetizationScore: Math.floor(Math.random() * (90 - 50 + 1)) + 50, // 50~90
            },
            summary: "현재 보컬 진단 결과, 잠재적 성장 동력은 높으나, 지속적인 참여 유도와 수익화 모델 연계가 필요합니다.",
            recommendation: "개인별 맞춤형 로드맵 설계 및 주기적인 피드백 세션을 통해 점수를 극대화할 수 있습니다."
        };
    } else {
        throw new Error("Unknown diagnosis type.");
    }
};

// --- Core Component ---

/**
 * 진단 결과를 시각화하고 사용자 액션을 유도하는 핵심 컴포넌트.
 */
const DiagnosisScoreComponent: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [scoreData, setScoreData] = useState<DiagnosisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * 진단 점수를 가져오는 핸들러 (API 호출 시뮬레이션)
     */
    const handleRunDiagnosis = useCallback(async () => {
        setLoading(true);
        setError(null);
        setScoreData(null);

        try {
            // 1. Mock API 호출을 통해 데이터 확보
            const result = await fetchDiagnosisScoreMock('vocal_pitch');
            
            // 2. 상태 업데이트 및 UI 반영
            setScoreData(result);
        } catch (e) {
            setError((e as Error).message || "진단 점수 로딩 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 🚀 UI 렌더링 로직
    const renderVisualization = () => {
        if (!scoreData) return null;
        const scores = scoreData.score;

        // 각 KPI별로 색상과 강조 정도를 계산하여 시각화합니다.
        const getScoreColor = (score: number, max: number = 100): string => {
            const ratio = Math.min(1, score / max); // 비율 제한
            if (ratio > 0.7) return 'bg-yellow-400'; // Gain 영역 강조
            if (ratio > 0.4) return 'bg-blue-300';
            return 'bg-gray-200';
        };

        return (
            <div className="space-y-6 pt-8">
                {/* KPI 시각화 섹션 */}
                <h3 className="text-xl font-bold text-dark-blue mb-4 border-b pb-2">📊 종합 진단 점수 분석</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Growth Score */}
                    <div className="p-5 rounded-lg shadow-md bg-white border-l-4 border-blue-500">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">📈 성장 가능성 (Growth)</h4>
                        <div className="w-full h-6 rounded-full bg-gray-200 overflow-hidden">
                            {/* Tailwind CSS를 사용하여 비율을 적용합니다. */}
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(scores.growthScore)}`} 
                                style={{ width: `${scores.growthScore}%` }}
                            ></div>
                        </div>
                        <p className="text-2xl font-bold mt-3 text-blue-700">{scores.growthScore}</p>
                    </div>

                    {/* Engagement Score */}
                    <div className="p-5 rounded-lg shadow-md bg-white border-l-4 border-accent-yellow">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">🤝 참여도 (Engagement)</h4>
                        <div className="w-full h-6 rounded-full bg-gray-200 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(scores.engagementScore)}`} 
                                style={{ width: `${scores.engagementScore}%` }}
                            ></div>
                        </div>
                        <p className="text-2xl font-bold mt-3 text-yellow-700">{scores.engagementScore}</p>
                    </div>

                    {/* Monetization Score */}
                    <div className="p-5 rounded-lg shadow-md bg-white border-l-4 border-red-500">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">💰 수익화 잠재력 (Monetization)</h4>
                        <div className="w-full h-6 rounded-full bg-gray-200 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(scores.monetizationScore)}`} 
                                style={{ width: `${scores.monetizationScore}%` }}
                            ></div>
                        </div>
                        <p className="text-2xl font-bold mt-3 text-red-700">{scores.monetizationScore}</p>
                    </div>
                </div>

                {/* 요약 및 추천 섹션 */}
                <div className="mt-12 p-8 bg-gray-50 rounded-xl shadow-inner border-t-4 border-blue-500">
                    <h3 className="text-2xl font-bold text-dark-blue mb-3">💡 진단 요약 및 액션 플랜</h3>
                    <p className="mb-4 italic text-gray-600">{scoreData.summary}</p>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4">
                        <p className="font-semibold text-lg text-yellow-800">🚀 다음 단계 추천:</p>
                        <p className="text-yellow-700">{scoreData.recommendation}</p>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
            {/* 섹션 제목 */}
            <h2 className="text-3xl font-extrabold text-dark-blue mb-6 border-b pb-2">
                🚀 AI 기반 실시간 진단 테스트 <span className='text-sm font-normal text-gray-500'>(/api/v1/diagnosis_score)</span>
            </h2>

            {/* 실행 버튼 및 로딩 상태 */}
            <button 
                onClick={handleRunDiagnosis} 
                disabled={loading}
                className={`px-8 py-3 text-lg font-bold rounded-full transition duration-300 ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
            >
                {loading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-80" fill="currentColor" d="M7 10a3 3 0 013-3h4a3 3 0 110 6H7z"></path></svg>
                        진단 분석 중... (2초 소요)
                    </span>
                ) : '진단 점수 측정하기 (테스트 실행)'}
            </button>

            {/* 에러 메시지 표시 */}
            {error && (
                <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    🚨 오류: {error} <br/>(백엔드 API 연동 또는 로직 검증 실패 가능성이 있습니다.)
                </div>
            )}

            {/* 결과 시각화 (Loading/Success) */}
            <div className="mt-12">
                {!loading && !scoreData && !error && (
                    <div className="text-center p-6 bg-blue-50 rounded-lg text-gray-600 border-l-4 border-blue-300">
                        진단 점수를 측정하고 나면, 위에서 실시간으로 KPI별 시각화와 구체적인 개선 로드맵을 받으실 수 있습니다. 버튼을 눌러 테스트를 시작해주세요!
                    </div>
                )}

                {scoreData && renderVisualization()}
            </div>
        </div>
    );
};

export default DiagnosisScoreComponent;