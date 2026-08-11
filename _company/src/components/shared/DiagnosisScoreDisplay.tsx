// src/components/shared/DiagnosisScoreDisplay.tsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// 💡 타입 정의: API 응답 구조를 명확히 합니다. (Self-RAG 근거 활용)
interface DiagnosisResult {
    score: number; // 전반적인 점수
    pain_area: { name: string; score: number }; // Pain 지표
    gain_area: { name: string; score: number }; // Gain 지표
    metadata: Record<string, any>; // 기타 메타데이터 (예: context_id)
}

// 🎨 디자인 시스템에서 정의된 색상 팔레트 사용 (Pain/Gain 대비 강조)
const PAIN_COLOR = '#8b0000';     // Dark Red 계열
const GAIN_COLOR = '#32cd32';     // Light Green 계열
const ACCENT_COLOR = 'yellow';

// 🎬 애니메이션 정의: 데이터가 바뀔 때 부드럽게 전환되도록 keyframes를 사용합니다.
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
`;

// 🧱 스타일 컴포넌트 정의 (Design System 준수)
const ScoreContainer = styled.div`
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    background: #fff;
    max-width: 900px;
    margin: 40px auto;

    /* 기술적 검증을 위해 클래스명 명확히 부여 */
    &--loading { opacity: 0.6; pointer-events: none; }
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    margin-bottom: 30px;
    border-left: 5px solid ${props => props.$color || '#ccc'};
    padding-left: 15px;
    display: inline-block;
`;

const ScoreCard = styled.div`
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }
`;

const ScoreDisplay = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;


/**
 * @description 진단 점수 데이터 기반의 'Pain -> Gain' 시각화 컴포넌트 프로토타입
 * @param {object} props - 부모 컴포넌트에서 전달받는 Props
 */
const DiagnosisScoreDisplay: React.FC = ({ diagnosisData, isLoading }) => {

    // 🚨 에러 핸들링 및 로딩 가드 구현 (필수)
    if (isLoading) {
        return <ScoreContainer className="loading">데이터를 불러오는 중입니다... 기술 검증 중입니다. ⚙️</ScoreContainer>;
    }

    if (!diagnosisData) {
        // 데이터가 없거나 타입이 맞지 않을 경우, 사용자에게 명확하게 피드백합니다. (안정성 확보)
        return <ScoreContainer>⚠️ 진단 점수 데이터를 찾을 수 없습니다. API 연동 로직과 데이터 스키마를 확인해주세요.</ScoreContainer>;
    }

    // 🖼️ 컴포넌트 구조화: Master Component Library 아키텍처 반영
    const renderSection = (title: string, data: { name: string; score: number }, color: string) => (
        <ScoreCard style={{ borderLeft: `5px solid ${color}` }}>
            <h4>{title}</h4>
            <p>{data.name} 영역의 현재 점수:</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color, animation: `${pulseAnimation} 2s infinite` }}>
                {`${Math.round(data.score)} / 10`}
            </div>
        </ScoreCard>
    );

    return (
        <ScoreContainer className="diagnosis-master-kit">
            <h1>✨ AI 진단 점수 Master Component Kit</h1>
            <p>데이터 기반의 'Pain $\rightarrow$ Gain' 전환 흐름을 시각화한 프로토타입입니다.</p>

            {/* 1. 전반적인 Score 요약 */}
            <SectionTitle $color={ACCENT_COLOR}>전체 진단 점수 (Overall Gap Score)</SectionTitle>
            <ScoreDisplay>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '3rem', margin: 0, color: ACCENT_COLOR }} className="animated-score">
                        {`${Math.round(diagnosisData.score)} / 10`}
                    </h2>
                    <p>전체 학습 리스크 격차 지수</p>
                </div>
            </ScoreDisplay>

            <hr style={{ margin: '40px 0' }} />

            {/* 2. Pain Area (Problem) */}
            <SectionTitle $color={PAIN_COLOR}>🚨 Potential Problem Area (Pain)</SectionTitle>
            {renderSection("현재 취약점", diagnosisData.pain_area, PAIN_COLOR)}

            {/* 3. Gain Area (Solution) */}
            <SectionTitle $color={GAIN_COLOR} style={{ marginTop: '40px' }}>✅ Improvement Target (Gain)</SectionTitle>
            {renderSection("개선 목표점", diagnosisData.gain_area, GAIN_COLOR)}

        </ScoreContainer>
    );
};

export default DiagnosisScoreDisplay;