# ✨ 아지트아트컴페니 - 영상 목업 디자인 시스템 구현 (V2.0)

## 🎯 I. 핵심 비전 및 구조 원칙
*   **프레임워크:** Pain $\rightarrow$ Gain (Risk 제시 $\rightarrow$ ROI/솔루션 제시). 모든 시각 요소는 이 논리 흐름을 따라야 함. [근거: Designer 검증된 지식]
*   **톤 앤 매너:** 전문적이고, 데이터 기반이며, 위기감을 조성하는 동시에 해결책을 통해 희망을 주는 '진단 리포트' 스타일.
*   **기술 반영 원칙 (Constraint):** 썸네일/영상은 **최대 가독성 영역(Clear Zone)**을 확보해야 하며, 복잡한 그래프는 단순화된 아이콘 또는 게이지 형태로 대체한다.

## 🎨 II. 디자인 시스템 컴포넌트 재확인
*   **Primary Color (신뢰):** Dark Blue (`#0A2463`) - 배경 및 주요 정보 영역 (Professionalism). [근거: Designer 검증된 지식]
*   **Accent Yellow (경고/기회):** Accent Yellow (`#FFD700`) - Pain(위험), Gap Score, CTA 강조. [근거: Designer 검증된 지식]
*   **Body Color:** Neutral Grey (`#F5F5F5`) - 데이터 배경 및 가독성 확보. [근거: Designer 검증된 지식]
*   **Title Font:** Montserrat Bold (강렬함, 헤드라인). [근거: Designer 검증된 지식]
*   **Body Font:** Noto Sans KR (가독성, 데이터 제시). [근거: Designer 검증된 지식]

## 🖼️ III. Mockup 상세 레이아웃 스펙 (썸네일 및 영상 시작부 공통)

### A. 상단 섹션 (Pain/위기감 조성 - Hook)
*   **배경:** Dark Blue (`#0A2463`) 단색 배경을 사용하여 무게감을 부여한다.
*   **핵심 요소:** 큰 글씨의 질문 형태 헤드라인과 시각적 위험 지표(KPI 미달).
    *   **헤드라인 (Title):** "혹시, 당신의 실기 준비가 '이것' 때문에 흔들리고 있진 않나요?" (Montserrat Bold, White Text) [근거: Designer 검증된 지식]
    *   **서브 텍스트:** "AI 분석에 따르면, 현재 *데이터 흐름 안정성(KPI)*이 가장 취약합니다." (Noto Sans KR, Yellow Highlight on 'KPI')
    *   **비주얼 컴포넌트 (Gap Score):** 화면 좌측 상단에 게이지 형태의 위험 지표를 배치.
        *   **디자인:** 원형 그래프 또는 세그먼트 바 사용.
        *   **상태:** 붉은색 계열의 Yellow (`#FFD700`와 유사한 Warning Tone)로 채우고, '위험' 아이콘(🚨)을 배치하여 즉각적인 시선 집중 유도.

### B. 중앙 섹션 (핵심 증거 제시 - Proof/Data Visualization)
*   **배경:** Neutral Grey (`#F5F5F5`) 영역으로 전환하여 데이터 가독성을 극대화한다.
*   **레이아웃:** 2분할 구조 (Pain Point / 근본 원인).
    1.  **Left Pane (문제점):** 'KPI 미달'의 구체적 증거 제시.
        *   **제목 (Title):** "🚨 데이터 기반의 문제: 낮은 DCR(Data Consistency Rate)" (Montserrat Bold, Dark Blue Text)
        *   **시각화:** 간결한 막대 그래프 모형 사용. 목표치(Dark Blue)와 현재 수치(Light Grey)를 명확히 대비시키고, 그 사이의 Gap을 Accent Yellow로 강조한다. [근거: Designer 검증된 지식]
    2.  **Right Pane (원인 분석):** '왜' 문제가 발생했는지 직관적 아이콘으로 설명.
        *   **컴포넌트:** 3개의 작은 카드 모듈(Icon + Noto Sans KR Text).
        *   **내용 예시:** ① 비체계적인 연습 루틴 (❌ Icon), ② 최신 트렌드 반영 부족, ③ 데이터 연동의 부재.

### C. 하단 섹션 (솔루션 제시 - Gain/CTA)
*   **배경:** Dark Blue (`#0A2463`)로 다시 전환하여 마무리와 신뢰감을 확보한다.
*   **핵심 요소:** '해결책'의 명확한 제안과 CTA 버튼.
    *   **헤드라인 (Title):** "✅ 해결책: AI 기반 시스템 최적화 프로그램으로 재도약!" (Montserrat Bold, White Text)
    *   **설명 텍스트:** "막연한 감성 학습 대신, 데이터로 증명된 빈틈을 메우세요. 아지트아트컴페니가 완성합니다." (Noto Sans KR, Light Grey Text)
    *   **CTA 버튼:** 크고 눈에 띄는 직사각형 형태. **Accent Yellow (`#FFD700`)** 배경에 "무료 진단 받아보기" 문구 (Montserrat Bold).

## 🚀 IV. 기술적 구현 및 애니메이션 가이드라인 (Technical Constraint Integration)
*   **전환 효과:** Pain 섹션에서 Gain 섹션으로 넘어갈 때, Dark Blue $\rightarrow$ Neutral Grey $\rightarrow$ Dark Blue로 색상 전환이 순차적으로 발생하며 '진단 과정'을 시각화한다.
*   **KPI 강조:** 데이터 그래프의 Gap Score는 단순 수치 표시가 아닌, **Yellow 빛이 채워지며 부풀어 오르는 (Inflation/Highlight) 애니메이션**으로 구현하여 임팩트를 극대화해야 한다.