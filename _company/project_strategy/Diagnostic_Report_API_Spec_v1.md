# 📊 AI 진단 보고서 - API 명세 및 DB 계산 로직 (Diagnostic_Report_API_Spec_v1)
**작성자:** 💻 코다리 (Lead Developer)
**버전:** 1.0 (PoC & MVP 검증용)

---

## 🎯 목표
비즈니스 기획(현빈)에서 정의한 3대 Pain Point(수강생 이탈, 강사 리소스 낭비, 수강료 가치 하락)를 기술적으로 데이터베이스와 매핑하고, 계산 로직을 SQL 및 API 스펙 수준으로 확정하여 즉시 구현 가능하도록 한다.

---

## 💾 Part 1. 데이터베이스 필드 매핑 및 확장 스펙
현빈님이 정의한 비즈니스 지표들은 `schema_v2.sql`에 정의된 `Diagnosis_Results`, `Learning_Sessions`, `KPI_Metrics` 테이블의 데이터를 기반으로 계산됩니다.

### 1. 지표 매핑 테이블
| 비즈니스 지표 (현빈) | 데이터베이스 필드/테이블 | 물리적 데이터 타입 | 계산 핵심 변수 (Formula Variables) |
| :--- | :--- | :--- | :--- |
| **평균 음정 편차 (Avg Pitch Dev)** | `Diagnosis_Results.physical_pitch_stability` | FLOAT | `AVG(Abs(Actual Pitch - Target Pitch))` |
| **평균 호흡 지속 시간 (Breath Dur)** | `Diagnosis_Results.result_data->>'breath_duration'` | FLOAT (JSONB 추출) | `AVG(stable_tone_duration_seconds)` |
| **발전율 (Rate of Improvement)** | `KPI_Metrics.growth_score` | NUMERIC(5,2) | `((Last_Metric - First_Metric) / First_Metric) * 100` |
| **연습 빈도 및 시간 (Engagement)** | `Learning_Sessions.duration_minutes`, `session_date` | INTEGER, DATE | `SUM(duration_minutes)`, `COUNT(session_id)` |
| **단기 이탈 위험도 (Short Churn Risk)** | `KPI_Metrics.details->>'churn_risk_score'` | FLOAT (JSONB 추출) | 최근 2주간 연습량 감소 추세 및 평균 개선율 정체 조합 계산 |

---

## 🧮 Part 2. 핵심 KPI 메트릭 계산 SQL 쿼리

### 1️⃣ 단기 이탈 위험군(3개월 내 이탈) 및 개선율 정체 필터링
최근 90일 이내 등록 수강생 중, 2주 이상 연습량이 없거나 개선율이 5% 미만인 이탈 위험 수강생 리스트를 추출합니다.

```sql
WITH user_registration AS (
    SELECT 
        user_id, 
        created_at AS register_date
    FROM Users
    WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
),
recent_progress AS (
    SELECT 
        user_id,
        MIN(growth_score) AS initial_growth,
        MAX(growth_score) AS latest_growth,
        MAX(kpi_date) AS last_activity_date
    FROM KPI_Metrics
    GROUP BY user_id
)
SELECT 
    ur.user_id,
    ur.register_date,
    rp.last_activity_date,
    COALESCE(rp.latest_growth - rp.initial_growth, 0.00) AS overall_growth_diff,
    CASE 
        WHEN rp.last_activity_date < CURRENT_DATE - INTERVAL '14 days' THEN 'INACTIVE'
        WHEN COALESCE(rp.latest_growth - rp.initial_growth, 0.00) < 5.00 THEN 'STAGNANT_PROGRESS'
        ELSE 'NORMAL'
    END AS churn_risk_status
FROM user_registration ur
LEFT JOIN recent_progress rp ON ur.user_id = rp.user_id
WHERE rp.last_activity_date < CURRENT_DATE - INTERVAL '14 days' 
   OR COALESCE(rp.latest_growth - rp.initial_growth, 0.00) < 5.00;
```

### 2️⃣ 강사 피드백 준비 시간 절감 및 리소스 ROI 계산
학원 내 전체 수강생의 학습 세션 수 대비 AI 자동화 진단 도입으로 절감 가능한 가치(시간당 인건비 기반)를 계산합니다.
*   **수작업 피드백 작성 시간:** 세션당 평균 10분 소요 가정.
*   **AI 자동화 작성 시간:** 세션당 1분 미만 소요.
*   **강사 평균 시급:** ₩15,000 기준.

```sql
SELECT 
    COUNT(session_id) AS total_sessions_last_month,
    COUNT(session_id) * 10 / 60.0 AS manual_prep_hours_est,
    COUNT(session_id) * 1 / 60.0 AS ai_prep_hours_est,
    (COUNT(session_id) * 10 / 60.0 - COUNT(session_id) * 1 / 60.0) AS saved_hours_est,
    (COUNT(session_id) * 10 / 60.0 - COUNT(session_id) * 1 / 60.0) * 15000 AS saved_cost_krw_est
FROM Learning_Sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days';
```

---

## 🌐 Part 3. API 엔드포인트 및 JSON 스키마 명세

기존 `diagnosis_service.py`와 `DiagnosisResult` 스키마를 계승하면서, 학원 운영자의 비즈니스 지표 요구사항을 수용할 수 있도록 API 응답 객체를 확장합니다.

### 엔드포인트: `GET /api/v1/diagnostic-report/business`
*   **Query Parameters:**
    *   `academy_id` (string, required): 학원 고유 ID
    *   `period_days` (integer, optional, default=30): 분석 대상 기간

### API Response JSON Schema
```json
{
  "academy_id": "academy_seoul_vocal",
  "period_days": 30,
  "summary": {
    "total_students": 45,
    "at_risk_count": 8,
    "churn_rate_benchmark_gap_pct": 12.5
  },
  "pain_points": {
    "short_term_churn": {
      "metric_name": "3개월 내 이탈 위험 수강생 비율",
      "current_value_pct": 28.5,
      "benchmark_value_pct": 15.0,
      "gap_value_pct": 13.5,
      "estimated_monthly_loss_krw": 2400000
    },
    "instructor_efficiency": {
      "metric_name": "강사 주간 수작업 피드백 시간",
      "current_hours": 18.5,
      "optimized_hours_est": 1.8,
      "saved_hours_est": 16.7,
      "saved_cost_krw": 250500
    },
    "price_premium": {
      "metric_name": "객관적 AI 진단 도입 시 요금 저항선 극복 잠재력",
      "current_fee_avg_krw": 280000,
      "justifiable_premium_fee_krw": 330000,
      "potential_revenue_increase_krw": 2250000
    }
  },
  "roi_simulation": {
    "monthly_total_saving_krw": 250000,
    "monthly_revenue_preservation_krw": 2400000,
    "monthly_net_gain_krw": 2650000,
    "payback_period_months": 0.5
  }
}
```
