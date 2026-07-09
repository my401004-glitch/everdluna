# 📐 DiagnosisScoreWidget: 인터랙티브 프로토타입 사양서 (V2.0)

## 🎯 목표
코다리(Developer)가 정의한 **State Machine 로직**을 기반으로, 사용자가 'Phase 1: Crisis'에서 출발하여 'Phase 3: Clarity/Gain'로 이동하는 전 과정을 시각적으로 체험할 수 있는 인터랙티브 목업의 최종 사양을 확정합니다.

## 🛠️ 활용 컴포넌트 라이브러리 (Figma Component Mapping)
*   **[Source]:** sessions/2026-05-19T13:49/designer.md 및 Figma Assets (`/Users/iyeongjae/Desktop/초보프로젝트/_company/Assets/BrandSystemKit/01_StyleGuide.fig`)
*   **[핵심 컴포넌트]:** Score Visualization Widget (Score, Phase Text), Metric Cards (Gap Score, RoC), CTA Button.

## 🏃‍♂️ 애니메이션 목업 흐름 정의 (The User Journey)
이 프로토타입은 단순한 화면 전환이 아닌, **'데이터 변화에 따른 시각적 반응(Visual Reaction to Data Change)'**을 보여주는 것이 핵심입니다.

### 1단계: Crisis Phase (Pain Point 최대화)
*   **Trigger:** 초기 데이터 입력 (사용자 상태 진단).
*   **시각적 특징:** 배경의 어두운 색감 (`Dark Blue`를 기반으로 채도 낮은 블루/레드 계열 사용), 불안정한 움직임(Wiggle Effect, Glitch Filter 적용 가능성 언급).
*   **핵심 액션:** Gap Score 영역이 **빨간색 경고 (Accent Yellow가 아닌 Red)**로 폭발적으로 강조되며, '노력 대비 성과 부재'를 시각화합니다.
*   **Transition Out:** 위기감이 최고조에 달했을 때, 화면 전체에 강한 노이즈/글리치 효과와 함께 **"객관적 진단 필요(Diagnosis Required)"**라는 메시지를 띄우며 다음 단계로 급격히 전환됩니다.

### 2단계: Warning Phase (문제 인식 및 기대)
*   **Trigger:** AI 시스템의 개입 시작. 객관적인 데이터 제시.
*   **시각적 특징:** 색상이 어둠에서 중립성(Neutral Grey/Dark Blue)으로 안정화되기 시작합니다. 통계 차트와 그래프가 화면에 깔끔하게 등장하며, 정보 전달력이 높아집니다.
*   **핵심 액션:** Rate of Change (RoC) 그래프가 **'잠재적 변화 가능성'을 나타내는 추세선(Projection Line)**을 보여주며 희미한 노란색 점으로 빛나기 시작합니다.
*   **Transition Out:** '이 상태를 유지하면 안 됩니다.'라는 명확한 경고 메시지와 함께, 해결책에 대한 기대감을 주는 **밝은 옐로우 플래시(Accent Yellow)**가 화면을 가로질러 지나갑니다.

### 3단계: Clarity/Gain Phase (해결 및 성공)
*   **Trigger:** 학습 루틴 개선과 데이터 기반 성장이 지속될 때.
*   **시각적 특징:** 전체적인 배경이 밝고 깨끗한 느낌 (`Neutral Grey`가 주조색), 전문성을 상징하는 **Dark Blue와 Accent Yellow의 조화로운 사용**이 극대화됩니다. 움직임은 부드럽고, 데이터는 명확하게 정렬되어 있습니다.
*   **핵심 액션:** Score Visualization Widget이 안정적으로 목표 점수에 도달하며, 모든 지표가 **'성장(Growth)' 또는 '안정화(Stabilized)'** 상태를 보여줍니다. 최종 CTA 버튼은 가장 밝고 확신에 찬 `Accent Yellow`로 빛납니다.
*   **End State:** 최종적인 성공과 성취감을 주는 명료한 애니메이션 효과 (예: 황금빛 광원, 상승하는 파동)로 마무리됩니다.

## 💻 개발자(Kodari)를 위한 기술 요구사항 및 검증 항목
1.  **State Transition Lock-down:** 모든 단계의 전환 시점과 로직은 `sessions/2026-07-09T07-37/developer.md`에 정의된 State Machine을 **절대적으로 준수**해야 합니다. 디자인적 자유도는 로직 구현 후에만 허용됩니다.
2.  **Animation Timeline:** 모든 애니메이션은 '시간 흐름'과 연결되어야 하며, 1단계에서 3단계로 이동하는 데 걸리는 시간(예: 총 45초)을 시각적으로 느껴지게 구성해야 합니다.

---