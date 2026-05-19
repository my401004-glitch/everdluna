'use server'; // Next.js Server Action임을 명시

import { DiagnosisApiResponse, UserDiagnosisInputs, DiagnosisResult } from '@/types/diagnosis';

/**
 * [POST /api/diagnosis] 
 * 사용자의 진단 데이터를 받아 AI 분석을 수행하고 결과를 반환하는 엔드포인트입니다.
 * @param body - 클라이언트가 전송한 UserDiagnosisInputs 객체
 * @returns DiagnosisApiResponse 형태의 JSON 데이터
 */
export async function POST(body: UserDiagnosisInputs): Promise<DiagnosisApiResponse> {
  console.log(`[API LOG] 수신된 진단 요청 타입: ${body.diagnosisType}`);
  
  // --- [!!! 핵심 로직 수행 구역 !!!] ---
  // 1. (DB Check) Body의 userId로 기존 학습 기록 조회 및 권한 검증 (RBAC 적용 필요)
  // 2. (AI Process) body.userAnswers를 기반으로 화성학 분석 AI 호출 (외부 API 연동 예상)
  // 3. (Model Update) 계산된 KPI를 Diagnosis_Results 테이블에 저장하고 트랜잭션 커밋

  try {
    // Mock 데이터 반환: 실제로는 복잡한 비즈니스 로직을 거쳐야 함
    const mockResult: any = {
      overallGapScore: Math.floor(Math.random() * 100) + 30, // 임의의 Gap Score (최소 30점부터 시작하도록 설정)
      isSuccessful: true,
      summaryMessage: "현재 화성학 지식 습득에 상당한 격차(Gap)가 발견되었습니다. 핵심은 병진행과 기능적 관계 재정립입니다.",
      kpis: {
        growthScore: Math.random(), 
        engagementScore: Math.random() * 0.8 + 0.2, // 최소 점수 보장
        monetizationPotential: Math.random() > 0.7 ? 0.9 : 0.3 // 임의로 유료 모듈 필요성을 높게 설정할 확률을 부여
      },
      detailedReportData: {
        weakestAreas: [
          { areaName: "화성 기능 이해", score: Math.floor(Math.random() * 20) + 60, recommendation: "도미넌트 코드의 해결 관계를 집중적으로 학습해야 합니다." },
          { areaName: "음정 편차 패턴", score: Math.floor(Math.random() * 20) + 50, recommendation: "화성적 맥락에서의 음정을 재점검하세요." }
        ],
        scoreBreakdown: { Harmony: Math.floor(Math.random() * 30) + 60, PitchDeviation: Math.floor(Math.random() * 20) + 50 }
      }
    };

    return {
      status: 'success',
      message: "진단 분석이 완료되었습니다.",
      data: mockResult as DiagnosisResult,
    };

  } catch (error) {
    console.error("[API ERROR] 진단 처리 중 오류 발생:", error);
    return {
      status: 'error',
      message: `서버 내부 오류로 진단을 완료할 수 없습니다. (${(error as Error).message})`,
      data: undefined,
    };
  }
}

export const dynamic = 'force-dynamic'; // 캐싱 없이 매 요청마다 동적 처리함을 명시합니다.