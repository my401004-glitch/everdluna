# 🎬 아지트아트컴페니 - 실용음악 AI 활용 교육 영상 최종 목업 디자인 사양서 (v1.0)

**작성 목적:** 코다리의 데이터 시퀀스 매핑 로직(`Hook` $\rightarrow$ `Proof` $\rightarrow$ `Growth`)을 기반으로, 전문성과 신뢰도를 극대화하는 비디오 스토리보드 및 애니메이션 가이드라인 제공.
**적용 원칙:** Pain $\rightarrow$ Gain 프레임워크 준수. (위험 제시 $\rightarrow$ 해결책 제시)

## 🎨 I. 디자인 시스템 요약 재확인
*   **Primary Color (신뢰/안정):** Dark Blue (`#0A2463`) - 배경, 헤더, 주요 섹션의 전문성 확보.
*   **Accent Color (행동 유도/기회):** Accent Yellow (`#FFD700`) - 위험 수치 강조(Pain), 핵심 성과 수치(Gain), CTA 버튼에 사용.
*   **Body Color (가독성):** Neutral Grey (`#F5F5F5`) - 본문 텍스트 배경, 데이터 영역 명확화.
*   **Title Type:** Montserrat Bold - 강력한 메시지 전달력 확보.
*   **Body Type:** Noto Sans KR - 구체적인 데이터 및 설명 텍스트 가독성 극대화.

## 🎞️ II. 단계별 시각적 목업 & 애니메이션 스펙 (The Story Flow)

### A. Stage 1: THE HOOK (Pain Point 제시 - 위기감 조성)
**[내러티브 목표]** 현재 학습 방식의 '결핍'과 '비효율성'을 자극하여 문제의식을 심는다.
**[레이아웃 컨셉]** 어둡고 답답한 분위기를 연출하며, 텍스트와 그래프가 급격히 나타났다 사라지며 시청자의 주의를 붙잡는다. (Motion Graphics 중심)

| 컴포넌트 | 역할 및 내용 | 디자인 스펙 | 애니메이션/전환 효과 |
| :--- | :--- | :--- | :--- |
| **Hook Title Card** | 주제 제시: "노력만으로는 부족합니다." | 배경: Dark Blue (`#0A2463`). 타이틀: Montserrat Bold, 72pt. 색상: Accent Yellow로 하이라이트 되는 핵심 키워드 사용. | 등장 (Fade-in) $\rightarrow$ 텍스트 한 글자씩 강하게 타이핑 효과(Typewriter Effect). |
| **Pain Metric Card** | 구체적인 문제점 제시 (예: "시간 대비 낮은 점수 상승률"). | 배경: Neutral Grey (`#F5F5F5`). 그래프/숫자 영역에만 Dark Blue 테두리 적용. 핵심 수치(`X%`)는 Accent Yellow로 크게 강조. | **데이터 등장:** 왼쪽에서 오른쪽으로 급격히 슬라이드 인(Slide-in). 숫자는 카운트업 애니메이션 (0 $\rightarrow$ X)을 사용하여 긴장감을 높임. |
| **Visual Transition** | 다음 단계로의 연결 고리 (전환점 예고). | Dark Blue 배경에 굵은 Accent Yellow 화살표가 '?' 모양으로 깜빡이며 나타남. | 짧은 간격(0.5s)의 진동 효과(Blinking/Jittering) 후, 화면이 급격하게 어두워지며 다음 단계로 전환 (Quick Fade Out). |

### B. Stage 2: THE PROOF (Solution 제시 및 증명 - 데이터 시각화)
**[내러티브 목표]** AI 활용 프로그램의 기술적 원리와 데이터를 통해 '가능성'과 '효율성'을 객관적으로 증명한다.
**[레이아웃 컨셉]** 깔끔하고, 높은 정보 밀도를 유지하며 신뢰성을 강조하는 대시보드(Dashboard) 형태. (데이터 중심)

| 컴포넌트 | 역할 및 내용 | 디자인 스펙 | 애니메이션/전환 효과 |
| :--- | :--- | :--- | :--- |
| **Solution Title Card** | 솔루션 소개: "AI가 당신의 잠재력을 찾아냅니다." | 배경: Neutral Grey (`#F5F5F5`). 타이틀: Dark Blue. 보조 설명은 Noto Sans KR 사용. | 등장 (Smooth Fade-in). 제목과 부제가 2단계로 분리되어 차례대로 나타남. |
| **Diagnosis Component** | 코다리가 매핑한 핵심 데이터 시각화 영역. (예: '약점 파트 A', '강점 파트 B') | 그리드 시스템(Grid System) 기반의 모듈형 디자인. 각 지표는 Card 형태로 구성. 배경은 아주 연한 Blue 톤 적용하여 전문성 강조. | **데이터 로딩:** 카드들이 화면 중앙에서 동시에 바깥으로 퍼지듯 등장 (Out-Spring Effect). 그래프 라인(Line Graph)은 시작점에서 끝점으로 부드럽게 그려지는 애니메이션 필수. |
| **Key Metric Visualization** | 가장 중요한 KPI 수치 제시 (예: '개선 예상 점수 +20%'). | Accent Yellow를 배경으로 한 박스 안에 Dark Blue로 굵은 숫자를 배치. 주변에 작은 설명 텍스트(Noto Sans KR) 추가. | 숫자만 강조되어 크게 커지며 나타나고(Scale Up), 그 뒤에 카테고리 설명이 순서대로 등장하는 '팝업' 효과 적용. |

### C. Stage 3: THE GROWTH (결론 및 CTA - 행동 유도)
**[내러티브 목표]** 모든 증거를 종합하여 최종적인 '변곡점(Turning Point)'을 제시하고, 시청자의 즉각적인 행동을 유도한다.
**[레이아웃 컨셉]** 희망적이고 개방적인 느낌. 밝은 배경과 명확한 액션 버튼에 집중. (결정적임)

| 컴포넌트 | 역할 및 내용 | 디자인 스펙 | 애니메이션/전환 효과 |
| :--- | :--- | :--- | :--- |
| **The Turning Point** | 최종 메시지: "이것이 당신의 성공적인 변화입니다." | 배경: Dark Blue와 Accent Yellow가 대비되게 사용된 강렬한 디자인. 중앙에 가장 큰 폰트로 핵심 문구 배치 (Montserrat Bold, 90pt). | 모든 애니메이션 중 가장 드라마틱하게 등장. 마치 무대 조명이 비추듯(Spotlight Effect) 나타나야 함. |
| **CTA Button** | Call To Action 버튼: "무료 진단 받기" | 배경: Accent Yellow (`#FFD700`). 텍스트: Dark Blue. 모서리는 약간 둥글게 처리하여 클릭 용이성을 높임. | 마우스 오버(Hover) 시 미세하게 커지며(Scale Up 1.05x), 버튼을 누르는 듯한 '눌림' 효과(Press Down Effect)를 주어 즉각적 상호작용 유도. |
| **Footer/Info** | 추가 정보 (사이트 URL, 로고). | Dark Blue 배경 하단에 Noto Sans KR로 작게 배치. | 부드럽게 페이드 인(Gentle Fade-in)하여 화면을 마무리한다. |

---
**[활용 가이드]**
*   **전체 흐름:** 각 단계 간의 전환은 **'사운드 디자인'과 '빠른 컷 편집'**이 주도해야 합니다. 시각적 변화는 극적으로, 정보 전달은 부드럽게 연결되어야 합니다.
*   **데이터-애니메이션 규칙:** 모든 데이터 포인트는 반드시 숫자가 *증가하는(Increment)* 애니메이션으로 처리하여 성장의 느낌을 강조합니다.