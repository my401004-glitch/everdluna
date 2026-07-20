# 🎨 AdCard 동적 디자인 시스템 가이드 (V1.0)
**목표:** A/B 테스트 데이터(Codari의 API Contract 기반)가 변경될 때, 브랜드 정체성(`Dark Blue` 신뢰/전문성, `Accent Yellow` 기회/경고)을 유지하며 시각적으로 최적화된 경험을 제공하는 컴포넌트 사양서.
**참조 타입:** src/types/adcard.ts (DynamicContent)

---

## 1. 전역 규칙 및 레이아웃 구조 (Global Layout & Structure)

*   **섹션 분할:** AdCard는 항상 **[Pain(위험)] $\rightarrow$ [Solution(솔루션)] $\rightarrow$ [Gain/CTA(기회)]**의 명확한 흐름을 유지해야 합니다.
    *   레이아웃은 3단 구조를 기본으로 하며, 모바일 환경에서는 세로 스크롤에 맞춰 메시지 블록이 순차적으로 배열되어야 합니다.
*   **폰트 계층:** 모든 제목(Headline)은 Montserrat Bold를 사용하되, 데이터의 긴급성/위험도에 따라 굵기 및 크기를 동적으로 조절합니다. [근거: Designer 검증된 지식]

## 2. 변수별 디자인 규칙 (Rules by Dynamic Variable)

### A. Pain 영역 (The Problem / Risk 강조)
*   **활용 데이터:** `dynamic_pain_message`, `diagnosis_score`
*   **시각적 목적:** 사용자의 불안감과 현재의 손실을 극대화하여 '문제 의식'에 공감하게 만듭니다.
*   **규칙 1: 배경 및 색상 (Color):** 전체 Pain 섹션은 **Dark Blue (`#0A2463`)**를 배경으로 사용하여 전문적이고 심각한 분위기를 조성합니다. [근거: Designer 검증된 지식]
*   **규칙 2: 메시지 강조 (Typography/Highlight):** `dynamic_pain_message`가 표시될 때, 이 문구의 **핵심 키워드(예: '시간 부족', '불안감')**는 배경색과 대비되는 빨간 계열 또는 경고성 노란색(`Accent Yellow`)으로 처리하여 즉각적인 시선을 끕니다.
*   **규칙 3: 점수 시각화 (Visualization):** `diagnosis_score`가 높을수록(위험도가 높을수록), **노출되는 그래프의 색상 폭과 기울기가 더 가파르게 표현되어야 합니다.** (예: Score > 70% $\rightarrow$ Yellow/Red Gradient)

### B. Solution 영역 (The Bridge / 공감 및 기대)
*   **활용 데이터:** `solution_headline`, `core_benefit`
*   **시각적 목적:** 문제 해결의 가능성을 제시하며, 희망을 심어줍니다.
*   **규칙 1: 배치/색상:** 배경은 Neutral Grey (`#F5F5F5`)를 사용하여 Pain 영역과 Gain 영역 사이에 '숨통'이 트인 느낌을 줍니다. [근거: Designer 검증된 지식]
*   **규칙 2: 헤드라인 처리 (Typography):** `solution_headline`은 Montserrat Bold를 사용하되, 크기는 가장 크게 설정하여 메시지 전달력을 확보합니다.

### C. Gain/CTA 영역 (The Opportunity / 행동 유도)
*   **활용 데이터:** `final_gain_message`, `cta_button_text`, `ab_test_group` (전환 여부), `conversion_flag`
*   **시각적 목적:** 즉각적인 이득(ROI)과 다음 행동을 명확하게 지시합니다.
*   **규칙 1: 색상 (Color):** CTA 버튼 자체는 **Accent Yellow (`#FFD700`)**를 사용하며, 배경은 Dark Blue로 돌아가 신뢰감을 기반으로 기회를 포착하도록 유도합니다. [근거: Designer 검증된 지식]
*   **규칙 2: 동적 메시지 (Dynamic Message):** `conversion_flag`와 `ab_test_group`에 따라 Gain 메시지의 내용이 달라져야 합니다.
    *   **A-Group (손실 회피 기반):** "지금 행동하지 않으면, 이 기회는 사라집니다." (Fear of Missing Out)
    *   **B-Group (권위 지향 기반):** "업계 최고 전문가들이 선택한 검증된 방법입니다." (Authority Bias)
*   **규칙 3: CTA 버튼 활성화:** `conversion_flag`가 `true`일 경우에만 CTA 버튼이 정상적으로 노출되어야 하며, 이 경우 버튼의 애니메이션 효과를 적용하여 클릭을 유도합니다.

---

## 3. 컴포넌트 기술 통합 로직 요약 (Developer Focus)
*   **데이터 흐름:** Codari API $\rightarrow$ **AdCard_Dynamic_Design_Guide.md 규칙 적용** $\rightarrow$ React/TS 컴포넌트 렌더링.
*   **최종 검증 항목:** 모든 `[근거: Designer 검증된 지식]`이 명시한 색상 코드와 타이포그래피 스타일이 이 가이드에 반영되어야 합니다.