# ✨ Reels 1 - Dynamic Animation Parameter Specification Sheet V2.0 (Dev Ready)

## 📝 1. 개요 및 목표
본 문서는 'Reels 1: [Pain $\rightarrow$ Gain]' 콘텐츠의 모든 시각적 변수와 애니메이션 Keyframe을 **코드 기반 매핑(Code-Driven Mapping)**하여 개발팀이 즉시 프로토타입을 구축하고 테스트할 수 있도록 설계된 최종 사양서입니다.

*   **대상:** 프론트엔드/백엔드 개발팀
*   **목표:** 애니메이션의 '감성적 흐름'을 `(시간, 변수값)` 형태로 치환하여 API 서비스 레이어에서 제어 가능하도록 한다.
*   **참조 사양:** Master Design System Guide V3.0 / Reels 1 Motion Spec (V1.0)

## 🎨 2. 디자인 시스템 상수 (Constants) 재확인
애니메이션 구동에 사용되는 모든 기본 색상과 타이포그래피는 하드코딩된 변수로 정의되어야 합니다.

| 요소 | 속성 | 값 | 코드 타입 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Color (Trust)** | `#0A2463` | `COLOR_TRUST` | Hex Code | 신뢰 구간, 배경색 |
| **Accent Color (Gain/CTA)** | `#FFD700` | `COLOR_GAIN` | Hex Code | Gain 영역 강조, CTA 버튼 색상 |
| **Pain Color** | `#CC3333` | `COLOR_PAIN` | Hex Code | 위험(Risk) 구간 경고 표시 (Red 계열로 확장 고려) |
| **Background/Data** | `#F5F5F5` | `COLOR_BG` | Hex Code | 본문 텍스트 배경색 |
| **Title Font** | Montserrat Bold | - | CSS Class | 헤드라인(`H1`, `H2`)에 적용 (강렬함) |
| **Body Font** | Noto Sans KR | - | CSS Class | 데이터 및 설명 텍스트에 적용 (가독성) |

## ⚙️ 3. 애니메이션 Keyframe 변수 정의 (The Core Logic)
모든 시퀀스 전환은 다음의 구조화된 파라미터를 통해 제어되어야 합니다.

**[API Input Structure 예시]**
```json
{
  "segment_id": "pain_setup_01",
  "duration_sec": 2.5, // 이 세그먼트가 지속될 시간 (초)
  "visual_params": {
    "background_gradient": ["#A0B0D0", "#0A2463"], // 배경 그라디언트 시작/끝색
    "opacity_change": "0.1s ease-in-out", // 요소가 등장하는 투명도 변화 속성
    "text_scale_keyframe": "scale(1) -> scale(1.2) -> scale(1)" // 텍스트 크기 키프레임 함수
  },
  "data_binding": {
    "score_value": "$VARIABLE: GapScore", // API에서 받아올 변수명 (e.g., "GapScore")
    "text_template": "당신의 현재 점수는 ${score_value}점입니다.", // Mustache/Handlebars 템플릿 형식
    "color_mapping": "if(score_value < threshold) COLOR_PAIN else COLOR_TRUST" // 조건부 색상 매핑 로직
  }
}
```

## 🎬 4. Reels 1 - 시퀀스별 애니메이션 사양 (Mapping Example)

### A. [0:00 ~ 0:03] Intro / Pain Point 제시 (The Hook)
*   **목표:** 문제점을 강렬하게 던지며 사용자의 불안감(Pain)을 자극한다.
*   **Keyframe/변수:**
    1.  **시작 효과 (Start):** 화면 전체가 `COLOR_PAIN` 계열의 어두운 톤으로 빠르게 깜빡이며 시작 (`flash: true`).
    2.  **텍스트 애니메이션:** 타이틀 문구("혹시, 아직도...?")가 강한 **Stuttering Effect**와 함께 등장하며, 각 글자가 순차적으로 나타나야 한다. (타이포그래피: Montserrat Bold, 크기 변수 사용)
    3.  **데이터 시각화:** Gap Score를 표시하는 게이지/바 그래프는 `COLOR_PAIN`으로 채워지며, **좌측에서 우측으로 튕겨 나오는(Bounce-in)** 애니메이션을 적용한다.

### B. [0:04 ~ 0:08] Solution 제시 / Gain Point 전환
*   **목표:** Pain점에서 벗어나 '솔루션'이라는 빛(Gain)을 보여주며 시선을 전환시킨다.
*   **Keyframe/변수:**
    1.  **배경 변화:** 배경이 급격히 어두운 톤에서 `COLOR_TRUST` 기반의 밝은 그라디언트로 부드럽게 변한다 (`ease-out: 0.8s`).
    2.  **핵심 원리 시각화:** '변곡점'을 상징하는 **V자 형태의 그래프 애니메이션**이 화면 중앙에 그려지며, 이 과정에서 `COLOR_GAIN` 색상이 점차 강해진다. (애니메이션: Path Drawing/Morphing)
    3.  **텍스트 애니메이션:** 솔루션 설명 텍스트는 배경과 조화로운 `Noto Sans KR` 레귤러체로 부드럽게 페이드인 되며, 신뢰감을 주는 **차분한 움직임(Subtle Float)**을 유지한다.

### C. [0:09 ~ 끝] CTA 및 결론 (Action)
*   **목표:** 최종적인 행동 유도(CTA)를 명확하고 강력하게 제시한다.
*   **Keyframe/변수:**
    1.  **버튼 강조:** CTA 버튼 영역은 화면 중앙에서 **Zoom-in 효과**와 함께 가장 높은 대비율을 가진 `COLOR_GAIN`으로 빛나야 한다. (애니메이션: Pulsing Glow Effect)
    2.  **정보 구조화:** 프로그램의 장점(Feature List)은 3단 레이아웃으로 분할되며, 각 항목이 번호 순서대로 **순차적으로 나타나는(Sequential Reveal)** 애니메이션을 적용하여 정보 과부하를 막는다.

---
**[개발팀 검증 지침]**
위 `Animation Parameter Specification Sheet V2.0`에 명시된 모든 변수(`COLOR_TRUST`, `$VARIABLE: GapScore`, `Stuttering Effect`)는 API 호출 시점에 유효한 JSON/데이터 구조로 전달되어야 합니다. 디자인 의도는 이 **'데이터 인터페이스 계약(Data Contract)'**을 통해 완벽하게 구현됩니다.