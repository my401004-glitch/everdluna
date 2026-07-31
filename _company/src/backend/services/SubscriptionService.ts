// src/backend/services/SubscriptionService.ts (P0-1 기반 스켈레톤)

import { User } from '../../models/User';
import { DiagnosisResultDto } from '../../dto/DiagnosisResult';

/**
 * @description 사용자 권한에 따른 데이터 접근 가능 여부를 검증하는 핵심 서비스 레이어
 * [WHY] 유료 전환 퍼널의 가장 중요한 방화벽 역할을 수행합니다.
 */
export class SubscriptionService {

    private static readonly FREE_TIER_LIMITS = ['growth', 'engagement']; // 무료 사용자에게는 Growth와 Engagement만 기본 노출 가능

    /**
     * 주어진 사용자가 특정 진단 타입에 대해 상세 결과를 볼 권한이 있는지 검사합니다.
     * @param user - 현재 인증된 사용자 객체 (User 모델)
     * @param diagnosisType - 요청된 진단의 유형 ('basic', 'advanced', etc.)
     * @returns boolean - 접근 가능 여부
     */
    public static hasAccess(user: User, diagnosisType: string): boolean {
        // TODO: DB에서 사용자의 구독 상태를 로드하는 비동기 호출이 필요함.
        const isPremium = user.subscriptionStatus === 'PREMIUM'; 

        if (diagnosisType === 'basic') return true; // 모든 사람이 기본 진단은 가능

        if (isPremium) {
            return true; // 프리미엄 사용자는 무조건 접근 허용
        }

        // TODO: 실제 로직에서는 user.role과 diagnosisType을 매칭하는 복잡한 비즈니스 규칙이 필요함.
        console.warn(`[SECURITY ALERT] Non-premium user attempted access to advanced type: ${diagnosisType}`);
        return false; 
    }

    /**
     * 주어진 진단 결과 DTO를 사용자 권한에 맞춰 마스킹하여 반환합니다.
     * @param resultDto - 백엔드에서 계산된 전체 진단 결과 데이터
     * @param user - 현재 인증된 사용자 객체
     * @returns DiagnosisResultDto - 사용자가 볼 수 있는 제한적인 결과 데이터
     */
    public static maskResults(resultDto: DiagnosisResultDto, user: User): DiagnosisResultDto {
        const masked = { ...resultDto };

        // 1. 권한 체크를 통해 특정 KPI 필드를 제거하거나 기본값으로 대체합니다.
        if (!this.hasAccess(user, resultDto.diagnosisType)) {
            masked.kpis['monetization'] = null; // 유료 모듈의 핵심 데이터는 마스킹
            // 기타 민감한 데이터를 순회하며 처리...
        }

        return masked;
    }
}