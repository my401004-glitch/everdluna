import React, { useState, useEffect } from 'react';
import { VisualizationProps, DiagnosisResult } from './types';

// ⚠️ FIXME: 애니메이션 라이브러리(e.g., framer-motion)가 필요함. 다음 단계에서 통합 예정.
const GapScoreVisualizationComponent: React.FC<VisualizationProps> = ({ data, isLoading, isFirstLoad }) => {
  // [WHY] 데이터 로딩 상태를 명확히 분리해야 컴포넌트의 의존성이 낮아지고 재사용성이 높아진다.
  const [displayData, setDisplayData] = useState<DiagnosisResult | null>(data);

  useEffect(() => {
    if (isLoading) {
      setDisplayData(null); // 로딩 중에는 데이터 표시 안 함
      return;
    }
    // TODO: 실제 API 호출이 완료되면 data로 상태 업데이트 필요
    setDisplayData(data);
  }, [isLoading, data]);

  // [WHY] Gap Score의 변화를 시각화하는 핵심 함수. 이 부분이 가장 복잡함.
  const renderGapScoreHistory = () => {
    if (!displayData || !displayData.gapScoreHistory) return <p>데이터가 부족합니다.</p>;

    return (
      <div className="visualization-area">
        {/* TODO: 여기에 실제 차트 라이브러리(recharts 등)를 사용하여 
           '실시간 채워지는 애니메이션'을 구현해야 함. */}
        <h3 className="text-xl font-bold mt-4 text-blue-700">Gap Score 추이 분석 (Simulation)</h3>
        {/* Mock Visualization Placeholder */}
        <div style={{ height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {displayData.gapScoreHistory.map((point, index) => (
            <div key={index}>
              <span className="text-3xl font-extrabold text-yellow-600">{point.score}</span>
              <small className="text-gray-500 ml-2">({new Date(point.timestamp).toLocaleDateString()})</small>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center text-blue-600 animate-pulse">💡 데이터를 로딩하고 있습니다. 시스템이 작동 중입니다...</div>;
  }

  if (!displayData && !isFirstLoad) {
      return null; // 데이터가 없고 첫 로드도 아니라면 렌더링 안 함
  }


  return (
    <section className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">📊 당신의 성장 점수 분석 (Gap Score Analysis)</h2>

      {/* 1. 핵심 KPI 카드 섹션 */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        {Object.keys(displayData?.kpis || {}) as ScoreMetricKey | keyof typeof displayData.kpis).map((key) => (
          <div key={key} className="p-4 bg-blue-50 rounded-lg shadow transition duration-300 hover:shadow-md">
            <h4 className="text-sm font-medium text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
            <p className="text-4xl font-extrabold mt-1 text-blue-800">
              {displayData?.kpis[key] || 0}점
            </p>
          </div>
        ))}
      </div>

      {/* 2. 실시간 변화 추이 시각화 (가장 중요한 부분) */}
      {renderGapScoreHistory()}

    </section>
  );
};

export default GapScoreVisualizationComponent;