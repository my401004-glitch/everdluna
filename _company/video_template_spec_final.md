# 🎬 아지트아트컴페니 영상 콘텐츠 제작 표준 사양서 (V1.0)
**목표:** '실용음악 입시생' 타겟에게 'Gap Score' 기반의 Pain $\rightarrow$ Gain 메시지를 전달하는 일관성 있고 전문적인 비디오 포맷을 확립한다.

## 📏 I. 기본 환경 및 규격 (Global Settings)
*   **플랫폼:** YouTube Shorts / Instagram Reels (세로형 최적화)
*   **비율:** 9:16 (해상도 권장: 1080px * 1920px)
*   **프레임 속도:** 30 FPS (최소한의 애니메이션으로 지루함 방지)
*   **전체 톤앤매너:** 전문성, 진단적 명확성, 희망적 변곡점.

## 🎨 II. 컬러 및 타이포그래피 시스템 (Design System)
| 요소 | 색상 코드 | 역할 및 사용처 | 근거/규칙 |
| :--- | :--- | :--- | :--- |
| **Primary Trust** (신뢰) | `#0A2463` (Dark Blue) | 배경, 헤더, 진단 결과 섹션의 주 영역. 전문성과 안정감을 부여한다. | [근거: Designer 검증된 지식] |
| **Accent CTA/Pain** (강조) | `#FFD700` (Yellow Gold) | Gap Score 위험 수치 강조, 핵심 성과 수치(Gain), 모든 Call-To-Action (CTA). 시선 집중 및 경고. | [근거: Designer 검증된 지식] |
| **Background/Data** (가독성) | `#F5F5F5` (Neutral Grey) | 본문 텍스트 배경, 데이터 그래프 영역. Dark Blue와의 대비를 유지하여 가독성을 높인다. | [근거: Designer 검증된 지식] |
| **Title Font** (헤드라인) | Montserrat Bold | 모든 핵심 헤드라인(Pain/Gain)에 사용. 가장 강력한 메시지를 전달한다. | [근거: Designer 검증된 지식] |
| **Body Font** (본문/데이터) | Noto Sans KR Regular | 구체적인 데이터, 설명 텍스트, 그래프 레이블 등 높은 가독성이 요구되는 곳에 사용. | [근거: Designer 검증된 지식] |

## 🎬 III. 비디오 슬라이드별 상세 스펙 (Scene Breakdown)
전체 영상은 **'Problem (Pain) → Diagnosis (Gap Score) → Solution (Gain)'**의 3막 구조를 따른다. 각 섹션은 최소 1~2개의 시각적 전환을 거쳐 지루함을 방지한다.

### Scene 1: 후크 및 문제 제기 (The Hook & Pain Point - 0-5초)
*   **목표:** 타겟의 가장 큰 고통(Pain)에 공감하며 즉시 주목시킨다.
*   **비주얼:** 강렬한 대비를 활용하여 경각심을 조성한다.
*   **레이아웃/색상:**
    *   배경: Dark Blue (`#0A2463`)
    *   텍스트 (Title): Montserrat Bold, 최대 사이즈, `#FFD700` (노란색) 사용.
    *   내용 예시: "❌ 아직도 막연한 공부법에 시간 낭비 중인가요?"
    *   **[디자인 지침]:** 질문을 던지는 듯한 불안정하고 급박한 느낌의 폰트 움직임을 짧게 활용한다.

### Scene 2: 진단 및 핵심 데이터 제시 (The Diagnosis - 5-15초)
*   **목표:** 추상적인 문제(Pain)를 객관적이고 전문적인 수치로 증명하여 신뢰를 확보한다.
*   **비주얼:** 'Gap Score'와 주요 지표가 그래프 및 대시보드 형태로 시각화된다.
*   **레이아웃/색상:**
    *   배경: Neutral Grey (`#F5F5F5`) (데이터 분석 환경 느낌)
    *   핵심 요소: **진단 보고서 Mockup 스타일.** 코다리 API가 제공하는 데이터 필드(예: `gap_score`, `monetization_triggers`)를 카드 형태로 배치한다.
    *   **[디자인 지침]:** Gap Score 수치에 따라 배경 색상이나 테두리를 Dark Blue $\to$ Yellow Gradient로 변화시키며 긴장감을 고조시킨다. (Danger Zone 시각화)

### Scene 3: 해결책 제시 및 Gain 확정 (The Solution & CTA - 15-25초)
*   **목표:** 문제의 심각성을 인지한 사용자에게 명확하고 즉각적인 이득(Gain)을 보여주며 행동을 유도한다.
*   **비주얼:** 밝고 희망찬 톤으로 전환하며, 얻게 될 미래를 시뮬레이션한다.
*   **레이아웃/색상:**
    *   배경: Dark Blue (`#0A2463`) 또는 밝은 그라데이션을 사용하여 '변곡점' 느낌을 강조.
    *   텍스트 (Title): Montserrat Bold, Gain 메시지 사용. 색상은 대비되는 `#FFD700`으로 다시 한번 강조한다.
    *   **[CTA 레이아웃]:** 화면 하단에 항상 고정된 CTA 배너를 배치한다.
        *   배경: Accent Yellow (`#FFD700`) (클릭 유도 색)
        *   텍스트: "지금 무료 진단을 받고, 나만의 합격 로드맵을 확인하세요."
        *   **[Codari 협업 지침]:** 이 CTA 버튼 클릭 시, API의 최종 등록 페이지로 연결되는 웹훅(Webhook) 처리를 염두에 둔다.

---
### ✨ 디자인 결론 및 다음 단계 액션 플랜 (Action Plan)
1.  **Designer:** 본 스펙을 기반으로 Figma 파일에 실제 목업 컴포넌트 세트를 제작하고, 애니메이션 흐름도(Storyboard)를 작성한다.
2.  **Codari:** 이 표준화된 UI/UX 요구사항에 맞춰 프론트엔드 개발 시 필요한 컴포넌트 API 사양 및 데이터 바인딩 로직을 최종 점검한다.
3.  **Writer:** 템플릿 스펙과 최종 확정된 스토리보드를 받아, 각 장면에 맞는 스크립트의 '최적 발화 타이밍(Timing)'을 조정한다.