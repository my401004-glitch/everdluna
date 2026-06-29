/**
 * @fileoverview VADP 데이터를 받아 컴포넌트의 Props가 기술적으로 유효한지 검증하는 테스트 목업 파일입니다.
 * @description 실제 React 컴포넌트를 구현하기 전에, 데이터 타입과 인터페이스를 강제하여 시스템 안정성을 확보합니다. (Unit Test Mock)
 */

import React from 'react';
import { Video4DiagnosisResultType } from './types/Video4Types';

// 이 목업 컴포넌트는 실제 화면에 렌더링되는 것이 아니라,
// Props의 타입 검증(TypeScript compile time check)을 위한 목적입니다.

interface TestMockProps {
    diagnosisData: Video4DiagnosisResultType;
}

const Video4TestMockComponent: React.FC<TestMockProps> = ({ diagnosisData }) => {
    // 1. 데이터 유효성 검증 (예시 로직)
    if (!diagnosisData.resonanceGraph || diagnosisData.resonanceGraph.dataPoints.length === 0) {
        console.error("[TEST FAIL] Resonance Graph Data is missing or empty.");
        return <div>[TEST FAILED]: 필수 그래프 데이터가 누락되었습니다.</div>;
    }

    // 2. 핵심 비즈니스 로직 검증 (CTA 플래그)
    const canProceedToPaidTest = diagnosisData.isQualifiedForPremiumTest && diagnosisData.kpis.metrics.some(m => m.name === 'Growth' && m.currentValue > 50);

    return (
        <div style={{ border: '2px solid #ccc', padding: '20px', background: '#fff' }}>
            <h1>✅ V4 Mockup Component Test Passed</h1>
            <p>데이터 타입 계약(Type Contract)을 성공적으로 준수했습니다.</p>

            <h3>[Test Summary]</h3>
            {canProceedToPaidTest ? (
                <p style={{ color: 'red', fontWeight: 'bold' }}>🚨 CTA Logic OK: 유료 테스트 참여를 강력하게 권유할 수 있는 데이터 조합입니다. (Growth > 50)</p>
            ) : (
                <p style={{ color: 'orange' }}>⚠️ CTA Logic Warning: 현재 KPI만으로는 유료 테스트 강제성이 약합니다. 스크립트 재검토 필요.</p>
            )}

            <h3>[Debug Check]</h3>
            <p>Received Diagnosis Type: {diagnosisData.diagnosisType}</p>
        </div>
    );
};

export default Video4TestMockComponent;