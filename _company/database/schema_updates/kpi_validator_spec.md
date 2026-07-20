# 📈 KPI Validator Business Logic Specification V1.0 (Head of Business 최종 승인)

## 🎯 목표 및 원칙
본 Validator는 단순 데이터 유효성 검증을 넘어, **비즈니스 성장의 신호(Signal)**를 포착하는 것을 최우선 목표로 합니다. 모든 이상치는 '기술적 오류'인지, 아니면 '전략 수정이 필요한 비즈니스 문제'인지를 구분해야 합니다.

## 🛠️ Validation Layer별 검증 항목 정의 (Validation Rules)

### Level 1: 데이터 무결성 및 형식 검사 (Technical Integrity)
| 필드 | 규칙 | 검증 로직 | 실패 시 처리 |
| :--- | :--- | :--- | :--- |
| `content_pk` | Null 체크 필수 | NOT NULL | 기록 거부 (Reject) |
| `youtube_video_id` | 유효한 UUID/ID 형식 확인 | Regex Match, Length Check | 기록 거부 (Reject) |
| `view_count` | 비음수 정수여야 함 | `> 0`, Integer Type | 0으로 대체 또는 경고 로그만 남김 |
| `recorded_at` | 현재 시간 범위 내여야 함 | Timestamp Range Check | 기록 거부 (Reject) |

### Level 2: 통계적 이상치 감지 (Statistical Anomaly Detection)
**검증 대상:** 트래픽 데이터 (`view_count`, 세션 수 등)
1. **급격한 변동성 감지 (Sudden Drop/Spike):**
    *   **규칙:** 전일 대비 `view_count`가 $\pm 50\%$를 초과하는 경우 플래그 설정.
    *   **조치:** 자동 알림(Alert) 발생 및 수작업 검토 필요(`Manual Review`) 상태로 전환. 시스템은 해당 데이터를 잠정적으로 사용하되, 경고 수준을 높임.
2. **평균 Deviation 분석:**
    *   **규칙:** 지난 7일 이동 평균 대비 현재 값이 3 표준편차($\sigma$) 이상 벗어날 경우 플래그 설정.
    *   **조치:** 상위 관리자 알림(Alert) 발생 및 원인 조사 요청.

### Level 3: 비즈니스 로직 검사 (Strategic Business Validation - ★필수★)
**검증 대상:** 콘텐츠별 KPI 관계성 (`CTR`, `Conversion Rate`)
1. **CTA 실패 지표 (Click-Through Action Failure):**
    *   **KPI:** 조회수(Views) 대비 '진단 테스트 시작' 클릭률(CTR).
    *   **규칙:** 해당 콘텐츠의 CTR이 **과거 30일 평균 $\mu_{ctr}$보다 $2\sigma$ 이상 낮으면**, 단순히 트래픽 문제가 아니라 *CTA 메시지 또는 배치 문제*로 판단.
    *   **조치:** `Content_Status`를 'A/B 테스트 필요'로 업데이트하고, 마케팅팀에 경고 플래그 전송.
2. **LTV 퍼널 이탈률 분석 (Funnel Drop-off):**
    *   **KPI:** [Views] $\to$ [Engagement Module 사용] $\to$ [Premium 기능 관심도]의 전환율 추이.
    *   **규칙:** 특정 콘텐츠에서 '진단 테스트 완료' 후 다음 단계(예: 유료 모듈 안내)로 넘어가는 비율(Conversion Rate)이 급감할 경우, **콘텐츠와 비즈니스 메시지 간의 연결고리(Storytelling)**에 문제 발생으로 판단.
    *   **조치:** `Narrative_Review` 플래그를 활성화하여 콘텐츠 기획팀 피드백을 유도.

## 🔗 시스템 통합 요구사항 (Integration Requirement)
- Validator는 모든 KPI 데이터를 수신할 때마다 Level 1, 2, 3 검사를 순차적으로 거쳐야 합니다.
- 최종 결과물은 원본 데이터 외에 반드시 `Validation_Status` (OK / WARN / CRITICAL)와 `Anomaly_Type` (Tech Error / Stat Drift / Biz Logic Failure)를 추가해야 합니다.