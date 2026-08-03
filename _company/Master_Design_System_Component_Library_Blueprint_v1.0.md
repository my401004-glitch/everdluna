# 🎨 아지트아트컴페니 디자인 시스템 컴포넌트 라이브러리 청사진 v1.0

## I. 목표 및 적용 원칙
*   **목표:** 모든 콘텐츠(썸네일, 본문 슬라이드, 랜딩 페이지)에 재사용 가능한 표준 컴포넌트를 정의하여 생산 효율성을 극대화한다.
*   **핵심 원칙:** Pain $\rightarrow$ Data Shock (Gap Score) $\rightarrow$ Gain/CTA의 시퀀스 구조를 모든 컴포넌트에 강제 적용한다.

## II. 비주얼 및 레이아웃 컴포넌트 정의 (Designer 담당)

### 1. 핵심 데이터 시각화 컴포넌트: [The Gap Gauge]
*   **기능:** 현재 상태(Actual Score)와 이상적인 목표치(Target Score) 사이의 '간극(Gap)'을 직관적으로 보여주는 게이지 형태.
*   **규격:**
    *   레이아웃 좌표: 120px x 350px (모바일 기준).
    *   색상 규칙:
        *   Target Zone (이상적): Dark Blue (`#0A2463`)
        *   Warning Zone (위험/Pain): Accent Yellow (`#FFD700`) - *Gap이 클수록 노란색 영역 확장.*
        *   Current Zone (현재/성장): Neutral Grey (`#F5F5F5`)
    *   **모션 가이드:** 게이지 바가 왼쪽에서 오른쪽으로 채워지는(Filling) 애니메이션을 적용하여 '채우는 행위'를 시각화한다.

### 2. 헤드라인/강조 컴포넌트: [Impact Headline Box]
*   **기능:** 영상 또는 포스트의 가장 중요한 메시지("Pain" 또는 "Gain")를 폭발적으로 전달하는 영역.
*   **규격:**
    *   폰트: Montserrat Bold (최대 72pt).
    *   배경: Dark Blue (`#0A2463`) 배경에 노란색 하이라이트를 부분 적용하여 시선 집중.
    *   텍스트 효과: 글자 단위로 타이핑되거나(Typewriter effect) 크기가 커지는(Scale up) 모션을 기본값으로 설정한다.

### 3. 데이터 제시 컴포넌트: [Stat Card]
*   **기능:** 핵심 통계 수치(KPI)를 단순 명료하게 제시.
*   **규격:**
    *   레이아웃: 사각형 카드 형태 (150px x 120px).
    *   구성 요소: **[숫자]** (가장 크게, Montserrat Bold), 아래에 *설명 텍스트* (Noto Sans KR Regular).
    *   강조: 수치가 '상승'했으면 Accent Yellow로 강조, '하락'했으면 Dark Blue 배경에 흰색으로 대비 강조.

## III. 사운드 및 모션 컴포넌트 정의 (Luna 담당)

### 1. Transition Sound Set
*   **사용처:** Act I $\rightarrow$ Act II 전환 시점 (문제 제기에서 분석으로 넘어갈 때).
*   **지침:** '화이트 노이즈 스윕(White Noise Sweep)' 또는 '글리치 사운드(Glitch SFX)'를 사용하여 청각적 충격을 주어 몰입도를 높인다.

### 2. Data Reveal Sound Set
*   **사용처:** Gap Gauge의 수치가 최종적으로 확정되어 제시되는 순간.
*   **지침:** 낮은 주파수 대역에서 짧게 '웅장하게(Deep Rumble)' 울리는 사운드를 적용하여, 정보가 단순한 데이터가 아닌 **'결론'**임을 강조한다.

## IV. 개발 및 로직 검증 (Kodari 담당)

### 1. API Endpoint 정의
*   Gap Score 산출 시뮬레이션에 필요한 가상의 API 엔드포인트를 정의하고 Mockup 데이터를 준비합니다. (`/api/v1/calculate_gap`)
    *   Input: `{"actual_score": float, "target_score": float}`
    *   Output: `{"gap_percentage": float, "status": ["Warning", "Safe"]}`

### 2. 컴포넌트 통합 검증 (E2E Test)
*   **테스트 케이스:** Gap Score가 '0'일 때와 최대치인 '100%'일 때의 시각적/사운드 반응이 매끄럽게 연결되는지 테스트해야 한다.
*   **필수 구현:** 모든 컴포넌트 전환에는 **[Transition Sound Set]**이 반드시 연동되도록 코딩 로직을 확립한다.

---