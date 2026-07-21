# ✨ [최종] 시각 에셋 통합 사양서 v1.0 - Gap Score & 비주얼 클립 라이브러리

**목표:** Writer의 스크립트 기반, CTR 최적화 컨셉을 구현하기 위한 모든 시각 요소(애니메이션, 색상 변화, 데이터 트래킹)에 대한 최종 개발 사양 정의. 이 문서는 코딩 단계로 넘어가기 전, 디자이너가 제공하는 **최종 블루프린트** 역할을 합니다.

## 1. 핵심 브랜드 가이드 재확인 (Self-RAG 근거)
*   **Primary Color (신뢰):** Dark Blue (`#0A2463`) - 배경/주요 정보 섹션.
*   **Accent Color (행동 유도/기회):** Accent Yellow (`#FFD700`) - CTA, Gap Score 'Gain' 영역 강조.
*   **Body/Data:** Neutral Grey (`#F5F5F5`) - 데이터 배경 및 가독성 확보.
*   **핵심 메시지 프레임워크:** Pain $\rightarrow$ Gain (위험 제시 $\rightarrow$ 이득 증명).

## 2. Gap Score 트래킹 에셋 사양 (데이터 기반 애니메이션)
Gap Score는 단순 숫자가 아닌, 사용자의 **'감정적 변곡점(Emotional Transition)'**을 시각화해야 합니다.

| 요소 | 상태 변화 | 색상 코드/가이드라인 | 애니메이션 효과 (애니메이터 지시사항) | 개발 로직 요구 사항 |
| :--- | :--- | :--- | :--- | :--- |
| **Pain Score (위험)** | High $\rightarrow$ Low | `#FF6B6B` (진한 레드 계열) - *🚨 경고* | 1. 불안정한 노이즈(Noise/Glitch) 효과로 시작. 2. 점수가 하락할 때, 색상이 '경고'에서 '중립'으로 부드럽게 디케이(Decay). | **[진동 로직]**: 위험도가 임계치(Threshold A)를 넘을 경우 화면 전체에 미세한 떨림(Shake Effect) 적용. |
| **Gap Score (변곡점)** | Low $\rightarrow$ High | `#0A2463` $\rightarrow$ `#FFD700` (Dark Blue $\rightarrow$ Yellow) | 1. 전환 지점에서 '빛나는 터널' 효과와 함께 색상이 급격히 밝아지며 상승하는 듯한 느낌 부여. 2. 가장 극적인 순간에 **Zoom-In/Focus** 효과를 사용하여 시선 집중 유도. | **[트랜지션 로직]**: 변화율(Rate of Change)이 최대일 때, 해당 프레임의 대비(Contrast)와 밝기(Luminosity)를 최고치로 설정하여 강조. |
| **Gain Score (획득)** | Steady $\rightarrow$ High | `#4CAF50` (성장/긍정적 녹색 계열) - *✅ 성취* | 1. 부드러운 '상승 곡선(Smooth Arc)' 애니메이션을 기본으로 사용. 2. 최고점에 도달할 때, 배경에 미세한 '파티클 효과'를 추가하여 성공감을 극대화. | **[최종 확정 로직]**: 목표 점수 달성 시, 화면 전체에 승리/성과 메시지(`Goal Reached!`)와 함께 긍정적 피드백 사운드를 연동할 수 있는 Placeholder 준비. |

## 3. 비주얼 클립 라이브러리 (High-Res Asset Specs)
모든 클립은 실용음악 입시생의 학습 여정을 상징하는 메타포를 사용해야 합니다.

| No. | 컨셉/사용처 | 내용물 사양 및 길이 | 애니메이션 지침 | 필수 소스 요구 사항 |
| :--- | :--- | :--- | :--- | :--- |
| **C-01** | **[Pain] 막막함의 시각화** | 복잡하게 얽힌 음표/코드 그래프 (3초) | 무질서하고 혼란스러운 움직임. 카메라가 이 미로 속을 헤매는 듯한 느낌. 색상: 어둡고 채도 낮은 회색 계열. | High-Res Noise, Glitch Transition Loop. |
| **C-02** | **[Transition] 통찰의 순간 (Aha!)** | 하나의 점이 다른 점으로 연결되는 빛줄기 (1초) | 마치 수학 공식처럼 논리적으로, 그리고 폭발적으로(Bursting) 커지며 시야를 가리는 듯한 효과. | Linear Path Animation, Bright Radial Gradient Overlay. |
| **C-03** | **[Gain] 명확성 확보** | 정돈되고 깔끔하게 배치된 코드/음표 패턴 (2초) | 완벽한 그리드(Grid) 구조 위에 점들이 하나씩 자리 잡으며 안정감을 주는 모션. 색상: Dark Blue $\rightarrow$ Yellow로 전환되는 Gradient 활용. | Clean Grid Overlay, Smooth Pop-in Animation (Ease-Out). |

## 4. 기술적 통합 지침서 (Developer Handover Checklist)
1. **Asset Format:** 모든 클립은 4K 해상도(3840x2160), 60FPS로 제작되어야 합니다.
2. **API 연동 포인트:** Gap Score 변화는 하드 코딩되지 않으며, 반드시 `kpi_ingestion_service`에서 받은 실시간 데이터(`GapScore_Value`, `Trend`)를 받아와서 애니메이션 파라미터(색상코드, 진폭, 속도)가 동적으로 변경되어야 합니다.
3. **최적화:** 모바일 환경(Reels/Shorts 비율 9:16)에서의 퍼포먼스를 최우선으로 고려하여, 무거운 시각 효과는 필요한 부분에만 집중하고 나머지 배경은 간결한 데이터 애니메이션으로 처리합니다.