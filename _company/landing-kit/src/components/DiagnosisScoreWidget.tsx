import React, { useState, useEffect } from 'react';
import { DiagnosisResult } from '../types'; // types.ts에서 정의된 타입을 사용합니다.

// Mock 데이터 구조 (실제 API 호출을 대기하는 상태)
interface DiagnosisData {
  score: number;          // Gap Score 값
  growth: number;         // Growth KPI
  engagement: number;     // Engagement KPI
  monetization: number;   // Monetization KPI
  diagnosisType: string;  // 진단 유형 (예: 'Pitch', 'Frequency')
  depthScore: number;     // Gap Score Depth
}

interface DiagnosisScoreWidgetProps {
  contextId: string; // 어떤 컨텍스트의 결과인지 식별자
  data: DiagnosisData | null;
  isLoading: boolean;
}

const DiagnosisScoreWidget: React.FC<DiagnosisScoreWidgetProps> = ({ contextId, data, isLoading }) => {
  if (isLoading) {
    return <div className="loading-state">데이터 로딩 중... ⚙️</div>;
  }

  if (!data) {
    return <div className="no-data-state">결과를 불러오려면 진단이 필요합니다. 🎯</div>;
  }

  // 색상 시스템 적용 (Dark Blue & Accent Yellow 기반 추측)
  const getColorClass = (score: number, type: string): string => {
    if (score > 70) return 'bg-red-500'; // 위험 수준 (빨강 계열)
    if (score > 40) return 'bg-yellow-500'; // 주의 수준 (노랑 계열)
    return 'bg-green-500'; // 양호 수준 (초록 계열)
  };

  const scoreClass = getColorClass(data.score, data.diagnosisType);

  return (
    <div className="diagnosis-widget">
      <h3>{data.diagnosisType} 진단 결과 ({contextId})</h3>
      
      {/* Gap Score 시각화 영역 */}
      <div className={`score-visualization ${scoreClass}`}>
        <h2>Gap Score: {data.score}%</h2>
        <p>Depth Score: {data.depthScore}%</p>
        <p className="insight">
          {data.growth > data.engagement ? "성장 지표(Growth)가 Engagement보다 높습니다." : "Engagement 관리가 필요합니다."}
        </p>
      </div>

      {/* KPI 요약 */}
      <div className="kpi-summary">
        <div className="kpi-item">
          <h4>Growth</h4>
          <p>{data.growth}%</p>
        </div>
        <div className="kpi-item">
          <h4>Engagement</h4>
          <p>{data.engagement}%</p>
        </div>
        <div className="kpi-item">
          <h4>Monetization</h4>
          <p>{data.monetization}%</p>
        </div>
      </div>

      {/* CTA (Landing Kit와의 연결 지점) */}
      <button className="cta-button">
        다음 단계로 이동하기 ➡️
      </button>
    </div>
  );
};

export default DiagnosisScoreWidget;