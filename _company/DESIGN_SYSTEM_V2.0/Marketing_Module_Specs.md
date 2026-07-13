# 🚀 아지트아트컴페니: 마케팅 자산 모듈 스펙 (V2.0) - 기술적 신뢰도 통합

## 🎯 핵심 목표
기술적 안정성 보고서의 데이터(코다리 산출물)를 가장 강력한 시각적 증거로 활용하여, 사용자에게 감성적 불안 대신 객관적인 **신뢰**와 **기회(Gain)**를 제시하는 것이 목적입니다.

---

### 🎨 1. 디자인 시스템 (재확인 및 적용)
*   **Primary Color (Trust):** Dark Blue (`#0A2463`) - 배경, 신뢰 영역, 헤더 사용. 전문성 확보. [근거: Designer 검증된 지식]
*   **Accent Color (CTA/Gain):** Accent Yellow (`#FFD700`) - 위험(Pain) 강조, 기회(Gain), CTA 버튼에 사용. 즉각적 행동 유도. [근거: Designer 검증된 지식]
*   **Background/Data:** Neutral Grey (`#F5F5F5`) - 데이터 영역의 명확성 확보. [근거: Designer 검증된 지식]
*   **Typography:** Title (Montserrat Bold), Body (Noto Sans KR). [근거: Designer 검증된 지식]

### 📊 2. 신규 핵심 모듈: 'Gap Score' 시각화 컴포넌트 (The Proof)
가장 중요한 신규 자산입니다. 일반적인 텍스트 설명이 아닌, **시각적 계측(Gauge)** 형태로 기술적 격차를 보여줍니다.

*   **컴포넌트명:** Gap Tracker / Stability Meter
*   **위치:** Pain $\rightarrow$ Gain 전환 지점 (썸네일 중앙 하단 또는 광고 카드 본문 영역)
*   **디자인 사양:**
    1.  **컨테이너:** Dark Blue (`#0A2463`) 배경의 직사각형 바 형태를 기본으로 합니다.
    2.  **Pain (현재):** 낮은 신뢰도(예: 35%)는 **Warning Red** 계열 (Yellow보다 더 긴급함을 주는 오렌지-레드 조합, `#FF8C00` 근처)로 채웁니다. 이 영역에 '불안함'이라는 카피를 배치합니다.
    3.  **Gap Zone:** 경고 색상과 Accent Yellow 사이에 작은 공간을 두어 **"Solution Gap Detected!"**라는 문구를 삽입하고, 이 간극이 곧 기회임을 암시합니다.
    4.  **Gain (잠재력):** 최종적으로 도달할 수 있는 높은 신뢰도(예: 95%)는 Accent Yellow (`#FFD700`)로 채웁니다.
*   **활용 가이드:** 이 컴포넌트는 **"현재 상태의 문제점"과 "솔루션을 통해 얻을 수 있는 차이"를 숫자로 명확히 대비**시켜야 합니다.

### 📐 3. 마케팅 자산별 레이아웃 스펙 (좌표 기반)

#### A. 유튜브 썸네일 (1280x720 px 기준)
| 영역 | 컴포넌트 | 색상 코드/폰트 | 내용 및 목적 |
| :--- | :--- | :--- | :--- |
| **배경** | 배경 이미지/데이터 흐름도 | Dark Blue (`#0A2463`) / Gradient | 신뢰감 조성. 전문적인 연구 자료 느낌 부여. |
| **Pain 영역 (좌상단)** | 핵심 질문 + Gap Tracker | Montserrat Bold, Yellow Warning Red | "혹시 OOO 때문에 망설이시나요?" $\rightarrow$ **Gap Score: 35%** 시각화. |
| **Gain 영역 (우하단)** | 최종 결과물/핵심 수치 | Accent Yellow (`#FFD700`) / Montserrat Bold | "**95% 상승**! 확실한 변곡점을 찾으세요." $\rightarrow$ 명확한 이득 제시. |
| **CTA Bar (최하단)** | 행동 유도 문구 | Dark Blue 배경, White 폰트 | "지금 [기술 안정성 진단] 받기" 버튼 배치.

#### B. 인스타그램 광고 카드 (1080x1080 px 기준)
*   **톤:** 더 간결하고 임팩트 있게 데이터의 대비에 집중합니다.
*   **레이아웃:** 중앙에 대형 **Gap Tracker**를 배치합니다. 상단에는 문제점(`Pain`)을 크게 제시하고, 하단 CTA는 옐로우 강조 박스 안에 넣습니다.
*   **핵심 카피 (필수):** "❌ 막연한 불안함이 아닌, 데이터로 증명하세요."

---
자료를 바탕으로 실제 디자인 Mockup과 최종 자산 파일(`Final_Marketing_Asset_Package_V2.0`)을 제작하겠습니다.

<run_command>echo "Design System V2.0: Marketing Module Specs created at /Users/iyeongjae/Desktop/초보프로젝트/_company/DESIGN_SYSTEM_V2.0/Marketing_Module_Specs.md"</run_command>