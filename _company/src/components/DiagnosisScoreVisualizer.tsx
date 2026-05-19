// src/components/DiagnosisScoreVisualizer.tsx
import React, { useState, useEffect } from 'react';
import { DiagnosisResult } from '../types/diagnosisTypes';

interface DiagnosisScoreVisualizerProps {
    // 이 Mockup은 props를 받지 않고, 내부적으로 API를 호출하여 데이터를 가져옵니다.
}

const DiagnosisScoreVisualizer: React.FC<DiagnosisScoreVisualizerProps> = () => {
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API 호출 로직
    useEffect(() => {
        const fetchDiagnosisScore = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/v1/diagnosis_score?contextId=VocalArtistPath');
                if (!response.ok) {
                    throw new Error("네트워크 응답 실패");
                }
                const data = await response.json();
                setResult(data);
            } catch (err) {
                console.error("API 호출 실패:", err);
                setError("진단 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiagnosisScore();
    }, []);

    if (isLoading) return <div className="p-10 text-center dark:text-gray-200">데이터를 분석 중입니다... 잠시만 기다려주세요. ⚙️</div>;
    if (error) return <div className="p-10 bg-red-100 text-red-800 border border-red-300 rounded">{error}</div>;

    return (
        <section id="diagnosis-score" className="p-8 bg-white dark:bg-[#1A2C46] shadow-xl border-b border-gray-200/30">
            <h2 className="text-3xl font-bold text-dark-blue mb-6">{result?.title}</h2>

            {/* 1. 종합 점수 시각화 */}
            <div className="mb-8 p-6 bg-gradient-to-r from-[#0A2463] to-[#153c7a] rounded-xl shadow-lg">
                <p className="text-sm text-yellow-400 mb-2 uppercase tracking-widest">종합 진단 점수</p>
                <div className="flex items-end space-x-4 py-2">
                    <div 
                        className="w-full bg-gray-700 rounded-full h-3 transition-all duration-1000"
                        style={{ width: `${result?.overallScore || 0}%` }}
                    ></div>
                    <span className="text-5xl font-extrabold text-yellow-400">{(result?.overallScore || result?.score) || 0}/100</span>
                </div>
                <p className="mt-3 text-lg text-white">현재 레벨: <span className={`font-bold ${result?.grade === 'Advanced' ? 'text-green-400' : result?.grade === 'Developing' ? 'text-yellow-400' : 'text-red-400'}`}>{result?.grade || 'Needs Improvement'}</span></p>
            </div>

            {/* 2. Pain -> Gain 핵심 요약 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Pain Point */}
                <div className="lg:col-span-2 p-5 bg-yellow-50 dark:bg-[#2a1c00] border-l-4 border-yellow-500 rounded-md shadow">
                    <h3 className="text-xl font-bold text-yellow-700 mb-2 flex items-center">⚠️ Pain Point</h3>
                    <p className="text-gray-800 dark:text-gray-100">{result?.painPointSummary || result?.analysisSummary}</p>
                </div>

                {/* Gain Potential */}
                <div className="p-5 bg-[#0A2463] border-l-4 border-accent-yellow rounded-md shadow flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-2">✨ Gain Potential</h3>
                    <p className="text-gray-100">{result?.gainPotentialStatement || result?.recommendation}</p>
                </div>
            </div>

            {/* 3. KPI 세부 분석 */}
            <h3 className="text-2xl font-bold text-dark-blue mb-6 border-b pb-2">세부 역량 지표 분석</h3>
            <div className="space-y-6">
                {result?.kpiMetrics?.map((metric, index) => (
                    <div key={index} className={`p-4 rounded-lg shadow ${metric.level === 'High' ? 'bg-green-50 dark:bg-[#1e3c2d]' : metric.level === 'Low' ? 'bg-red-50 dark:bg-[#461c1c]' : 'bg-gray-50 dark:bg-[#1f2b3a]'}`}>
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-dark-blue">{metric.description}</h4>
                            <span className={`text-2xl font-extrabold ${metric.level === 'High' ? 'text-green-600' : metric.level === 'Low' ? 'text-red-600' : 'text-yellow-600'}`}>{`${metric.score || metric.value || 0}%`}</span>
                        </div>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">진단 요약: {metric.description} 영역에서의 현황을 분석했습니다.</p>
                    </div>
                ))}
            </div>

        </section>
    );
};

export default DiagnosisScoreVisualizer;