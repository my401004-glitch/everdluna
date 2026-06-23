# 🎬 Hook 1 영상 마스터 프로덕션 스펙 가이드라인 v4.0

**[개요]**
본 문서는 '객관적 성장 엔진'의 첫 번째 영상 콘텐츠인 'Hook 1: 예측형 경고'의 애니메이션 및 시각 자산 제작을 위한 최종 설계도입니다. 모든 편집 요소는 이 가이드를 따르며, 개발된 데이터 로직(Gap Score)과 디자인 비주얼 시스템이 완벽하게 동기화되어야 합니다.

**[🎨 1. 핵심 브랜드 비주얼 재확인]**
*   **Primary Color (신뢰):** Dark Blue (`#0A2463`) - 배경, 헤더, 신뢰 구간 표시.
*   **Accent Color (주의/기회):** Accent Yellow (`#FFD700`) - 경고(Pain), 기회(Gain) 영역 강조, CTA.
*   **Neutral Grey:** `#F5F5F5` - 데이터 배경 및 가독성 확보.
*   **Typography:** Title: Montserrat Bold / Body: Noto Sans KR

**[📐 2. 레이어 구조 정의 (Layer Structure Definition)]**
모든 애니메이션 시퀀스는 아래와 같은 계층적(Hierarchical) 레이어 구조를 필수로 갖춰야 합니다.

1.  **BACKGROUND Layer:** 전체 배경색 및 움직임 없음. (Neutral Grey 또는 Dark Blue Gradient)
2.  **DATA Visualization Layer:** Gap Score 그래프, 수치 변화 애니메이션 영역. (코다리 피드백 필수)
3.  **TEXT Overlay Layer:** 핵심 메시지(Pain/Gain), 자막 타이포그래피가 위치합니다.
4.  **MODULE Highlight Layer:** '예측형 경고' 컴포넌트처럼 특정 모듈이 강조되어야 하는 영역 (Accent Yellow 사용).
5.  **TRANSITION & EFFECT Layer:** 전환 효과, 빛의 움직임, 사운드 시각화 요소 등.

**[📈 3. 데이터 기반 애니메이션 로직 (Data-Driven Animation Logic)]**
가장 중요한 부분입니다. Gap Score 변화에 따른 애니메이션은 다음 규칙을 따릅니다.

| 상태 | 시각적 트리거 (Trigger) | 색상 코드 및 강조 | 애니메이션 효과/전환 방식 |
| :---: | :--- | :--- | :--- |
| **Critical** | `GapScore`가 임계치 이하일 때 발생. | 배경에 미세한 빨간색 톤(Warning Red `#CC3300`)이 감돌며, 경고 문구 전체를 Accent Yellow로 깜빡임. | 그래프 라인이 급격히 하락하는 모습으로 역동적이고 불안정한 움직임을 연출 (Shake/Jump). |
| **Potential** | `GapScore`가 중간 범위일 때. | Primary Color (`#0A2463`)와 Accent Yellow의 그라데이션을 사용하며, 상승 여지가 있다는 느낌을 부여. | 그래프 라인이 완만하게 우상향하는 부드러운 커브(Smooth Curve)를 보여줌. |
| **Stable / Gain** | 목표 지점에 도달하거나 개선되었을 때. | Primary Color가 가장 안정적이며, 최종 성과 수치에 Accent Yellow로 '터지는' 느낌의 빛 효과 부여. | 그래프 라인이 꺾이는 대신, 목표 지점을 향해 명확하고 힘 있게 수렴하는 움직임을 연출 (Converge). |

**[🎬 4. 주요 장면별 제작 스펙 (Shot-by-Shot Specs)]**

| # | 시간대 (Approx.) | 내용 (Story) | 시각적 요구사항 (Visual/Animation) |
| :---: | :---: | :--- | :--- |
| **S01** | 00:00 - 00:08 | 문제 제기: '감성'에 의존하는 학습의 한계. | 어두운 배경(Dark Blue). 그래프가 일직선이거나 불안정하게 요동치는 모습. (Critical State 연출) |
| **S02** | 00:08 - 00:15 | 솔루션 제시: Gap Score 도입 및 정의. | 화면 분할(Split Screen) 구조 사용. 한쪽은 기존 방식, 다른 쪽은 데이터 그래프가 등장하며 대비 효과를 극대화 (Primary Blue $\rightarrow$ Yellow). |
| **S03** | 00:15 - 00:25 | 핵심 로직 시연: 예측형 경고 작동 과정. | **[최우선 구현 지점]** 코다리로부터 받은 실시간 데이터 흐름을 따라, Critical $\rightarrow$ Potential $\rightarrow$ Stable로 변화하는 과정을 명확하게 애니메이션화. (섹션 3의 규칙 적용) |
| **S04** | 00:25 - 끝 | 최종 Gain 제시 및 CTA 유도. | 화면이 밝아지며(Brighten), 모든 수치와 그래프가 목표 지점을 향해 수렴하는 모션 사용. 마지막에 '무료 진단받기' 버튼을 Accent Yellow로 강력하게 배치. |

**[⚠️ 5. 제작 주의사항 (Mandatory Check)]**
*   모든 애니메이션은 **"데이터의 객관적 움직임"**에서 비롯되어야 하며, 감성적인 과장(Over-dramatization)을 지양합니다. [근거: sessions/2026-06-23T11:23]
*   폰트 크기와 배치는 모듈별로 템플릿화하여 일관성을 유지합니다. (Montserrat Bold는 항상 헤드라인, Noto Sans KR은 설명문) [근거: Designer 검증된 지식]