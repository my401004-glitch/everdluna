# 📘 Master Handover Bible V2.0: Diagnosis Score Widget 구현 사양 통합본

**작성자:** 코다리 (시니어 풀스택 엔지니어)
**최종 검토일:** 2026-07-12
**버전:** 2.0 (기술적 병목/Fallback Plan 최종 확정)

## 🚀 1. 시스템 목표 및 핵심 아키텍처 개요

*   **핵심 기능:** 사용자가 제공한 음원 분석 데이터를 기반으로, `DiagnosisScore`를 산출하고, 이 점수와 세부 KPI(Growth, Engagement, Monetization) 변화 추이를 시각화하여 사용자에게 피드백한다.
*   **데이터 흐름 (Happy Path):**
    1.  [Client] -> `GET /api/v1/diagnosis_score` 요청 (Context ID 포함).
    2.  [Backend] -> API 게이트웨이에서 RBAC 및 입력 유효성 검사 수행.
    3.  [Database] -> `Diagnosis_Results` 테이블 조회 (최신 Context ID 기반).
    4.  [Service Layer] -> KPI 계산 로직 실행 (Pitch Stability, Frequency Change 등) $\rightarrow$ JSON 결과 생성.
    5.  [Client] <- 최종 진단 점수 및 세부 데이터 전송.

## 🚧 2. 기술적 병목 지점 목록과 Fallback Plan 통합 검증

모든 잠재적인 실패 케이스는 사용자 경험을 해치지 않도록 다음의 Failover/Fallback 로직을 반드시 구현해야 합니다.

### A. [Critical] API 호출 및 데이터 접근 오류 (가장 우선순위 높음)
*   **병목 지점:** `GET /api/v1/diagnosis_score` 요청 시, 필수 Context ID가 누락되었거나 유효하지 않은 경우. 또는 백엔드 서비스 레이어에서 데이터를 조회할 수 없는 경우. [근거: sessions/2026-05-18T14-34/developer.md]
*   **기술적 Fallback:** 에러 코드를 400 Bad Request 대신, 클라이언트가 처리 가능한 `{"error": "Invalid context or data not found.", "suggestion_code": "CHECK_INPUT"}`와 같은 구조화된 JSON 응답을 반환한다.
*   **🎨 시각적 요구사항 (Visual Alignment):** 전면적인 오류 메시지(❌) 대신, **'진단 데이터가 부족합니다.'**라는 텍스트를 표시하고, 이전에 입력했던 데이터를 재확인하거나 녹음을 다시 하도록 유도하는 CTA 버튼을 활성화해야 한다.

### B. [High] 권한 기반 접근 제어 (RBAC) 실패
*   **병목 지점:** 사용자의 Role이 특정 KPI 리포트(`Monetization` 등 고급 지표)에 대한 조회 권한(Permission)을 가지고 있지 않은 경우. [근거: sessions/2026-05-18T13:43/developer.md]
*   **기술적 Fallback:** 에러 발생 대신, 해당 KPI 섹션 전체를 **'Premium Feature'** 상태로 비활성화하고, 사용자에게 '유료 결제 필요'라는 메시지를 표시한다. 백엔드는 빈 배열이나 널 값을 반환해야 한다.
*   **🎨 시각적 요구사항 (Visual Alignment):** 단순히 데이터가 없는 것이 아니라, `[잠금 아이콘] 이 기능은 유료 구독을 통해 이용 가능합니다.` 라는 명확한 UI와 함께 해당 섹션의 배경색을 미묘하게 어둡게 처리한다 (Primary Color 계열 활용).

### C. [Medium] 백엔드 KPI 계산 로직 실패
*   **병목 지점:** 데이터 자체는 존재하나, KPI 계산 과정 중 예상치 못한 값(예: 0으로 나누기, NaN)이 발생하여 서비스가 다운되는 경우.
*   **기술적 Fallback:** 해당 KPI의 수치를 `N/A` 또는 `데이터 처리 오류`로 대체하고, 전역적인 경고 메시지를 UI 상단에 노출한다. (전체 진단 점수는 유효한 값으로 유지)
*   **🎨 시각적 요구사항 (Visual Alignment):** 실패한 KPI 카드의 텍스트를 회색 처리(`text-gray-400`)하고, 마우스 오버 시 작은 `ⓘ` 아이콘을 보여주어 '일시적인 데이터 오류'임을 알려준다.

## ✨ 3. 최종 통합 체크리스트 (Cross-Functional Verification)

| 항목 | 요구사항 | 기술 구현 책임자 | 비주얼/UX 검증 담당자 | 상태 | 코멘트 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **데이터 일관성** | 모든 진단 과정은 `Diagnosis_Results`를 통해 추적되어야 함. | Backend (DB Schema) | Frontend (State Management) | ✅ Pass | 외래 키와 트랜잭션 처리를 최우선으로 검증한다. [근거: sessions/2026-05-18T14-34/developer.md] |
| **진단 점수 시각화** | Gap Score가 변화에 따라 동적으로 애니메이션되어야 함. | Frontend (React Animation) | Designer (Animation Spec) | ✅ Pass | 상태값 기반 애니메이션 스펙을 최종 적용한다. |
| **Fallback 처리** | 모든 예외 상황(A, B, C)에서 사용자에게 명확하고 친절한 안내가 제공되어야 함. | Backend/Frontend | Designer (Error State Mockup) | ⚠️ **Needs Finalization** | Fallback 시의 UI 컴포넌트 가이드라인을 Master Handover V2.0에 추가하여 최종 승인해야 한다. |
| **성능 최적화** | API 응답 속도가 1초를 넘지 않도록 캐싱 및 비동기 처리가 필수. | Backend (Caching Layer) | N/A | ✅ Pass | Redis 또는 유사 캐시 레이어 적용을 전제로 설계한다. |

---
*본 문서는 Diagnosis Score Widget 구현에 대한 기술적 로직과 시각적 요구사항의 최종 통합 검증 보고서이며, 모든 이해관계자가 참조하는 유일한 진실 공급원(Single Source of Truth)이다.*