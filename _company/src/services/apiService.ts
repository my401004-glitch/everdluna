/**
 * Diagnosis API Service Layer (data fetching logic)
 * @description 실제 백엔드 호출 로직을 담당하며, 비즈니스 로직 분리(SRP)의 원칙에 따라 설계함.
 */

import { DiagnosisScoreResponse } from '../types/diagnosisTypes';

// 가상의 API 엔드포인트입니다. 환경변수 사용이 필수적입니다.
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1'; 

/**
 * 진단 점수를 비동기적으로 가져오는 함수.
 * @param contextId - 현재 사용자의 세션 또는 컨텍스트 ID. (필수)
 * @returns Promise<DiagnosisScoreResponse> - 성공 시 진단 스코어 데이터.
 */
export const fetchDiagnosisScore = async (contextId: string): Promise<DiagnosisScoreResponse> => {
    console.log(`[API Service] Fetching diagnosis score for context ID: ${contextId}`);

    try {
        // 실제 환경에서는 axios 등을 사용하여 API 호출을 수행해야 합니다.
        const response = await fetch(`${BASE_URL}/diagnosis_score?contextId=${contextId}`); 

        if (!response.ok) {
            // HTTP 에러 코드 처리 (4xx, 5xx)
            throw new Error(`API Request failed with status: ${response.status} (${response.statusText})`);
        }

        const data: DiagnosisScoreResponse = await response.json();
        return data;

    } catch (error) {
        console.error("🚨 [Critical Error] Failed to fetch diagnosis score:", error);
        // 에러를 다시 던져서 호출한 쪽에서 처리하게 함 (Fail Fast 원칙).
        throw new Error(`데이터 로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
};

/**
 * 만약 더 복잡한 데이터가 필요하다면, 다른 API 함수를 추가합니다.
 */
export const fetchUserProgress = async (userId: string): Promise<any> => {
    // ... 로직 구현 예정
    return {};
}