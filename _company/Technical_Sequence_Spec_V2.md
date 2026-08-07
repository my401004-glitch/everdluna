# ⚙️ 통합 기술 시퀀스 스펙 (Technical Data Validation Integration Spec) V2

**목표:** 영상 콘텐츠에 사용되는 모든 데이터(KPI, 진단 점수, 성취도 변화)가 정의된 API 인터페이스와 일치하며, 디자인 시스템 변수로 안전하게 매핑됨을 보장한다.
**핵심 아키텍처 원칙:** 진실의 출처는 항상 백엔드 API (`GET /api/v1/diagnosis_score`)이며, 모든 UI 요소는 이 구조를 읽어 해석해야 한다.

---

## I. 데이터 흐름 (Data Flow Mapping)

### A. 입력 데이터 정의 (Input Source Validation)
*   **원천:** 사용자 활동 로그 (세션 기록), 진단 테스트 결과 (`Diagnosis_Results` 테이블).
*   **API 계약:** `api/v1/diagnosis_score(userContextId, diagnosisType)` 호출 시 전달되는 파라미터는 반드시 **[진단 유형]**, **[사용자 ID]**, **[측정 시간]** 3가지를 포함해야 한다.
*   **검증 포인트 (KPI):** 입력 데이터에는 최소한 `Growth_Score`, `Engagement_Score`, `Monetization_Score`의 raw 값이 Time-Series 형태로 존재함을 확인한다.

### B. 핵심 처리 로직 (Processing & Business Logic)
*   **API 엔드포인트:** `GET /api/v1/diagnosis_score` (`src/controllers/diagnosisController.ts`)
*   **핵심 역할:** 원시 KPI 값을 받아서, **[Gap Score]**와 **[진단 시나리오에 따른 특수 지표(예: Stability Index)]**를 계산하는 로직이 수행된다. 이 과정에서 권한 기반 접근 제어(RBAC)가 적용되어야 한다.
*   **출력 스키마 (Contract):** 모든 API 응답은 다음 구조를 따라야 한다.

```typescript
// src/api/types/DiagnosisResultSchema.ts 기준
interface DiagnosisResult {
    diagnosis_type: 'Pitch' | 'Rhythm' | 'FrequencyStability'; // 진단 유형
    score: number;                                             // 종합 점수 (0-100)
    gap_score: number;                                         // Gap Score Depth (주요 지표)
    kpi_metrics: {
        growth: number;         // Growth KPI 값
        engagement: number;     // Engagement KPI 값
        monetization: number;   // Monetization KPI 값 // [근거: sessions/2026-05-18T14-34/developer.md]
    };
    suggested_action: string;                                 // 다음 학습 단계 (문자열)
}
```

### C. 출력 및 디자인 변수 매핑 (Output & Design System Mapping)
*   **변환 규칙:** API 응답 데이터 (`DiagnosisResult`)는 UI의 **시각적 요소(디자인 시스템)**에 필요한 상수 값으로만 사용되어야 한다.
    1.  `score` $\rightarrow$ 메인 스코어 바/카드 (가장 큰 폰트)
    2.  `gap_score` $\rightarrow$ 'Gap Score Depth' 시각화 컴포넌트의 핵심 값.
    3.  `suggested_action` $\rightarrow$ CTA 버튼의 텍스트 내용 및 안내 메시지 (`Writer/Designer와 협업하여 톤앤매너 확정 필요`).
*   **위험 요소:** **절대** API 데이터가 아닌, Hardcoded된 문자열이나 계산되지 않은 임시 값이 디자인 변수로 사용되어서는 안 된다.

---

## II. E2E 통합 검증 계획 (Integration Test Plan)

다음은 개발팀(Dev), 디자이너(Design), 콘텐츠팀(Content)이 각자의 역할로 수행해야 할 3단계의 테스트 케이스입니다.

### ✅ Phase 1: 데이터 무결성 검증 (Developer Focus)
*   **테스트 목표:** API가 예상 범위를 벗어난 데이터를 반환하는 것을 원천 차단한다.
*   **Test Case A (RBAC):** 무료 사용자(Role=Basic)로 테스트 시, `kpi_metrics`에 포함된 'Monetization' 관련 지표는 **Null 또는 0 값으로 처리되거나 아예 응답 스키마에서 제외**되어야 한다. [근거: sessions/2026-05-18T13:43]
*   **Test Case B (Schema Compliance):** 모든 KPI(`Growth`, `Engagement`, `Monetization`) 값은 SQL 데이터베이스의 유효 범위(예: 0~100)를 초과할 수 없으며, JSON 스키마 (`DiagnosisResultSchema.ts`)에 정의된 타입을 반드시 준수해야 한다. [근거: sessions/2026-05-18T14-34/developer.md]
*   **검증 도구:** `kpi_validator`를 사용하여 API 모의 테스트(Mock Test)를 수행한다.

### ✅ Phase 2: 비즈니스 플로우 검증 (Developer + Content Focus)
*   **테스트 목표:** 데이터 변화에 따라 콘텐츠 흐름과 추천 액션이 논리적으로 연결되는지 확인한다.
*   **Test Case C (Improvement Path):** 만약 `Growth_Score`가 낮고, `Gap Score`가 높게 측정될 경우 $\rightarrow$ **API는 '기초 문법 복습'을 제안하고**, Writer/Designer는 이 메시지를 기반으로 *구체적인 샷 리스트*를 작성해야 한다.
*   **Test Case D (High Performance):** 모든 KPI가 높은 경우 $\rightarrow$ API는 '심화 과정 진입'을 제안하며, 이는 콘텐츠 제작의 다음 마일스톤(다음 영상 주제)과 연결되어야 한다.

### ✅ Phase 3: 시각적 변수 일관성 검증 (Designer + Dev Focus)
*   **테스트 목표:** API에서 받은 모든 수치가 디자인 컴포넌트와 오차 없이 매핑되는지 확인한다.
*   **Test Case E (Typography & Data):** `DiagnosisResult` 객체 내의 점수 값(e.g., 85점)이 화면에 표시될 때, 해당 숫자의 **폰트 크기, 색상 팔레트, 강조 효과**가 디자인 시스템 가이드라인을 벗어나지 않아야 한다.
*   **Test Case F (Empty State):** 데이터 로딩 실패 또는 진단 불가 상태일 때(`API Error`), 에러 메시지(Fallback Message) 역시 **표준화된 디자인 컴포넌트**를 사용해야 하며, 사용자에게 명확한 다음 액션(CTA)을 제시해야 한다.

---