import React from 'react';
import './GapScoreVisualizer.css'; // CSS 파일을 분리하여 사용합니다.

// --- 1. 데이터 타입 정의 (Props Interface) ---
interface KPIScore {
  name: string;
  currentScore: number; // 현재 점수 (Pain 지표의 원천)
  targetScore: number; // 목표 점수 (Gain 지표의 목적지)
}

interface GapScoreVisualizerProps {
  kpis: KPIScore[]; // KPI 배열을 Props로 받습니다.
}

/**
 * 'Gap Score' 시각화 컴포넌트입니다. 
 * Pain(현재 상태)에서 Gain(목표 상태)으로의 격차를 직관적으로 보여줍니다.
 * @param {GapScoreVisualizerProps} props - KPI 데이터 배열
 */
const GapScoreVisualizer: React.FC<GapScoreVisualizerProps> = ({ kpis }) => {

  // Pain -> Gain 로직을 처리하는 렌더링 함수
  const renderKpiCard = (kpi: KPIScore) => {
    const gap = Math.abs(kpi.targetScore - kpi.currentScore);
    const isHighRisk = kpi.currentScore < 30; // 예시 기준

    return (
      <div className="kpi-card">
        <h3 className="kpi-title">{kpi.name}</h3>
        
        {/* Gap Score 시각화 영역 */}
        <div className="score-container">
          <span className={`score current ${isHighRisk ? 'risk' : ''}`}>
            현재: {kpi.currentScore.toFixed(0)}점
          </span>
          <div className="gap-progress-bar-wrapper">
              {/* Gap Progress Bar */}
            <div 
                className="gap-progress-bar" 
                style={{ width: `${Math.min(100, gap * 2)}%` }} // 가독성을 위해 최대 너비 제한 (예시)
            ></div>
          </div>
          <span className={`score target ${isHighRisk ? 'gain' : ''}`}>
            목표: {kpi.targetScore.toFixed(0)}점
          </span>
        </div>

        {/* 핵심 메시지 및 Call-to-Action */}
        <div className="gap-summary">
            <p><strong>🔥 Gap Score:</strong> {gap.toFixed(1)}점 격차</p>
            <button className="cta-button">
                🚀 격차 해소 전략 분석하기 (CTA)
            </button>
        </div>

      </div>
    );
  };


  return (
    <div className="gap-score-visualizer-container">
      <h2>📊 핵심 KPI 진단: Gap Score 시각화</h2>
      <p className="subtitle">현재의 위치(Pain)와 도달해야 할 지점(Gain)을 직관적으로 확인하세요.</p>
      
      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <React.Fragment key={index}>
            {renderKpiCard(kpi)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GapScoreVisualizer;