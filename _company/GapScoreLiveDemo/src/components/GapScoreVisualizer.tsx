import React, { useState, useEffect } from 'react';

// Define the expected data structure based on DiagnosisService output
interface ScoreData {
    growth: number; // Example score out of 100
    engagement: number;
    monetization: number;
    diagnosisType: string;
}

interface GapScoreVisualizationProps {
    data: ScoreData;
}

/**
 * [핵심] MasterVideoAnimationBible의 전환 로직을 시뮬레이션하는 컴포넌트.
 * '감성'에서 '데이터 기반 권위'로 변곡점을 보여주는 것이 목표입니다.
 */
const GapScoreVisualizer: React.FC<GapScoreVisualizationProps> = ({ data }) => {
    // State to control the visualization phase (simulating animation timeline)
    const [phase, setPhase] = useState<'emotional' | 'data_reveal'>('emotional');

    useEffect(() => {
        // Simulate time passing and triggering the transition from emotion to data.
        const timer = setTimeout(() => {
            setPhase('data_reveal');
        }, 3000); // Transition after 3 seconds (simulating the initial dramatic pause)
        return () => clearTimeout(timer);
    }, []);

    // --- Phase-specific rendering logic based on MasterVideoAnimationBible ---

    const renderVisualization = () => {
        if (phase === 'emotional') {
            return (
                <div className="p-8 bg-yellow-50 border-l-4 border-gray-300 shadow-lg transition duration-700">
                    <h3 className="text-2xl font-bold text-red-600 mb-4">⚠️ 경고: 당신의 발성은 아직 불완전합니다.</h3>
                    <p className="text-gray-700">
                        (Animation: 불안정하고 흔들리는 파형 애니메이션 시뮬레이션)<br/>
                        이 단계에서는 추상적인 '노력'이나 '감성적 코칭'에 의존하는 경향을 보입니다. 
                    </p>
                </div>
            );
        }

        // phase === 'data_reveal': The core integration point
        return (
            <div className="grid grid-cols-3 gap-6 mt-8">
                {/* Growth Score Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-[#0A2463] transform hover:scale-[1.02] transition duration-500">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Growth (성장)</h4>
                    {/* Dynamic visualization area */}
                    <div className="text-6xl font-extrabold text-[#FFD700]">{data.growth}</div>
                    <p className="mt-2 text-sm text-gray-500">점수: 진단 기반 성장의 잠재력 (Gap Score)</p>
                </div>

                {/* Engagement Score Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-[#0A2463] transform hover:scale-[1.02] transition duration-500">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Engagement (몰입)</h4>
                    <div className="text-6xl font-extrabold text-[#FFD700]">{data.engagement}</div>
                    <p className="mt-2 text-sm text-gray-500">점수: 청중의 반응을 유도하는 매력 지표</p>
                </div>

                {/* Monetization Score Card */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-[#0A2463] transform hover:scale-[1.02] transition duration-500">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Monetization (수익성)</h4>
                    <div className="text-6xl font-extrabold text-[#FFD700]">{data.monetization}</div>
                    <p className="mt-2 text-sm text-gray-500">점수: 상업적 성공 가능성을 나타내는 지표</p>
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-[400px] p-10 border rounded-lg bg-gray-50 transition-all duration-1000 ${phase === 'data_reveal' ? 'border-green-400 scale-100' : 'border-red-300 opacity-90'}`}>
            <h2 className="text-3xl font-bold mb-6 text-[#0A2463]">📊 Gap Score 진단 결과 시각화</h2>
            {renderVisualization()}
        </div>
    );
};

export default GapScoreVisualizer;