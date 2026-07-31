/**
 * @module AuthMiddleware
 * @description 모든 P0 기능 엔드포인트에 적용되는 권한 기반 접근 제어 미들웨어 계층입니다.
 * 이 미들웨어를 통과하지 못하면, 사용자의 역할이나 구독 상태와 무관하게 API 호출은 실패(403 Forbidden)해야 합니다.
 */

import { Request, Response, NextFunction } from 'express'; // Express를 가정합니다. 실제 프레임워크에 맞게 수정 필요.
import { UserRole, SubscriptionTier } from '../types/userTypes'; // 사용자 타입 정의 파일 (미리 생성되어야 함)
import { dbClient } from '../utils/dbConnection'; // DB 연결 유틸리티

/**
 * 🔑 미들웨어 초기화 함수: 현재 요청에 필요한 권한을 검증합니다.
 * @param requiredRole - 해당 기능을 사용하기 위해 필수적인 최소 역할 (예: UserRole.PREMIUM)
 * @returns {function} Express NextFunction 호환 미들웨어 함수
 */
export const requiresRole = (requiredRole: UserRole) => 
    async (req: Request, res: Response, next: NextFunction) => {
        // [STEP 1] 요청 헤더 또는 세션에서 사용자 ID 및 현재 Role을 가져옵니다.
        const userId = req.user?.id; // 인증 성공 시 req 객체에 user payload가 담겨있다고 가정
        if (!userId) {
            return res.status(401).json({ message: '인증 실패: 사용자 ID를 찾을 수 없습니다.' });
        }

        try {
            // [STEP 2] DB에서 사용자의 현재 활성 Role과 구독 등급 정보를 가져옵니다.
            const userProfile = await dbClient.query(
                `SELECT role, subscription_tier FROM users WHERE id = $1`, 
                [userId]
            );

            if (!userProfile || !userProfile.rows) {
                 return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            const actualRole = userProfile.rows[0].role;
            const actualTier = userProfile.rows[0].subscription_tier;

            // [STEP 3] 실제 Role이 요구되는 최소 Role보다 낮은지 비교합니다. (RBAC 체크)
            if (!isHigherRole(actualRole, requiredRole)) {
                console.warn(`[ACCESS DENIED]: User ${userId} attempted access to role ${requiredRole} but only has ${actualRole}.`);
                return res.status(403).json({ message: '권한 부족: 이 기능을 사용하려면 상위 권한이 필요합니다.' });
            }

            // [STEP 4] (추가 검증) 구독 등급을 통해 접근 제한이 있는지 확인합니다.
            if (requiredRole === UserRole.PREMIUM && actualTier !== SubscriptionTier.PAID) {
                return res.status(403).json({ message: '유료 기능입니다. 유료 플랜으로 업그레이드해주세요.' });
            }

            // 모든 검증 통과 시 다음 미들웨어/컨트롤러로 요청을 전달합니다.
            next(); 

        } catch (error) {
            console.error('AuthMiddleware Error:', error);
            res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
        }
    };

/**
 * @private
 * 역할의 계층 구조를 비교하는 유틸리티 함수입니다. (ENUM 값 순서에 의존)
 * 실제로는 DB 스키마에서 정수형(INT)으로 정의된 '권한 레벨'을 사용해야 합니다.
 */
const isHigherRole = (actual: UserRole, required: UserRole): boolean => {
    // 임시 구현: Role enum의 숫자 순서를 이용한다고 가정합니다.
    return actual >= required; 
};

/**
 * 특정 API 호출 전에 필수적으로 실행되는 핵심 미들웨어입니다.
 * 이 함수는 모든 P0 엔드포인트에 적용되어야 합니다.
 */
export const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
    // 실제 구현에서는 JWT 토큰 검증 등 더 복잡한 인증 로직이 들어갑니다.
    console.log("--- Authentication Middleware Running ---");
    next(); 
};

/**
 * @example
 * router.get('/premium-report', checkAuthentication, requiresRole(UserRole.PREMIUM), diagnosisController.getPremiumReport);
 */
// export default { checkAuthentication, requiresRole }; // 실제 파일 구조에 맞게 수정 필요