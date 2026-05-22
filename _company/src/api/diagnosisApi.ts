import { DiagnosisApiResponse } from '../types/diagnosis';

/**
 * 백엔드 진단 API를 호출하여 결과를 가져옵니다.
 * @param userId - 사용자 식별자
 * @returns {Promise<DiagnosisApiResponse>} API 응답 객체
 */
export const getDiagnosisScore = async (userId: string): Promise<DiagnosisApiResponse> => {
  const response = await fetch('/api/diagnosis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      diagnosisType: 'Harmony', // 기본값으로 설정
      timestamp: Date.now(),
      userAnswers: [],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || `HTTP error! status: ${response.status}`) as any;
    error.response = errorBody;
    throw error;
  }

  return response.json();
};
