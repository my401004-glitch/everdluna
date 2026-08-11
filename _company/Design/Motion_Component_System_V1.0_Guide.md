# 🎨 Motion Component System Guide v1.0 (Figma Master Kit 통합 사양)

## 🎯 목표: Pain $\rightarrow$ Gain의 시퀀스 흐름을 완벽히 재현하는 모션 프로토타입 구현.
모든 컴포넌트는 Figma Prototype 기능을 활용하여 상호 연결되어야 함.

### I. 핵심 원칙 (The Flow Rule)
1. **Pain Trigger:** 0s $\rightarrow$ 0.5s: Dark Red 배경 + Count-up (Stuttering).
2. **Pivot Transition:** 0.5s $\rightarrow$ 1.0s: Background Flash to Dark Blue (`#0A2463`). 짧고 강렬한 시각적 리셋이 필수.
3. **Gain Release:** 1.0s $\rightarrow$ 2.0s: Light Green 성장 + Bounce/Pop-up 애니메이션으로 수치 폭발적 제시.

### II. 컴포넌트 상세 사양 (Master Component Library)
**A. [Pain_Card]**
*   **애니메이션:** `Transform` (Scale Y 0% $\rightarrow$ 100%) + `Opacity` (0% $\rightarrow$ 100%).
*   **타이밍:** Duration: 500ms. Timing Function: Ease Out.
*   **적용 색상:** Dark Red 계열 (`#B83246`).

**B. [Transition_Flash]**
*   **애니메이션:** `Background Color Change` (White/Grey $\rightarrow$ `#0A2463`) + `Quick Scale`.
*   **타이밍:** Duration: 200ms. Timing Function: Linear (가장 빠르고 기계적인 느낌).

**C. [Gain_Metric]**
*   **애니메이션:** `Staggered Sequence`를 활용한 카운트업(Counter) 효과 필수. 수치가 등장할 때마다 작은 '팝' 애니메이션을 적용하여 생동감을 부여해야 함.
*   **타이밍:** Duration: 1000ms (총). Timing Function: Elastic/Spring Effect.

### III. 구현 지침 및 검증 항목 (Checklist)
1. [ ] **Master Kit 업데이트:** 기존 `/Users/iyeongjae/Desktop/초보프로젝트/_company/Design/Templates/01_YT_Thumbnail_V2_MasterKit.fig-spec` 파일 내에 위 3가지 컴포넌트를 인터랙티브 프로토타입으로 구현할 것.
2. [ ] **레오 검증 요청:** 이 가이드라인을 바탕으로, 레오는 Figma에서 실제로 클릭 가능한 모션 시퀀스를 제작해야 함. (Leo에게 전달)