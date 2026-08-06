/**
 * @fileoverview KPI_Gauge Component: 핵심 지표의 수치적 상태와 위험도를 게이지 형태로 표시합니다.
 * 이 컴포넌트는 PresentationValidatorService에서 확정된 '상태(State)' Props를 받아 시각 로직을 발동시킵니다.
 */

import React from 'react';

// --- 🎨 Design Tokens & Types ---
export type ScoreLevel = 'Danger' | 'Warning' | 'Normal' | 'Success';

interface KPI_GaugeProps {
  /** 지표의 이름 (예: Gap Score, Emotional Consistency) */
  kpiName: string;
  /** 현재 측정된 수치 값 (0~100) */
  scoreValue: number;
  /** 데이터가 속한 카테고리/지표 타입. UI에 추가 정보를 제공합니다. */
  metricType: 'Academic' | 'Emotional' | 'Financial';
  /** PresentationValidatorService에서 계산된 상태 레벨 (Danger, Warning 등) */
  visualLevel: ScoreLevel; 
}

// --- Component Implementation Start ---
const KPI_Gauge: React.FC<KPI_GaugeProps> = ({ kpiName, scoreValue, metricType, visualLevel }) => {
  
  // 1. Dynamic Color & Style Mapping (가장 중요한 디자인 로직)
  let levelColor: string; // 배경색/게이지 색상
  let labelText: string; // 사용자에게 보여줄 상태 설명

  switch (visualLevel) {
    case 'Danger':
      levelColor = '#D9534F'; // Red 계열 - 위험
      labelText = `위험! ${kpiName} 점수(${scoreValue})는 즉각적인 개선이 필요합니다.`;
      break;
    case 'Warning':
      levelColor = '#FFD700'; // Accent Yellow - 주의/기회
      labelText = `주의: ${kpiName} 점수(${scoreValue}). 잠재적 위험 구간에 있습니다.`;
      break;
    case 'Normal':
      levelColor = '#5BC0DE'; // Blue 계열 - 보통/평균
      labelText = `${kpiName} 점수가 평균 수준입니다. 꾸준한 관리가 필요합니다.`;
      break;
    case 'Success':
      levelColor = '#5CB85C'; // Green 계열 - 성공/최적화
      labelText = `훌륭해요! ${kpiName} 점수(${scoreValue})는 최적의 상태입니다.`;
      break;
    default:
      levelColor = '#CCCCCC';
  }

  // 2. UI Structure (Props 기반으로 재사용 가능한 구조)
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{kpiName} ({metricType})</h3>
      </div>

      {/* Gauge Visual Area */}
      <div style={styles.gaugeContainer}>
          <div style={{ 
              ...styles.gaugeFill, 
              backgroundColor: levelColor, // 상태에 따른 색상 적용
              width: `${scoreValue}%` 
          }}></div>
          <span style={styles.scoreText}>{Math.round(scoreValue)}%</span>
      </div>

      {/* Status & Call to Action */}
      <div style={styles.statusBox}>
        <p style={styles.statusMessage}>{labelText}</p>
        <button 
            style={{...styles.ctaButton, backgroundColor: levelColor}} 
            onClick={() => console.log('CTA Clicked for', kpiName)}
        >
          {visualLevel === 'Danger' ? '진단받기 (Action Required)' : '더 알아보기'}
        </button>
      </div>
    </div>
  );
};

export default KPI_Gauge;