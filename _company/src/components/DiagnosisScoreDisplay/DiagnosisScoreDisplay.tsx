import React from 'react';
import { DiagnosisScoreDisplayProps, GapScoreData } from '../types/diagnosisTypes';
import './DiagnosisScoreDisplay.css'; // CSS는 별도로 관리한다고 가정합니다.

/**
 * @description AI 진단 결과 (Gap Score)를 시각적으로 표시하는 핵심 컴포넌트입니다.
 * 이 컴포넌트는 데이터의 직관적 이해와 다음 액션(CTA) 유도에 초점을 맞춥니다.
 */
const DiagnosisScoreDisplay: React.FC<DiagnosisScoreDisplayProps> = ({ data, title }) => {

  // 1. 점수 기반의 시각화 로직 (핵심): Gap Score가 높을수록 경고/개선 필요성을 강조합니다.
  const getScoreDescription = (score: number): string => {
    if (score >= 80) return "매우 높은 잠재력! 집중 투입이 필요합니다.";
    if (score >= 50) return "일정 수준의 격차 발견. 보완할 영역을 찾아보세요.";
    return "현재 목표에 도달한 상태입니다. 안정적인 관리가 필요합니다.";
  };

  // 2. 배경 색상 및 경고 레벨 결정 로직 (가이드라인 반영 지점):
  const getVisualLevel = (score: number) => {
    if (score >= 80) return 'level-critical'; // Accent Yellow/Red 계열 강조
    if (score >= 50) return 'level-moderate'; // Dark Blue와 대비되는 경고 색상
    return 'level-stable'; // 안정적인 기본 배경색
  };

  // Gap Score를 %로 변환하여 막대 그래프의 채우기 비율을 결정합니다.
  const displayScorePercent = Math.min(100, Math.max(0, data.score));


  return (
    <div className={`diagnosis-display ${getVisualLevel(displayScorePercent)}`}>
      {/* 제목 섹션 */}
      <h2>{title}</h2>

      {/* 핵심 점수 요약 및 설명 */}
      <div className="score-summary">
        <p className="gap-label">{data.gapType} 격차 점수 (Gap Score)</p>
        <h1 className="score-value">{Math.round(displayScorePercent)}%</h1>
        <p className="score-description">
          {getScoreDescription(displayScorePercent)}
        </p>
      </div>

      {/* 시각화 막대 그래프 */}
      <div className="visualization-container">
        <div 
          className="progress-bar" 
          style={{ width: `${displayScorePercent}%` }}
          role="progressbar" 
          aria-valuenow={displayScorePercent} 
          aria-valuemin="0" 
          aria-valuemax="100"
        >
          <span className="progress-label">진단 점수</span>
        </div>
      </div>

      {/* 데이터 메타 정보 (디버깅 및 신뢰성 확보용) */}
      <div className="data-metadata mt-4">
        <small>측정 기준: {data.gapType} | Context ID: {data.contextId}</small>
      </div>
    </div>
  );
};

export default DiagnosisScoreDisplay;