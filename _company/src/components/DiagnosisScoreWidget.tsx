import React, { useState, useEffect } from 'react';

// --- 🚨 Type Definitions (API Spec 기반) ---
interface DiagnosisResult {
  diagnosis_score: number; // 전체 진단 점수 (0-100)
  growth_kpi: number;     // Growth KPI 점수
  engagement_kpi: number; // Engagement KPI 점수
  monetization_kpi: number;// Monetization KPI 점수
  context_id: string;     // 진단 컨텍스트 ID
}

interface WidgetProps {
  userId: string;
}

/**
 * DiagnosisScoreWidget: API를 호출하여 사용자 진단 결과를 시각화하는 핵심 컴포넌트.
 * 로딩, 에러, 성공 상태 처리를 포함합니다.
 */
const DiagnosisScoreWidget: React.FC<WidgetProps> = ({ userId }) => {
  // 💡 State Management: Loading, Error, Data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    // 🛠️ API 호출 시뮬레이션 (실제로는 Axios 등을 사용)
    const fetchDiagnosisScore = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        console.log(`[API] Fetching diagnosis score for user: ${userId}...`);

        // ⚠️ 가드 로직: 유효한 User ID가 있는지 확인해야 합니다.
        if (!userId) {
          throw new Error("User ID is required to fetch diagnostic data.");
        }

        // --- Mock API Call (실제 백엔드 엔드포인트 사용 예정) ---
        await new Promise(resolve => setTimeout(resolve, 1500)); // Loading time simulation

        // 임시 더미 데이터 생성 (테스트 통과 확인용)
        const mockData: DiagnosisResult = {
          diagnosis_score: Math.floor(Math.random() * (90 - 40 + 1)) + 40, // 40-90 사이 점수
          growth_kpi: Math.floor(Math.random() * (70 - 30 + 1)) + 30,
          engagement_kpi: Math.floor(Math.random() * (60 - 20 + 1)) + 20,
          monetization_kpi: Math.floor(Math.random() * (50 - 10 + 1)) + 10,
          context_id: 'mock-context-' + Date.now(),
        };

        setData(mockData); // 데이터 설정 성공
      } catch (err) {
        console.error("Diagnosis API Fetch Failed:", err);
        // 🐞 에러 핸들링 로직 실행
        setError(err instanceof Error ? err.message : "알 수 없는 네트워크 오류가 발생했습니다.");
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchDiagnosisScore();
  }, [userId]); // userId가 변경될 때만 재실행 (Dependency Array)


  // 🖼️ UI Rendering Logic based on State
  const renderContent = () => {
    if (isLoading) {
      return <div className="p-6 text-center text-gray-500">⚙️ 진단 데이터를 불러오는 중입니다... 잠시만 기다려 주세요.</div>;
    }

    if (error) {
      // 🚨 에러 발생 시 UI 피드백 및 사용자 안내
      return <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700">
        <h3 className="font-bold mb-2">⚠️ 진단 데이터 로딩 실패</h3>
        <p>오류: {error}</p>
        <p className="mt-1 text-sm">백엔드 API 스펙과 환경변수 설정을 확인해 주세요. (Console 로그 참고)</p>
      </div>;
    }

    if (!data) {
      return <div className="p-6 text-center text-gray-500">진단 데이터를 찾을 수 없습니다. 사용자 정보를 확인해주세요.</div>;
    }

    // ✅ 데이터 성공 시 렌더링 (가장 복잡하고 중요한 부분)
    const score = data.diagnosis_score;
    let diagnosisMessage = '';

    if (score >= 85) {
      diagnosisMessage = '✨ 탁월한 성장 잠재력! 시스템 개선이 필요 없습니다.'; // Success Message Example
    } else if (score >= 60) {
      diagnosisMessage = '✅ 안정적인 성과. 꾸준히 관리하는 것이 중요합니다.';
    } else {
      diagnosisMessage = '🚨 주의가 필요합니다. 진단 결과 분석을 통해 집중 개선 영역을 찾으세요.'; // Warning Message Example
    }

    return (
      <div className="space-y-6 p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        {/* 🥇 메인 점수 시각화 섹션 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">📊 종합 진단 스코어</h2>
          <div className={`inline-block p-6 rounded-full ${score >= 85 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'} transition duration-300`}>
            <p className="text-7xl font-extrabold text-gray-900">{score}</p>
            <p className={`text-2xl mt-2 ${score >= 85 ? 'text-green-600' : score <= 40 ? 'text-red-600' : 'text-yellow-600'}`}>{diagnosisMessage}</p>
          </div>
        </div>

        {/* 🚀 KPI 상세 분석 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <ScoreCard title="📈 성장(Growth) 잠재력" score={data.growth_kpi} color="bg-indigo-50" />
          <ScoreCard title="🗣️ 참여도(Engagement)" score={data.engagement_kpi} color="bg-emerald-50" />
          <ScoreCard title="💰 수익화(Monetization) 구조" score={data.monetization_kpi} color="bg-amber-50" />
        </div>

        {/* 📝 상세 분석 요약 (추후 디자이너와 협업하여 채울 부분) */}
        <div className="mt-8 p-4 bg-gray-50 rounded">
            <h3 className='text-xl font-semibold text-gray-700'>🔍 코치 피드백이 필요한 영역</h3>
            <p className='text-sm text-gray-600 mt-1'>진단된 KPI를 바탕으로 맞춤형 학습 플랜을 제공하는 섹션입니다. (추후 로직 추가 예정)</p>
        </div>
      </div>
    );
  };

  return <div className="max-w-4xl mx-auto">{renderContent()}</div>;
};

// 재사용 가능한 서브 컴포넌트: KPI 스코어 카드
const ScoreCard: React.FC<{ title: string, score: number, color: string }> = ({ title, score, color }) => (
    <div className={`p-4 rounded-lg shadow ${color} border border-gray-100`}>
        <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
        <p className="text-4xl font-bold mt-2 text-indigo-800">{score}</p>
        <p className='text-sm text-gray-500'>점수 (최대 100)</p>
    </div>
);

export default DiagnosisScoreWidget;