import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiagnosisScoreDisplay from '../DiagnosisScoreDisplay';

// ⚠️ 모킹 대상: API 호출 함수 (예시)
// 실제 프로젝트 구조에 맞춰 apiClient.ts 등을 사용한다고 가정합니다.
const mockFetchDiagnosis = jest.fn();
jest.mock('../api/diagnosisAPI', () => ({
  fetchDiagnosisScore: mockFetchDiagnosis,
}));

describe('DiagnosisScoreDisplay Component Integration Test Suite', () => {
  // 테스트 전후 상태 초기화 (Mocking)
  beforeEach(() => {
    mockFetchDiagnosis.mockClear();
  });

  test('1. 성공적인 데이터 로딩 시 진단 점수와 상세 정보를 정확히 표시해야 한다.', async () => {
    // Mock 구현: API 호출이 성공하고 데이터를 반환하는 경우
    const mockSuccessData = {
      score: 85,
      details: [
        { category: 'Growth', score: 40, description: '지속적인 연습 필요' },
        { category: 'Engagement', score: 30, description: '흥미 유지 양호' },
        { category: 'Monetization', score: 15, description: '수익화 포트폴리오 구축 권장' },
      ],
    };
    mockFetchDiagnosis.mockResolvedValue(mockSuccessData);

    render(<DiagnosisScoreDisplay diagnosisType="AI_ANALYSIS" />);

    // 로딩 상태 확인 (isLoading)
    expect(screen.getByText(/Loading 진단 점수.../i)).toBeInTheDocument();

    // 비동기 대기 후, 최종 결과물 확인
    await waitFor(() => {
      expect(mockFetchDiagnosis).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('heading', { name: /총 진단 점수: 85점/i })).toBeInTheDocument();
    });

    // 상세 항목별 표시 검증
    expect(screen.getByText(/Growth...지속적인 연습 필요/i)).toBeInTheDocument();
    expect(screen.getByText(/Monetization...수익화 포트폴리오 구축 권장/i)).toBeInTheDocument();
  });

  test('2. API 호출 실패 시, 명확한 에러 메시지를 표시하고 버튼을 비활성화해야 한다.', async () => {
    // Mock 구현: API 호출이 Reject 되는 경우 (네트워크 오류 또는 서버 500)
    mockFetchDiagnosis.mockRejectedValue(new Error("Network request failed or server error."));

    render(<DiagnosisScoreDisplay diagnosisType="AI_ANALYSIS" />);

    await waitFor(() => {
      // 로딩 상태가 사라지고 에러 메시지가 나타나는지 확인
      expect(screen.queryByText(/Loading 진단 점수.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/데이터 로드에 실패했습니다./i)).toBeInTheDocument();
    });

    // 버튼 비활성화 검증 (혹은 재시도 버튼의 상태)
    const retryButton = screen.queryByRole('button', { name: /다시 시도/i });
    expect(retryButton).toHaveAttribute('disabled'); // 또는 비활성화된 속성 체크
  });

  test('3. 최초 렌더링 시 로딩 상태를 정확히 표시해야 한다.', () => {
    // Mock 구현: API 호출을 아예 하지 않거나, 테스트 초기 단계로 설정 (Mocking이 바로 실패하는 경우 대비)
    mockFetchDiagnosis.mockResolvedValue(null); // 임시 값으로 처리

    render(<DiagnosisScoreDisplay diagnosisType="AI_ANALYSIS" />);

    expect(screen.getByText(/Loading 진단 점수.../i)).toBeInTheDocument();
  });
});
`;

### ⚙️ Step 3: 환경 변수 관리 및 안전성 검증 (Config)
코드 테스트가 완료되었다면, 다음으로 중요한 것은 **환경 설정의 안정성**입니다. API 키나 기본 URL 같은 민감한 정보는 절대로 하드코딩되면 안 됩니다. 이를 위해 프로젝트 루트에 `.env` 파일을 생성하고, 코드가 `process.env`를 통해 값을 가져오도록 로직을 수정해야 합니다.

<create_file path="./.env">
# ⚙️ API Environment Variables for Diagnosis System
# 이 파일은 .gitignore에 추가되어야 함!

# 기본 API 엔드포인트 (운영 환경)
API_BASE_URL=https://api.azhitartcompany.com/v1

# 진단 점수 계산을 위한 인증 키
DIAGNOSIS_SECRET_KEY="YOUR_SECRET_KEY_HERE"

# 사용 가능한 진단 유형 목록 (예: AI, Manual, QuickTest)
SUPPORTED_DIAGNOSIS_TYPES=AI_ANALYSIS,MANUAL_INPUT,QUICK_TEST