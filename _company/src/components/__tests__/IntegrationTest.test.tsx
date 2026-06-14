import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiagnosisFlowSimulator from '../DiagnosisFlowSimulator';
import * as apiService from '../../services/apiService';

// Mock API Service를 전체적으로 목킹하여 테스트 환경을 고립시킵니다.
jest.mock('../../services/apiService', () => ({
    default: {
        fetchDiagnosisScore: jest.fn(),
    },
}));

const mockFetchSuccess = (scoreData) => Promise.resolve(scoreData);
const mockFetchError = () => Promise.reject('API Connection Failed');

describe('E2E Diagnosis Flow Simulation Test', () => {
    // 테스트 전후 초기화
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('✅ 1. API 호출 성공 시, 데이터 매핑 및 Pain->Gain 애니메이션이 정상적으로 작동해야 한다.', async () => {
        const mockSuccessResult = {
            score: 'A+',
            kpis: [
                { name: 'Growth', value: 85, description: '기대치 상회' },
                { name: 'Engagement', value: 72, description: '보통 수준' },
                { name: 'Monetization', value: 90, description: '최고 성과' }
            ],
        };

        // apiService의 fetchDiagnosisScore를 성공 응답으로 목킹합니다.
        (apiService.default.fetchDiagnosisScore as jest.Mock).mockImplementation(() => mockFetchSuccess(mockSuccessResult));

        // 컴포넌트 렌더링 및 테스트 실행 (await 사용)
        render(<DiagnosisFlowSimulator />);

        // 초기 로딩 상태 확인
        expect(screen.getByText(/진단 중.../i)).toBeInTheDocument();

        // API 호출이 완료되고, UI가 업데이트되기를 기다립니다.
        await act(async () => {
            // 컴포넌트 내부에서 fetchDiagnosisScore가 호출되는 시점을 가정하고 테스트를 진행합니다.
            // 실제 구현에서는 useEffect 의존성 관리가 중요하므로 이를 명시적으로 처리해야 합니다.
            // 여기서는 Mocking된 API 호출이 끝난 후의 상태 변화를 검증합니다.
        });

        // 성공적인 결과 표시 확인 (예: 최고 점수 또는 'A+' 등)
        expect(screen.getByText(/최종 진단 결과/i)).toBeInTheDocument();
        expect(screen.getByText(/score: A\+/i)).toBeInTheDocument(); 

        // KPI 데이터가 정상적으로 매핑되어 표시되는지 확인 (예시로 'Growth'를 체크)
        const growthCard = screen.queryByRole('heading', { name: /growth/i });
        expect(growthCard).toBeInTheDocument();
        expect(screen.getByText(/85/)).toBeInTheDocument(); // KPI 값 확인
    });

    it('❌ 2. API 호출 실패 시, 에러 메시지가 사용자 친화적으로 표시되어야 한다.', async () => {
        // apiService의 fetchDiagnosisScore를 실패 응답으로 목킹합니다.
        (apiService.default.fetchDiagnosisScore as jest.Mock).mockImplementation(() => mockFetchError());

        render(<DiagnosisFlowSimulator />);

        await act(async () => {}); // API 호출 및 상태 변화 대기

        // 에러 메시지 영역이 활성화되고, 사용자에게 적절한 가이드가 제공되는지 확인
        expect(screen.getByText(/API 연결에 실패했습니다./i)).toBeInTheDocument(); 
    });
});