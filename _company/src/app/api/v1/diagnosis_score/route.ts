import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const contextId = request.nextUrl.searchParams.get('contextId') || 'DefaultPath';
  console.log(`[API LOG] GET /api/v1/diagnosis_score called with contextId: ${contextId}`);

  // Mock data satisfying the FE's DiagnosisScoreVisualizer property expectations
  const mockResponse = {
    title: "화성학 및 발성 종합 진단 결과",
    overallScore: 78,
    grade: "Developing",
    painPointSummary: "현재 화성 기능 분석 결과, 도미넌트 모션 해결 관계에서 취약점이 발견되었습니다.",
    gainPotentialStatement: "공명 주파수의 최적 해결과 3화음 복합 리듬 연습을 병행하면 2주 내 음정 안정도 15% 개선이 가능합니다.",
    kpiMetrics: [
      {
        description: "Growth (성장 잠재력)",
        score: 85,
        level: "High"
      },
      {
        description: "Engagement (참여도)",
        score: 62,
        level: "Medium"
      },
      {
        description: "Monetization (수익화 잠재력)",
        score: 70,
        level: "High"
      }
    ]
  };

  return NextResponse.json(mockResponse);
}

export const dynamic = 'force-dynamic';
