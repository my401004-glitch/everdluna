# 📄 API 통합 개발 사양서 (v1.0 - 초안)

## 🎯 목표: 진단 결과 화면(Diagnosis Result Screen) 컴포넌트 구현 상세화
**목표 기능:** 사용자가 AI 진단 테스트를 완료하고, `/api/v1/diagnosis_score` API 호출을 통해 받은 `result_data`를 기반으로, 디자인 목업과 동일한 구조의 성과 보고서를 사용자에게 제시한다.

### 1. 핵심 데이터 흐름 (Flow)
1.  **Trigger:** 사용자가 테스트 완료 버튼 클릭.
2.  **API Call:** 클라이언트가 `/api/v1/diagnosis_score` POST 요청 전송 (필수 파라미터: `context_id`, `session_data`).
3.  **Backend Processing:** 백엔드가 데이터를 처리하고, 진단 점수와 핵심 메시지(서사)를 포함한 JSON 응답을 반환.
4.  **Frontend Rendering:** 프론트엔드 컴포넌트가 수신된 JSON 데이터의 각 필드를 매핑하여 UI에 표시.

### 2. 필수 API 요청/응답 스펙 (Focus: `result_data` 구조)

#### A. 예상 응답 JSON 포맷 (`response_body`)
```json
{
  "status": "success",
  "diagnosis_id": "UUID-12345",
  "score_data": {
    "overall_score": 85, // 전체 점수 (KPI)
    "pain_points": [
      {"skill": "호흡 지지력", "level": "Weak", "description": "발성 시 호흡 압력이 불규칙합니다."},
      {"skill": "음정 정확도", "level": "NeedsImprovement", "description": "고음역대에서 미세한 음정 흔들림이 관찰됩니다."}
    ],
    "achievement_areas": [
      {"skill": "가창 스타일 이해도", "level": "Good", "description": "곡의 분위기를 잘 파악하고 있습니다."},
      // ... 기타 강점 영역
    ]
  },
  "storytelling": { // 서사 구조와 동기 부여 요소
    "title": "당신의 성장은 이 변곡점에서 시작됩니다.", 
    "summary_message": "지금의 노력은 분명한 데이터로 증명되고 있습니다. 다음 단계는...",
    "next_action_prompt": "추가 코칭 모듈을 통해 [호흡 지지력] 개선에 집중해야 합니다." // CTA 유도 핵심 메시지
  },
  "metadata": {
    "generated_at": "2026-05-19T10:00:00Z",
    "user_id": "USR-AABBCC"
  }
}
```

#### B. 컴포넌트별 데이터 매핑 요구사항 (Designer & Developer)
| UI 영역 | 표시할 내용 | 데이터 소스 필드 | 비고/디자인 고려사항 |
| :--- | :--- | :--- | :--- |
| **전체 점수 위젯** | `overall_score` | `score_data.overall_score` | 가장 크게 배치하며, 긍정적 피드백 컬러(#4CAF50) 사용 필수. |
| **Pain Point 목록** | `pain_points[].skill`, `description` | `score_data.pain_points` 배열 | '🚨' 경고 아이콘과 함께 제시하여 심리적 충격을 유도해야 함 (마케팅 핵심). |
| **강점/성취 영역** | `achievement_areas[].skill`, `description` | `score_data.achievement_areas` 배열 | 긍정적인 피드백을 주어 동기 부여를 강화하는 서사적 배치 필요. |
| **다음 스텝 가이드** | `storytelling.next_action_prompt` | `storytelling.next_action_prompt` | 이 부분이 곧 유료 모듈 결제(CTA)로 연결되는 핵심 문구여야 함. |