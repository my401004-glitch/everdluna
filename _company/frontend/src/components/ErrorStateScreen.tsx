import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 최근 생성한 모킹 API를 가져옵니다. [근거: 29분 전]
import { fetchDiagnosisScore, DiagnosisResult } from '../api/mockDiagnosisApi'; 

/**
 * ErrorStateScreen 컴포넌트: 진단 실패 로그를 기반으로 시각화되는 에러 화면 프로토타입.
 * 데이터 로딩 상태, 성공, 실패 케이스를 모두 처리하도록 설계되었습니다.
 */
const ErrorStateScreen: React.FC = () => {
    // 1. 상태 관리 (Loading, Success Data, Error)
    const [diagnosisData, setDiagnosisData] = useState<DiagnosisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 2. 데이터 로딩 함수 정의 (API 호출)
        const loadDiagnosisData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log("Attempting to fetch diagnosis score...");
                // API 호출 시뮬레이션: 실제 환경에서는 사용자 세션 ID 등을 포함해야 함.
                const result = await fetchDiagnosisScore(); 
                setDiagnosisData(result);
            } catch (err) {
                console.error("Failed to load diagnosis data:", err);
                setError('진단 데이터 로드에 실패했습니다. 네트워크를 확인하거나 잠시 후 다시 시도해주세요.');
            } finally {
                setIsLoading(false);
            }
        };

        loadDiagnosisData();
    }, []); // 컴포넌트 마운트 시 한 번 실행

    // 3. 상태별 렌더링 로직 (State Machine)
    if (isLoading) {
        return <div className="p-10 text-center">⚙️ 진단 데이터를 불러오는 중입니다... 잠시만 기다려주세요.</div>;
    }

    if (error) {
        // 에러 상태 화면 렌더링: 사용자에게 친절하게 실패 원인을 안내해야 합니다. [근거: CEO 지시사항]
        return <div className="p-10 bg-red-50 border-l-4 border-red-500 text-red-700">
            <h2 className="text-xl font-bold mb-3">🚨 진단 실패 안내</h2>
            <p>{error}</p>
        </div>;
    }

    if (!diagnosisData) {
        return <div className="p-10 text-center text-gray-500">표시할 데이터가 없습니다.</div>;
    }


    // 4. 성공 상태: 핵심 정보 시각화
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">✅ 당신의 진단 결과</h2>

            {/* 4.1. Gap Score 시각화 (핵심 KPI) */}
            <div className="mb-8 p-6 bg-yellow-50 rounded-lg shadow-md" style={{ borderLeft: '5px solid #FFC300' }}>
                <h3 className="text-xl font-bold text-[#FFC300] mb-2">📈 Gap Score (잠재력 격차)</h3>
                <p className="text-4xl font-extrabold text-gray-800">{diagnosisData.gapScore}</p>
                <p className="text-sm text-gray-600 mt-1">발견된 최대 성장 기회 영역입니다.</p>
            </div>

            {/* 4.2. 진단 요약 및 컨텍스트 */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-3">🔍 핵심 분석 결과: {diagnosisData.contextId}</h3>
                <p className="text-lg mb-4">{diagnosisData.summary}</p>
                
                {/* Growth, Engagement, Monetization KPI 카드 구조화 */}
                <div className="flex space-x-6">
                    {[
                        { label: '성장 잠재력 (Growth)', value: diagnosisData.kpis.growth },
                        { label: '참여도 측정 (Engagement)', value: diagnosisData.kpis.engagement },
                        { label: '수익화 가능성 (Monetization)', value: diagnosisData.kpis.monetization }
                    ].map((kpi, index) => (
                        <div key={index} className="flex-1 p-4 border rounded-lg bg-gray-50">
                            <p className="text-sm font-semibold text-gray-600 mb-1">{kpi.label}</p>
                            <span className={`text-3xl font-bold ${kpi.value > 'High' ? 'text-green-600' : kpi.value < 'Low' ? 'text-red-600' : 'text-blue-600'}`}>{kpi.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4.3. 상세 실패 로그 테이블 (진단 세부 항목) */}
            <div className="mt-10">
                <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">📊 세부 진단 실패 로그</h3>
                <table className="min-w-full bg-white border divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">항목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">발생 유형</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">상세 내용 (Fail Message)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* 실제 진단 데이터 배열을 순회하며 렌더링하는 로직이 필요합니다. */}
                        {diagnosisData.failureLogs?.map((log, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.type}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${log.severity === 'Critical' ? 'text-red-500 font-semibold' : 'text-yellow-500'}`}>{log.severity}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ErrorStateScreen;