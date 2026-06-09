// src/controllers/diagnosisController.ts - Diagnosis Score API Controller
import { Request, Response } from 'express';
import { dbClient } from '../config/dbClient'; // 데이터베이스 클라이언트 가정
import * as UserService from '../services/userService';

/**
 * @description 진단 점수 계산 및 DB 트랜잭션 커밋 처리 (핵심 로직)
 * @param req - 요청 객체. 반드시 user_id를 포함해야 함.
 * @param res - 응답 객체.
 */
export const getDiagnosisScore = async (req: Request, res: Response) => {
    // 1. [Validation] 사용자 ID 필수 체크 및 인증 과정 시뮬레이션
    const { user_id } = req.body; // 요청 바디에서 user_id를 받도록 수정 가정
    if (!user_id || typeof user_id !== 'string' || !isValidUUID(user_id)) {
        return res.status(401).json({ message: "Unauthorized: Missing or invalid User ID." });
    }

    // 2. [Service] 실제 진단 점수 계산 로직 호출 (Mock)
    try {
        // 이 부분에서 복잡한 AI/데이터 분석 로직이 실행되어 scores 객체를 산출합니다.
        const { gapScore, potentialPoints } = await calculateDiagnosisMetrics(req.body);

        if (!gapScore || !potentialPoints) {
            return res.status(500).json({ message: "Failed to calculate diagnosis metrics." });
        }

        // 3. [Transaction Start] DB 트랜잭션 시작 및 데이터 영구 기록 (핵심)
        await dbClient.transaction(async (tx) => {
            const resultId = uuidv4(); // 새로운 결과 ID 생성

            // A. Diagnosis_Results 테이블에 진단 로그 기록
            await tx('diagnosis_results')
                .insert({
                    result_id: resultId,
                    user_id: user_id, // <--- User ID 강제 삽입
                    diagnosis_type: 'GapScore',
                    context_id: req.body.content_source || 'unknown',
                    score_data: JSON.stringify({ gapScore: gapScore, potentialPoints: potentialPoints }),
                });

            // B. KPI_Metrics 테이블에 Growth/Engagement 등 개별 지표 기록
            await tx('kpi_metrics')
                .insert([
                    { user_id: user_id, diagnosis_result_id: resultId, kpi_type: 'Growth', value: Math.round(gapScore) },
                    // ... 다른 KPI들 추가 가능 (Engagement, Monetization 등)
                ]);

            console.log(`[SUCCESS] User ${user_id}의 진단 결과가 성공적으로 트랜잭션 커밋됨.`);
        });


        res.status(200).json({ 
            message: "Diagnosis score calculated and saved successfully.", 
            data: { gapScore, potentialPoints } 
        });

    } catch (error) {
        console.error("Error during diagnosis processing:", error);
        // 트랜잭션 실패 시 에러 로그 및 사용자에게 피드백 제공
        res.status(500).json({ message: "Internal server error during scoring process." });
    }
};

// Mock 함수 정의 (실제 프로젝트에서는 별도 서비스 파일로 분리되어야 함)
const isValidUUID = (uuid: string): boolean => { /* UUID 검증 로직 */ return true; };
const uuidv4 = () => 'mock-uuid-123'; 
const calculateDiagnosisMetrics = async (input: any) => ({ gapScore: Math.floor(Math.random() * 100), potentialPoints: Math.floor(Math.random() * 200) });