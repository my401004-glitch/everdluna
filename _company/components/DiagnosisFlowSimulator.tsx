import React, { useState, useCallback } from 'react';
import { DiagnosisScoreComponent } from './DiagnosisScoreComponent'; // 기존 컴포넌트 참조
// 필요한 타입 및 상수 정의 (가정)
type SimulationStep = 'PAIN' | 'PROOF' | 'SOLUTION';

interface AnalysisResult {
  diagnosisType: string;
  scoreData: number[]; // [Growth, Engagement, Monetization] 순서 가정
  detailMessage: string;
}

// --- Mock API Functions (실제 백엔드 호출을 대체) ---
/** 
 * 사용자가 Pain 포인트를 입력했을 때의 가짜 진단 결과 생성
 */
const mockApiFetchDiagnosis = async (input: string): Promise<AnalysisResult> => {
  console.log(`[MOCK API] Diagnosing input: ${input}`);
  // 실제 환경에서는 여기에 axios.get('/api/v1/diagnosis_score?input=' + input) 가 들어갑니다.
  await new Promise(resolve => setTimeout(resolve, 800)); // 네트워크 지연 시뮬레이션

  if (input.includes("보컬")) {
    return {
      diagnosisType: "VocalPotential",
      scoreData: [50, 30, 70], // Growth=50, Engagement=30, Monetization=70 (가상)
      detailMessage: "현재 보컬 잠재력은 높으나(Growth), 실전 경험 부족으로 인한 몰입도가 낮고(Engagement), 장기적 수입 모델 설계가 시급합니다(Monetization)."
    };
  } else {
     return {
      diagnosisType: "GeneralPotential",
      scoreData: [30, 40, 50],
      detailMessage: "일반적인 잠재력은 있으나, 명확한 목표 설정과 체계적인 커리큘럼이 필요합니다."
    };
  }
};

/**
 * 시뮬레이션 흐름을 관리하는 메인 컴포넌트
 */
const DiagnosisFlowSimulator: React.FC = () => {
  // 1. 상태 정의: 현재 어느 단계에 있는지 추적 (Pain -> Proof -> Solution)
  const [currentStep, setCurrentStep] = useState<SimulationStep>('PAIN');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Pain 단계 로직: 사용자 입력 기반 진단 시작
  const handleDiagnosisStart = useCallback(async (userInput: string) => {
    if (!userInput || isLoading) return;
    setIsLoading(true);
    setAnalysisResult(null);
    setCurrentStep('PAIN'); // 일단 PAIN 상태로 설정

    try {
      // Mock API 호출을 통해 데이터 획득
      const result = await mockApiFetchDiagnosis(userInput);
      
      // 데이터 성공적으로 받으면, Proof 단계로 전환하고 결과를 저장함.
      setAnalysisResult(result);
      setCurrentStep('PROOF'); // 다음 단계를 준비
    } catch (error) {
      console.error("진단 실패:", error);
      alert("데이터 로딩에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // 3. Step별 콘텐츠 렌더링 및 흐름 관리 (핵심)
  const renderContent = () => {
    switch (currentStep) {
      case 'PAIN':
        return (
          <section className="step-pain p-6 bg-gray-50 border mb-8">
            <h2 className="text-xl font-bold text-red-700 mb-4">🔴 1. Pain Point 진단: 현 상황 인식</h2>
            <p className="mb-4">AI가 귀하의 현재 상태를 객관적으로 진단하기 위해, 가장 고민되는 부분을 자유롭게 입력해주세요.</p>
            <input
              type="text"
              placeholder="예: 보컬 레슨을 받았는데 실력이 늘지 않는 것 같아요."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
              disabled={isLoading}
            />
            <button 
                onClick={() => handleDiagnosisStart("보컬 레슨을 받았는데 실력이 늘지 않는 것 같아요.")} // 테스트용 하드코딩
                disabled={isLoading}
                className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? '진단 중...' : '진단 시작 (Pain -> Proof 이동)'}
            </button>
          </section>
        );

      case 'PROOF':
        if (!analysisResult) return null; // 데이터가 없으면 렌더링 금지
        return (
          <section className="step-proof p-6 bg-yellow-50 border mb-8">
            <h2 className="text-xl font-bold text-yellow-700 mb-4">🟡 2. Proof: AI 진단 결과 분석</h2>
            <p className="mb-4">진단된 데이터를 통해 현재의 문제점을 객관적인 수치로 확인합니다.</p>
            {/* DiagnosisScoreComponent를 통합하여 시각화 */}
            <DiagnosisScoreComponent result={analysisResult} /> 
             <button 
                onClick={() => setCurrentStep('SOLUTION')} 
                className="mt-6 w-full p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              결과 받아들이기 (Proof -> Solution 이동)
            </button>
          </section>
        );

      case 'SOLUTION':
        if (!analysisResult) return null;
        return (
          <section className="step-solution p-6 bg-green-50 border mb-8">
            <h2 className="text-xl font-bold text-green-700 mb-4">🟢 3. Solution: 데이터 기반의 해결책 제시</h2>
            <p className="mb-4">진단 결과를 바탕으로, 목표 달성을 위한 구체적인 로드맵과 솔루션을 제안합니다.</p>
             {/* 여기에 최종 CTA 및 컨설팅 내용이 들어갈 공간 */}
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-800">
                <strong>[코다리 제안]:</strong> <br/> 
                데이터 분석 결과, 가장 부족한 것은 '{analysisResult.diagnosisType}' 영역의 **전문가 피드백 루프**입니다. 커리큘럼 설계와 개인별 모니터링 시스템 통합이 필수적입니다.
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">AI 진단 시뮬레이터 (PoC Test Shell)</h1>
      {renderContent()}
    </div>
  );
};

export default DiagnosisFlowSimulator;