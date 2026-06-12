# ⚙️ 기술 사양서: AI 보컬 진단 및 신뢰성 검증 파이프라인 (V1.0)
**작성자:** 코다리 (Senior Fullstack Engineer)
**대상:** 개발팀 (Backend/Infra)
**목표:** Pain $\rightarrow$ Proof 전환을 위한 AI 분석 로직의 데이터 처리, 비즈니스 규칙 적용 및 법적 신뢰 검증 단계를 구현한다.

## 1. 개요 및 시스템 목표 [Goal]
본 파이프라인은 사용자의 진단 입력(`diagnosis_type`)을 받아, 단순히 점수를 산출하는 것을 넘어, **'신뢰성 확보(Trust Layer)'**를 거쳐 비즈니스 가치에 맞는 구조화된 결과를 반환하는 것이 핵심입니다.

*   **핵심 엔드포인트:** `GET /api/v1/diagnosis_score`
*   **트랜잭션 원칙:** 모든 데이터 처리는 ACID 트랜잭션을 준수하며, 실패 시 롤백되어야 합니다.
*   **신뢰성 보증 (Trust Guarantee):** 결과에 법률 검토 마크(`legal_review_passed: Boolean`)와 함께 해당 기준이 충족되었음을 나타내는 메타데이터를 포함해야 합니다.

## 2. 데이터 모델 구조 [Schema Reference]
(참고: `schema.sql` 기반)

| 테이블 | 역할 | 주요 필드 (Must-Have) | 관계/제약 조건 |
| :--- | :--- | :--- | :--- |
| `User` | 사용자 인증 및 권한 관리 | `user_id`, `role` (e.g., 'Free', 'Premium'), `created_at` | RBAC의 기준점. |
| `Diagnosis_Results` | 진단 결과 메인 저장소 | `result_id`, `context_id`, `diagnosis_type`, `score_data` (JSON), `is_legal_passed` | 외래 키: User, Context |
| `KPI_Metrics` | 핵심 성과 지표 추적 | `metric_id`, `user_id`, `growth_score`, `engagement_score`, `monetization_score`, `date` | 분리된 테이블로 KPI 변화를 시간 순으로 추적. |

## 3. API 엔드포인트 상세 사양 [API Specification]
### Endpoint: `GET /api/v1/diagnosis_score`
**Request:**
```json
{
  "user_id": "UUID",
  "context_id": "UUID",
  "diagnosis_type": "string", // 예: 'VocalRangeAnalysis', 'GenreFitAssessment'
  "input_data": { /* 실제 진단 입력 데이터 구조 */ }
}
```

**Response (Success 200):**
```json
{
  "status": "success",
  "result": {
    "score_data": {
      "overall_score": 85,
      "breakdown": {
        "growth": 70,
        "engagement": 90,
        "monetization": 65
      }
    },
    "narrative_output": "사용자의 잠재력은 ~입니다. (Writer Storyline)",
    "confidence_score": 0.92,
    // *** 중요: 신뢰성 보증 필드 ***
    "system_metadata": {
      "legal_review_passed": true, // 법률 검토 마크 통과 여부 (Boolean)
      "v1_required_context": "GenreFitAssessment",
      "timestamp": "2026-06-12T..."
    }
  },
  "message": "Diagnosis score successfully retrieved."
}
```

## 4. 데이터 흐름 (Data Flow) 및 비즈니스 로직 [Core Logic]
요청이 들어오면 다음의 순차적 단계를 거쳐야 합니다. 이 과정은 **Service Layer**에 구현되어야 합니다.

### Step 1: Input Validation & RBAC Check (Guard Rail)
1.  `diagnosis_type`과 `user_id`를 기반으로 DB에서 사용자 권한(`User.role`)을 조회합니다.
2.  **[RBAC 로직]**: 해당 `diagnosis_type`에 접근할 권한이 있는지 확인합니다. (예: 무료 사용자는 'Monetization' 리포트 접근 불가) $\rightarrow$ **권한 미충족 시 403 Forbidden 반환.**

### Step 2: Data Fetch & Preliminary Score Calculation
1.  입력 데이터(`input_data`)를 기반으로 초기 점수를 계산합니다. (순수 로직, Side Effect 없음).
2.  이 과정에서 필요한 모든 원천 데이터를 DB에서 조회하여 `context_id`와 연관시킵니다.

### Step 3: LLM/AI Analysis & Narrative Generation (The Magic)
1.  Step 2의 데이터를 프롬프트에 담아 LLM을 호출합니다.
2.  **Prompt Engineering Focus**: 단순 점수 요청이 아니라, Writer가 정의한 **Pain $\rightarrow$ Proof 구조를 반영한 서사(Narrative)**를 생성하도록 강제해야 합니다. (예: "사용자 A는 현재 X라는 문제에 직면해 있습니다 (Pain). 하지만 데이터 Y를 통해 Z라는 증거가 발견되었습니다 (Proof).")
3.  LLM 응답을 파싱하여 `narrative_output` 필드를 채웁니다.

### Step 4: System Reliability & Legal Check (The Trust Layer) - **[코다리 추가 로직]**
1.  AI 분석 결과와 원천 데이터를 취합합니다.
2.  **법률 검토 마크 통합:** 시스템 아키텍처 요구사항에 따라, 해당 진단이 법적/윤리적 문제(예: 특정 직업군 단정)를 유발하는지 체크하는 별도의 로직(`LegalValidatorService`)을 실행합니다.
3.  `is_legal_passed` 플래그가 `false`일 경우, 사용자에게 경고 메시지를 반환하고, 결과 저장 시 이 플래그와 함께 '제한적 사용' 태그를 붙여야 합니다. (이것이 시스템 신뢰도 확보의 핵심입니다.)

### Step 5: Persistence & KPI Update (Commit)
1.  Step 4에서 최종 검증된 데이터를 `Diagnosis_Results` 테이블에 저장합니다.
2.  성공적으로 저장되면, 해당 진단 결과와 관련된 세부 지표(Growth/Engagement/Monetization)를 계산하여 `KPI_Metrics` 테이블에도 별도로 트랜잭션 커밋 합니다.

---

**[개발팀 전달 코멘트]**: 이 사양서에 따라 백엔드 API 레이어 및 서비스 로직을 구축해 주십시오. 특히 **Step 4의 법률 검토 로직은 핵심적인 비즈니스 위험 통제 장치이므로, 가장 높은 테스트 커버리지와 안정성이 요구됩니다.**