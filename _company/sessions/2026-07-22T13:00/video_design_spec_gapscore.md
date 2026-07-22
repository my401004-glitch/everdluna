# 🎥 영상 디자인 명세서 (Design Specification) - Gap Score 시스템 소개

## 🎯 개요 및 목표
**영상 주제:** 감성 코칭을 넘어, 실용음악 성장의 '객관적 증거'를 찾는 방법 (Gap Score 시스템 소개)
**핵심 컨셉:** **좌절(Pain) $\rightarrow$ 객관적 진단(Process) $\rightarrow$ 명확한 해결책 제시(Gain)**. 시각적으로 불안정함에서 구조화된 데이터로의 '변곡점'을 경험하게 한다.
**타겟 감정 흐름:** 혼란/불안정 (Pain) $\rightarrow$ 기대감/호기심 (Process) $\rightarrow$ 자신감/확신 (Gain)

## 🎨 브랜드 시스템 가이드라인 재확인
*   **Primary Color (신뢰/구조):** Dark Blue (`#0A2463`) - 안정적 배경, UI의 기본 틀. [근거: Designer 검증된 지식]
*   **Accent Color (경고/기회):** Accent Yellow (`#FFD700`) - 이탈 위험(Pain) 표시, 개선 영역(Gain), CTA 강조. [근거: Designer 검증된 지식]
*   **Body Color:** Neutral Grey (`#F5F5F5`) - 데이터 표면 배경색. [근거: Designer 검증된 지식]
*   **Title Typography:** Montserrat Bold (강력한 메시지, 헤드라인)
*   **Body Typography:** Noto Sans KR (데이터 수치, 설명 텍스트)

---

## 🎬 시퀀스별 Key Visuals 및 모션 명세

### [Phase 1: 후크 (Hook)] - Pain Point 극대화 (0:00 ~ 0:30)
**목표:** 청중의 불안감(성장 정체, 막막함)을 증폭시키고 '데이터가 필요하다'는 문제의식을 심는다.

| 요소 | 스크립트 내용 | 시각 컨셉 및 모션 (VFX/Motion Graphics) | 색상 코드 / 폰트 적용 |
| :--- | :--- | :--- | :--- |
| **배경** | "성장이 정체되었다고 느끼시나요?" | 어둡고, 대비가 낮은 배경. 무작위로 움직이는 음파 파형(Waveform)이나 미분화된 주파수 스펙트럼을 사용한다. (Chaos Visual) | 톤 다운된 Blue/Grey 계열. Dark Blue의 채도를 낮춘 #3A4B70 사용. |
| **주요 시각** | "직감이나 경험에만 의존하고 있지는 않습니까?" | '???' 또는 'WHY' 같은 질문형 키워드가 팝업되나, 명확한 답변 없이 사라진다 (Unstable Graphic). 카메라가 흔들리거나 초점이 맞는 듯 풀리는 효과를 준다. | Accent Yellow로 된 물음표와 함께 Dark Blue의 경고 라인을 사용한다. |
| **전환점** | "진짜 문제는... 객관적 증거가 없다는 겁니다." | 화면 전체에 '데이터 부족(DATA GAP)'이라는 문구가 큰 폰트(`Montserrat Bold`)로 빠르게 플래시되며 나타난다. (Pain Peak) | 배경을 순간적으로 어둡게 만들고, **Accent Yellow**의 강한 깜빡임 효과를 주어 시선을 사로잡는다. |

### [Phase 2: 본론 - 문제 정의 및 시스템 제시] - Process (0:31 ~ 4:00)
**목표:** 혼돈에서 질서(데이터)로 이동하는 경험을 제공하고, Gap Score UI를 '해결책'으로 제시한다.

| 요소 | 스크립트 내용 | 시각 컨셉 및 모션 (VFX/Motion Graphics) | 색상 코드 / 폰트 적용 |
| :--- | :--- | :--- | :--- |
| **배경 전환** | "시스템을 전환해야 합니다." | 갑자기 배경이 깔끔하고 구조적인 그리드(Grid) 패턴으로 바뀐다. Dark Blue가 메인 컬러로 자리 잡으며 안정감을 준다. (Structure Visual) | `#0A2463` (Dark Blue). 깨끗한 Neutral Grey 배경 위에 그리드를 배치한다. |
| **핵심 시스템** | "우리는 [AI 기반 객관적 진단 시스템]을 도입했습니다." | **Gap Score 인터페이스 Mockup**이 화면 중앙에 큼직하게 등장한다. 마치 영화의 메인 UI처럼 느껴지게 한다. (좌측: Input Data, 우측: Gap Score 결과) | Dark Blue를 UI 프레임워크로 사용하고, `Accent Yellow`는 '진단 영역'을 표시하는 데 집중적으로 활용한다. |
| **Pain Point 심화** | "어떤 지점에서 정체되고 있는지 알기 위해서는 '패턴 분석'이 필요합니다." | 2D 그래프 또는 스펙트럼 시각화가 나타난다. 정상 범위(Ideal Zone)는 Dark Blue의 깔끔한 영역으로, 현재 측정된 주파수/변수는 **Accent Yellow**로 표시되며 이탈된 지점을 강조한다. | **Yellow Highlight:** 데이터와 Ideal Zone 간의 거리를 물리적 'Gap'처럼 표현하고, 그 Gap을 시각적으로 부각시킨다. |

### [Phase 3: 본론 - 해결책 제시] - Gain (최종 클라이맥스)
**목표:** 시스템 사용 전후의 극적인 대비를 통해 서비스 이용의 필요성을 최대화한다.

| 요소 | 스크립트 내용 | 시각 컨셉 및 모션 (VFX/Motion Graphics) | 색상 코드 / 폰트 적용 |
| :--- | :--- | :--- | :--- |
| **Gap 축소** | "데이터가 명확합니다." | Yellow로 표시된 'Gap' 영역이 마치 마법처럼 점차 좁아지면서, 데이터 라인이 Ideal Zone(Dark Blue) 쪽으로 수렴하는 애니메이션을 보여준다. (Convergence Motion) | Gap의 크기가 줄어드는 비율에 따라 모션 그래픽 효과를 달리하여 시각적 성취감을 준다. |
| **최종 결과** | "다음 단계로 나아갈 수 있는 객관적인 증거를 확인해 보세요." | 최종 진단 리포트(Mockup)가 펼쳐진다. 가장 중요한 개선점(`Solution`)은 크고 명확하게, 그리고 긍정적인 느낌의 Dark Blue 또는 Emerald Green 계열 (새로운 승리 색상)로 강조된다. | **CTA 버튼:** 화면 하단에 "진단 시작하기" 버튼을 배치하고, `Accent Yellow`를 사용하여 클릭 유도 효과를 극대화한다. |

---
**⚠️ 제작 참고 사항 (Motion Guide)**
1.  **속도 조절:** Pain Point 구간(Phase 1)은 빠르고 불안정하게, Solution 제시 구간(Phase 2/3)은 느리고 명확한 속도로 전환하여 리듬감을 만듭니다.
2.  **사운드 디자인:** 시각적 변화에 맞춰 사운드 이펙트(SFX)를 적극 활용합니다. (예: Pain $\rightarrow$ 날카로운 '삑' 소리, Structure $\rightarrow$ 안정적인 '웅~' 하는 저주파음).