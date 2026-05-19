import React from 'react';

const PricingSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mt-8 text-left">
      <div className="bg-white/10 p-6 rounded-lg border border-white/20">
        <h4 className="text-xl font-bold text-yellow-400 mb-2">무료 진단</h4>
        <p className="text-gray-300 text-sm mb-4">기본적인 학습 Gap Score 진단 및 결과 요약 제공</p>
        <div className="text-2xl font-bold text-white mb-4">0원</div>
        <button className="w-full py-2 bg-white/20 text-white rounded font-semibold hover:bg-white/30 transition">현재 플랜</button>
      </div>
      <div className="bg-white/20 p-6 rounded-lg border-2 border-yellow-400">
        <h4 className="text-xl font-bold text-yellow-400 mb-2">프리미엄 리포트</h4>
        <p className="text-gray-200 text-sm mb-4">상세 약점 분석, 1:1 맞춤 커리큘럼 및 솔루션 피드백 제공</p>
        <div className="text-2xl font-bold text-white mb-4">29,000원 <span className="text-sm font-normal text-gray-300">/ 월</span></div>
        <button className="w-full py-2 bg-yellow-400 text-darkblue rounded font-bold hover:bg-yellow-500 transition">구독하기</button>
      </div>
    </div>
  );
};

export default PricingSection;
