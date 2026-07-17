# 🛠️ API 인터페이스 사양 및 기술 검증 데이터 계약서 (V2.0)

## 📄 개요: 진단 서비스 백엔드 스펙 정의
이 문서는 AI 보컬 진단 서비스를 위한 모든 프론트엔드/마케팅 자산의 **데이터 근거(Source of Truth)** 역할을 합니다. 디자이너와 라이터는 여기에 명시된 데이터 필드명과 값을 기준으로 시각화 및 카피라이팅을 진행해야 합니다.

## 1. 핵심 엔드포인트: 진단 점수 조회
**GET /api/v1/diagnosis_score/{contextId}**

*   **역할:** 특정 사용자의 보컬 역량에 대한 종합적인 분석 결과를 제공합니다.
*   **요청 파라미터 (Query Params):**
    *   `userId`: 진단을 받은 사용자 ID (필수)
    *   `diagnosis_type`: 요청하는 진단 유형 (예: 'VocalRange', 'RhythmControl') [근거: sessions/2026-05-18T13:43/developer.md]
*   **반환 데이터 스키마 (JSON Payload):**

```json
{
  "contextId": "UUID_of_Session",
  "status": "SUCCESS",
  "timestamp": "2026-07-17T10:30:00Z",
  "diagnosisScore": {
    "raw_score": 85, // 전체 역량 종합 점수 (0~100)
    "gapScore": 4.2, // [핵심 마케팅 지표] 현재 레벨과 목표 간의 격차(Gap). 이 수치가 클수록 니즈가 높음.
    "score_explanation": "현재 당신은 중급 단계에 도달했으며, 주력해야 할 영역은 '호흡 제어'입니다." // 사용자에게 전달할 구체적 해석 텍스트
  },
  "kpiMetrics": { // 핵심 지표 배열 (KPIs)
    "Growth": {
      "score_value": 0.75, // 성장 잠재력: 향상시킬 수 있는 부분의 비율 (0~1). [근거: sessions/2026-05-18T14-34/developer.md]
      "user_facing_title": "📈 잠재적 성장 가능성", // 마케팅에 사용될 제목
      "explanation": "현재 학습 방식만으로는 최고 레벨까지 도달하기 어렵습니다."
    },
    "Engagement": {
      "score_value": 0.62, // 참여도/몰입도: 지속 가능한 연습의 가능성 (0~1). [근거: sessions/2026-05-18T14-34/developer.md]
      "user_facing_title": "💡 일관된 학습 습관", 
      "explanation": "단발적인 노력보다는 체계적이고 지속적인 연습이 필요합니다."
    },
    "Monetization": {
      "score_value": 0.88, // 가치/실현 가능성: 시장에서 인정받을 수 있는 결과물 수준 (0~1). [근거: sessions/2026-05-18T14-34/developer.md]
      "user_facing_title": "🏆 전문 역량 레벨", 
      "explanation": "현재의 성취도는 충분히 높은 수준이나, 전문화된 기술이 부족합니다."
    }
  },
  // RBAC 체크: 이 데이터는 사용자 권한(Role)에 따라 접근 제한 여부가 결정되어야 함.
  "accessControlRequired": true 
}
```

## 2. 마케팅 자산 활용 가이드 (Design/Copy Guideline)

| 기술 지표 | 마케팅 해석 (Pain Point 유도) | 시각적 표현 방법 | CTA 연결 고리 (Solution) |
| :--- | :--- | :--- | :--- |
| **`gapScore`** (높을수록 좋음) | "지금 이대로는 안 됩니다!" / "치명적인 격차가 발생했습니다." | 하락 그래프, 빨간색 경고 표시. | Gap Score를 줄여줄 수 있는 'AI 시스템' 제시. |
| **`Growth` (낮을 때)** | "노력만으로는 한계가 있습니다." / "막연한 감각에 의존하고 계신가요?" | 정체된 그래프, 퍼즐 조각이 빠진 그림. | 체계적인 로드맵(커리큘럼) 제공 필요성 강조. |
| **`Engagement` (낮을 때)** | "지속 가능한 루틴이 없습니다." / "매번 포기하는 패턴에 갇혀있습니다." | 시계를 나타내는 아이콘, 흐릿한 반복 작업 이미지. | 시스템화된 동기 부여 및 관리 기능(Dashboard) 제공 필요성 강조. |
| **`Monetization` (낮을 때)** | "실제 시장에서 인정받는 수준이 아닙니다." / "합격이라는 결과가 보이지 않습니다." | 낮은 점수대, '미달' 표시, 벽에 부딪힌 실루엣. | 검증된 데이터와 포트폴리오를 만들어주는 솔루션(우리의 서비스) 제시. |

---