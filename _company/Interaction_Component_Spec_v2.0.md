# ✨ A-01 & A-02 최종 상호작용 컴포넌트 스펙 (Interaction Component Spec v2.0)
**문서 목적:** A-01 및 A-02 에셋에 정의된 모든 상호작용 포인트(IP)를 개발팀이 즉시 구현 가능한 디자인/데이터 통합 명세로 확정합니다. 이 스펙은 시각적 결과물과 데이터 로깅을 동시에 만족시켜야 합니다.

**대상 자산:**
1. A-01: Headline & Pain Point Visualization Module (최상단 핵심 메시지)
2. A-02: Growth Metrics / Gap Score Calculation Module (데이터 제시 및 비교 영역)

**🎨 디자인 시스템 원칙 재확인:**
*   **메인 컬러 (신뢰/전문):** Dark Blue (`#0A2463`) - 배경, 주요 텍스트.
*   **액센트 컬러 (행동 유도/기회):** Accent Yellow (`#FFD700`) - CTA 버튼, 핵심 변화(Gain), 위험 감지(Pain) 영역.
*   **폰트:** Headline: Montserrat Bold / Body: Noto Sans KR

---

## 💡 표준 상호작용 컴포넌트 정의 (The Template)

모든 IP는 아래의 3단계 구조를 반드시 따릅니다. 개발팀은 이 구조에 맞춰 Event Listener와 데이터 Payload를 설계해야 합니다.

| 필드명 | 설명 | 디자인 가이드라인 | 기술 스펙 (필수) |
| :--- | :--- | :--- | :--- |
| **Interaction ID** | 고유 식별자 (개발팀용) | `A01_HOVER_HEADLINE` | N/A |
| **Trigger Type** | 상호작용 유발 방식 | Hover, Click, Scroll Viewport 진입 등 | `on:hover`, `onClick`, `onScroll(element)` |
| **Target Component** | 스펙이 적용되는 자산 모듈 | A-01 (헤드라인), A-02 (Gap Score 차트) | Element ID (`#A01_headline`) |
| **Visual Action (디자인)** | 사용자에게 보여지는 시각적 반응 | 색상 변화, 애니메이션(Scale/Fade), 텍스트 전환 등. (구체적인 CSS/Figma 레퍼런스 필요) | Transition Time (ms) 및 Effect Type 지정 |
| **Data Payload** | 상호작용 발생 시 수집되어야 할 데이터 구조 | 해당 상호작용과 관련된 핵심 지표 또는 사용자 상태. | **JSON Schema 형식 필수 명시** |

---

## ⚙️ A-01: Headline & Pain Point Module 스펙 (상세)

| Interaction ID | Trigger Type | Target Component | Visual Action (디자인) | Data Payload (기술 스펙) |
| :--- | :--- | :--- | :--- | :--- |
| **A01\_HOVER\_HEADLINE** | Hover (Headline 영역 위 마우스 오버 시) | A-01 Headline Box | 1. 배경색이 Dark Blue $\rightarrow$ `#1F3B7D`로 부드럽게 전환됨. <br>2. 헤드라인 텍스트의 `Pain` 단어만 Accent Yellow (`#FFD700`)가 아닌 **Red (CSS: #C0392B)**으로 변색되어 경고 효과를 줌. | `{ "event_type": "hover", "asset_id": "A01", "element": "Headline", "status": "PainPointAware" }` |
| **A01\_CLICK\_CTA** | Click (최종 CTA 버튼) | A-01 CTA Button | 1. 배경색이 Dark Blue $\rightarrow$ Accent Yellow (`#FFD700`)로 전환되며, 크기(Scale)가 살짝 커지는 애니메이션 발생. <br>2. 클릭 시 짧은 'Pop' 사운드 및 진동 피드백 (Haptic Feedback) 제공. | `{ "event_type": "click", "asset_id": "A01", "cta_action": "ProceedToDiagnosis", "time_spent_sec": <현재 페이지 체류 시간> }` |

## 📉 A-02: Growth Metrics / Gap Score Module 스펙 (상세)

| Interaction ID | Trigger Type | Target Component | Visual Action (디자인) | Data Payload (기술 스펙) |
| :--- | :--- | :--- | :--- | :--- |
| **A02\_SCROLL\_TRIGGER** | Scroll Viewport 진입 시 (Viewport 내 80% 도달 시) | A-02 Gap Score Chart | 차트가 수평으로 '팝업'되듯 등장하며, 이전 지표(Baseline)와 현재 예측치(Predicted)의 간극(Gap)이 Accent Yellow로 강조되어 표시됨. (애니메이션 필수) | `{ "event_type": "scroll", "asset_id": "A02", "metric": "GapScore", "status": "Visualized" }` |
| **A02\_INTERACT\_TOOLTIP** | Hover (특정 데이터 포인트 위 마우스 오버 시) | A-02 차트 요소 | 1. 커서가 위치한 지점 주변으로 Dark Blue 계열의 '반사광(Halo)' 효과가 나타남. <br>2. 해당 데이터의 정확한 수치와 의미를 담은 작은 카드형 Tooltip이 등장함. (Noto Sans KR 사용) | `{ "event_type": "tooltip", "asset_id": "A02", "metric_name": "<데이터 이름>", "value": <수치>, "context": "상세 설명 데이터 로깅" }` |

---
**✅ 개발팀 전달 가이드:**
*   위 스펙을 기반으로 각 상호작용 시점마다 **정확한 JSON Payload**를 수집하는 것이 KPI 추적의 최우선 목표입니다.
*   디자인 애니메이션(Visual Action)은 CSS Transition 또는 Lottie/SVG 애니메이션 방식으로 구현하며, 반드시 성능 부하가 적어야 합니다.