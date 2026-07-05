import React from 'react';
import ScoreCardComponent from '../components/ScoreCardComponent';

// 메인 레이아웃을 정의합니다. (PoC의 뼈대 역할)
const DiagnosisPage: React.FC = () => {
    // 실제 Context ID는 사용자 세션 또는 URL 파라미터에서 가져와야 합니다.
    const mockContextId = "user_session_abc123";

    return (
        <div className="diagnosis-page-container">
            {/* Header 및 CTA 영역 (Landing Kit의 핵심 구조 사용) */}
            <header style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f7fa' }}>
                <h1>✨ AI 기반 학생 성장 진단 리포트</h1>
                <p>당신의 자녀가 놓치고 있는 잠재적 문제점과 성장 로드맵을 데이터로 확인하세요.</p>
            </header>

            {/* 🚀 핵심 위젯 영역: Data Flow의 중심 */}
            <section style={{ padding: '40px', maxWidth: '1200px', margin: 'auto' }}>
                <h2>📊 종합 진단 스코어</h2>
                {/* 여기서 API 연동이 발생하며, 데이터 안정성이 검증되는 핵심 영역입니다. */}
                <ScoreCardComponent contextId={mockContextId} /> 
            </section>

            {/* Footer 및 FAQ 등 기타 섹션 (나중에 추가될 기능) */}
        </div>
    );
};

export default DiagnosisPage;