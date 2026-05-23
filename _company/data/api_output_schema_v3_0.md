# 📊 Gap Score 진단 API 결과물 스키마 명세서 (V3.0)
## 🚀 목적 및 비즈니스 목표
이 스키마의 최우선 목표는 **최소한의 투자로 시장 반응을 확인하는 MVP 단계**에서, 단순 정보 제공을 넘어 사용자의 '성장 과정에 대한 객관적 증명'이라는 가치를 전달하여 유료 모듈 구매(Conversion)를 유도하는 것입니다.
*   **핵심 KPI:** CTR 극대화 (Pain Point 자극 → Gain 제시), Conversion Rate 확보 (Gap Score 기반 트레이닝 패키지 판매).

## 💻 API Output Structure (JSON Schema Draft)
```json
{
  "status": "success",
  "diagnosis_report": {
    "user_id": "uuid-12345",
    "test_date": "2026-05-23T...",
    "summary_narrative": "[AI가 작성하는 핵심 문구: 사용자가 가장 공감할 만한 Pain Point 요약. (예: 호흡은 좋으나 감정 전달이 약함)]",
    "overall_gap_score": {
      "value": 45, // Gap Score (0~100). 숫자로 강렬하게 제시.
      "description": "현재 레벨(L1) 대비 목표 레벨(L2)까지 필요한 성장 폭.",
      "implication": "[이 점수가 의미하는 바: 즉각적인 해결의 필요성을 자극하는 문구.]"
    },
    "detailed_kpi_analysis": {
      "technical": {
        "index_name": "Pitch Deviation Index",
        "current_score": 72.5,
        "target_gap": "최소 N% 개선 필요",
        "improvement_plan": "전문 코치 A의 '음정 정교화 모듈' 학습 권장." // <-- CTA 연결점
      },
      "emotional": {
        "index_name": "Emotional Consistency Score",
        "current_score": 55.0,
        "target_gap": "일관성 확보가 시급함",
        "improvement_plan": "실전 감정 표현 워크시트 B를 통해 서사 구축 연습 필요." // <-- CTA 연결점
      },
      "breath_efficiency": {
        "index_name": "호흡 효율 점수",
        "current_score": 85.0,
        "target_gap": "유지력 증가가 핵심 과제",
        "improvement_plan": "1:1 호흡 패턴 분석 및 개인화된 운동 루틴 제공 필요." // <-- CTA 연결점
      }
    },
    "actionable_recommendation": {
      "priority_module": "[가장 점수가 낮고, 유료 모듈이 있는 영역]",
      "suggested_path": "Gap Score를 줄이기 위해 가장 먼저 투자해야 할 3가지 핵심 액션.",
      "cta_link": "/purchase/starter-pack", // 이 링크로 바로 연결되어야 함.
      "value_proposition": "단순 점수 비교가 아닌, **성장 서사**와 **다음 단계의 구체적 로드맵**을 제공합니다."
    }
  }
}
```

## 📝 기술 요구사항 (Kodari에게 전달)
1.  **데이터 구조 보강:** 기존 KPI 필드를 유지하되, 각 KPI마다 `implication` 및 `improvement_plan`이라는 **'비즈니스/교육적 해석' 필드**를 반드시 추가해야 합니다. 이는 단순 점수 제공을 막고 '해결책 제시'로 가치를 높이는 핵심 장치입니다. [근거: sessions/2026-05-18T13-43/developer.md]
2.  **CTA 강제 로직:** `actionable_recommendation` 필드는 가장 낮은 점수를 받은 KPI를 최우선으로 배치하고, 해당 KPI에 대한 유료 모듈(Module)을 명확히 연결해야 합니다. 이 로직은 백엔드에서 반드시 우선순위를 지정하도록 코딩되어야 합니다.

## 🔍 최종 검토 및 테스트 가이드
*   **Test Case 추가:** 기존의 데이터 누락/범위 초과 테스트 케이스 외에, **'CTA가 명확하게 제시되는지 여부'**를 최우선으로 검증해야 합니다. (예: 모든 KPI 분석 결과 이후, 반드시 '다음 액션(Next Step)' 필드가 존재해야 함.)