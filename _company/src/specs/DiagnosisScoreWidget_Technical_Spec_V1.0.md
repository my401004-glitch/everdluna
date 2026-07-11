# 🔬 Diagnosis Score Widget 통합 기술 사양서 (V1.0) - 개발 착수 보고서

## 🎯 1. 목표 및 핵심 전제
이 문서는 Master Production Bible(MPB)에 정의된 '감성적 고통을 객관 데이터로 변환'하는 코어 로직($W_n$)의 기술적 구현과 Designer가 요구하는 시각적 경험 간의 완벽한 동기화를 보장하기 위해 작성되었습니다.
**핵심 전제:** 모든 애니메이션 및 UI 상태 변화는 **프론트엔드의 임의적인 액션이 아닌, 백엔드 API에서 반환된 '진단 점수(Score)' 또는 '상태 플래그(Status Flag)'에 의해 트리거되어야 합니다.**

## ⚙️ 2. Backend API 명세 (Diagnosis Service)
### A. 엔드포인트 및 기능
*   **Endpoint:** `GET /api/v1/diagnosis_score`
*   **Request Body:** `{ "contextId": string, "userRole": string }`
*   **Response Schema (Success):**
    ```json
    {
        "status": "SUCCESS",
        "data": {
            "overallScore": 0.0, // [Range: -1.0 to 1.0]
            "phase": "Phase X",  // [Enum: Crisis, Caution, Optimal...] (Visual Trigger)
            "scores": {             // KPI Metrics
                "Growth": 0.0,
                "Engagement": 0.0,
                "Monetization": 0.0
            },
            "details": "진단 상세 설명..."
        }
    }
    ```

### B. 상태 플래그 (`phase`) 정의 및 기술적 요구사항 (Critical)
| Phase | Score Range (W_n 기반) | 시각적 의미 (Designer Input) | 백엔드 구현 로직 Trigger | 병목/주의 사항 |
| :--- | :--- | :--- | :--- | :--- |
| **Crisis** | $W_n < -0.5$ | 경고성, 강렬한 Red 계열 / 높은 불안정성 표현 (진동) | `overallScore`가 임계점 이하일 때 확정. *최소 3단계 이상의 점진적 하락 추이*를 포착해야 함. | **[Critical]** 과거 세션 데이터(`Diagnosis_Log`)와 현재 점수 간의 변화율(RoC)을 필수로 비교하여, 단순한 순간 값이 아닌 '하락 속도'를 점수화할 것. |
| **Caution** | $-0.5 \le W_n < 0.3$ | 노란색 계열 / 위험 신호 경고 (느린 파동 패턴) | `overallScore`가 범위 내에 있을 때 확정. | 로직은 '잠재적 위기'를 나타내야 하므로, 점수가 안정화되는 과정을 시각적으로 보여주는 **Transition Animation**이 필요함. |
| **Optimal** | $W_n \ge 0.3$ | Blue 계열 / 성장 및 가능성 (부드러운 상승 곡선) | `overallScore`가 임계점 이상일 때 확정. | 성장의 '지속가능성'을 시각적으로 증명하는 애니메이션(예: 장기 추세선의 기울기 표시)이 필수적임. |

## 🖼️ 3. Frontend 통합 가이드라인 (Designer & Developer)
### A. 핵심 컴포넌트별 요구사항
1.  **Score Indicator Widget**:
    *   `overallScore` 값을 실시간으로 바인딩하고, Phase 변화에 따라 색상 및 애니메이션을 즉시 변경해야 합니다.
    *   Phase가 결정되면, 해당 Phase의 **대표적인 시각적 메타포(예: Crisis -> 무너지는 구조물)**를 1~3초 동안 풀 애니메이션으로 보여줘야 합니다. (Transition Time 정의 필요)
2.  **KPI Metric Card**:
    *   Growth/Engagement/Monetization 값은 각자의 축을 가지므로, 단일 점수와는 별개로 **'증가율(Rate of Change)'** 형태로 시각화되어야 함. (꺾은선 그래프 또는 막대형 변화량 표시)

### B. 기술적 병목 지점 해결 방안
| 문제 영역 | 현상/요구사항 | 해결책 (Tech Stack & 로직) | 담당 에이전트 |
| :--- | :--- | :--- | :--- |
| **데이터 동기화** | Phase 변화가 너무 갑작스러움. | 백엔드에서 `Phase` 결정 시, 이전 Phase 대비 **변화율(RoC)**을 점수 데이터에 추가하고, 프론트엔드는 이 RoC 값을 받아 애니메이션의 속도/강도를 조절한다. | Backend (코다리) |
| **성장 증명** | '성장'이 추상적임. | 단순히 최종 점수를 보여주는 것이 아니라, 시간 흐름(X축)에 따른 여러 KPI(`Growth`, `Engagement` 등)의 다차원적인 변화를 보여주는 **스캐터 플롯 또는 복합 그래프**로 재구성해야 한다. | Frontend (Designer/코다리) |
| **권한 제어** | 유료 기능 접근 시 UI가 깨짐. | 모든 데이터 요청(API Call) 전에 `userRole`을 전송하고, 백엔드에서 RBAC 검증 후, 권한이 없을 경우 빈 상태 대신 **'접근 불가: Premium Feature'라는 명확한 에러 메시지/UI**를 반환하도록 구조화한다. | Backend (코다리) |

## ✅ 4. Action Items & 다음 단계
1.  (Backend): `DiagnosisController`에서 RoC 계산 로직을 최종적으로 구현하고, 테스트 케이스를 작성합니다.
2.  (Frontend): 위 사양서의 Phase별 애니메이션 요구사항을 기반으로 **컴포넌트 목업(Mockup)에 상태 플래그(`phase`)와 변화율(`RoC_trigger`) 바인딩 지점을 명시**해야 합니다. (Designer)