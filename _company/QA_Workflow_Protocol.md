# 🚨 데이터-구동형 디자인 시스템 구현 프로토콜 (v1.0)

## 🎯 목표 및 원칙
*   **목표:** 영상 제작 과정에서 모든 시각적 요소가 백엔드 API(`GET /api/v1/diagnosis_score`)의 구조와 논리에 의해 강제적으로 생성됨을 보장한다.
*   **원칙:** 디자인은 데이터에 종속된다 (Design is subservient to Data).

## 🛠️ 필수 구성 요소 및 매핑 정의

### 1. 데이터 계약 참조 (Source of Truth)
*   **API 엔드포인트:** `GET /api/v1/diagnosis_score(userContextId, diagnosisType)`
*   **필수 변수 구조 (Technical Spec V2 기반):**
    ```json
    {
      "success": true,
      "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
      "data": {
        "diagnosisScore": 75,         // [Number]: 핵심 진단 점수 (0~100)
        "statusCategory": "High",    // [String]: 상태 분류 ("Low", "Medium", "High")
        "improvementRatio": 0.25     // [Number]: 개선 비율 (0.0 ~ 1.0)
      }
    }
    ```

### 2. 디자인-데이터 매핑 규칙 (Visual Mapping Rules)

| 데이터 변수 | 조건/범위 | 시각적 컴포넌트 | 적용 색상 코드 및 효과 | 비고 |
| :---: | :---: | :---: | :---: | :---: |
| `diagnosisScore` | $0 \sim 40$ (Pain Zone) | 게이지/차트 배경 | Dark Blue (`#0A2463`) & Accent Yellow 강조. 경고 아이콘 필수. | 위험도 시각화 |
| `diagnosisScore` | $41 \sim 79$ (Medium Zone)| 게이지/차트 배경 | Neutral Grey (`#F5F5F5`). 점진적 상승 곡선 사용. | 모호성 강조 |
| `diagnosisScore` | $80 \sim 100$ (Gain Zone) | 메인 CTA 영역, 최종 수치 | Accent Yellow (`#FFD700`)로 최대 강조. 승리 이모지/아이콘 필수. | 성취감 극대화 |
| `statusCategory` | "Low" | 헤드라인 텍스트 배경 | Dark Blue 배경 + 경고 아이콘 (⚠️) | Pain 메시지 강화 |
| `improvementRatio` | 증가 추세 시 | 그래프 애니메이션 | 점진적으로 Accent Yellow가 채워지는 효과. | '성장'의 데이터 증명 |

### 3. QA 자동화 검증 체크리스트 (QA Checkpoints Checklist)

**A. [기술적 무결성] Data Consistency Check:**
*   모든 수치(점수, 비율 등)는 소수점 첫째 자리 또는 정수로만 표현되어야 하며, API 스펙을 벗어난 계산은 금지한다.
*   [테스트] 공백 값(`null`)이 들어왔을 때의 기본 표시값 (예: "데이터 미확인" 텍스트 처리)이 정의되었는가?

**B. [시각적 일관성] Visual Compliance Check:**
*   모든 헤드라인은 Montserrat Bold를 사용하고, Pain/Gain 섹션에서만 색상 변화(Blue $\leftrightarrow$ Yellow)가 일어나야 한다. (좌절 $\rightarrow$ 기회 전환의 시점 명확화).
*   데이터 차트는 단순한 막대 그래프보다 **진행률을 보여주는 게이지 형태**를 우선 적용하여 몰입도를 높인다.

**C. [스토리텔링] Narrative Flow Check:**
1.  **Pain (초반):** 높은 대비(Dark Blue/Accent Yellow)와 불안감을 유발하는 시각적 요소로 시작한다. (`statusCategory == "Low"` 상태의 데이터가 반드시 먼저 노출되어야 함).
2.  **Solution (중반):** 문제를 해결할 수 있는 방법을 제시하며, Neutral Grey를 활용해 '체계적인 학습 과정'에 집중시킨다.
3.  **Gain (후반):** 최종 결과를 Accent Yellow로 폭발적으로 강조한다. 이 단계에서 `improvementRatio`가 가장 크게 노출되어야 한다.