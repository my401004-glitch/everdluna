# 🔍 디자인 데이터 무결성 체크리스트 (Design Data Integrity Checklist)

## 🎯 목적
Designer가 확정한 'Pain $\rightarrow$ Gain' 시각화 Master Guide를 백엔드 API와 DB 스키마에 완벽하게 매핑하여, 모든 진단 결과가 누락 없이 정확히 표현됨을 보장합니다.

## 🧪 핵심 검증 지표: Gap Score (진단 점수)
Gap Score는 단순한 수치가 아니라 'Pain'과 'Gain'의 **비율적 관계**를 나타내므로, 계산에 필요한 최소 데이터 입력값이 정의되어야 합니다.

### 1. 필수 Input Metrics 및 유효성 검증
| 지표 | 산출 근거 (데이터 소스) | DB 스키마 필드 | 필수 값 유형 | 검증 로직/제약사항 |
| :--- | :--- | :--- | :--- | :--- |
| **Pain Metric ($P_{score}$)** | 현재 상태의 부족함. 진단 테스트 결과 기반 (예: Current Engagement Level). | `diagnosis_results.current_score` 또는 관련 KPI 필드 | Float (0-100) | 💡 $P_{score} = \text{MIN}(\text{HistoryAvg}, \text{TestResult})$ 로 정의되는지 확인해야 함. (최소 비교 기준 필요) |
| **Gain Metric ($G_{score}$)** | 솔루션 적용 시 기대하는 최대치. 잠재력 기반 (예: Max Potential Score). | `diagnosis_results.potential_score` 또는 관련 KPI 필드 | Float (0-100) | 💡 $G_{score} = \text{MAX}(\text{IndustryAvg}, \text{SubscriptionTierBonus})$ 등 로직을 포함하여 정의해야 함. |
| **Context ID** | 진단이 발생한 특정 시점의 사용자 상황/맥락. | `diagnosis_results.context_id` (FK) | UUID / String | 이 필드가 필수적으로 기록되어야, 추후 리포팅에서 해당 Gap Score를 재현 가능함. |

### 2. 데이터 흐름 및 API 연동 계약 (API Contract Verification)
1.  **Input**: 사용자가 진단 테스트 완료 $\rightarrow$ `POST /api/v1/diagnosis_score` 호출.
2.  **Process (Backend)**:
    *   **Step A (RBAC Check):** 사용자 권한(Role) 체크 및 접근 가능한 KPI(`Growth`, `Engagement`, `Monetization`) 리스트 확보. [근거: sessions/2026-05-18T13:43]
    *   **Step B (Score Calculation):** $P_{score}$, $G_{score}$를 계산하고, 이 과정에서 **'Gap Score = $G_{score} - P_{score}$'** 공식을 사용한다. $\rightarrow$ 이 공식의 예외 처리 로직(예: $P_{score} > G_{score}$)이 정의되어야 함.
    *   **Step C (Persistence):** 계산된 3가지 스코어($P, G, Gap$)와 관련 KPI를 `Diagnosis_Results` 및 `KPI_Metrics`에 트랜잭션으로 기록한다. [근거: sessions/2026-05-18T43/]
3.  **Output**: 프론트엔드 컴포넌트에 전송되는 JSON 응답은 반드시 다음 스키마를 따르야 한다.

```json
{
  "diagnosis_id": "uuid",
  "timestamp": "datetime",
  "scores": {
    "pain_score": 75, // P_score (Dark Blue 배경 위의 Yellow)
    "gain_score": 92, // G_score (Yellow 강조)
    "gap_score": 17 // Gap Score (가장 중요!)
  },
  "metrics": {
    "growth_kpi": 0.85,
    "engagement_kpi": 0.62,
    "monetization_kpi": 0.40
  }
}
```

### 3. 최종 보강 요구사항 (Critical Action Items)
1.  **Gap Score 정의 공식화**: $P_{score}$와 $G_{score}$를 계산하는 **정확한 비즈니스 로직(Formula)**을 백엔드 문서에 최우선으로 기록해야 합니다. 현재는 '관계'만 알고 있을 뿐, 구체적인 수식과 가중치($w_1 P + w_2 G$)가 필요합니다.
2.  **데이터 갱신 주기 명시**: 진단 점수가 시간이 지남에 따라 어떻게 변하는지(재진단 주기)를 정의하고, 그 빈도에 맞춰 데이터 모델의 만료일(`ExpirationDate`) 또는 재계산 로직을 추가해야 합니다.