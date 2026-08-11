# ✨ [최종 확정] Diagnosis AI 진단 시스템 비주얼 가이드라인 v1.0

## 🎯 목적: 단일 진실의 원천 (Single Source of Truth)
이 문서는 모든 콘텐츠 제작 및 디자인 작업의 최종 기준점입니다. 이 가이드에 명시된 요소는 절대 임의로 변경되어서는 안 됩니다. 모든 에셋 요청은 본 가이드라인을 근거로 합니다.

---

## 🎨 SECTION 1: 브랜드 시스템 확정 (Brand System)
**(근거: Self-RAG 검증 지식)**

| 항목 | 상세 스펙 | 컬러 코드 (HEX) | 역할 및 적용 범위 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Color (신뢰/전문성)** | Dark Blue | `#0A2463` | 배경, 헤더, 주요 텍스트 블록, 신뢰 기반 정보. 전문성과 안정감을 확보합니다. | *메인 브랜드 컬러* |
| **Accent Color (행동 유도/기회)** | Accent Yellow | `#FFD700` | CTA 버튼, '성공적 개선점(Gain)', 핵심 성과 수치 강조, 즉각적인 주목 유도. | *가장 자주 사용됨* |
| **Warning Color (위험/Pain Point)** | Red-Orange | `#CC3300` | 현재의 부족함('노력만으로는 안 됨'), 진단 결과의 위험 영역(Gap Score). 경고 및 주의 표지. | *추가 정의 필요* |
| **Neutral Background** | Light Grey | `#F5F5F5` | 본문 데이터 표시 배경. Dark Blue와의 대비를 통해 가독성을 극대화합니다. | *데이터 영역 전용* |

### 📝 타이포그래피 확정 (Typography)
*   **Headline/Title:** Montserrat Bold (`[근거: Self-RAG]`) - 임팩트 있는 메시지 전달 (Pain, Gain).
*   **Body Text/Data:** Noto Sans KR Regular/Medium (`[근거: Self-RAG]`) - 데이터의 높은 가독성 확보.

---

## 💡 SECTION 2: 핵심 컴포넌트 디자인 사양 (Widget & UI Spec)
**(대상: Diagnosis Score Widget)**

### 1. 진단 점수 위젯 구조 (Diagnosis Score Widget Structure)
*   **위치:** 모든 콘텐츠에서 가장 먼저, 그리고 가장 자주 노출되는 시각적 요소입니다.
*   **레이아웃:** 직사각형 형태의 카드 컴포넌트.
    *   [좌측] **현재 진단 점수 / Gap Score (Pain)**: 빨간색 계열(`Warning Color`)과 Montserrat Bold를 사용해 불안감을 조성합니다.
    *   [중앙] **진단 결과 제목**: Noto Sans KR Medium, Dark Blue (`#0A2463`).
    *   [우측] **최종 목표 점수 / 개선 가능성 (Gain)**: 노란색 계열(`Accent Yellow`)과 Montserrat Bold를 사용해 기대감/기회를 제시합니다.

### 2. 데이터 시각화 규칙 (Data Visualization Rules)
*   **추세선:** 모든 '변곡점'은 명확한 화살표(→)와 함께 표현되어야 합니다. 이 화살표는 **Accent Yellow (`#FFD700`)**로만 통일합니다.
*   **진단 결과 설명 박스:** 배경색을 Light Grey (`#F5F5F5`)로 설정하고, 핵심 키워드는 Dark Blue를 사용하여 전문성을 유지합니다.

---

## 🎬 SECTION 3: 영상 시퀀스별 디자인 및 모션 가이드라인 (Motion & Flow)
**(가장 중요하며, 애니메이션 방향성 제시)**

### 1. 전체 서사 흐름 기반 연출 원칙 (The Golden Rule)
*   **Pain $\rightarrow$ Gap $\rightarrow$ Solution $\rightarrow$ Gain:** 영상의 시각적 전환은 반드시 이 네 단계의 순서를 따릅니다.
    1.  **(Pain/좌절)**: **느리고, 어둡고(Dark Blue + Red-Orange), 정체된 느낌.** (현실 진단)
    2.  **(Gap/문제 인식)**: 위젯 점수가 낮은 상태로 *강조*되며, 시청자가 '왜?'라는 질문을 던지게 만듭니다.
    3.  **(Solution/AI 도입)**: **빠르게(Fast Cut), 밝고(Accent Yellow), 명쾌한 데이터 애니메이션**이 등장하며 시스템의 힘을 과시합니다.
    4.  **(Gain/승리)**: 점수가 급상승하는 시퀀스 (애니메이션)와 함께, 최종 목표치(`#FFD700`)가 화면 전체를 압도합니다.

### 2. 핵심 모션 가이드라인 (Key Animation Directives)
| 장면 | 목적 | 디자인 액션/모션 | 색상 강조점 | 담당 에이전트 |
| :--- | :--- | :--- | :--- | :--- |
| **Hook** (0:00-1:30) | 시선 즉각 확보, 문제 제기. | 진단 위젯의 낮은 점수(Pain)가 화면에 *강하게 꽂히듯* 나타나고, 배경이 어두워지며 긴장감을 높임. | `Warning Color` (빨간색 계열), Dark Blue | Leo (편집) / Kodari (데이터 연동) |
| **Solution Reveal** | AI 시스템 도입의 시각화. | 'AI 진단'이라는 텍스트가 데이터 플로우 차트와 함께 **빠르게, 기하학적 패턴**으로 화면에 그려지며(Drawing Effect), 복잡한 수치들이 깔끔하게 정리되는 애니메이션을 사용. | `Accent Yellow` (데이터의 빛), Dark Blue | Leo (편집) / Kodari (API 연동) |
| **Gain/성장 곡선** | 성공적인 변화의 시각적 증명. | 낮은 점수에서 높은 점수로 *직진하는 듯한* 급격하고 가파른 그래프 애니메이션. 마지막 목표치는 화면을 채우는 폭발력 있는 노란색(Yellow)으로 마무리. | `Accent Yellow` (성장), Dark Blue | Leo (편집) / Kodari (데이터 연동) |

---

## 🛠️ SECTION 4: 에이전트별 작업 체크리스트 (Handoff Checklist)
**(향후 콘텐츠 제작 시 필독)**

*   **✅ Writer:** 스크립트를 작성할 때, [Pain] 단계에서는 **의문형 문장**과 감성적 공감대를, [Gain] 단계에서는 **객관적인 수치와 증명된 결과(데이터 기반 톤)**를 사용해야 합니다.
*   **✅ Leo (Editor):** 위 가이드에 정의된 **'모션 및 흐름 원칙'**을 절대 벗어나지 마십시오. 특히 Pain $\rightarrow$ Gain 전환 시, 속도감과 색상 대비가 가장 중요합니다.
*   **✅ Kodari (Developer):** API 연동 데이터는 반드시 이 디자인 사양(특히 위젯의 폰트 크기, 컬러 코드)에 맞춰 포맷팅 되어야 합니다. **데이터가 곧 비주얼 에셋입니다.**

---