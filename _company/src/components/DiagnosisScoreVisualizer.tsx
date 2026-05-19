// src/components/DiagnosisScoreVisualizer.tsx
import React, { useState, useEffect } from 'react';
import { DiagnosisResult } from '../types/diagnosisTypes';
import axios from 'axios'; // API 호출을 가정

/**
 * 진단 점수 결과를 시각화하는 핵심 컴포넌트입니다. 
 * (Dark Blue / Accent Yellow 브랜드 시스템 적용)
 */
interface DiagnosisScoreVisualizerProps {
    // 이 Mockup은 props를 받지 않고, 내부적으로 API를 호출하여 데이터를 가져옵니다.
}

const DiagnosisScoreVisualizer: React.FC<DiagnosisScoreVisualizerProps> = () => {
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API 호출 로직: 실제 백엔드와 연동하는 곳입니다.
    useEffect(() => {
        const fetchDiagnosisScore = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // [근거: sessions/2026-05-19T09:57, API 연동 로직 구현] 
                // 실제 엔드포인트와 요청 파라미터로 대체해야 합니다.
                const response = await axios.get<DiagnosisResult>(
                    '/api/v1/diagnosis_score', 
                    { 
                        params: { contextId: 'VocalArtistPath' } // 예시 컨텍스트 ID
                    }
                );
                setResult(response.data);

            } catch (err) {
                console.error("API 호출 실패:", err);
                setError("진단 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiagnosisScore();
    }, []);


    // ----------------- UI 렌더링 로직 -----------------

    if (isLoading) return <div className="p-10 text-center dark:text-gray-200">데이터를 분석 중입니다... 잠시만 기다려주세요. ⚙️</div>;
    if (error) return <div className="p-10 bg-red-100 text-red-800 border border-red-300 rounded">{error}</div>;

    // 데이터 로딩 성공 시: 메인 섹션을 렌더링합니다.
    return (
        <section id="diagnosis-score" className="p-8 bg-white dark:bg-[#1A2C46] shadow-xl border-b border-gray-200/30">
            <h2 className="text-3xl font-bold text-dark-blue mb-6">{result?.title}</h2>

            {/* 1. 종합 점수 시각화 (가장 중요) */}
            <div className="mb-8 p-6 bg-gradient-to-r from-[#0A2463] to-[#153c7a] rounded-xl shadow-lg">
                <p className="text-sm text-yellow-400 mb-2 uppercase tracking-widest">종합 진단 점수</p>
                <div className="flex items-end space-x-4 py-2">
                    <div 
                        className="w-full bg-gray-700 rounded-full h-3 transition-all duration-1000"
                        style={{ width: `${result?.overallScore}%` }} // 실제 점수로 너비 조절
                    ></div>
                    <span className="text-5xl font-extrabold text-yellow-400">{result?.overallScore}/100</span>
                </div>
                <p className="mt-3 text-lg text-white">현재 레벨: <span className={`font-bold ${result?.grade === 'Advanced' ? 'text-green-400' : result?.grade === 'Developing' ? 'text-yellow-400' : 'text-red-400'}`}>{result?.grade}</span></p>
            </div>

            {/* 2. Pain -> Gain 핵심 요약 (Designer 요구사항 반영) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Pain Point (경고/위험 구역 - Accent Yellow 강조) */}
                <div className="lg:col-span-2 p-5 bg-yellow-50 dark:bg-[#2a1c00] border-l-4 border-yellow-500 rounded-md shadow">
                    <h3 class="text-xl font-bold text-yellow-700 mb-2 flex items-center">⚠️ Pain Point</h3>
                    <p className="text-gray-800 dark:text-gray-100">{result?.painPointSummary}</p>
                </div>

                {/* Gain Potential (해결책 제시 - Dark Blue/CTA 느낌) */}
                <div class="p-5 bg-[#0A2463] border-l-4 border-accent-yellow rounded-md shadow flex flex-col justify-center">
                    <h3 class="text-xl font-bold text-white mb-2">✨ Gain Potential</h3>
                    <p className="text-gray-100">{result?.gainPotentialStatement}</p>
                </div>
            </div>

            {/* 3. KPI 세부 분석 (Growth, Engagement, Monetization) */}
            <h3 class="text-2xl font-bold text-dark-blue mb-6 border-b pb-2">세부 역량 지표 분석</h3>
            <div className="space-y-6">
                {result?.kpiMetrics.map((metric, index) => (
                    <div key={index} className={`p-4 rounded-lg shadow ${metric.level === 'High' ? 'bg-green-50 dark:bg-[#1e3c2d]' : metric.level === 'Low' ? 'bg-red-50 dark:bg-[#461c1c]' : 'bg-gray-50 dark:bg-[#1f2b3a]'}`}>
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-dark-blue">{metric.description}</h4>
                            <span className={`text-2xl font-extrabold ${metric.level === 'High' ? 'text-green-600' : metric.level === 'Low' ? 'text-red-600' : 'text-yellow-600'}`}>{`${metric.score}%`}</span>
                        </div>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">진단 요약: {metric.description} 영역에서의 현황을 분석했습니다.</p>
                    </div>
                ))}
            </div>

        </section>
    );
};

export default DiagnosisScoreVisualizer;