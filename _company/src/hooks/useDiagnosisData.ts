import { useState, useEffect } from 'react';
import { DiagnosisResultSchema } from '@/types/schema'; // Assume this type exists

// Mock 데이터 타입을 정의합니다. 실제로는 DB 스키마를 따릅니다.
interface ScorePayload {
    growthScore: number;
    engagementScore: number;
    monetizationScore: number;
    overallDiagnosis: string;
}

interface DiagnosisData {
    result: DiagnosisResultSchema['result_data']; // Full schema data type
    scoreDetails: ScorePayload;
    isSuccess: boolean;
}

/**
 * API 호출 로직을 캡슐화한 커스텀 훅. 상태 관리 및 데이터 페칭을 담당합니다.
 * @param contextId - 진단 결과를 요청할 컨텍스트 ID (예: 세션 ID)
 */
export const useDiagnosisData = (contextId: string): { data: DiagnosisData | null; isLoading: boolean; error: Error | null } => {
    const [data, setData] = useState<DiagnosisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!contextId) return;

        // 🚨 중요: 실제 환경에서는 여기에 Next/FastAPI 등으로 API 호출 로직이 들어갑니다.
        // const fetchData = async () => { ... }
        const fetchDiagnosisData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log(`[Mock API] Fetching diagnosis data for contextId: ${contextId}`);

                // 2초간 로딩 상태 시뮬레이션
                await new Promise(resolve => setTimeout(resolve, 2000));

                // --- Mock Success Payload ---
                const mockScorePayload: ScorePayload = {
                    growthScore: Math.floor(Math.random() * (100 - 50 + 1)) + 50, // 50~100
                    engagementScore: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
                    monetizationScore: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
                    overallDiagnosis: '균형 잡힌 발전 단계',
                };

                const mockResultData = {
                    // DiagnosisResultSchema의 일부를 모킹합니다.
                    diagnosis_type: 'AI Vocal Analysis',
                    result_data: {
                        context_id: contextId,
                        timestamp: new Date().toISOString(),
                        scoreDetails: mockScorePayload, // 실제 로직에서 이 값을 사용해야 함
                        // ... 나머지 필드들
                    }
                };

                setData({
                    result: mockResultData.result_data as DiagnosisResultSchema['result_data'],
                    scoreDetails: mockScorePayload,
                    isSuccess: true,
                });

            } catch (e) {
                console.error("Error fetching diagnosis data:", e);
                setError(new Error("진단 데이터를 불러오는 데 실패했습니다. 서버 연결을 확인해주세요."));
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiagnosisData();
    }, [contextId]);

    return { data, isLoading, error };
};