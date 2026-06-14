/**
 * @description 사용자 상호작용(Interaction) 로그를 기록하는 서비스 레이어.
 * 모든 클라이언트 요청은 이 로직을 거쳐야 합니다. (Centralized Logging Point)
 */

import { Request, Response } from 'express'; // 가정: Express 환경
import { LogPayload } from '../types/logTypes'; 

/**
 * 로그 기록 유효성 검사 및 DB 트랜잭션 처리를 담당합니다.
 * @param payload - 전송된 상호작용 데이터
 * @returns Promise<boolean> - 성공적으로 로깅되었는지 여부
 */
export const logUserInteraction = async (payload: LogPayload): Promise<boolean> => {
    // 1. 필수 필드 검증 (Guard Clause)
    if (!payload.userUuid || !payload.contextSessionId || !payload.interactionType) {
        console.warn("🚫 로그 기록 실패: 필수 사용자/세션 정보가 누락되었습니다.");
        return false;
    }

    // 2. 데이터 정규화 및 클렌징 (Data Cleaning)
    const normalizedPayload = {
        userUuid: payload.userUuid,
        contextSessionId: payload.contextSessionId,
        interactionType: payload.interactionType.toUpperCase(), // 일관된 케이스 유지
        timestamp: new Date().toISOString(),
        elementSelector: payload.elementSelector || null,
        dataPayload: payload.dataPayload ? JSON.stringify(payload.dataPayload) : null,
        isCritical: payload.isCritical || false
    };

    try {
        // 3. DB 트랜잭션 호출 (실제 구현 시 Prisma/TypeORM 등 ORM 사용)
        // 예시: await db.userInteractionLog.create(normalizedPayload);
        console.log(`✅ [LOG SUCCESS] User ${payload.userUuid} logged interaction type: ${normalizedPayload.interactionType}`);
        return true;

    } catch (error) {
        console.error("🚨 데이터베이스 로깅 실패:", error);
        // DB 연결 문제 등 심각한 오류 발생 시, 시스템 관리자에게 알림이 가도록 처리 필요.
        throw new Error("Logging service unavailable."); 
    }
};