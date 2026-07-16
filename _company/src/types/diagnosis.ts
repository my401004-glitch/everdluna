/**
 * @fileoverview DiagnosisScore 계산을 위한 공통 데이터 구조 및 인터페이스 정의.
 * 이 파일은 API의 '계약서' 역할을 합니다. 모든 컴포넌트는 이 타입을 참조해야 합니다.
 */

// 1. 진단 종류 (Diagnosis Type) - RBAC 체크에 사용되는 핵심 식별자
export type DiagnosisType = 'Growth' | 'Engagement' | 'Monetization' | 'Overall';

/**
 * 사용자 권한 레벨 정의. 어떤 리포트를 볼 수 있는지 제어합니다.
 */
export enum UserRole {
    FreeUser = 1,
    PremiumUser = 2,
    Admin = 3,
}

/**
 * API 요청 시 필요한 기본 입력 데이터 구조. (클라이언트 -> 서버)
 * 학생의 현재 상태와 테스트 결과가 필요합니다.
 */
export interface DiagnosisRequest {
    userId: string; // 사용자 식별자
    role: UserRole; // 현재 사용자의 권한 레벨
    diagnosisType: DiagnosisType; // 요청하는 분석 타입 (Growth, Engagement 등)
    studentProfileData: Record<string, any>; // 학생의 기본 정보 (예: 학년, 현 성적대)
    testResultSnapshot: {
        score: number; // 진단 테스트 총점
        keyIndicators: Record<DiagnosisType, number>; // Growth/Engagement 등 각 KPI별 점수
        rawFeedback: string; // 원본 피드백 텍스트 (추후 LLM 연동용)
    };
}

/**
 * API 응답 스키마. 모든 성공적인 진단 호출의 결과가 이 구조를 따라야 합니다.
 */
export interface DiagnosisResult {
    success: boolean;
    message: string; // 에러 발생 시 사용자 친화적 메시지
    data?: {
        // 1. 종합 점수 (시각적으로 가장 먼저 노출될 핵심 지표)
        overallScore: number;
        overallDiagnosisType: DiagnosisType;

        // 2. KPI별 상세 진단 결과 (Pain -> Gain 구조에 매핑됨)
        kpis: Record<DiagnosisType, {
            score: number; // 해당 분야의 현재 점수
            potentialGapScore: number; // Gap Score (미래 잠재력과의 격차 - 가장 중요한 지표)
            recommendation: string[]; // 구체적인 개선 방안 리스트
        }>;

        // 3. 기술적 검증 데이터 (개발자/백엔드 전용, 디버깅 및 로깅 용도)
        technicalMetadata: {
            sourceApiVersion: 'v1';
            processedTimestamp: string; // ISO Date String
            accessGrantedByRBAC: boolean; // RBAC 통과 여부 기록
        };
    } | null;
}

// API 호출 성공 시 예상되는 결과의 예시 (개발 테스트용)
export const EXAMPLE_SUCCESS_RESULT: DiagnosisResult = {
    success: true,
    message: "진단 점수 계산 및 분석이 완료되었습니다.",
    data: {
        overallScore: 78.5,
        overallDiagnosisType: 'Overall',
        kpis: {
            'Growth': { score: 60, potentialGapScore: 35, recommendation: ["개념 복습 주기 설정", "취약 유형 집중 학습"] },
            'Engagement': { score: 85, potentialGapScore: 10, recommendation: ["학원 커뮤니티 참여 독려"] },
            'Monetization': { score: 72, potentialGapScore: 20, recommendation: ["유료 자료 활용 가이드 제공"] }
        },
        technicalMetadata: {
            sourceApiVersion: 'v1',
            processedTimestamp: new Date().toISOString(),
            accessGrantedByRBAC: true
        }
    }
};