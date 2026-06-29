# 🎥 Video 4: CTA 디자인 사양서 (VADP v1.0)

## 🎯 1. 목표 및 원칙 (Goal & Principle)
*   **핵심 목적:** 시청자가 자신의 목소리 문제에 대해 '직감'이 아닌 '객관적인 지표(데이터)'로 인식하게 만들어, 유료 진단 테스트 참여를 강제한다.
*   **톤앤매너:** 충격적이고 전문적이며, 권위 있는 과학적 데이터 제시 톤 (Empowering & Scientific).
*   **지정된 에셋 활용:**
    *   Primary Color (신뢰): Dark Blue (`#0A2463`) [근거: Designer 검증된 지식]
    *   Accent Color (CTA/Gain): Accent Yellow (`#FFD700`) [근거: Designer 검증된 지식]
    *   Background/Data: Neutral Grey (`#F5F5F5`) [근거: Designer 검증된 지식]
    *   폰트: Title - Montserrat Bold / Body - Noto Sans KR [근거: Designer 검증된 지식]

---

## 💡 2. 스크립트 기반 시각 전환 흐름 (Emotional Flow Mapping)

| 단계 | 스크립트 내용 | 감정적 목표 (Emotion) | 디자인 컨셉 (Visual Concept) | 주요 색상 팔레트 |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Pain Point** | "가슴으로 부른다", "모호한 조언만 던진다." | 불안감, 의심 유발 (Anxiety) | 혼란스러운 에너지의 시각화. 흐릿하고 모호한 배경 이미지 사용. | Dark Blue 계열의 어두운 그라데이션 + 경고성 회색조. |
| **Phase 2: Shocking Data** | "공명 주파수의 불균형을 측정합니다." / "평균 $\pm 8\text{Hz}$ 이상 불안정..." | 충격, 객관적 문제 인식 (Shock) | 깔끔한 UI/UX 데이터 그래프 오버레이. 수치와 지표를 극대화하여 제시. | Neutral Grey 배경 + **빨간색 또는 Dark Blue**의 강조된 불균형 수치. |
| **Phase 3: Solution & CTA** | "AI 기반 객관적 진단 시스템입니다." / "시스템으로 승리하라." | 희망, 행동 유도 (Gain/Action) | 명확한 구조와 로드맵 제시. 최종 CTA 버튼을 가장 밝고 선명하게 강조. | **Accent Yellow (`#FFD700`)**를 핵심 포인트로 사용. Dark Blue의 안정감 결합. |

---

## 🖼️ 3. 상세 비주얼 컴포넌트 및 레이아웃 (Mockup & Layout)

### A. Phase 2: 데이터 제시 구간 (The Diagnostic Reveal, 5~8초)
*   **레이아웃:** 화면의 약 70%를 차지하는 **'가상의 진단 대시보드(Dashboard)' 컴포넌트**를 중앙에 배치한다.
*   **핵심 요소:**
    1.  **Title (Montserrat Bold):** "발성 주파수 불균형 분석 결과" (좌측 상단).
    2.  **Data Visualization (필수):** 공명 주파수를 나타내는 가상의 사인파 그래프를 애니메이션으로 그려 넣는다. 그래프가 불안정하게 떨리거나, 특정 영역(Pain Zone)에서 크게 벗어나는 지점을 **빨간색 하이라이트**로 표시해야 한다.
    3.  **Critical Metric (CTA 유도):** 가장 큰 폰트로 "불안정 수치: $\pm X \text{Hz}$"를 제시한다. 이 값은 반드시 `Accent Yellow`로 강조되어야 하며, 시청자가 자신의 데이터를 대입하게 만드는 효과를 노린다.
*   **기술 지시:** 데이터 그래프는 단순 이미지 아님. 꺾은선 그래프 형태의 **애니메이션 트랜지션(Animated Transition)**으로 구현해야 한다.

### B. Phase 3: 최종 CTA 컴포넌트 (The Call to Action, 마지막 5초)
*   **목적:** 시청자의 모든 불안감을 해소하고, '해결책'이라는 확신을 심어주며 즉각적인 액션을 유도한다.
*   **레이아웃:** 화면 전체를 Dark Blue 배경으로 깔끔하게 통일하여 신뢰도를 최고로 높인다.
*   **구성 (상 -> 하 순서):**
    1.  **헤드라인 (Montserrat Bold, 36pt):** "더 이상 추측하지 마세요. 객관적인 진단이 필요합니다." (`#FFD700` 강조)
    2.  **핵심 메시지:** "AI 기반 공명 주파수 분석 시스템으로 당신의 근본적 문제를 파악하세요." (Noto Sans KR, 24pt).
    3.  **CTA 버튼 영역 (가장 중요):**
        *   **Button Design:** 모서리가 약간 둥글고(Border Radius: 8px), 배경색은 **Accent Yellow (`#FFD700`)**.
        *   **Text:** "무료 공명 주파수 진단 시작하기" (Noto Sans KR, Bold).
        *   **Animation:** 버튼이 화면에 나타날 때 미세한 '펄스(Pulse)' 애니메이션을 적용하여 시선을 강하게 붙잡는다.

---

## 🖥️ 4. 개발 및 기술 구현 가이드라인 (VADP Compliance)

### A. 프론트엔드/편집팀 참고 사항
1.  **애셋 패키징:** Phase 2에서 사용된 모든 데이터 그래프 레이어(벡터 파일 권장)는 `Video4_DataGraph_LayerSet_V1.zip`으로 통합되어 제공되어야 한다.
2.  **트랜지션 정의:** Phase 1 $\rightarrow$ Phase 2로 넘어갈 때, 배경이 Dark Blue에서 Neutral Grey로 '데이터가 투사되는' 듯한 **글리치(Glitch) 또는 데이터 스트림 오버레이 효과**를 사용하여 기술적 전환을 명확히 해야 한다.

### B. 백엔드/개발팀 참고 사항 (Kodari 필수 검토 항목)
1.  **랜딩 페이지 연동:** 최종 CTA 버튼은 반드시 **특정 랜딩 페이지 URL(예: `[AI_Diagnosis_Link]`)로 이동시키는 기능을 탑재**해야 한다. 단순한 텍스트 링크가 아니다.
2.  **데이터 수집 이벤트:** 사용자가 CTA 버튼을 클릭하는 순간, 해당 세션의 **사용자 추정치/지역 정보 등의 이벤트를 로그 시스템에 기록**할 수 있는 콜백 함수(`onCtaClick(userId)`)를 준비해야 한다. (마케팅 퍼널 추적 필수).
3.  **컴포넌트 재활용:** Phase 2의 데이터 그래프 컴포넌트는 향후 모든 마케팅 콘텐츠에서 **'객관적 증거 제시'** 시퀀스로 재활용 가능하도록 모듈화해야 한다.