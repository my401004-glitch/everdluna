import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DiagnosisScoreComponent from '../../components/DiagnosisScoreComponent';
import * as apiService from '../../api/ApiService';

// Mock API Service를 사용하여 실제 백엔드 호출을 가로챕니다.
jest.mock('../../api/ApiService', () => ({
    default: {
        fetchDiagnosisScore: jest.fn(),
        validateUserRole: jest.fn(),
    }
}));

describe('E2E Diagnosis Flow Validation (Edge Cases)', () => {
    const mockApiService = apiService as jest.Mocked<typeof apiService>;

    // 1. 필수 데이터 누락/형식 오류 테스트
    it('should display an error message when essential diagnosis data is missing or malformed', async () => {
        // Mock API가 '필수 필드 누락' 에러를 반환하도록 설정
        mockApiService.default.fetchDiagnosisScore.mockResolvedValue({ 
            error: true, 
            message: "Missing mandatory KPI values (Growth/Engagement required)." 
        });

        render(<DiagnosisScoreComponent />);
        // 버튼 클릭 시 비동기 호출을 시뮬레이션
        const diagnoseButton = screen.getByRole('button', { name: /진단 시작/i });
        await fireEvent.click(diagnoseButton);

        // 에러 메시지 표시 여부 확인
        expect(screen.getByText(/필수 데이터가 누락되었습니다:/i)).toBeInTheDocument();
    });

    // 2. 권한 기반 접근 제어 (RBAC) 실패 테스트 - 가장 중요함!
    it('should block access and show an error if the user lacks necessary diagnosis role', async () => {
        // Mock API가 '권한 부족' 에러를 반환하도록 설정
        mockApiService.default.validateUserRole.mockResolvedValue(false); // 권한 없음
        mockApiService.default.fetchDiagnosisScore.mockRejectedValue(new Error("Authorization Failed: Insufficient Role"));

        render(<DiagnosisScoreComponent />);
        const diagnoseButton = screen.getByRole('button', { name: /진단 시작/i });
        await fireEvent.click(diagnoseButton);

        // 권한 부족 경고 메시지 확인
        expect(screen.getByText(/접근할 수 없습니다. 관리자나 유료 구독이 필요합니다./i)).toBeInTheDocument();
    });

    // 3. 백엔드 시스템 오류 테스트 (System Down)
    it('should display a fallback message when the backend API call fails due to system error', async () => {
        // Mock API가 일반적인 서버 에러(500)를 발생시키도록 설정
        mockApiService.default.fetchDiagnosisScore.mockRejectedValue(new Error("Server Unavailable (HTTP 503)"));

        render(<DiagnosisScoreComponent />);
        const diagnoseButton = screen.getByRole('button', { name: /진단 시작/i });
        await fireEvent.click(diagnoseButton);

        // 시스템 장애 메시지 확인
        expect(screen.getByText(/현재 진단 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요./i)).toBeInTheDocument();
    });

     // 4. 성공 케이스 (기존 테스트 유지)
    it('should correctly display the diagnosis score and metrics upon successful API call', async () => {
        const mockSuccessData = { 
            score: 85, 
            details: { growth: 0.7, engagement: 0.9, monetization: 0.6 } 
        };

        mockApiService.default.validateUserRole.mockResolvedValue(true); // 권한 있음
        mockApiService.default.fetchDiagnosisScore.mockResolvedValue(mockSuccessData); // 성공 데이터 반환

        render(<DiagnosisScoreComponent />);
        const diagnoseButton = screen.getByRole('button', { name: /진단 시작/i });
        await fireEvent.click(diagnoseButton);

        // 정상적인 점수 표시 확인
        expect(screen.getByText(/당신의 진단 점수는 85점입니다./i)).toBeInTheDocument();
    });
});