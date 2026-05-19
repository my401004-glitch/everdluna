import React, { useState, useEffect } from 'react';
import { DiagnosisResult, ApiDiagnosisResponse } from '../types';

// 🎨 디자인 변수 정의 (Designer 사양 반영)
const COLORS = {
  primary: '#1A237E', // Dark Blue
  accent: '#FFC100', // Accent Yellow
  background: '#F5F5F5',
  text: '#333333',
};

interface DiagnosisScoreWidgetProps {
  diagnosisId: string;
  initialData: DiagnosisResult | null;
  isLoading: boolean;
}

export const DiagnosisScoreWidget: React.FC<DiagnosisScoreWidgetProps> = ({ diagnosisId, initialData, isLoading }) => {
  const [data, setData] = useState<DiagnosisResult | null>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !initialData) {
      // TODO: 실제 API 호출 로직을 여기에 연결합니다. (api.ts 참조)
      // const fetchData = async () => {
      //   try {
      //     const response = await fetch(`${API_BASE_URL}/diagnosis_score/${diagnosisId}`);
      //     if (!response.ok) throw new Error('Failed to fetch data');
      //     const result: ApiDiagnosisResponse = await response.json();
      //     setData(result.resultData);
      //   } catch (err) {
      //     setError(err.message);
      //   }
      // };
      // fetchData();
    }
  }, [isLoading, initialData]);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>⏳ 데이터 로딩 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>❌ 오류 발생: {error}</div>;
  }

  if (!data) {
    return <div style={{ textAlign: 'center', padding: '20px', border: `1px solid ${COLORS.primary}`, borderRadius: '8px' }}>🔍 진단 결과를 불러오는 중...</div>;
  }

  // 📊 Gap Score 시각화 (Designer 사양 반영)
  const renderScoreCard = (label: string, score: number) => {
    const colorClass = score > 70 ? 'bg-green-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div style={{ padding: '15px', borderRadius: '8px', backgroundColor: `${COLORS.primary}20`, borderLeft: `5px solid ${COLORS.accent}`, margin: '10px 0' }}>
        <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: COLORS.text }}>{label}</div>
        <div style={{ fontSize: '2.5em', fontWeight: 'extrabold', color: COLORS.primary, marginTop: '5px' }}>{score}%</div>
      </div>
    );
  };

  return (
    <div style={{ padding: '30px', backgroundColor: COLORS.background, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: COLORS.primary, borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: '10px' }}>학생 성장 리포트</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {renderScoreCard('성장 지표 (Growth)', data.growthScore)}
        {renderScoreCard('참여도 지표 (Engagement)', data.engagementScore)}
        {renderScoreCard('수익화 잠재력 (Monetization)', data.monetizationScore)}
        <div style={{ padding: '15px', backgroundColor: COLORS.primary, color: 'white', borderRadius: '8px', marginTop: '20px' }}>
          **Gap Score Depth**: {data.gapScoreDepth}% 
          {/* Gap Score 시각화 추가 로직은 추후 구현 */}
        </div>
      </div>

      {/* 추이 데이터 영역 (향후 채워질 부분) */}
      <h3 style={{ marginTop: '30px', color: COLORS.text }}>성장 추이</h3>
      <div style={{ height: '200px', backgroundColor: '#EFEFEF', border: `1px solid ${COLORS.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {data.trendData && data.trendData.map((trend, index) => (
          <div key={index} style={{ margin: '0 10px', textAlign: 'center' }}>
            <span style={{ color: COLORS.primary }}>{trend.date}</span>: G:{trend.growth}% E:{trend.engagement}% M:{trend.monetization}%
          </div>
        ))}
      </div>

    </div>
  );
};