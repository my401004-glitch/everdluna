import React from 'react';
import AdCard from './components/AdCard';

const App: React.FC = () => {
  return (
    <div className="p-10 space-y-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3">🚀 AdCard Dynamic Rendering Test Suite</h1>

      {/* A/B 그룹 'A' (Loss Area) 테스트 */}
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">🧪 1. Loss Area Group ('A') - 불안감 자극</h2>
        <AdCard dynamicData={/* Mock Data Pass */ } abTestGroupOverride={'A'} />
      </div>

      {/* A/B 그룹 'B' (Authority Bias) 테스트 */}
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🧪 2. Authority Group ('B') - 권위 강조</h2>
        <AdCard dynamicData={/* Mock Data Pass */ } abTestGroupOverride={'B'} />
      </div>

      {/* 기본/제어 그룹 (Control) 테스트 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">🧪 3. Control Group ('Default') - 안전장치</h2>
        <AdCard dynamicData={/* Mock Data Pass */ } abTestGroupOverride={'Control'} />
      </div>
    </div>
  );
};

export default App;