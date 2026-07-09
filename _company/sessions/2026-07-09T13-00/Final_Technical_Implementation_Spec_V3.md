# 🚀 DiagnosisScoreWidget: 최종 기술 구현 사양서 (V3.0)
## 🎯 목적 및 범위
본 문서는 'VideoEditor_Handover_Package_V2'의 모든 시각적 요구사항과 본 프로젝트가 채택한 State Machine 로직을 완벽하게 통합하여, 외부 개발팀이 별도의 질의 없이 즉시 구현할 수 있는 최종 엔지니어링 계약서 역할을 합니다.

## 🏗️ 1. 시스템 아키텍처 개요 (System Architecture)
*   **프론트엔드(Client):** React/Next.js 기반 컴포넌트 라이브러리 사용. 상태 관리는 Redux Toolkit 또는 Zustand를 통해 중앙 집중화합니다.
*   **백엔드(API):** FastAPI/Node.js 환경에서 DiagnosisScore 계산 및 데이터 처리를 담당합니다. 핵심 엔드포인트는 `GET /api/v1/diagnosis_score`입니다.
*   **데이터 흐름:** 사용자 액션 $\rightarrow$ Client State Update $\rightarrow$ API Call $\rightarrow$ Server Calculation (KPI Validation) $\rightarrow$ State Change $\rightarrow$ UI Render.

## 🔬 2. 데이터 모델 및 API Contract (The Source of Truth)
### 📄 Endpoints & Schema: `GET /api/v1/diagnosis_score`
| 파라미터 | 타입 | 필수 여부 | 설명 | 검증 로직 |
| :--- | :--- | :--- | :--- | :--- |
| `context_id` | UUID | O | 진단 세션의 고유 식별자. | Null 체크 및 DB 조회 필수. |
| `diagnosis_type` | Enum(Growth/Engage/Monetize) | O | 진단을 수행할 핵심 KPI 유형. | RBAC (권한 기반 접근 제어) 검증 필요. |
| **응답 스키마** | JSON Object | - | `{ score: number, phase: string, metrics: { growth: float, engage: float, monetize: float } }` | `score`는 0~100 사이여야 하며, `phase`는 정의된 Phase Enum 중 하나여야 합니다. (Critical Check!) |

### 💡 KPI 및 상태 관리 로직 (State Machine Contract)
**[핵심]** 모든 시각적 변화의 근거는 이 State Transition 테이블을 따라야 합니다.

| Phase (상태) | Score Range | `diagnosis_type` | 핵심 메시지 (Visual Focus) | Action Trigger (Next Step) |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Crisis** | $0 \le S < 35$ | Growth/Engage/Monetize | "노력 대비 성과 부재. 객관적 진단 필요." (Warning Tone) | `[Analyze]` 버튼 클릭 $\rightarrow$ Score 계산 API 호출. |
| **Phase 2: Gap Identified** | $35 \le S < 70$ | Growth/Engage/Monetize | "문제 영역 포착. 이 부분을 집중 개선해야 합니다." (Focus Tone) | `[Deep Dive]` 버튼 클릭 $\rightarrow$ 특정 KPI 리포트 페이지로 이동. |
| **Phase 3: Clarity / Gain** | $S \ge 70$ | Growth/Engage/Monetize | "객관적 데이터 기반 성장 시작. 확신을 가지세요." (Empowerment Tone) | `[Action Plan]` 버튼 클릭 $\rightarrow$ 맞춤 학습 커리큘럼 제공. |

## ✨ 3. 프론트엔드 컴포넌트 및 애니메이션 사양 (The UX Contract)
### A. DiagnosisScoreWidget Component (`DiagnosisWidget`)
*   **기술 요구사항:** Score 값에 따라 **색상(Color)**, **모양(Shape)**, **애니메이션 속도(Animation Curve)**가 달라져야 합니다.
    *   Crisis: Red/Orange 계열 (DeepBlue $\rightarrow$ Red). 불규칙한 진동 애니메이션 (`jitter effect`) 적용.
    *   Clarity: Green/Blue 계열 (DeepBlue $\rightarrow$ Green). 부드러운 상승 그래프 (`smooth curve up`).
*   **구현 체크리스트:** [ ] Score 값 바인딩, [ ] Phase Text 변경 로직, [ ] 색상 전환 애니메이션 구현.

### B. Metric Cards Component (`KPICard`)
*   **기술 요구사항:** Gap Score와 RoC는 항상 3개의 Card 형태로 표시되어야 하며, 숫자가 업데이트될 때 `number-to-percent` 변환 과정과 함께 **카운팅 효과(Counting Animation)**가 발생해야 합니다. (단순 값 변경 X)
*   **구현 체크리스트:** [ ] 데이터 바인딩, [ ] 카운터 애니메이션 구현.

## 🐛 4. 개발팀 필수 검토 항목 및 테스트 플랜
1.  **에러 핸들링:** API 호출 실패(Timeout/500 Error) 시, 사용자에게 '기술적 문제'가 아닌 **'데이터 부족으로 진단 불가'**와 같은 명확한 메시지를 제공하고 재시도 버튼을 활성화해야 합니다. (Guard Clause 필수)
2.  **권한 검증:** `diagnosis_type`에 따라 접근 권한이 없는 경우, API 레벨에서 403 Forbidden 응답을 반환하고 프론트엔드에는 "이 진단은 프리미엄 멤버십에서만 확인 가능합니다." 메시지를 표시해야 합니다.