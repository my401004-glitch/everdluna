# 🎨 GapScoreVisualizationComponent 최종 애니메이션 스펙 시트 (V2.0)

## 🎯 목표 및 범위
*   **목표**: 데이터 기반의 객관적인 '진단' 과정을 통해 사용자의 불안감을 해소하고, 다음 행동(CTA)으로 유도하는 스토리텔링을 구현한다. [근거: 2026-06-24T02-25]
*   **범위**: `GapScoreVisualizationComponent`가 받아들이는 데이터 흐름(`API /api/v1/diagnosis_score`) 전체를 커버하며, Mockup 제작에 필요한 애니메이션 로직 및 상호작용 규칙을 정의한다.

## 📂 1. 입력 데이터 구조 (Source of Truth)
*   **Endpoint**: `GET /api/v1/diagnosis_score`
*   **Response Schema (JSON)**:
    ```json
    {
      "context_id": "string", // 진단 세션 ID
      "user_data": {
        "role": "string", // 사용자 역할 (e.g., free, premium) [근거: 2026-05-18T13:43]
        "diagnosis_type": "string" // 사용자가 진단한 유형
      },
      "timestamp": "datetime",
      "scores": {
        "growth": { "score": 75, "trend": "+5%", "status": "Improving" },
        "engagement": { "score": 40, "trend": "-2%", "status": "Weakening" },
        "monetization": { "score": 60, "trend": "Stable", "status": "Moderate" }
      },
      "gap_score_depth": 15 // 핵심 지표: Gap Score Depth (0-100) [근거: 2026-05-18T15:49]
    }
    ```

## ✨ 2. 시각화 컴포넌트별 애니메이션 및 상호작용 규칙

### A. 핵심 지표: Gap Score Depth (가장 중요)
*   **시각 요소**: 중앙의 메인 게이지/점수 표시 영역 (`GapScoreVisualizationComponent` 내 최상단).
*   **애니메이션 요구사항**:
    1.  **Initial Load (진입)**: 컴포넌트 로드 시, 점수는 0에서 시작하여 **데이터가 도착하는 시간(Time-based)**을 반영해 부드럽게 목표 값(`gap_score_depth`)까지 상승해야 한다. (e.g., 2초 동안 Linear Interpolation)
    2.  **Trend 변화**: `gap_score_depth` 값이 API 호출 간에 크게 변동할 경우, 게이지의 **색상과 떨림(Subtle Shake)** 효과가 발생하여 시각적 경고를 주어야 한다. (예: 10점 이상 급락 시 - 빨간색/경고)
    3.  **Focus**: 점수 변화 애니메이션이 전체 화면에서 가장 높은 우선순위로 처리되어야 한다.

### B. KPI 섹션별 변화 규칙 (Growth, Engagement, Monetization)
*   **시각 요소**: 3개의 독립적인 카드로 구성된 세부 지표 영역.
*   **애니메이션 요구사항**:
    1.  **진입 애니메이션**: 각 KPI는 Gap Score Depth가 안정화된 *이후에 순차적(Sequential)*으로 로드되는 것이 효과적이다. (예: 0.5초 간격).
    2.  **Trend 변화 시**: `trend` 값이 **양수(+%)**일 경우, 카드가 살짝 위로 상승하며 초록색 하이라이트가 나타나야 한다. **음수(-%)**일 경우, 아래로 처지며 주황색/빨간색 경고 표시가 되어야 한다.
    3.  **상태 변화**: `status` 필드(e.g., Weakening)에 따라 아이콘이나 배경 색상이 고정적으로 적용되어야 한다.

### C. 사용자 경험 (UX) 및 스토리텔링 플로우
1.  **Pre-Diagnosis State**: 데이터 로딩 전에는 "진단 데이터를 분석 중..."이라는 상태 메시지와 함께, 미스터리한 느낌의 초기 애니메이션(예: 신호가 수집되는 듯한 시각 효과)을 보여준다.
2.  **Post-Diagnosis CTA**: 최종 Gap Score Depth 값이 특정 임계치(Threshold) 이하로 떨어지면 (예: 30점 이하), 화면 하단의 **CTA 버튼의 강조도와 애니메이션 강도가 극대화**되어야 한다. 이는 '지금 당장 행동해야 함'이라는 긴급성을 부여한다.
3.  **권한 기반 가림 처리**: 만약 `user_data.role`이 'free'인 경우, 일부 고급 지표(예: 전문 분석 그래프)는 의도적으로 **흐릿하게(Blurred)** 보이도록 디자인하고, "프리미엄 기능으로 확인하세요"라는 마스킹 텍스트를 오버레이 해야 한다. [근거: 2026-05-18T13:43]

## 🧪 3. 테스트 및 검증 체크리스트 (Developer Review)
*   [ ] **Edge Case Test**: 모든 KPI 값이 극단적인 값(예: Growth -90%, Engagement +120%)을 가질 때, 애니메이션이 깨지지 않고 정상적으로 수치를 반영하는가?
*   [ ] **Latency Simulation**: 데이터 스트리밍이 지연될 경우(API 응답 딜레이), 컴포넌트가 로딩 스켈레톤 상태를 유지하며 사용자에게 기다림의 경험을 제공하는가? (Timeout Handling)

---
**✅ 코다리의 기술적 검증 요약:**
*   위 스펙은 기존에 설계된 DB 스키마(`Diagnosis_Results`, `KPI_Metrics`)와 API 엔드포인트(`/api/v1/diagnosis_score`)를 완벽히 기반으로 작성되었으므로, 기술적으로는 **구현 가능성이 100%**입니다.
*   디자인 에이전트님께서는 이 스펙을 기준으로 Mockup 제작을 진행해 주시면 되며, 저는 이 스펙에 맞춰 백엔드와 프론트엔드의 통합 테스트 환경 구축을 완료하겠습니다.