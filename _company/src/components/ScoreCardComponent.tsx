/**
 * 진단 점수 카드를 표시하고, 데이터 로드 및 에러 처리를 담당하는 컴포넌트입니다.
 */
import React, { useState, useEffect } from 'react';
import { fetchDiagnosisScore } from '../services/apiService';
import { DiagnosisScoreResponse } from '../types/diagnosisTypes';

// Mock Props를 정의하여 재사용성을 높입니다.
interface ScoreCardProps {
    contextId: string; // 이 컴포넌트가 필요로 하는 진단 컨텍스트 ID
}

const ScoreCardComponent: React.FC<ScoreCardProps> = ({ contextId }) => {
    // 💡 상태 관리 (State Management)를 통해 로딩, 성공, 에러 세 가지 케이스를 모두 처리해야 안정적임.
    const [scoreData, setScoreData] = useState<DiagnosisScoreResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 컴포넌트 마운트 시 API 호출 실행
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // 🚨 실제 비동기 로직을 사용함.
                const data = await fetchDiagnosisScore(contextId); 
                setScoreData(data);
            } catch (err) {
                setError((err as Error).message || "알 수 없는 데이터 로드 오류");
                setScoreData(null);
            } finally {
                setIsLoading(false); // 성공/실패 관계없이 반드시 종료해야 함.
            }
        };

        loadData();
    }, [contextId]); // contextId가 변경될 때만 재실행 (Dependency Array)


    // 🎨 JSX 렌더링 로직: 상태에 따라 다른 UI를 보여줘야 합니다.
    if (isLoading) {
        return <div className="score-card loading">데이터 로딩 중... 안정성을 검증하고 있습니다. ⚙️</div>;
    }

    if (error) {
        // 에러 발생 시, 사용자에게 명확한 메시지와 함께 재시도 버튼을 제공하는 것이 UX/안정성 관점입니다.
        return <div className="score-card error">⚠️ 데이터 로드 실패: {error}. 나중에 다시 시도해 주세요.</div>;
    }

    if (!scoreData) {
        return <div className="score-card empty">진단 점수 데이터를 찾을 수 없습니다.</div>;
    }


    // ✅ 모든 상태가 정상일 때, 최종 결과를 출력합니다.
    const { overallDiagnosisScore, riskLevel, kpiMetrics } = scoreData;

    return (
        <div className="score-card success">
            <h1>🎯 진단 점수: {overallDiagnosisScore}%</h1>
            <p>위험 레벨: <span style={{ color: getRiskColor(riskLevel) }}>{riskLevel}</span></p>
            
            <h3>핵심 KPI 분석</h3>
            <div className="kpi-grid">
                <div>
                    <h4>성장 가능성 (Growth)</h4>
                    <p>{kpiMetrics.growthScore}%</p> {/* Data Binding */}
                </div>
                <div>
                    <h4>참여도 (Engagement)</h4>
                    <p>{kpiMetrics.engagementScore}%</p>
                </div>
                <div>
                    <h4>수익 잠재력 (Monetization)</h4>
                    <p>{kpiMetrics.monetizationScore}%</p>
                </div>
            </div>
        </div>
    );
};

// 🎨 Helper function: 시각적 피드백을 위한 보조 함수 정의
const getRiskColor = (level: 'Low' | 'Medium' | 'High'): string => {
    switch(level) {
        case 'High': return 'red';
        case 'Medium': return 'orange';
        default: return 'green';
    }
};

export default ScoreCardComponent;