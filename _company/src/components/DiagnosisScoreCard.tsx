// src/components/DiagnosisScoreCard.tsx
import React from 'react';

interface DiagnosisResult {
  growth: number;
  engagement: number;
  monetization: number;
  message?: string;
}

// 점수 바의 스타일링을 담당하는 컴포넌트 (재사용성 고려)
const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    // 0-100 스케일로 진행률 계산
    const widthPercentage = `${score}%`;
    return (
        <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
                <span>{label}</span>
                <span>{score}점</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3.5">
                <div 
                    className={`h-3.5 rounded-full transition-all duration-1000 ${
                        score < 40 ? 'bg-red-500' : score < 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: widthPercentage }}
                ></div>
            </div>
        </div>
    );
};

const DiagnosisScoreCard: React.FC<{ data: DiagnosisResult }> = ({ data }) => {
  return (
    <div className="bg-white p-10 rounded-xl shadow-2xl border-t-4 border-accentyellow">
      {/* 1. 종합 메시지 및 경고 */}
      <div className={`p-5 mb-8 rounded-lg ${data.message && data.monetization < 60 ? 'bg-red-100 border-l-4 border-red-500' : 'bg-green-100 border-l-4 border-green-500'}`}>
        <p className="text-lg font-semibold text-gray-800">💡 AI 진단 코멘트:</p>
        <p className={`mt-1 ${data.monetization < 60 ? 'text-red-700' : 'text-green-700'} transition-all duration-500`}>{data.message || "현재 상태를 유지하며 꾸준히 학습하는 것이 중요합니다."}</p>
      </div>

      {/* 2. 점수 시각화 섹션 */}
      <h3 className="text-2xl font-bold mb-8 text-center">📉 성장 지표 분석 (KPI)</h3>
      
      <ScoreBar label="성장 잠재력 (Growth)" score={data.growth} />
      <ScoreBar label="학습 몰입도 (Engagement)" score={data.engagement} />
      <ScoreBar label="수익화 기여도 (Monetization)" score={data.monetization} />

      {/* 3. 액션 플랜 CTA */}
      <div className="mt-12 text-center">
        <button className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transition duration-300 transform hover:scale-105">
          나의 맞춤 학습 플랜 받기 → (유료)
        </button>
      </div>
    </div>
  );
};

export default DiagnosisScoreCard;