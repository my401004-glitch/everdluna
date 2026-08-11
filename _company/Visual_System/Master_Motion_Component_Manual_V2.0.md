# 📐 [업데이트] 핵심 모션 컴포넌트 라이브러리 가이드 (v2.0)

## I. 목표 및 적용 원칙
*   **목표:** 영상 제작에 필요한 모든 동적 요소(위젯, 그래프)의 애니메이션 스펙을 통합하고 재사용성을 극대화합니다.
*   **원칙:** Pain $\rightarrow$ Gain 변곡점 서사를 기반으로, **'변화(Change)'**와 **'극대화(Emphasis)'**에 초점을 맞춥니다.

## II. 핵심 컴포넌트 (Figma 구현 목표)
1.  **Score Widget Animation:**
    *   **State 1 (Pain/Start):** 낮은 점수(Low Score)가 느리고 어두운 애니메이션으로 제시됩니다. (Dark Blue 계열의 채도가 낮고, 움직임이 제한적임을 강조).
    *   **Transition (The Moment):** 데이터 변화 시작 시, 배경에 '변곡점'을 상징하는 빛이나 에너지파(Accent Yellow)가 짧게 지나갑니다.
    *   **State 2 (Gain/End):** 점수가 빠르게 상승하며(Quick Zoom-in), 밝고 역동적인 애니메이션으로 최고점을 찍으며 멈춥니다. (강한 시각적 이득감 제공).

2.  **Growth Graph Animation:**
    *   **Line Chart:** 데이터가 시작점에서 끝점으로 **'채워지는' (Filling)** 방식을 사용합니다. 단순히 선이 그어지는 것이 아니라, 시간의 흐름에 따라 값이 증가하는 듯한 트랜지션 효과를 적용해야 합니다.
    *   **Key Milestones:** 특정 기준점(예: 50점) 도달 시, 해당 지점에 Accent Yellow로 빛나는 마커와 함께 **"Critical Point"**라는 텍스트가 Pop-up 되어야 합니다.

3.  **CTA/Emphasis Element:**
    *   모든 최종 결과 수치 또는 CTA 버튼은 애니메이션의 마지막에 가장 밝고 강렬하게(Accent Yellow) 'Focus' 되며, 잠시 동안 **잔상 효과 (Glow Effect)**를 남겨 시선을 고정해야 합니다.

## III. 프레임별 기술 사양 체크리스트
| 요소 | 애니메이션 유형 | 지속 시간 (Duration) | Keyframe/Trigger | 참고 사항 |
| :--- | :--- | :--- | :--- | :--- |
| Score Value | Scale & Fade-In | 0.8s | Data Update Trigger | 점수 변화율에 따라 속도 가변 적용 |
| Graph Line | Stroke Draw / Morph | 1.5s ~ 2.5s | Time Progression (T=0 to T=End) | 곡선의 부드러움(Bezier Curve) 유지 필수 |
| Critical Marker | Pop-up + Glow | 0.4s | Threshold Hit Event (e.g., Score > X) | 배경의 모션과 분리되어 강조되도록 처리 |

---