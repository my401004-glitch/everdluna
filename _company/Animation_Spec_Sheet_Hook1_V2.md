# 🎬 Hook 1 인트로 애니메이션 및 디자인 리소스 최종 스펙 시트 (v2.0)
**[참고 파일]**: Production Bible Hook1 V1, Design System Blueprint

## ⏱️ 1. 시간 흐름 및 레이아웃 정의 (Time-Based Flow)
| Time Code | Scene Description | Visual Element Focus | Transition Type | Key Action Trigger |
| :---: | :--- | :--- | :--- | :--- |
| **00:00 - 00:02** | **인트로 & Pain Point 제시 (Hook)**. 배경은 Dark Blue (`#0A2463`)가 지배적이며, 긴장감을 조성한다. | 'Gap Score' 수치 변화 애니메이션. 시청자의 현재 상황(Risk)을 극대화하여 보여준다. | Fade-In/Stutter Effect | 데이터 로딩 완료 (기술적 Trigger). |
| **00:02 - 00:05** | **문제 정의 및 전환점 제시**. 수치와 함께 '진단 결과'를 시각화한다. Neutral Grey 배경에 빨간색(⚠️) 경고가 강조된다. | 핵심 Pain Metric (예: 발성 습관의 문제 지표)가 그래프로 급락하는 애니메이션. 타이포는 Montserrat Bold. | Wipe/Swipe Up | 텍스트 스크립트 '문제점' 언급과 동기화. |
| **00:05 - 00:08** | **솔루션 제시 및 기대감 고조**. 화면 전체의 색감이 Blue $\rightarrow$ Yellow로 전환되며 밝아진다. | 프로그램 로고와 핵심 키워드(예: '과학적 분석', '시스템화')가 모듈식으로 분할되어 나타난다. Accent Yellow (`#FFD700`) 강조. | Zoom-In/Build-Up | 스크립트에서 '해결책' 언급 시점과 일치. |
| **00:08 - 00:12** | **CTA 및 최종 메시지 전달**. 배경은 신뢰감을 주는 Dark Blue로 회귀하며, 명확한 행동 유도(CTA)가 배치된다. | '지금 진단받기' 버튼이 화면 중앙에 크게 등장한다. 이 버튼은 Accent Yellow 그라디언트와 미세한 애니메이션 호버 효과를 갖는다. | Smooth Transition/Focus Shift | 최종 메시지 전달 직후 (Peak Moment). |

## 🎨 2. 주요 디자인 및 모션 스펙 (Design & Motion Specs)
### A. 타이포그래피 활용 지침
*   **헤드라인/강조:** Montserrat Bold 사용. 숫자가 등장할 때마다 **'카운팅 업(Counting Up)' 애니메이션**을 적용하여 역동성을 부여한다. [근거: Designer 검증된 지식]
*   **본문 데이터:** Noto Sans KR (Regular). 그래프나 수치 변화는 부드러운 곡선 움직임(Easing Curve)을 활용하여 전문적인 느낌을 준다.

### B. 컬러 및 애니메이션 가이드라인
*   **Dark Blue (`#0A2463`):** 주요 섹션의 배경색으로 사용되며, 화면 전환 시 안정감을 주는 베이스 톤이다. 모든 모션은 이 색상을 기반으로 부드럽게 시작/종료되어야 한다. [근거: Designer 검증된 지식]
*   **Accent Yellow (`#FFD700`):** 오직 **'기회(Gain)'**, **'행동 유도(CTA)'**, 또는 **'경고(Pain) 수치'**에만 사용된다. 이 색상이 화면에 나타날 때마다 시청자의 시선이 즉각적으로 집중되도록 대비 효과를 극대화해야 한다.
*   **모션 스펙:** 모든 전환은 급격한 컷 편집보다는, **오버랩(Overlap)**과 **패닝/줌 아웃을 통한 정보 계층 구조 변화** 방식을 사용한다. (Ex: 데이터 그래프가 화면 바깥에서 안으로 '슬라이딩'되어 들어오는 방식)

## ✅ 3. 시스템 통합 검증 요청 사항
*   **[To Codari]**: API 호출 결과(Mock Data)의 **특정 필드 값 변화**가 시각화될 때, 애니메이션 스펙에 정의된 **카운팅 업 효과와 동기화**되어야 합니다. 단순 데이터 노출이 아닌 '애니메이션 과정'이 필수입니다.
*   **[To All]**: 제작된 모든 리소스는 16:9 비율 (YouTube Standard)을 기본으로 하되, Instagram Reels용은 세로(9:16)에 맞게 모듈화가 가능해야 합니다.