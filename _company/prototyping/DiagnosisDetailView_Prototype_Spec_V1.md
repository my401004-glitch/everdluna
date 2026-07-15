# 🎨 통합 데모 시연회 프로토타입 설계 사양 (Diagnosis Detail View V1.0)

**[목표]** 기술적 안정성 검증 로직을 기반으로, Pain $\rightarrow$ Gain 흐름이 명확히 드러나는 인터랙티브 진단 보고서 프로토타입 제작.
**[핵심 컬러/폰트]** Primary: #0A2463 (Dark Blue), Accent: #FFD700 (Yellow), Body: #F5F5F5 (Grey). Title: Montserrat Bold, Body: Noto Sans KR.

## 1. 구조 및 레이아웃 정의
- **전체 비율:** 모바일/데스크톱 공통 16:9 최적화.
- **섹션 A: Diagnosis Summary Header**
    - [Component] 진단명 (H2, Montserrat Bold, #0A2463)
    - [Component] 최종 Gap Score (h1, Accent Yellow 배경의 대형 숫자).
    - [Component] 리스크 요약 문구 (Noto Sans KR, Pain/Gain 프레임워크에 따른 텍스트 배치).

## 2. 핵심 모듈: Problem $\rightarrow$ Gain Pivot Point (B Section)
*   **레이아웃:** 가로 분할 (Flexbox) - 왼쪽(Pain) / 오른쪽(Gain). 각 섹션은 카드 형태로 독립성을 유지.
*   **[Pain Card] (기술적 결함 지표)**
    - **배경:** Dark Blue 계열의 낮은 채도 배경을 사용해 '위험' 컨셉 강조.
    - **핵심 요소 1: 위험 수치 표시:** 진단된 취약점별 점수(0~100)를 Gauge Meter 형태로 시각화. 점수가 낮을수록 Accent Yellow 영역이 커지도록 설계.
    - **핵심 요소 2: 근거 제시:** 해당 취약점이 '기술적 안정성 보고서'의 어떤 데이터를 기반으로 했는지 명확히 출처 표기 (예: *[Source: Harmony Scale Frequency Report]*).
*   **[Gain Card] (솔루션 적용 이득 예측)**
    - **배경:** 밝은 Neutral Grey 또는 미묘하게 푸른 그라데이션을 사용하여 '희망/개선' 컨셉 강조.
    - **핵심 요소 1: 예측 지표:** 개선될 수치(%)를 큰 숫자로 제시하고, 상승하는 화살표 아이콘과 함께 배치.
    - **핵심 요소 2: ROI 근거:** 이득이 발생하는 논리적 근거 (예: "본 교육 시스템은 사용자 패턴을 재설정하여 데이터 Gap을 메웁니다.")

## 3. 인터랙티브 모듈: 성장 히스토리 시각화 (C Section)
*   **구현 방식:** 시간 축(Timeline Slider) 기반 애니메이션 필수.
*   **기능:** 사용자가 슬라이더를 움직이면, 그래프 상의 데이터 포인트가 **[과거 시점 (Pain)] $\rightarrow$ [개선 과정] $\rightarrow$ [현재 예측치 (Gain)]** 순서로 색상 변화와 크기가 변하는 것을 보여준다.
*   **데이터 매핑:** 코다리가 제공할 `System_Stability_Report` 데이터를 이 그래프에 1:1로 매핑해야 함.