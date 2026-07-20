import React, { useState, useEffect } from 'react';
import { AdCardProps } from '../types/adcard';
import { simulateApiCall, ABTestGroupContext } from '../services/adcardApiService';

// 🚨 실제 컴포넌트가 사용하는 Tailwind CSS 클래스 가정 (스타일링은 생략)

/**
 * A/B 테스트 결과에 따라 동적으로 반응하는 마케팅 AdCard 컴포넌트입니다.
 * @param {AdCardProps} props - 부모 컴포넌트로부터 받은 Props
 */
const AdCard: React.FC<AdCardProps> = ({ dynamicData, abTestGroupOverride }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🚨 핵심 로직: 컴포넌트 마운트 시점에 A/B 그룹 컨텍스트를 활용하여 데이터를 로드합니다.
  useEffect(() => {
    const loadCardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Props로 오버라이드된 그룹을 사용하거나, 기본 'Control'을 사용합니다.
        const groupToUse: 'A' | 'B' | 'Control' = abTestGroupOverride || 'Control';
        
        // 2. 시뮬레이션 API 호출 실행 (실제로는 axios.get('/api/v1/adcard_data?group=' + groupToUse) 형태)
        const data = await simulateApiCall(groupToUse);

        // 3. 받은 데이터를 내부 상태로 설정합니다. (이 예시에서는 props가 이미 데이터이므로 로딩만 처리)
        console.log(`[AdCard Render] Successfully loaded dynamic content for group: ${groupToUse}`);

      } catch (e) {
        setError("마케팅 자산 로드 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
        console.error("Failed to load ad card data:", e);
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
  }, [abTestGroupOverride]); // abTestGroupOverride 값이 변경될 때만 재실행되도록 의존성 설정

  if (loading) return <div className="p-8 bg-yellow-50 border border-yellow-200">⚙️ 로딩 중: A/B 테스트 데이터 컨텍스트를 불러오는 중입니다...</div>;
  if (error) return <div className="p-8 text-red-700 bg-red-100">{error}</div>;

  // 🚨 렌더링 로직: dynamicData prop을 사용합니다.
  return (
    <div className="max-w-xl p-8 border rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.02]" 
         style={{ borderTop: '5px solid #4f46e5' }} // 기본 브랜드 색상 강조
    >
      {/* 🚀 A/B 테스트 그룹 컨텍스트 표시 (개발자 디버깅용) */}
      <div className="text-xs text-gray-500 mb-4">
        [현재 테스트 그룹: {abTestGroupOverride || 'Control'}] - Dynamic Rendering Test
      </div>

      {/* 1. 손실 영역 (Loss Area): 가장 먼저 사용자 불안감을 자극 */}
      <div className={`p-4 rounded-lg text-center ${dynamicData.lossAreaMessage.colorClass}`}>
        <h3 className="text-xl font-bold text-gray-800">🚨 {dynamicData.headlineVariation}</h3>
        <p className="mt-2 text-sm italic">{dynamicData.lossAreaMessage.text}</p>
      </div>

      {/* 2. 핵심 메시지 (Main Copy) */}
      <div className="mt-6 p-4 border-l-4 border-indigo-500 bg-indigo-50">
        <p className="text-lg font-semibold text-gray-700">{dynamicData.mainCopy}</p>
      </div>

      {/* 3. Call To Action (CTA): 명확하고 즉각적인 행동 유도 */}
      <a 
        href={dynamicData.ctaButton.link} 
        className="mt-8 block w-full text-center py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold transition duration-150 cursor-pointer shadow-md"
      >
        {dynamicData.ctaButton.text}
      </a>
    </div>
  );
};

export default AdCard;