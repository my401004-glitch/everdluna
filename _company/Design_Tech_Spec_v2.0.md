# 📐 디자인-개발 인터페이스 명세서 (Master Component Library Spec v2.0)

## 목적 및 정의
본 문서는 아지트아트컴페니의 모든 시각적 컴포넌트를 개발팀이 코드로 구현할 때 필요한 **기술 사양(Technical Specification)**을 제공합니다. 각 컴포넌트는 독립적인 모듈로 기능하며, 다음 3가지 요소가 필수적으로 포함되어야 합니다:
1. **[Design Specs]:** 색상 코드, 타이포그래피, 크기 등 시각적 정의 (Designer 담당).
2. **[Component Props]:** 구현 가능한 속성 및 변수 구조 (e.g., `isActive`, `dataValue`).
3. **[Integration Logic]:** 어떤 데이터를 받아(Input) 어떤 API를 호출하며(Process), 어떤 형태의 결과를 출력해야 하는지(Output) (Developer/Designer 협업).

---

## 🌟 핵심 컴포넌트 목록 및 정의

### A. [Primary Component] Pain-Data-Solution Card
*   **역할:** 콘텐츠의 핵심 정보 단위 (Pain $\rightarrow$ Data $\rightarrow$ Solution 흐름 시각화).
*   **[Design Specs]:**
    *   레이아웃: 3단 분리 구조 (Risk/Evidence/Gain)
    *   색상 매핑: Risk(Accent Yellow), Evidence(Dark Blue 배경, Neutral Grey 텍스트), Gain(Accent Yellow 강조)
    *   폰트 사용: Title - Montserrat Bold / Body - Noto Sans KR.
*   **[Component Props]:**
    *   `painData`: { riskScore: Number, description: String }
    *   `evidenceData`: { kpiValue: Number, changeRate: String, graphType: Enum('line', 'bar') }
    *   `solutionData`: { gainDescription: String, roiEstimate: String }
*   **[Integration Logic]:**
    *   **Input:** `DiagnosisService.get_analysis(studentId)`의 JSON 결과 데이터 구조를 100% 반영해야 함.
    *   **Process:** Evidence 영역의 KPI 값은 반드시 코다리가 검증한 API(`api/v1/kpi_calc`) 호출을 통해 실시간으로 받아와야 하며, 그래프는 `graphType`에 따라 동적으로 로드되어야 한다.
    *   **Output:** 해당 컴포넌트가 성공적으로 렌더링되면, 다음 섹션의 가용성(Availability) 점수가 재계산되는 **이벤트(`emit: kpi_update`)**를 발생시켜야 함.

### B. [Secondary Component] CTA Button (행동 유도 버튼)
*   **역할:** 시청자의 행동을 유발하는 최종 클릭 지점.
*   **[Design Specs]:**
    *   색상: Accent Yellow (`#FFD700`) (강제 적용).
    *   모서리 처리: 4px Radius.
    *   상태 변화: Hover 시 Dark Blue로 미세하게 배경색 변경 (미묘한 전문성 부여).
*   **[Component Props]:**
    *   `text`: Button Text (String)
    *   `onClickAction`: 함수 (Function) — 클릭 시 실행할 로직을 정의.
*   **[Integration Logic]:**
    *   **Process:** `onClickAction`은 단순한 링크 이동이 아니라, 반드시 **추적 이벤트(Tracking Event)**를 발생시켜야 함.
    *   예: `api/v1/track_cta_click(type, contentId)` 호출 후, 다음 화면으로 전환된다.

### C. [Utility Component] Growth Bar (성장 바 그래프)
*   **역할:** 데이터의 시간적 변화를 직관적으로 보여주는 핵심 시각 요소.
*   **[Design Specs]:**
    *   형태: 수평 막대(Horizontal Bar).
    *   색상: 기본값 Dark Blue (`#0A2463`), 목표 달성 구간은 Accent Yellow로 하이라이트.
    *   축 표시: Y축에 레이블, X축에 값 표시 (명확한 단위 명시 필수).
*   **[Component Props]:**
    *   `dataPoints`: [{ timeStep: Date, value: Number }] 배열 형태의 데이터 구조.
*   **[Integration Logic]:**
    *   **Input:** 과거 시점별 데이터를 받아와야 함. (API: `api/v1/history_data?studentId=...`)
    *   **Process:** 그래프는 **데이터 유효성 검증(Validation)**을 거쳐야 한다. 데이터가 누락되거나 범위 밖일 경우, 컴포넌트 자체에 경고 아이콘(`⚠️`)이 표시되어야 하며, 로직 오류로 인해 화면이 깨지는 것을 방지해야 한다 (Defensive Programming).

---