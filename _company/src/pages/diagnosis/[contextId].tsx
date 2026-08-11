import React from 'react';
// 🚨 중요: 위에서 정의한 커스텀 훅을 임포트합니다.
import { useDiagnosisData } from '@/hooks/useDiagnosisData'; 
import { DiagnosisScoreDisplay } from '@/components/shared/DiagnosisScoreDisplay'; // Shared Component

/**
 * 진단 결과를 받아와 전체 레이아웃을 구성하는 페이지 컴포넌트입니다.
 * 이 컴포넌트는 데이터의 라이프사이클(Loading, Error, Success)을 관리합니다.
 */
const DiagnosisPage = ({ contextId }: { contextId: string }) => {
    // 🚨 핵심: API 연동 로직을 분리한 커스텀 훅 호출
    const { data, isLoading, error } = useDiagnosisData(contextId);

    if (isLoading) {
        return <div className="p-8 text-center">⚙️ 진단 데이터를 불러오는 중입니다... 객관적인 수치를 측정합니다.</div>;
    }

    if (error) {
        return <div className="p-8 bg-red-100 border border-red-400 text-red-700">{`❌ ${error.message}`}</div>;
    }
    
    // 데이터가 성공적으로 로드되었을 때만 렌더링
    if (data) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">✨ AI 진단 결과 분석</h1>
                <p className="mb-8 text-gray-600">진단 컨텍스트 ID: {contextId}</p>

                {/* 💡 핵심 컴포넌트 배치 및 데이터 바인딩 */}
                <DiagnosisScoreDisplay scoreDetails={data.scoreDetails} />
                
                {/* 나머지 진단 상세 결과 섹션 (여기에 다른 컴포넌트를 붙일 수 있음) */}
                <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">🔬 추가 분석 지표</h2>
                    <p>전체 진단 결과: {data.result.diagnosis_type}</p>
                </div>
            </div>
        );
    }

    return <div className="p-8 text-center">데이터를 찾을 수 없습니다. 유효한 컨텍스트 ID가 필요합니다.</div>;
};

export default DiagnosisPage;