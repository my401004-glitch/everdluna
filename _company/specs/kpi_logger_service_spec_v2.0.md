# 🛠️ KPI Event Logger Service 기술 명세서 (V2.0)
**프로젝트:** 아지트아트컴페니 - 실용음악 AI 활용 과정 데이터 측정 시스템
**목표:** 사용자 행동 로그(Event Log)를 수집하고, 이를 정의된 핵심 KPI(Growth, Engagement, Monetization)와 연관시켜 DB에 구조적으로 저장한다.

---

## 1. 개요 및 역할 (The 'Why')
이 서비스는 클라이언트(프론트엔드/진단 스크립트)가 발생시킨 모든 사용자 상호작용을 받아들이고, 비즈니스 로직 계층에서 **유효성 검사(Validation)**와 **데이터 정규화(Normalization)**를 수행한 후, 최종적으로 `KPI_Metrics` 테이블에 기록하는 역할을 합니다. [근거: sessions/2026-05-18T43/developer.md]

## 2. API 명세 (The Contract)
### A. 엔드포인트 정의
*   **메서드:** `POST`
*   **URL:** `/api/v1/kpi/log`
*   **설명:** 모든 KPI 관련 이벤트를 로깅합니다.

### B. 요청 바디 (Request Body Schema)
| 필드 이름 | 타입 | 필수 여부 | 설명 | 예시 값 |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | String | O | 사용자 식별자 (Authentication Token 기반 추출 권장) | `"uuid-xyz-123"` |
| `context_id` | String | O | 이벤트가 발생한 특정 콘텐츠 또는 진단 세션 ID | `"diag-session-abcde"` |
| `event_type` | Enum/String | O | 이벤트의 종류 (e.g., 'SCORE_VIEW', 'QUIZ_ANSWER', 'CTA_CLICK') | `"SCORE_VIEW"` |
| `timestamp` | Date/String | O | 이벤트 발생 시점 (UTC) | `"2026-06-22T15:30:00Z"` |
| **`metrics`** | Object | O | 핵심 KPI 데이터 덩어리. 이 객체 내부의 필드가 실제 KPI가 됩니다. | `{ "growth": 0.8, "engagement": 0.7, "monetization": 0 }` |
| `details` | JSON/Object | X | 추가 메타데이터 (예: 클릭한 버튼 ID, 답변 내용 등) | `{"button_id": "cta-premium"}` |

## 3. 서비스 로직 및 흐름도 (The 'How')
개발 순서는 **[1] 요청 수신 $\rightarrow$ [2] 입력 유효성 검증 $\rightarrow$ [3] 비즈니스 로직 처리 $\rightarrow$ [4] DB 기록**의 네 단계를 따릅니다.

### ⚙️ A. 단계별 상세 구현 요구사항
1.  **입력 게이트 (Input Guard):**
    *   `user_id`, `context_id`, `event_type`이 누락되거나 형식 오류 시, 즉시 **400 Bad Request** 반환 및 로그만 기록한다.
    *   `metrics` 객체가 필수 필드를 포함하는지 확인한다. (Growth, Engagement, Monetization 키 존재 여부)

2.  **KPI 값 유효성 검사 (Data Validation):**
    *   핵심 KPI (`growth`, `engagement`, `monetization`)의 값은 반드시 **0.0 ~ 1.0 사이의 실수(Float)**여야 한다. 범위를 벗어나면 해당 필드를 무시하거나 기본값(0)으로 처리하고 경고를 로깅해야 한다. [근거: sessions/2026-05-18T14-34/developer.md]
    *   `metrics` 값이 이전에 기록된 평균/분포치를 벗어나는 급격한 이상치(Anomaly Detection)일 경우, 경고 플래그를 추가하고 관리자에게 알림을 보낸다.

3.  **비즈니스 로직 처리 (Business Logic):**
    *   **`Growth`:** 진단 점수의 절대적 변화량(`Current Score - Initial Score`)을 기반으로 산출한다. 단순히 기록된 값이 아니라, 이전 세션의 데이터와 비교하여 *성장 정도*를 재계산하는 로직이 필요하다. [근거: sessions/2026-05-18T43/developer.md]
    *   **`Engagement`:** `event_type`에 따라 가중치를 부여한다. (예: 'QUIZ_ANSWER' = 0.3, 'CTA_CLICK' = 0.5). 단순 값 합산이 아닌, 활동 종류별 기여도를 계산해야 한다.
    *   **DB 트랜잭션:** 모든 로직 처리가 완료되면, 단일 DB 트랜잭션으로 다음 세 테이블에 순차적으로 기록한다.

4.  **데이터 저장 (Persistence):**
    1.  `KPI_Event_Log`: 이벤트 발생 시점의 원본 데이터를 기록한다. (추적 용이성 확보)
    2.  `Diagnosis_Results`: 최종 산출된 `result_data` (JSON 스키마 준수).
    3.  `KPI_Metrics`: 핵심 KPI 값만 별도 테이블에 연관시켜 저장하여, 대시보드에서 빠른 집계가 가능하도록 한다.

## 4. 개발 및 예상 리소스 분석 (Time & Scope)
| 기능 영역 | 주요 작업 내용 | 기술 스택/난이도 | 예상 시간(Man-Day) | 담당 에이전트 |
| :--- | :--- | :--- | :--- | :--- |
| **API 구현** | `/api/v1/kpi/log` 컨트롤러 및 라우터 설정. (FastAPI/Express 기준) | Python/TS, Backend Low | 0.5일 | 코다리(나) |
| **Service Layer** | 입력 유효성 검증 로직 구현 및 KPI 계산 비즈니스 로직 통합. | Python/TS, Core Logic Medium | 1.5일 | 현빈 (데이터 모델 전문가) |
| **DB 마이그레이션** | `KPI_Event_Log` 테이블 구조 확정 및 외래 키 설정. | SQL, DB Schema Low-Medium | 0.5일 | 코다리(나) |
| **테스트 케이스** | 정상 흐름, 경계값(Boundary), 오류 흐름(Failure Path) 테스트 코드 작성. | Unit Test/Integration Test High | 1.0일 | 모든 팀원 |

**총 예상 시간 (MVP): 약 3.5 Man-Day.**