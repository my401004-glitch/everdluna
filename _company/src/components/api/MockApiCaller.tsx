import React, { useState, useCallback } from 'react';

// 💡 Data Structures based on DiagnosisResult schema (Self-RAG)
interface ApiResponse {
  success: boolean;
  data: Record<string, any>; // Flexibility for different types of results
  message: string;
}

interface StepData {
  stepName: string;
  requiredAccess: 'Growth' | 'Engagement' | 'Monetization';
  isCritical: boolean;
}

// Mock API 호출 시뮬레이션 함수 (가짜 백엔드 호출)
/**
 * 특정 진단 단계를 시뮬레이션하고, 성공/실패를 반환합니다.
 * @param stepData - 현재 처리할 단계의 정보
 * @param forceFailure - 강제로 실패시키고 싶은지 여부 (테스트용 플래그)
 * @returns Promise<ApiResponse>
 */
const mockApiCall = async (stepData: StepData, forceFailure: boolean): Promise<ApiResponse> => {
  console.log(`[API Call] Attempting to process step: ${stepData.stepName}...`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // API Latency Simulation

  if (forceFailure) {
    return { success: false, data: {}, message: `Failed to retrieve data for ${stepData.requiredAccess}. Check user role or context.` };
  }

  // 성공 로직 시뮬레이션
  const mockSuccessData = {
    score: Math.floor(Math.random() * 50) + (stepData.isCritical ? 10 : 0),
    detail: `${stepData.stepName} 진단 완료. 개선 필요 영역 감지.`,
  };

  return { success: true, data: mockSuccessData, message: `${stepData.stepName} 데이터 처리가 성공적으로 완료되었습니다.` };
};


/**
 * Mock API 호출 및 단계별 시뮬레이션을 보여주는 메인 컴포넌트
 */
const MockApiCaller: React.FC = () => {
  const [results, setResults] = useState<Array<{ step: StepData; result: ApiResponse | null; isComplete: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 시뮬레이션할 단계 정의 (권한 검증 로직 포함)
  const diagnosticSteps: StepData[] = [
    { stepName: "Growth 잠재력 분석", requiredAccess: 'Growth', isCritical: true }, // KPI 1
    { stepName: "Engagement 패턴 진단", requiredAccess: 'Engagement', isCritical: false }, // KPI 2
    { stepName: "Monetization 기회 탐색", requiredAccess: 'Monetization', isCritical: true }, // KPI 3
  ];

  // API 호출 실행 핸들러
  const handleRunSimulation = useCallback(async (forceFailures: boolean) => {
    setIsLoading(true);
    setResults(diagnosticSteps.map(step => ({ step, result: null, isComplete: false })));
    
    for (let i = 0; i < diagnosticSteps.length; i++) {
      const currentStepData = diagnosticSteps[i];
      
      // 강제 실패 시뮬레이션 로직 적용
      const failFlag = forceFailures && i === 1; // 예시: 두 번째 단계(Engagement)만 실패하도록 설정
      
      const apiResult = await mockApiCall(currentStepData, failFlag);

      setResults(prev => {
        const updatedResults = [...prev];
        updatedResults[i] = { step: currentStepData, result: apiResult, isComplete: true };
        return updatedResults;
      });
    }
    setIsLoading(false);
  }, [diagnosticSteps]);

  // UI 렌더링 로직
  const renderStatusCard = (result: ApiResponse | null): JSX.Element => {
    if (!result) return <p className="text-gray-500">실행 대기 중...</p>;

    if (result.success) {
      return (
        <div className="bg-green-100 border-l-4 border-green-500 p-3 text-green-800" role="alert">
          <p className="font-bold flex items-center"><span className="mr-2">✅</span> 성공:</p> {result.message}
        </div>
      );
    } else {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 p-3 text-red-800" role="alert">
          <p className="font-bold flex items-center"><span className="mr-2">❌</span> 실패:</p> {result.message}
        </div>
      );
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-[#0A2463]">🛠️ 진단 시스템 통합 테스트 시뮬레이션</h2>
      <p className="mb-6 text-sm text-gray-600 border-l-4 pl-3 py-1 bg-yellow-50">
        [⚠️ 중요] 이 컴포넌트는 실제 API 호출의 흐름과 예외 처리를 Mocking하여, 시스템 연동 전 기술적 안정성을 검증합니다. (Self-RAG 기반 Data Contract 준수)
      </p>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleRunSimulation(false)} 
          disabled={isLoading}
          className={`px-6 py-2 rounded font-semibold transition ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FFD700] hover:bg-yellow-50'} text-[#0A2463]'}`}
        >
          {isLoading ? '실행 중...' : '✅ 성공 케이스로 시뮬레이션 실행'}
        </button>
        <button 
          onClick={() => handleRunSimulation(true)} 
          disabled={isLoading}
          className={`px-6 py-2 rounded font-semibold transition ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {isLoading ? '실행 중...' : '❌ 실패 케이스로 시뮬레이션 실행 (테스트용)'}
        </button>
      </div>

      <div className="space-y-8">
        {results.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg ${item.isComplete ? 'bg-gray-50 border' : 'border-dashed border-gray-300'} transition duration-150`}>
            <h3 className="text-xl font-semibold mb-2 text-[#0A2463]">{index + 1}. {item.step.stepName}</h3>
            <p className="text-sm text-gray-500 mb-3">필수 권한: `{item.step.requiredAccess}` (Critical: {String(item.step.isCritical)})</p>
            {item.result ? renderStatusCard(item.result) : (
              <div className="text-center py-4 text-gray-500">
                {isLoading ? '데이터를 로딩 중입니다...' : '클릭하여 API 호출 시뮬레이션 시작'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockApiCaller;