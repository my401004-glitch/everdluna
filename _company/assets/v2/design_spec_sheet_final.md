# 🎨 통합 비주얼 에셋 제작 사양서 (Final Specification)
**프로젝트:** 실용음악 AI 활용 교육 콘텐츠
**버전:** V1.0
**작성자:** Designer Lead Agent

## 🎯 목표: 시각적 서사 구현을 위한 애니메이션 및 클립 라이브러리 통합 규격 정의

### 💡 핵심 원칙 (Pain $\rightarrow$ Gain)
모든 시각 요소는 '위험(Risk)' 제시와 '이득(ROI)' 제시가 명확히 분리되어야 합니다. 색상과 애니메이션의 변화 자체가 서사적 기능을 수행합니다.

---

### 🎨 1. 시스템 상수 (Constants Reference)
*   **Color Palette:** Primary Trust: `#0A2463`, Accent Gain/Risk: `#FFD700`, Background Data: `#F5F5F5`
*   **Typography:** Title (Montserrat Bold), Body (Noto Sans KR Regular/Medium)

### 🎬 2. 필수 애니메이션 에셋 목록 및 구현 사양

#### A-01. Pain/Risk State 시각화 모듈
*   **기능:** Gap Score가 임계치 초과를 알리는 '위험 경고' 효과.
*   **사양:** Lottie JSON 포맷 권장. 붉은 계열의 색상 변화(경고)와 함께 그래프/게이지바의 급격한 상승 애니메이션을 구현할 것. (1~2초 루프).

#### A-02. Solution Input & Transition 클립
*   **기능:** 솔루션 발견 및 학습 시작 시 발생하는 '지식 주입' 느낌의 전환 효과.
*   **사양:** Diffusion/Light Spread 애니메이션을 사용하며, 배경색 `#0A2463`에서 점차 밝아지며 콘텐츠가 채워지는(Filling) 느낌이어야 합니다. (1.5초 Transition).

#### A-03. Gap Score 감소/성장 트래킹 모듈 (Core Component)
*   **기능:** 시간 경과에 따른 성능 개선을 가장 명확하게 보여주는 핵심 시각화 컴포넌트.
*   **기술 요구사항:**
    1.  `data_points: [T1, T2, ..., Tn]` 형태의 Time Series Array를 입력받는다.
    2.  그래프 라인은 반드시 부드러운 S-Curve 패턴을 따라야 하며(Bezier Curve), 애니메이션은 데이터 포인트에 맞춰 점진적으로 그려져야 한다.
    3.  색상 변화: 초기 값(T1)에서는 `#FFD700`이 지배적이며, 최종 값(Tn)으로 갈수록 `#0A2463`의 비율이 높아지도록 색상이 그라데이션되어야 함.

#### A-04. Final CTA/Gain 강조 모듈
*   **기능:** 궁극적인 성공을 시각적으로 폭발시키며 청중에게 강한 인상을 남김.
*   **사양:** 최종 수치를 `#FFD700`으로 크게 노출하며, 주변에 빛 번짐(Bloom Effect) 효과와 함께 '성공'을 상징하는 패턴(예: 별 모양 또는 체크 마크의 애니메이션 폭발)이 추가되어야 합니다. (1초 이내의 강력한 임팩트).

---
**[개발자 참고 사항]**
*   모든 에셋은 벡터 기반으로 제공되어야 하며, React/TSX 컴포넌트로 통합하기 용이해야 합니다.