# 🎬 Production Bible v1.0: 애니메이션 및 레이아웃 최종 명세
**목표:** Master Template Kit v1.0과 Content Series Visual Blueprints를 통합하여, 편집자가 별도의 질의 없이 즉시 고품질 콘텐츠 제작을 시작할 수 있도록 완벽한 기술 사양서를 제공한다.
**적용 기준:** Pain $\rightarrow$ System $\rightarrow$ Gain (감성 흐름) 및 Dark Blue/Accent Yellow 색상 대비 원칙 준수.

---

## 1. ✨ 핵심 시각 시스템 재확인 (Design Principles)
*   **Color Palette:**
    *   Primary (Trust/Background): `#0A2463` (Dark Blue) - 신뢰, 전문성. 배경 및 주요 정보 섹션에 사용. [근거: Designer 검증된 지식]
    *   Accent (CTA/Gain): `#FFD700` (Accent Yellow) - 기회, 주목, 결과 강조. CTA, 성공 수치, '솔루션 적용 시 얻는 이득' 영역에 집중적으로 사용. [근거: Designer 검증된 지식]
    *   Neutral (Data Background): `#F5F5F5` (Neutral Grey) - 데이터의 명확성 확보. 본문 텍스트 배경으로 사용하여 Dark Blue와의 대비를 유지함. [근거: Designer 검증된 지식]
*   **Typography:**
    *   Title/Headline (Pain, Gain): Montserrat Bold (강렬하고 강력한 메시지 전달력).
    *   Body/Data Text: Noto Sans KR Regular/Medium (최대 가독성 확보).

## 2. 📐 레이아웃 좌표 시스템 정의 (Layout Coordinates Specification)
*(Figma / Premiere Pro 기준으로 모든 섹션의 상대적 좌표 및 크기를 명시합니다.)*

| 영역 | 요소 | 설명 및 목적 | 권장 크기/위치 (%) |
| :--- | :--- | :--- | :--- |
| **A. Pain Point 제시** | 1. 후크 헤드라인 (H1) | 가장 충격적이거나 위험한 현 상태를 명시. 배경 전체에 걸쳐 강조. | 상단 중앙, 높이: 25% / 너비: 90% |
| | 2. 문제 데이터 그래프 | 현재의 실패율 또는 부족분을 시각화. Accent Yellow로 경고 영역 표시. | 중단 좌측 (60% 지점) 배치. Y축 강조 필요. |
| **B. System/솔루션 제시** | 1. 핵심 원리 박스 | '아지트아트컴페니의 방법'을 설명하는 모듈. Dark Blue 배경 사용 권장. | 중앙 상단, 가로 분할 (2개 열) 배치. |
| | 2. 프로세스 플로우차트 | 단계별 개선 과정을 화살표와 함께 명확히 제시. | 중단 중앙, 좌->우 흐름 유지. |
| **C. Gain/성장 결과** | 1. 최종 성과 수치 (KPI) | Before $\rightarrow$ After 변화를 가장 크게 보여주는 영역. `#FFD700`을 배경색으로 사용. | 화면 전체의 하단 25%에 걸쳐 배치 (가장 넓은 면적). |
| | 2. Call-to-Action (CTA) | 최종 행동 유도 문구 및 버튼. 반드시 대비되는 색상(Dark Blue)을 활용하여 주목도를 높임. | 가장 마지막 화면, 중앙 하단 고정. |

## 3. 🎬 애니메이션 요구사항 명세 (Animation Specification Guide)
**핵심 원칙:** 시각적 전환은 단순히 '보이는 것'이 아니라, **감성적 변화의 흐름(Pain $\rightarrow$ System $\rightarrow$ Gain)** 을 물리적으로 구현해야 합니다.

| 단계 | 트리거 이벤트 (Trigger Event) | 애니메이션 타입 및 사양 | 타이밍 (Timing/Duration) |
| :--- | :--- | :--- | :--- |
| **A $\rightarrow$ B** | Pain Point 제시 완료 시점 | **[TRANSITION: Shock to Insight]**: 배경의 Dark Blue 톤이 점진적으로 Neutral Grey로 밝아지며, 시스템 핵심 원리가 중앙에서 '떠오르는(Pop-up)' 효과를 준다. (과도한 움직임 지양) | 1.5초~2.0초 (부드러운 페이드 인/아웃 사용) |
| **B $\rightarrow$ C** | 솔루션 단계 완료 시점 | **[TRANSITION: Proof of Concept]**: 프로세스 플로우의 화살표가 역동적으로 움직이며, 최종 KPI 수치가 마치 '성장 곡선'을 그리듯 0에서 최종 값으로 급상승(Ramp Up)하며 나타난다. | 2.5초~3.5초 (속도감 있는 트랜지션 필수) |
| **데이터 강조** | 핵심 데이터 포인트 노출 시점 | **[VISUAL: Spotlight/Focus]**: 해당 수치에만 순간적으로 `#FFD700` 색상의 '광원 효과(Glow Effect)'를 주어, 시청자의 시선을 강제로 집중시킨다. | 0.2초 (매우 짧고 날카로운 임팩트) |
| **텍스트 등장** | 헤드라인/주요 메시지 노출 시점 | **[TEXT: Kinetic Typewriter]**: 텍스트가 한 글자씩 타이핑되거나, 위에서 아래로 강력하게 낙하(Drop-down)하며 등장한다. | 0.5초~1.0초 (강조하고 싶은 단어는 더 느리게 처리) |

## 4. 📦 최종 에셋 체크리스트 (Asset Handoff Checklist for Editor/Developer)
*   **[필수] 마스터 컴포넌트 파일:** `Master Template Kit v1.0`의 모든 레이어(Layer) 이름과 속성(Attribute)을 포함하는 Figma Source File (`.fig`).
*   **[필수] 색상 코드 팔레트:** `#0A2463`, `#FFD700`, `#F5F5F5` (CSS/HEX 코드로 문서화).
*   **[권장] 애니메이션 프리셋:** 위 3번 항목에 명시된 모든 트랜지션(Fade, Pop-up, Ramp Up)을 After Effects의 '프리컴포즈 가능한 키 프레임 세트'로 제공.

---
**이 문서는 아지트아트컴페니가 추구하는 시각적 일관성 및 감성적 설득력을 담보하는 최종 제작 지침서입니다.**