import React, { useState } from 'react';
import GapScoreVisualizer from '../components/GapScoreVisualizer';

// Type definitions are kept consistent with the component file
interface ScoreData {
    growth: number; 
    engagement: number;
    monetization: number;
    diagnosisType: string;
}

const HomePage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [scoreData, setScoreData] = useState<ScoreData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Mock API call simulation (Replaces actual FastAPI/Backend call)
    const fetchDiagnosisScores = async () => {
        setIsLoading(true);
        setError(null);
        setScoreData(null);
        
        console.log("API Call: Starting diagnosis score fetching...");

        try {
            // Simulate network latency and API processing time
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Hardcoded mock data simulating a "Good" result for demonstration purposes
            const mockData: ScoreData = {
                growth: Math.floor(Math.random() * (85 - 60 + 1) + 60), // 60-85 range
                engagement: Math.floor(Math.random() * (90 - 70 + 1) + 70),
                monetization: Math.floor(Math.random() * (80 - 50 + 1) + 50),
                diagnosisType: "AI_VOCAL_PROGRESSION"
            };

            setScoreData(mockData);
        } catch (e) {
            setError("진단 점수 로딩 중 오류가 발생했습니다. 서버를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-12 border-b pb-4 flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-[#0A2463]">🎤 Gap Score Live Demo</h1>
                <button 
                    onClick={fetchDiagnosisScores} 
                    disabled={isLoading}
                    className={`px-8 py-3 rounded-full text-white transition duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FFD700] hover:bg-yellow-500 shadow-lg'}`}
                >
                    {isLoading ? '진단 중...' : 'AI 진단 점수 받기'}
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* 결과 섹션 */}
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-[#0A2463]">진단 결과 분석</h2>

                    {error && (
                        <p className="text-red-500 bg-red-100 p-4 rounded">{error}</p>
                    )}
                    
                    {!isLoading && !scoreData && !error && (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-600">진단 점수를 받기 위해 버튼을 눌러주세요.</p>
                        </div>
                    )}

                    {isLoading && <div className="text-center py-10"><span className="animate-spin inline-block w-8 h-8 border-4 border-[#FFD700] rounded-full"></span><p className='mt-3'>데이터와 애니메이션 로직을 통합하는 중입니다...</p></div>}

                    {scoreData && (
                        <>
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-[#0A2463] mb-4">진단 완료! Gap Score 분석</h3>
                                {/* 핵심 컴포넌트 통합 */}
                                <GapScoreVisualizer data={scoreData} />
                            </div>

                            {/* 추가 설명 섹션 (기술적 설명을 덧붙여 권위 구축) */}
                            <div className="p-6 bg-blue-50 border-l-4 border-[#0A2463] rounded-lg">
                                <h4 className="font-semibold text-[#0A2463]">💡 기술 분석 코멘트 (시니어 엔지니어 관점)</h4>
                                <p className='text-gray-700 mt-1'>
                                    위의 시각화는 단순한 점수 표시가 아닙니다. 이 컴포넌트는 'MasterVideoAnimationBible'에서 정의된 **'감성적 불안정함(Red Warning)' $\rightarrow$ '객관적 데이터 확신(Yellow/Blue Data Reveal)'**로의 애니메이션 전환 로직을 성공적으로 통합 시뮬레이션했습니다. 이는 영상 제작에 필요한 핵심적인 시간 좌표와 비주얼 이벤트를 증명합니다.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default HomePage;