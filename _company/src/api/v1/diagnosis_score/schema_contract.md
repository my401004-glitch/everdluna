# 📊 Diagnosis Score API 통합 데이터 계약서 (V2.0 - Final Contract)
## 목적
이 문서는 프론트엔드(React Component)와 백엔드(FastAPI Controller)가 공유하는 `DiagnosisScore` 데이터를 정의합니다. 디자인팀의 Pain $\rightarrow$ Gain 시각화 요구사항을 기술적으로 구현 가능하도록 최소한의 무결성을 확보하는 것이 목표입니다.

## 1. 데이터 요청 구조 (Input Payload - POST /api/v1/diagnosis_score)
| 필드명 | 타입 | 설명 | 제약 조건 | [근거] |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | UUID | 진단을 수행하는 사용자 ID. (RBAC 검증 필수) | Null 불가 | [선행 지식] |
| `diagnosis_type` | Enum/String | 요청된 진단 유형 (e.g., 'VocalGrowth', 'Engagement'). | 미리 정의된 값만 허용 | [근거: sessions/2026-05-18T13:43/developer.md] |
| `raw_answers` | JSON Array | 사용자가 제출한 원본 응답 데이터 배열. | 최소 1개 이상 | - |

## 2. 확장된 백엔드 스키마 제안 (DiagnosisFactor 테이블 추가)
기존 KPI(`Growth`, `Engagement`, `Monetization`)는 여전히 최상위 레벨의 지표로 남고, 그 근본 원인을 추적하기 위해 새로운 Fact 테이블을 도입합니다.

**Table: `diagnosis_factor`**
*   **FK:** `result_id` (Diagnosis_Results 참조)
*   **Factor Name:** 진단 요소 이름 (예: '기초 음정 정확도', '장르 적응력')
*   **Factor Type:** Pain 또는 Gain. **(필수 필드)** [근거: Designer의 P $\rightarrow$ G 흐름]
*   **Score:** 해당 요소에 대한 점수 (0-100).
*   **Weight:** 이 요소를 구성하는 KPI에 미치는 가중치 (0.1 ~ 5.0).

## 3. API 응답 구조 (Output Payload - GET /api/v1/diagnosis_score)
프론트엔드가 화면을 그리기 위해 필요한 모든 정보를 단일 JSON 객체로 제공합니다.

```json
{
    "status": "SUCCESS",
    "metadata": {
        "timestamp": "2026-05-23T18:30:00Z",
        "diagnosis_type": "VocalGrowth",
        "is_premium_access": true 
    },
    "summary_score": {
        "gap_score": 78.5,  // 핵심 지표 (0-100)
        "kpi_breakdown": {   // 상위 KPI 요약
            "growth": 85,      // Growth Score (%)
            "engagement": 62,  // Engagement Score (%)
            "monetization": 70 // Monetization Score (%)
        }
    },
    "visual_factors": [ // P -> G 시각화에 사용될 요소 목록 (가장 중요)
        {
            "factor_name": "기초 음정 정확도",
            "type": "Pain", // Pain or Gain
            "score": 45,      // 낮은 점수는 Pain을 의미
            "description": "음역대 변화에 따른 미세한 떨림이 관찰됩니다.",
            "recommended_action": "워밍업 시 음정 반복 훈련 강화"
        },
        {
            "factor_name": "장르 적응력",
            "type": "Gain", // Gain을 의미하는 요소
            "score": 92,
            "description": "다양한 리듬 패턴에 대한 높은 민감도가 확인되었습니다.",
            "recommended_action": null
        }
    ],
    "recommendations": {
        "next_step": "하모니 파트 집중 학습",
        "resource_link": "/content/harmony-lesson-v3"
    }
}
```

## 4. 테스트 및 검증 계획 (Self-Validation)
1.  **유효성 검사:** `visual_factors` 배열의 모든 요소는 반드시 `type` 필드(Pain 또는 Gain)와 `score`를 가지고 있어야 합니다.
2.  **RBAC 검사:** 만약 사용자가 'Engagement' 리포트에 접근할 권한이 없다면, 응답 전체가 403 Forbidden 에러 코드와 함께 `{ "error": "Insufficient access rights for this diagnosis type." }` 메시지를 반환해야 합니다.