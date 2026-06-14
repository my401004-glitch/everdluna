# ⚙️ 시스템 아키텍처 청사진 (V1.0 - 2026-06-14)

## 🎯 목표: MVP 프로토타입을 위한 통합 API 프레임워크 확정
이 문서는 모든 기술 스택(DB, 백엔드 로직, 프론트엔드 컴포넌트)의 계약서 역할을 합니다. 개발팀은 이 청사진에 따라 코드를 작성해야 하며, 어떤 요청도 누락되어서는 안 됩니다.

---

### 1. 핵심 데이터 모델 (Data Model - SQL 기반)
*   **참조:** `Diagnosis_Results` 테이블 및 관련 스키마 정의를 따릅니다.
*   **핵심 논리:** 모든 분석 결과(`result_data`)는 사용자의 권한(RBAC) 검증을 거쳐야 하며, KPI 지표는 반드시 별도 추적 테이블(`KPI_Metrics`)에 기록되어야 합니다.

### 2. 백엔드 API 엔드포인트 계약 (API Contract - FastAPI/Express.js 기준)
모든 API는 데이터의 무결성과 보안(RBAC)을 최우선으로 고려합니다.

#### A. `/api/v1/diagnosis_score` (GET)
*   **기능:** 사용자가 입력한 원본 데이터(`raw_data`)를 기반으로 핵심 성장 지표(Gap Score)와 세부 진단 리포트 JSON을 반환합니다.
*   **요청 파라미터 (Query Params):**
    *   `user_id`: 필수. 요청 주체 식별.
    *   `raw_data`: 필수. 사용자의 원본 데이터(JSON string 또는 Base64 인코딩).
    *   `diagnosis_type`: 선택. 진단할 유형 (e.g., 'Growth', 'Engagement').
*   **응답 스키마 (Response Schema):** `DiagnosisResultDTO`를 따름.

```json
{
  "status": "success",
  "data": {
    "score_summary": {
      "total_gap_score": 85, // 전체 Gap 점수 (0-100)
      "kpis": {
        "growth": {"value": 70, "description": "성장 잠재력"},
        "engagement": {"value": 92, "description": "참여도 지표"},
        "monetization": {"value": 65, "description": "수익화 가능성"}
      }
    },
    "detailed_report": {
      // 여기에 detailed JSON report가 들어갑니다. (시각 시스템 가이드라인 반영)
    },
    "access_level_check": [
        {"type": "Growth", "is_allowed": true, "reason": "Free Tier Access"}, 
        {"type": "Monetization", "is_allowed": false, "reason": "Premium Required"}
    ]
  }
}
```

#### B. `/api/v1/user/profile` (GET)
*   **기능:** 사용자 정보 및 현재 구독 상태(Tier 1, Tier 2 등)를 확인합니다. (RBAC 구현의 기반)

### 3. 프론트엔드 컴포넌트 요구사항 통합
| 섹션 | 데이터 출처 (API Call) | 필수 로직 / 비고 | 시각 가이드라인 반영 여부 |
| :--- | :--- | :--- | :--- |
| **Hero/Diagnosis Input** | N/A (Local State) | `raw_data` 입력 유도. CTA 버튼은 즉시 API 호출로 연결되어야 함. | Dark Blue / Accent Yellow 사용. |
| **Score Visualization** | `/api/v1/diagnosis_score` | `score_summary` 데이터를 받아 시각화합니다. (가장 중요한 섹션) | Gap Score를 명확히 강조. |
| **Detailed Report View** | `/api/v1/diagnosis_score` | `detailed_report`의 JSON 구조를 파싱하여 단계별 설명을 제공해야 합니다. | 텍스트와 그래프의 조합. |
| **CTA / Monetization Block** | `/api/v1/user/profile`, Score API의 `access_level_check` | `is_allowed: false`인 경우, 유료 전환을 강하게 유도하는 문구와 CTA를 표시해야 합니다. (수익화 연결 지점) |

---