# 🎬 Hook 1: Gap Score 시각화 애니메이션 디자인 스펙 (V1.0)

## 💡 핵심 목표
Gap Score 데이터가 '추상적인 수치'가 아닌, **실시간으로 변화하고 증명되는 객관적 근거**로 보이게 함으로써 시청자의 불안감(Pain)을 즉시 해소하는 시각적 충격을 주는 것.

## 🎨 비주얼 시스템 기반
*   **컬러 팔레트:** Dark Blue (`#0A2463`), Accent Yellow (`#FFD700`), Neutral Grey (`#F5F5F5`)
*   **타이포그래피:** Montserrat Bold (헤드라인), Noto Sans KR (데이터 레이블)

## ⏱️ 애니메이션 시퀀스 브리프 (총 예상 시간: 12초)

### [Phase 1: Problem Introduction & Hook (0~3초)]
*   **목표:** 현재의 '위험' 상태를 강렬하게 제시하여 시청자의 주의 집중(Hook) 유도.
*   **비주얼 요소:**
    1.  화면 중앙에 큰 Gap Score 수치 박스 등장. 배경은 어두운 Dark Blue 톤을 유지하며 긴장감 조성.
    2.  수치가 **빨간색 경고(`#FFD700`와 대비되는 강렬한 계열)**로 깜빡이며 나타남 (애니메이션: Scale Up + Flash).
    3.  **텍스트 애니메이션:** Montserrat Bold를 사용하여 "데이터의 사각지대(Blind Spot)" 또는 "미확인 변수" 등의 Pain Point 문구가 화면에 타이핑 효과로 등장하며 공포감을 조성.
*   **사운드 스펙 (참고):** 낮게 깔리는 앰비언트 베이스 사운드, 경고음 톤의 짧은 '띠링' 사운드.

### [Phase 2: Solution Introduction & Data Flow Visualization (3~9초)]
*   **목표:** 솔루션(시스템)이 문제를 어떻게 객관적으로 해결하는지 데이터 흐름으로 증명.
*   **비주얼 요소:**
    1.  화면 전환: 배경은 Neutral Grey 계열로 바뀌며 안정감을 제공 (애니메이션: 부드러운 페이드 아웃/인).
    2.  **핵심 시각화:** Gap Score 데이터가 그래프 형태(Line Chart)로 그려지기 시작함. 이 과정 자체가 애니메이션의 핵심이 되어야 함. (애니메이션: Graph Drawing Effect - 0%에서 100%까지 점진적으로 라인/데이터 포인트 연결).
    3.  **데이터 레이블:** 데이터가 상승하는 지점마다 Accent Yellow(`#FFD700`)로 강조된 작은 '획득(Gain)' 마커를 배치하고, Noto Sans KR로 구체적인 수치를 표시 (애니메이션: Pop-up + Fade In).
    4.  **전환 애니메이션:** 기존의 'Pain'을 상징하던 빨간색 경고 영역이 데이터가 채워지면서 점차 Dark Blue와 Accent Yellow의 조합으로 바뀌는 시각적 변곡점(Transition)을 보여줌.

### [Phase 3: Call to Action & Conclusion (9~12초)]
*   **목표:** 최종적으로 얻게 될 '결과'를 명확히 제시하며 CTA 유도.
*   **비주얼 요소:**
    1.  화면 전체가 다시 Dark Blue와 Accent Yellow의 조합으로 안정적이면서도 강렬하게 전환됨.
    2.  최종 Gain 수치(예: "LTV 30% 상승")를 가장 크게, Montserrat Bold로 중앙에 배치 (애니메이션: Zoom In + Bounce).
    3.  CTA 버튼이 화면 하단에 Yellow(`#FFD700`) 배경으로 즉시 나타나고, 클릭을 유도하는 애니메이션(Pulse Effect) 실행.

---
**[디자인 가이드라인 요약]**

| 요소 | 상세 스펙 | 사용 목적 |
| :--- | :--- | :--- |
| **Dark Blue (`#0A2463`)** | 신뢰, 배경, 안정화된 상태의 기본 컬러. | 전문성과 깊은 신뢰감을 부여합니다. (Pain 해소 후) |
| **Accent Yellow (`#FFD700`)** | 주목, 기회, CTA/Gain 수치 강조. | 시청자의 눈을 사로잡아 즉각적인 행동(클릭)을 유도하는 핵심 색상입니다. |
| **Transition Rule** | Pain (Reddish/Dark Blue) $\rightarrow$ Data Flow (Blue/Yellow Mix) $\rightarrow$ Gain (Bright Yellow)의 3단계 컬러 변화를 애니메이션으로 반드시 구현합니다. | 사용자에게 감정적 여정을 제공하고, 시스템의 가치를 극대화합니다. |