/**
 * @fileoverview 진단 점수(DiagnosisScore)를 계산하는 핵심 비즈니스 로직 서비스 레이어.
 * 이 파일은 외부 API 요청에 직접 노출되지 않으며, 테스트의 대상이 됩니다.
 */

import { UserContext } from '../types'; // 가상의 타입 정의
import { DiagnosisInput } from './diagnosisTypes'; 

/**
 * 진단 점수를 계산하여 구조화된 객체를 반환합니다.
 * 이 로직은 KPI(Growth, Engagement, Monetization) 산출 규칙을 따릅니다.
 * @param input - 진단을 위한 필수 데이터 입력값.
 * @param userContext - 사용자의 현재 컨텍스트 (예: 구독 레벨).
 * @returns 계산된 DiagnosisScore 객체.
 */
export const calculateDiagnosisScore = async (
    input: DiagnosisInput, 
    userContext: UserContext
): Promise<{ score: number; kpis: { growth: number; engagement: number; monetization: number } }> => {
    
    // [Critical Check] 권한 기반 접근 제어 (RBAC) 로직 선행 검증. 
    if (!['Premium', 'Pro'].includes(userContext.subscriptionLevel)) {
        throw new Error("Unauthorized access: Premium/Pro 레벨 사용자만 상세 진단 점수를 확인할 수 있습니다.");
    }

    // --- 핵심 KPI 계산 로직 (Business Rules) ---
    
    // 1. Growth Score (성장 잠재력): 주로 학습량 및 활동 빈도 기반
    const growthScore = Math.min(100, input.studyHours * 0.6 + input.practiceCount * 0.4);

    // 2. Engagement Score (몰입도/습관화): 지속적인 접속과 참여도를 측정
    let engagementScore = 50; // 기본 점수
    if (input.lastLoginDays < 7) {
        engagementScore += 20; // 최근 활동 보너스
    } else if (input.lastLoginDays > 30) {
        engagementScore -= 15; // 이탈 위험 감지 페널티
    }

    // 3. Monetization Score (수익화 기회): 유료 기능 사용 및 패턴 분석 기반
    const monetizationScore = input.hasUsedPremiumFeature ? 75 : 40;

    // 최종 점수는 세 KPI의 가중 평균을 통해 계산합니다.
    const finalScore = Math.round((growthScore * 0.3 + engagementScore * 0.4 + monetizationScore * 0.3) / 10);


    return {
        score: finalScore,
        kpis: {
            growth: Math.max(0, growthScore),
            engagement: Math.max(0, engagementScore),
            monetization: Math.max(0, monetizationScore)
        }
    };
};

/** 
 * 진단 점수 계산을 위한 공통 예외 처리 함수 (Utility).
 */
export const handleDiagnosisError = (error: Error): string => {
    console.error("진단 서비스 오류 발생:", error.message);
    if (error.message.includes("Unauthorized access")) {
        return "권한 부족: 더 상세한 진단 점수를 확인하려면 유료 플랜으로 업그레이드해주세요.";
    }
    // 기타 로직 에러는 시스템 안정성을 위해 일반 메시지로 처리합니다.
    return "진단 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.";
};