# 🔗 [최종 계약] Diagnosis AI 진단 시스템 API Asset Manifest v1.0

## 🎯 목적: 데이터 흐름 및 통합 명세서 (Single Source of Truth for Data)
이 문서는 백엔드 개발, 프론트엔드 컴포넌트 구현, 그리고 영상 콘텐츠 제작 시 필요한 모든 데이터 요청(API Call)의 **최종 계약서**입니다. 모든 로직은 이 Manifest를 따릅니다.

---

## 🌐 API 엔드포인트 정의 (Backend Contract)
모든 데이터는 `https://api.azitartcompany.com/api/v1`을 기준으로 합니다.

### 1. 진단 점수 조회 (Core Diagnostic Score Retrieval)
*   **Endpoint:** `/diagnosis_score`
*   **Method:** `GET`
*   **Description:** 특정 사용자(User ID 기준)의 최신 종합 진단 점수를 가져옵니다. 이 데이터는 영상에서 '현재 상태'를 보여주는 핵심 지표입니다.
*   **Request Params (Query):**
    *   `user_id`: 필수. (String, User 식별자)
    *   `context_type`: 필수. (Enum: `VOCAL`, `RHYTHM`, `PITCH`) - 진단할 분야 지정.
    *   `date_range`: 선택. (String, ISO Date format) - 기간 설정 (Default: Last 7 Days).

### 2. KPI 메트릭 조회 (Growth & Engagement Metrics)
*   **Endpoint:** `/user/kpi/metrics`
*   **Method:** `GET`
*   **Description:** 사용자의 시간 경과에 따른 주요 성과 지표(KPI) 추이를 그래프로 보여줍니다. **[근거: Self-RAG]** KPI 테이블 연관 저장 구조를 활용합니다.
*   **Request Params (Query):**
    *   `user_id`: 필수.
    *   `metric_type`: 필수. (Array of Enum: `GROWTH`, `ENGAGEMENT`, `MONETIZATION`) - 요청할 지표 목록.

### 3. 진단 기록 조회 (Historical Result Fetch)
*   **Endpoint:** `/diagnosis/history/{context_id}`
*   **Method:** `GET`
*   **Description:** 특정 컨텍스트(예: '발성 코칭')의 과거 모든 진단 결과를 시간순으로 가져옵니다. **[근거: Self-RAG]** 데이터 추적 및 변화 과정 시각화에 사용됩니다.
*   **Request Params (Path):**
    *   `context_id`: 필수. (String, 진단 종류 고유 ID)

---

## 📊 JSON Data Schema 정의 (The Contract Body)

### A. Diagnosis Score Schema (`diagnosis_score`)
```json
{
  "status": "SUCCESS",
  "data": {
    "context_type": "VOCAL", // 예: VOCAL, RHYTHM
    "overall_score": 78.5,   // (Number) 전체 종합 점수 (0-100). [근거: Self-RAG]
    "diagnosis_details": [ // Array of Objects
      {
        "metric": "Pitch Deviation", // 측정 항목명
        "current_score": 65.2,       // 현재 진단 점수
        "ideal_range": "80 - 95",   // 목표 범위 (문자열)
        "deviation_reason": "음정 편차의 주파수 스펙트럼이 불규칙함." // 문제 원인 분석 (작가/AI 생성)
      }
    ]
  }
}
```

### B. KPI Metrics Schema (`kpi_metrics`)
```json
{
  "status": "SUCCESS",
  "data": {
    "user_id": "U12345",
    "time_series": [ // Array of Objects (Time-Series Data)
      {
        "timestamp": "2026-08-01T00:00:00Z",
        "KPIs": {
          "Growth": 7.5,       // 성장 지표 (예: 평균 점수 증가율 %) [근거: Self-RAG]
          "Engagement": 0.9,   // 참여도 (예: 세션당 체류 시간 비율) [근거: Self-RAG]
          "Monetization": 1.2  // 수익화 기여도 (예: 프리미엄 기능 사용률) [근거: Self-RAG]
        }
      },
      // ... 더 많은 타임스탬프 데이터
    ],
    "summary": { // 최종 요약 정보
      "avg_growth": 5.2,
      "max_engagement": 1.5
    }
  }
}
```

---

## 🎬 영상 시퀀스별 데이터 흐름 (Asset Request Flow)

| Video Phase | Duration Est. | 목표/감성적 스토리 | 필요한 API Call | 사용되는 Schema | 비고 / 로직 검증 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[1] 좌절 (Pain Point)** | 0:00 - 1:30 | "노력만으로는 부족하다." 불안감 조성. | `GET /diagnosis_score` (context\_type=VOCAL) | Diagnosis Score Schema | **핵심:** 현재 점수(65.2점 등)와 '이상적 범위'를 대비시켜 시각화합니다. 데이터의 공백/불균형을 강조해야 합니다. [근거: Self-RAG] |
| **[2] AI 해결 (System Introduction)** | 1:30 - 3:00 | "데이터가 규칙을 바꾼다." 시스템 소개 및 원리 설명. | `GET /diagnosis_history/{context_id}` | Diagnosis Score Schema, KPI Metrics Schema | **시퀀스:** 과거 데이터(`history`)를 보여주며, 점수가 *변화할 수 있음*을 증명합니다. 'Gap Score' 계산 로직 시각화가 필요합니다. [근거: Self-RAG] |
| **[3] 승리 (Transformation)** | 3:00 - End | "객관적 진단으로 목표 달성." 성공 사례 제시 및 CTA 유도. | `GET /user/kpi/metrics` | KPI Metrics Schema | **최종 증명:** 시간 경과에 따른 `Growth`, `Engagement`의 긍정적인 추이를 그래프로 보여주며, 서비스 가입을 유도합니다. [근거: Self-RAG] |

---
**[🚨 중요 개발 참고 사항 (MUST READ)]**
1. **RBAC 적용**: 모든 API 호출 시 반드시 사용자의 권한(`user_id`)을 통해 접근 가능 여부 및 데이터 열람 범위를 검증해야 합니다. 무료 사용자에게는 `Monetization` KPI가 가려지거나 제한되어야 합니다. [근거: Self-RAG]
2. **에러 핸들링**: API 호출 실패 시, "데이터 로딩 중 오류가 발생했습니다."와 같은 일반적인 메시지를 사용하고, 개발자 콘솔에는 상세 에러 코드를 남겨야 합니다.