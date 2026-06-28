/**
 * @fileoverview Diagnosis Score 계산 및 데이터 처리를 위한 핵심 타입 정의 (Data Contract).
 * 이 파일의 구조는 백엔드와 프론트엔드의 API 명세서 역할을 합니다.
 */

import { UserRole } from '../UserAuth.js'; // Assume existing type for user roles

/**
 * 1. 입력 데이터 스키마: 클라이언트가 서버에 전송하는 진단 요청 데이터.
 * @param diagnosisType - 사용자가 받은 진단 유형 (예: 'Vocal_Gap', 'Rhythm_Weakness').
 * @param contextId - 이 진단 결과를 연결할 사용자 컨텍스트 ID.
 */
export interface DiagnosisRequestInput {
    diagnosisType: string; // 예시: "vocal_gap"
    contextId: string;     // DB의 Context ID와 매칭되는 고유 식별자
}

/**
 * 2. 핵심 결과 스키마: API가 성공적으로 반환하는 최종 진단 점수 객체.
 * Designer가 정의한 Modular Data Flow Module과 일관성을 유지해야 합니다.
 */
export interface DiagnosisScoreOutput {
    scoreLevel: 'Beginner' | 'Intermediate' | 'Advanced'; // 난이도 레벨
    overallScore: number;                                  // 종합 점수 (0~100)
    kpis: {                                                // KPI Metrics 별도의 구조화된 데이터
        growthIndex: number;     // 성장 잠재력 지수
        engagementRate: number; // 참여율/몰입도 지수
        monetizationPotential: number; // 유료 전환 가능성 (가장 중요)
    };
    recommendationText: string;                            // 사용자에게 제공할 핵심 메시지 텍스트
    recommendedAction: {                                    // 다음 단계의 행동 가이드
        componentName: 'TitleCard' | 'DataFlowModule';     // 어느 모듈을 사용해야 할지 지시
        instruction: string;
    };
}

/**
 * 3. 사용자 권한 및 에러 처리 타입 정의
 */
export interface ApiErrorResponse {
    errorCode: number;
    message: string;
    details?: any;
}

// 추가적인 공통 상수나 열거형이 필요하면 여기에 정의합니다.
// 예시: RoleBasedAccessControl에 사용되는 권한 목록 등.
// export const USER_ROLES: UserRole[] = ['Free', 'Premium', 'Mentor'];