// frontend/components/ErrorStateScreen.tsx
import React, { useState, useEffect } from 'react';

// 1. 데이터 구조 정의 (API 계약 기반)
interface FailureLogEntry {
    logId: string;
    failureType: 'PITCH_OUT_OF_RANGE' | 'RHYTHM_INCONSISTENT' | 'TONE_FLAT' | string; // 모든 실패 유형을 포함하는 Union 타입 권장
    failureDetail: string;
    isCritical: boolean;
    failedTimestamp: string;
}

interface ApiResponse {
    status: 'success' | 'error';
    data: FailureLogEntry[];
    totalCount: number;
}

// 2. Mock API 호출 함수 (실제 백엔드 로직과 연결될 지점)
const fetchFailureLogs = async (contextId: string, userId: string): Promise<ApiResponse> => {
    console.log(`[API CALL] Fetching failure logs for context ID: ${contextId} and User ID: ${userId}`);

    // 실제 환경에서는 /api/v1/diagnosis_failure 엔드포인트를 호출해야 합니다.
    await new Promise(resolve => setTimeout(resolve, 500)); // Mock API 지연 시간 시뮬레이션

    // 테스트 데이터를 생성하여 반환합니다.
    const mockData: FailureLogEntry[] = [
        {
            logId: 'a1b2c3d4',
            failureType: 'PITCH_OUT_OF_RANGE',
            failureDetail: "테스트 음역대(250Hz~270Hz)를 벗어난 불안정한 피치. 지속적인 연습이 필요합니다.",
            isCritical: true, // 치명적 오류로 강조 표시
            failedTimestamp: new Date().toISOString(),
        },
        {
            logId: 'e5f6g7h8',
            failureType: 'RHYTHM_INCONSISTENT',
            failureDetail: "특정 마디에서 박자가 불규칙합니다. 리듬 연습 모듈을 복습하세요.",
            isCritical: false, // 경고성 오류로 표시
            failedTimestamp: new Date(Date.now() - 3600000).toISOString(),
        },
    ];

    return {
        status: 'success',
        data: mockData,
        totalCount: mockData.length,
    };
};


// 3. 메인 컴포넌트
interface ErrorStateScreenProps {
    contextId: string; // 필수: 현재 진단 세션의 ID
}

const ErrorStateScreen: React.FC<ErrorStateScreenProps> = ({ contextId }) => {
    const [logs, setLogs] = useState<FailureLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 사용자 ID는 보통 Context나 Redux Store에서 가져와야 하지만, 테스트를 위해 하드코딩합니다.
                const userId = 'user-uuid-123'; 
                
                const result = await fetchFailureLogs(contextId, userId);

                if (result.status === 'success' && result.data) {
                    setLogs(result.data);
                    setError(null);
                } else {
                    throw new Error("API 응답 실패: 로그 데이터를 불러올 수 없습니다.");
                }
            } catch (err) {
                console.error("Failed to load failure logs:", err);
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [contextId]);


    if (loading) {
        return <div className="p-8 text-center">⚙️ 데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded">{`에러 발생: ${error}`}</div>;
    }

    const renderFailureCard = (log: FailureLogEntry) => {
        // isCritical 상태에 따라 UI 강조 로직을 분리합니다.
        const cardClass = log.isCritical 
            ? "border-red-500 bg-red-50 shadow-xl ring-2 ring-red-200" 
            : "border-yellow-400 bg-yellow-50 shadow-md";

        return (
            <div key={log.logId} className={`p-6 rounded-lg border-l-8 ${cardClass}`}>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                    ⚠️ {log.failureType} 오류 감지
                </h3>
                <p className="text-sm text-gray-500 mb-4">발생 시각: {new Date(log.failedTimestamp).toLocaleString()}</p>
                <p className="mb-3 text-lg">{log.failureDetail}</p>
                {/* 실제 사용자는 이 실패 로그를 기반으로 커리큘럼을 추천받게 됩니다. */}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
                ❌ 진단 실패 로그 분석 (Failure Log Analysis)
            </h1>
            <p className="mb-8 text-gray-600">
                위 화면에 표시된 실패 기록들은 당신의 실력에서 아직 보완이 필요한 핵심 지표들입니다. 이 데이터를 기반으로 개인 맞춤형 학습 플랜을 재조정합니다.
            </p>

            {logs.length > 0 ? (
                <div className="space-y-6">
                    {logs.map(renderFailureCard)}
                </div>
            ) : (
                <div className="text-center p-12 border-4 border-dashed border-gray-200 rounded-lg">
                    <p className="text-xl text-green-600 font-semibold mb-2">✨ 실패 로그 없음!</p>
                    <p className="text-gray-500">축하드립니다. 현재 진단된 세션에서는 심각한 오류가 감지되지 않았습니다.</p>
                </div>
            )}
        </div>
    );
};

export default ErrorStateScreen;