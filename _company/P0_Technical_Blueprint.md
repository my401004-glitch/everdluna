# 💻 P0 기능 개발 청사진 및 Funnel Flow 검증 보고서 (2026-07-31)

## 📜 개요: 프로젝트 핵심 목표
이 문서는 아지트아트컴페니의 MVP가 성공적으로 유료 전환을 달성하기 위한 기술적 기반(P0: 권한 게이팅, 트랜잭션 보장)을 확립하는 청사진입니다. 모든 개발은 이 Blueprint를 기준으로 진행되어야 합니다.

## 🧱 섹션 1: 데이터 모델링 (DB Schema Refactoring Plan)
**목표:** 사용자 상태와 접근 기록을 통합적으로 관리하여 권한 게이팅(RBAC) 및 트랜잭션 보장이 가능하도록 확장합니다.

### 1. `User` 테이블 리팩토링 필수 항목
| 컬럼명 | 데이터 타입 | 설명 | 비고 | 근거 |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | UUID | 사용자 고유 ID (PK) | - | 기존 구조 유지 |
| `is_premium` | BOOLEAN | 유료 구독 여부 (True/False) | P0 필수 | [sessions/2026-07-31T04:34] |
| `subscription_tier` | ENUM | 구독 등급 (Basic, Premium, Enterprise) | Funnel Gate 조건 | [sessions/2026-05-18T13:43] |
| `last_paid_at` | TIMESTAMP | 마지막 결제일 (트랜잭션 추적) | P0 필수 | 트랜잭션 보장 목적 |

### 2. `Diagnosis_Results` 테이블 확장 및 관계 설정
*   **기존 로직 유지:** 진단 결과 저장 (`result_data`, `context_id`)는 그대로 유지합니다.
*   **추가/강화 포인트:** 접근 시도와 성공 여부를 기록하는 **Audit Log 패턴**을 도입해야 합니다.
    *   `access_attempt`: 사용자가 특정 기능에 *접근 시도*한 횟수 (KPI로 활용).
    *   `is_authorized`: 해당 접근이 권한 게이팅을 통과했는지 여부 (BOOLEAN).

### 3. `KPI_Metrics` 테이블 역할 정의
*   Growth, Engagement, Monetization KPI는 **별도의 트랜잭션**으로 기록되어야 합니다. 이는 진단 결과(`Diagnosis_Results`)와 분리하여 관리함으로써 데이터 불일치 문제를 방지합니다. (트랜잭션 원자성 확보)

## ⚙️ 섹션 2: 핵심 API 기술 요구사항 정의
**핵심 엔드포인트:** `GET /api/v1/diagnosis_score` (진단 점수 조회 및 리포팅)

### 🚀 P0 로직 흐름도 (Pseudo Code Logic)
1.  **[Request Received]:** 사용자 ID와 진단 유형 (`diagnosis_type`)이 전달됨.
2.  **[Step 1: RBAC Pre-Check]**:
    *   `User` 테이블에서 `user_id`의 `subscription_tier`를 조회한다.
    *   요청된 `diagnosis_type`에 접근할 권한(Role)이 현재 사용자의 Tier에 포함되는지 DB 레벨에서 검증한다. **(권한 미달 시 403 Forbidden 즉시 반환)** [근거: sessions/2026-05-18T13:43]
3.  **[Step 2: Transaction Start]**: 트랜잭션 시작 (`BEGIN TRANSACTION`).
    *   진단 로직을 실행하여 점수 및 리포트 데이터를 산출한다.
    *   `Diagnosis_Results` 테이블에 결과 저장.
    *   관련 `KPI_Metrics` (Growth/Engagement) 업데이트.
4.  **[Step 3: Commit & Response]**: 트랜잭션 커밋 (`COMMIT TRANSACTION`). 성공적인 데이터 저장이 확인된 후에만 클라이언트에 응답을 보낸다.

## 🚦 섹션 3: Funnel Flow Audit Map 및 기술적 게이트 검증 보고서
Funnel Flow의 주요 전환 지점(Gate)마다 요구되는 시스템 조건을 정의합니다. 이는 기능 구현 시 개발자가 반드시 고려해야 할 '기술적 제약'입니다.

| Gate Point | 목적 (Pain $\rightarrow$ Gain) | 필요한 조건/로직 | 기술적 난이도 | 근거 |
| :--- | :--- | :--- | :--- | :--- |
| **Gate 1: 초기 진단** | 기본적인 문제 인식 유도 (무료 제공) | `user.is_premium` = FALSE. 모든 사용자 접근 허용. | Low | [sessions/2026-05-18T13:43] |
| **Gate 2: 깊은 분석 요청** | '이대로는 안 된다'는 결핍 증폭 (Pain) | `user.subscription_tier` != Premium. 진단 결과의 핵심 지표(`Gap Score Depth`)를 가린 상태로 제공해야 함. **(정보 차단)** | Medium | [sessions/2026-05-18T14:34] |
| **Gate 3: 결제 유도 (Subscription Wall)** | 해결책 제시 및 구매 결정 촉진 (Gain) | `user.is_premium` = FALSE 이고, 일정 시간 이상 Gate 2에 머물렀을 때만 노출. *결제 모듈 호출.* | High | [sessions/2026-07-31T05:04] |
| **Gate 4: 프리미엄 리포트 해금** | 최종 성취감과 서비스 가치 제공 (Gain) | `user.is_premium` = TRUE 이고, 유효한 결제 트랜잭션이 존재해야 함. DB 조회 시 권한 검증 필수. | High | [sessions/2026-05-18T13:43] |

---
**[다음 액션 항목]**
1.  위 Blueprint를 바탕으로, 백엔드 개발자에게는 **`schema.sql` 업데이트 초안**을 요청합니다. (필수 컬럼 추가)
2.  프론트엔드/UX 팀에게는 **Gate 3 및 Gate 4의 UI/Copywriting 디테일**에 대한 최종 검토를 받습니다.