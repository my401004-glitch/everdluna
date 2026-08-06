/**
 * @fileoverview PainGainCard Component: '현재의 문제점(Pain)'과 '솔루션을 통한 이득(Gain)'을 대칭적으로 보여주는 컴포넌트입니다.
 * 모든 비즈니스 및 교육 콘텐츠의 핵심 메시지를 구조화합니다.
 */

import React from 'react';

interface PainGainCardProps {
  /** 현재 겪고 있는 문제점 (Pain Point) */
  painTitle: string;
  /** Pain에 대한 상세 설명 및 근거 제시 */
  painDescription: string;
  /** 해결 후 얻게 될 이득의 제목 (Gain Title) */
  gainTitle: string;
  /** Gain에 대한 구체적인 수치적/정성적 기대 결과 (ROI, Return On Investment) */
  gainMetrics: string[]; // 배열 형태로 여러 근거 제시 가능
}

const PainGainCard: React.FC<PainGainCardProps] = ({ painTitle, painDescription, gainTitle, gainMetrics }) => {

  // 🎨 디자인 로직: 배경 대비를 통해 메시지 전달력을 극대화합니다.
  return (
    <div style={styles.cardWrapper}>
      {/* LEFT SIDE: PAIN - 위험/문제 제기 (Accent Yellow 강조) */}
      <div style={styles.painSide}>
        <h2 style={{...styles.title, color: '#D9534F'}}>{`❌ ${painTitle}`}</h2> {/* Reddish Tone for Pain */}
        <p style={styles.description}>{painDescription}</p>
        <small style={styles.sourceText}>(현재의 손실 / Risk)</small>
      </div>

      {/* RIGHT SIDE: GAIN - 기회/해결책 제시 (Dark Blue Trust 강조) */}
      <div style={styles.gainSide}>
        <h2 style={{...styles.title, color: '#0A2463'}}>{`✅ ${gainTitle}`}</h2> {/* Dark Blue Tone for Gain */}
        <ul style={styles.metricsList}>
          {gainMetrics.map((metric, index) => (
            <li key={index} style={styles.metricItem}>{metric}</li>
          ))}
        </ul>
        <small style={styles.sourceText2}>(예상 이득 / ROI)</small>
      </div>
    </div>
  );
};

export default PainGainCard;