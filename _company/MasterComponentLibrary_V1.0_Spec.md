# 🎨 마스터 컴포넌트 라이브러리 V1.0 명세서 (Funnel-Driven)
**작성 목적:** 확정된 Funnel Map과 가격 구조를 시각적으로 일치시키는, 모든 콘텐츠(랜딩 페이지, 영상/썸네일)에 즉시 적용 가능한 핵심 모듈 세트 정의.

## 📋 1. 라이브러리 개요 및 원칙 (Source of Truth)
*   **기반 로직:** Pain $\rightarrow$ Insight $\rightarrow$ Solution/Gain (ROI 증명 논리). [근거: Designer 검증된 지식]
*   **톤앤매너:** 전문성, 객관적 측정, 명확한 전환 유도.
*   **활용 범위:** 랜딩 페이지 전체 섹션, 모든 썸네일 및 영상 인트로/클로징 화면.

## 🎨 2. 디자인 시스템 재확인 (Design System Recap)
| 요소 | 정의 (Code) | 사용 목적 | 비고 |
| :--- | :--- | :--- | :--- |
| **Primary Color (신뢰)** | Dark Blue (`#0A2463`) | 배경, 헤더, 핵심 데이터 영역. 신뢰감 구축. | [근거: Designer 검증된 지식] |
| **Accent Color (CTA/Gain)** | Accent Yellow (`#FFD700`) | CTA 버튼, '기회/성공' 수치 강조, 이탈 위험 표시(Pain). | [근거: Designer 검증된 지식] |
| **Background** | Neutral Grey (`#F5F5F5`) | 본문 텍스트 배경. 가독성 확보. | [근거: Designer 검증된 지식] |
| **Headline Type** | Montserrat Bold | Pain/Gain 핵심 메시지(헤드라인). 강력한 임팩트 제공. | [근거: Designer 검증된 지식] |
| **Body Type** | Noto Sans KR (Regular) | 데이터, 상세 설명 텍스트. 높은 가독성 보장. | [근거: Designer 검증된 지식] |

## 🧩 3. 핵심 모듈 컴포넌트 정의 (The Funnel Modules)
모든 콘텐츠는 다음의 순차적 흐름을 반드시 따르며, 각 단계별 전용 컴포넌트를 사용합니다.

### M-01: [Pain Point / Hook Shock] - 위기감 조성 모듈 (Dark Blue/Yellow 강조)
*   **목표:** 타겟의 현재 상태(Status Quo)가 얼마나 위험한지 즉각적으로 자극하여 시선 고정.
*   **핵심 비주얼:** 경고 사인 아이콘, 급격히 떨어지는 그래프, 충격적인 숫자 제시.
*   **디자인 특징:** Dark Blue 배경에 Accent Yellow로 '위험 수치'를 표시 (Gap Score 개념 차용).
*   **필수 요소:** **"당신의 현재 실력은 O점입니다."** 형태의 진단 점수 시각화 위젯.

### M-02: [Insight / Problem Definition] - 문제 정의 모듈 (Grey/Blue 대비)
*   **목표:** Pain Point가 막연한 감정이 아닌, '측정 가능한 객관적 손실'임을 증명.
*   **핵심 비주얼:** 데이터 차트(과거-현재), 경제적 비용 환산 테이블.
*   **디자인 특징:** Noto Sans KR을 활용하여 전문적인 보고서 느낌을 주며, **"이대로 가면 놓치는 기회비용: XX만원"** 이라는 문구를 명확히 제시.

### M-03: [Solution / Value Proposition] - 해결책 제시 모듈 (Bright Blue/Yellow)
*   **목표:** 서비스가 왜 유일한 해답인지 논리적으로 설득.
*   **핵심 비주얼:** 3~5단계의 명확한 프로세스 다이어그램, Before/After 비교 시각화.
*   **디자인 특징:** 애니메이션 전환이 용이하도록 모듈형 플로우차트 구성. 레오가 이 부분을 설명할 때 가장 임팩트 있어야 함.

### M-04: [Pricing / Tier Comparison] - 가치 증명 및 선택 유도 모듈 (Yellow/Blue 대비)
*   **목표:** Bronze $\rightarrow$ Silver $\rightarrow$ Gold 순으로 가치가 기하급수적으로 증가함을 시각화.
*   **핵심 비주얼:** 3단 카드(Card) 비교 구조 (Funnel Map의 핵심).
*   **디자인 특징:** **Gold 티어에만 Accent Yellow로 포커스 라이트 효과**를 주고, "최적 선택"임을 강조하는 시각적 계층구조 확립.

### M-05: [CTA / Conversion] - 최종 행동 유도 모듈 (High Contrast)
*   **목표:** 망설이는 고객에게 즉각적인 결정을 촉구.
*   **핵심 비주얼:** CTA 버튼, 보증/환불 정책 안내, '지금 등록하기'와 같은 강력한 문구.
*   **디자인 특징:** 배경과 가장 대비되는 색상 (예: 진한 Blue 배경에 Yellow 텍스트)을 사용하여 시각적 충격 최대화.

## 📝 4. 실행 가이드라인 및 다음 스텝
1.  **[Action]**: 이 명세서를 바탕으로 Figma에서 위의 5개 모듈 컴포넌트 세트를 제작합니다. (재사용 가능한 Figma Component Set 구축)
2.  **[Review]**: Business Agent에게 M-04 (Pricing/Tier Comparison)의 로직적 흐름(가치 증가 곡선)에 대한 최종 검토를 요청합니다.