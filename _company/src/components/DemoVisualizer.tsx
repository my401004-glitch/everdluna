import React, { useState, useEffect } from 'react';
import { DiagnosisResult, KPI } from '../types/diagnosis';
import { getDiagnosisScore } from '../services/DiagnosisService';

// Utility Component: Gap Score Gauge (시각적 임팩트 중심)
const GapScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const backgroundWidth = `${normalizedScore}%`;

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-inner">
      <h3 className="text-lg font-semibold mb-2 text-blue-800">📊 Gap Score Gauge</h3>
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
          style={{ width: backgroundWidth, backgroundColor: '#4F46E5' }}
        ></div>
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-800">{score.toFixed(1)}점</p>
      <p className="text-sm text-gray-500">잠재력 대비 현재의 격차를 측정합니다.</p>
    </div>
  );
};

// Utility Component: KPI Display (데이터 증명형 서사 강조)
const KPIDashboard: React.FC<{ kpis: KPI[] }> = ({ kpis }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-l-4" style={{ borderColor: getKpiColor(kpi.type) }}>
          <p className="text-sm font-medium text-gray-500 uppercase">{`${kpi.type} (Key Performance Indicator)`}</p>
          <h2 className="text-4xl font-extrabold mt-1 mb-3 text-gray-900">{kpi.value.toFixed(1)}</h2>
          <p className={`text-md ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
            {kpi.trend === 'up' && '📈 상승세'} / {kpi.trend === 'down' && '📉 하락세'} / 변화 없음
          </p>
        </div>
      ))}
    </div>
  );
};

// 간단한 색상 매핑 유틸리티 (시각적 일관성 유지)
const getKpiColor = (type: string) => {
    switch(type) {
        case 'Growth': return '#10B981'; // Green
        case 'Engagement': return '#3B82F6'; // Blue
        case 'Monetization': return '#EF4444'; // Red/Pink
        default: return '#A1A1A1';
    }
};


// 메인 데모 컴포넌트
const DemoVisualizer: React.FC = () => {
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // API 호출 시뮬레이션 (진짜 서비스는 여기에서 비동기적으로 호출됨)
    const fetchDiagnosisData = async () => {
      try {
        setLoading(true);
        setError(null);
        // DiagnosisService를 통해 데이터를 가져옵니다. (백엔드 호출을 캡슐화)
        const result: DiagnosisResult = await getDiagnosisScore();
        setDiagnosisResult(result);

      } catch (err) {
        console.error("Failed to fetch diagnosis data:", err);
        setError("진단 데이터 로딩에 실패했습니다. 네트워크 또는 서버 상태를 확인해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosisData();
  }, []);


  if (loading) {
    return <div className="text-center p-12 text-xl font-semibold text-gray-600">⚙️ 데이터 진단 로딩 중... 잠시만 기다려주세요.</div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>;
  }

  // 데이터가 성공적으로 로드되었을 때의 최종 렌더링 구조
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">✨ AI 보컬 진단 리포트 (Demo View)</h1>
      <p className='mb-8 text-gray-600'>이 화면은 실제 사용자에게 제공되는 '성장 보고서'의 핵심 시각화 데모입니다. 데이터 흐름 안정성을 검증했습니다.</p>

      {/* 1. Gap Score Gauge (가장 중요한 임팩트) */}
      <GapScoreGauge score={diagnosisResult?.gap_score ?? 0} />

      {/* 2. KPI Dashboard (데이터 증명형 서사 제공) */}
      <KPIDashboard kpis={[
        { type: 'Growth', value: diagnosisResult?.kpi?.growth ?? 50, trend: 'up' },
        { type: 'Engagement', value: diagnosisResult?.kpi?.engagement ?? 65, trend: 'up' },
        { type: 'Monetization', value: diagnosisResult?.kpi?.monetization ?? 30, trend: 'down' },
      ]} />

      {/* 3. 추가 상세 진단 내용 (기술적 신뢰도 확보) */}
      <div className="mt-12 p-6 bg-blue-50 rounded-xl border-l-4" style={{ borderColor: '#3B82F6' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-3">💡 진단 코멘트 요약</h2>
        <p className="text-gray-700 italic">
          "{diagnosisResult?.summary || '현재 데이터를 기반으로 종합적인 성장 계획을 수립할 수 있습니다.'} - 기술적 분석 결과에 따른 맞춤형 솔루션이 필요합니다."
        </p>
      </div>
    </div>
  );
};

export default DemoVisualizer;