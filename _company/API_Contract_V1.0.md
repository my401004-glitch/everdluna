# 💻 KpiEventLoggerService 통합 API 계약 명세서 (v1.0)
*최종 검토: 2026-06-23 / 담당: 코다리(Developer)*

## I. 목적 및 범위 정의 (Purpose & Scope)
이 문서는 '아지트아트컴페니'의 모든 콘텐츠 제작 과정과 사용자 진단 프로세스를 기술적으로 연결하는 계약서입니다. 개발팀은 이 명세서를 기반으로 KpiEventLoggerService를 구현해야 합니다. 단순한 데이터 저장소가 아닌, **비즈니스 로직을 강제하는 게이트웨이** 역할을 해야 합니다.

## II. 콘텐츠 흐름 분석 및 이벤트 매핑 (Source: Video3_Production_Brief.md)
Leo님의 브리프에 따르면, 사용자의 여정은 'Pain Point 제시 $\rightarrow$ 데이터 충격(Gap Score) $\rightarrow$ 해결책 요구'의 3단계로 이루어집니다. 각 단계별로 필수 로깅 이벤트와 필요한 데이터를 정의합니다.

### 1. [Phase: Pain Point 제시] - 진단 시작 전 (Engagement 측정 초점)
*   **사용자 액션:** 사용자가 최초 진단 테스트에 접속하거나, 특정 문제 영역을 클릭하는 순간.
*   **필수 로깅 이벤트:** `diagnosis_start`
*   **전달할 데이터 (Payload):**
    *   `user_id`: 사용자 고유 ID
    *   `context_type`: 'Video3' 또는 'WebSite'
    *   `target_kpi`: 진단 유형 (예: 'Vocal Range', 'Rhythm')
    *   `initial_interaction`: 최초 상호작용 지점 (로그를 통해 이탈 예상 지점을 파악)

### 2. [Phase: 데이터 충격 및 검증] - 핵심 로직 실행 구간 (Growth & Diagnosis 측정 초점)
*   **사용자 액션:** 진단 테스트의 특정 문항에 응답하거나, 시스템이 Gap Score를 계산하여 보여주는 순간.
*   **필수 로깅 이벤트:** `diagnostic_step_completed` 및 `score_reveal`
*   **전달할 데이터 (Payload):**
    *   `user_id`: 사용자 고유 ID
    *   `context_type`: 'Video3'
    *   `step_index`: 현재 진단 단계 번호
    *   `raw_input`: 사용자가 제출한 원본 값 (예: 5/10)
    *   `intermediate_score`: 해당 단계에서 산출된 임시 점수.
    *   **[Critical]**: `gap_score_delta`: 이전 스텝 대비 점수의 변화량 (이 값이 Gap Score의 핵심 로직임을 명시해야 함).

### 3. [Phase: 해결책 요구 및 CTA] - 진단 완료 후 (Monetization 측정 초점)
*   **사용자 액션:** 최종 결과 리포트를 보고, 유료 서비스(CTA)를 클릭하거나, 다음 단계 학습을 시작하는 순간.
*   **필수 로깅 이벤트:** `report_view` 및 `conversion_attempt`
*   **전달할 데이터 (Payload):**
    *   `user_id`: 사용자 고유 ID
    *   `context_type`: 'Video3'
    *   `final_score_data`: 최종 산출된 진단 결과 JSON 스키마.
    *   `cta_clicked`: 어떤 CTA 버튼을 클릭했는지 (예: 'Basic Plan', 'Premium Plan').
    *   `session_duration`: 전체 세션 지속 시간 (이탈 예측 변수로 활용).

## III. API 엔드포인트 및 데이터 타입 정의 (Backend Contract)

| 기능 | 엔드포인트 | HTTP Method | 요청 Body (Input Schema) | 응답 Data (Output Schema) | 비고 / 핵심 로직 검증 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **진단 시작 기록** | `/api/v1/diagnosis/start` | POST | `(Phase 2. Payload)` | `{ success: boolean, log_id: string }` | 최소한의 데이터 수집을 목표로 합니다. |
| **점수 로깅 (핵심)** | `/api/v1/diagnostic/log_step` | POST | `(Phase 2. Payload)` | `{ success: boolean, updated_score: number }` | **[가장 빈번 호출 예상]** 트랜잭션 처리 필수. 점수 변화량(`gap_score_delta`)을 메인 로직으로 사용해야 함. |
| **결과 보고 및 저장** | `/api/v1/diagnosis/save_result` | POST | `(Phase 3. Payload)` | `{ success: boolean, result_id: string }` | RBAC 체크가 가장 까다로운 지점입니다. 사용자 권한에 따라 데이터 저장 여부를 판단해야 합니다. |

## IV. 개발 및 연동 시 고려 사항 (Developer Checklist)
1.  **비동기 처리:** 모든 로깅 API는 사용자 경험을 해치지 않도록 백그라운드 비동기 처리가 필수적입니다. 실패하더라도 서비스가 다운되어서는 안 됩니다.
2.  **트랜잭션 관리:** `diagnostic_step_completed` 호출 시, 점수 계산 및 DB 저장이 원자적으로(Atomically) 이루어져야 합니다. (ACID 준수).
3.  **모니터링/로깅:** 모든 API 게이트웨이는 성공/실패 여부와 함께 지연 시간(Latency), 에러 코드 등을 상세히 로깅해야 합니다.