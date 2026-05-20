import { useState, useEffect } from 'react';
import * as api from '../api/diagnosisApi'; // 가상의 API 모듈
import { DiagnosisResultSchema } from '../types/schema'; // 진단 결과 타입

// Backend에서 정의된 상세 에러 구조를 가정합니다.
export interface ApiErrorDetail {
  field: string;       // 유효성 검사가 실패한 필드 이름 (e.g., 'pitch_stability')
  message: string;     // 사용자에게 보여줄 오류 메시지 (e.g., "음정의 일관성이 부족합니다.")
}

export interface DiagnosisState {
  data: DiagnosisResultSchema | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorDetails: ApiErrorDetail[] | null; // 백엔드에서 받은 상세 에러 목록
  errorMessage: string | null;            // 사용자에게 보여줄 요약 메시지 (e.g., "진단에 실패했습니다.")
}

/**
 * 진단 점수 API를 호출하고, 성공/실패 상태와 상세 오류를 관리하는 커스텀 훅.
 * 이 훅은 모든 클라이언트 측 데이터 로직을 단일 책임 원칙(SRP)으로 분리합니다.
 */
export const useDiagnosisScoreData = (userId: string): DiagnosisState => {
  const [state, setState] = useState<DiagnosisState>({
    data: null,
    isLoading: true,
    isSuccess: false,
    isError: false,
    errorDetails: null,
    errorMessage: null,
  });

  useEffect(() => {
    const fetchScoreData = async () => {
      setState(s => ({ ...s, isLoading: true, isSuccess: false, isError: false }));
      try {
        // 1. API 호출 (가정): 실제로는 axios 등을 사용합니다.
        // 이 Mock 함수는 백엔드의 성공/실패 시나리오를 모방합니다.
        const response = await api.getDiagnosisScore(userId); 

        if (!response || !response.data) {
          throw new Error("API 응답 데이터가 누락되었습니다.");
        }

        // 2. 성공 상태 처리 및 전역 상태 업데이트
        setState({
          data: response.data,
          isLoading: false,
          isSuccess: true,
          isError: false,
          errorDetails: null,
          errorMessage: null,
        });

      } catch (e) {
        // 3. 실패 상태 처리 및 상세 오류 매핑 (핵심 로직!)
        const error = e as Error;
        let details: ApiErrorDetail[] | null = null;
        let message: string = "데이터를 불러오는 중 예기치 않은 문제가 발생했습니다.";

        // 백엔드에서 구조화된 에러 객체를 받았는지 확인 (HTTP 400 등의 경우)
        if (error.response && error.response.errors) {
          details = error.response.errors; // [근거: ValidationUtility의 출력 형태]
          message = "진단 점수를 계산하기 위한 입력 데이터에 오류가 있습니다. 아래 내용을 확인해주세요.";
        } else if (error instanceof Error) {
          // 기타 일반적인 에러 처리
          details = null; 
          message = error.message;
        }

        setState({
          data: null,
          isLoading: false,
          isSuccess: false,
          isError: true,
          errorDetails: details,
          errorMessage: message,
        });
      }
    };

    fetchScoreData();
  }, [userId]);

  return state;
};