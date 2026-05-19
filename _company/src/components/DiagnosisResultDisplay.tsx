/**
 * @component DiagnosisResultDisplay
 * 진단 결과를 받아 시각화하고, 사용자에게 Gap을 인지시키며 CTA를 유도하는 핵심 컴포넌트입니다.
 */
import React from 'react';
import { DiagnosisResult } from '@/types/diagnosis';

interface Props {
  /** API 호출로 받은 진단 결과 데이터 */
  result: DiagnosisResult;
}

const DiagnosisResultDisplay: React.FC<Props> = ({ result }) => {
  // Gap Score에 따라 경고 레벨을 결정하는 로직 (UX 핵심)
  const getGapLevel = (score: number): 'Low' | 'Medium' | 'High' => {
    if (score >= 80) return 'High'; // 위험! 즉각적인 조치가 필요하다는 신호
    if (score >= 50) return 'Medium'; // 주의! 학습 패턴 재점검이 필요함
    return 'Low'; // 안정권 (매우 드물어야 함)
  };

  const gapLevel = getGapLevel(result.overallGapScore);
  let warningColor = '';
  if (gapLevel === 'High') warningColor = 'text-red-600 bg-red-100'; 
  else if (gapLevel === 'Medium') warningColor = 'text-yellow-600 bg-yellow-100';
  else warningColor = 'text-green-600 bg-green-100';

  return (
    <div className="p-8 bg-white shadow-xl rounded-lg my-12 border-t-4 border-[#FFD700]">
      {/* 🏆 Gap Score 시각화 모듈 - 핵심 컴포넌트 */}
      <section className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#0A2463] mb-4">🔬 AI 진단 보고서: 당신의 Gap Score</h2>
        <div className={`inline-block p-6 rounded-lg shadow-inner ${warningColor}`}>
          <p className="text-sm uppercase tracking-widest">{gapLevel} 위험 레벨 감지</p>
          <p className="text-7xl font-extrabold mt-2 text-[#0A2463]">{result.overallGapScore}</p>
          <p className="text-xl mt-1">/ 100점 (현재 학습 Gap)</p>
        </div>
      </section>

      {/* 💡 요약 메시지 및 Pain Point 재강조 */}
      <div className="mb-8 p-6 bg-[#EBF3FF] border-l-4 border-[#0A2463]">
        <h3 className="text-2xl font-bold text-[#0A2463] mb-2">⚠️ 분석 요약: 놓치고 있는 핵심 포인트</h3>
        <p className="text-gray-700">{result.summaryMessage}</p>
      </div>

      {/* 📊 KPI 상세 지표 섹션 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {(Object.entries(result.kpis) as [keyof typeof result.kpis, number][]).map(([key, score]) => (
          <div key={key} className="p-5 border rounded-lg shadow-sm bg-gray-50">
            <h4 className="text-lg font-semibold text-[#0A2463] mb-1">{key.toUpperCase()}</h4>
            <p className={`text-4xl font-extrabold ${score < 0.4 ? 'text-red-500' : 'text-green-600'}`}>{Math.round(score * 10) / 10} 점</p>
            <p className="text-sm text-gray-500 mt-2">현재 지표의 안정성과 개선 필요도를 나타냅니다.</p>
          </div>
        ))}
      </section>

      {/* 📚 상세 보고서 및 CTA (Monetization Funnel) */}
      <section className="mt-12 p-8 bg-[#F0F9FF] rounded-xl">
        <h3 className="text-3xl font-bold text-[#0A2463] mb-6 border-b pb-2">✅ 상세 진단 보고서 및 솔루션 제안</h3>

        {/* 약점 영역 목록 */}
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-[#FFD700] mb-3">🎯 가장 시급히 개선해야 할 영역 (Weakest Areas)</h4>
          <ul className="space-y-4">
            {result.detailedReportData.weakestAreas.map((area, index) => (
              <li key={index} className="p-4 border-l-4 border-red-500 bg-white shadow-sm flex justify-between items-center">
                <div>
                  <strong className="text-lg text-[#0A2463]">{area.areaName}</strong> (점수: {Math.round(area.score)}점)
                  <p className="text-gray-600 ml-4 mt-1">→ 추천 솔루션: {area.recommendation}</p>
                </div>
                {/* 이 부분이 유료 전환의 핵심 CTA가 됩니다 */}
                <button className="px-6 py-2 bg-[#FFD700] text-[#0A2463] font-bold rounded hover:bg-yellow-400 transition duration-150">
                  이 영역 집중 학습 (유료)
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 최종 유도 CTA */}
        <div className="text-center pt-8 border-t mt-8">
          <p className="text-xl text-gray-700 mb-4">
            AI 진단 결과가 보여주듯, 객관적인 데이터만이 실력 향상의 길을 제시합니다. 
            더 깊고 체계적인 커리큘럼이 필요하지 않으신가요?
          </p>
          <button className="w-full max-w-md py-4 text-2xl bg-[#0A2463] text-white font-bold rounded-lg shadow-lg hover:bg-[#071d4c] transition duration-300">
            📚 전 과정 로드맵 확인 및 컨설팅 받기 (Paid Module)
          </button>
        </div>
      </section>
    </div>
  );
};

export default DiagnosisResultDisplay;