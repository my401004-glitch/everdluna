# 예측형 경고 모듈 디자인 시스템 명세서 v1.0

## 🚀 개요 및 목적
이 컴포넌트는 사용자의 학습 데이터(Gap Score, LTV 등)를 기반으로 '미래의 잠재적 위험'과 '개선 시 기대 이득'을 객관적인 수치로 제시하여 사용자에게 **통제감**과 **즉각적인 행동 필요성(Sense of Urgency)**을 부여하는 핵심 UI/UX 모듈입니다.

## 🎨 브랜드 시스템 적용 (검증된 지식 반영)
*   **Primary Color (신뢰):** Dark Blue (`#0A2463`) — 배경 및 기본 정보 제공에 사용되어 전문성을 확보합니다. [근거: Designer 검증된 지식]
*   **Accent Yellow (경고/기회):** Accent Yellow (`#FFD700`) — 위험 수치(Pain)와 개선 기회(Gain), 그리고 핵심 CTA 버튼에만 제한적으로 사용하여 시선 집중을 유도합니다. [근거: Designer 검증된 지식]
*   **Typography:** Title (Montserrat Bold), Body (Noto Sans KR).

## 📊 모듈 상태 정의 (State Definition)
모듈은 데이터의 심각도에 따라 세 가지 명확한 상태(State)를 가집니다. 각 상태별 컬러 코드와 시각적 강조가 필수입니다.

| State | 이름 | 위험 레벨 | Primary Color | Accent Color | 메시지 톤 | 사용 목적 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Critical Warning (위험)** | High Risk (90%+) | Red (`#CC3333`) | Yellow (`#FFD700`) | 경고/충격적 | 당장 행동이 필요한 상황. 이탈 위험 수치 제시. |
| **2** | **Potential Warning (잠재)** | Medium Risk (50-90%) | Orange (`#FF8C00`) | Yellow (`#FFD700`) | 경고/주의 필요 | 관리가 필요하며, 적극적인 개입을 유도하는 단계. |
| **3** | **Stable Status (안정)** | Low Risk (<50%) | Dark Blue (`#0A2463`) | Green (`#4CAF50`) | 안심/성장 가능 | 긍정적 피드백 제시 및 다음 목표 설정 유도. |

## 📐 컴포넌트 상세 구성 요소 (Component Breakdown)
모든 모듈은 이 세 가지 필수 요소를 포함해야 합니다.

1.  **헤더 (Header - [Montserrat Bold]):** 가장 강력한 문구로 사용자 시선을 잡습니다. ("경고: 현재 학습 패턴 유지 시 92일 후 이탈 확률 85%").
2.  **데이터 핵심 수치 영역 (Core Metric):** 가장 중요한 수치를 큰 글씨(Noto Sans KR)와 함께 보여줍니다. (예: Gap Score - 45점). **이 부분에만 Accent Yellow를 사용합니다.** [근거: Designer 검증된 지식]
3.  **액션 로드맵/CTA 영역:** 해결책 제시 및 다음 단계로의 유도 버튼입니다. (예: "개선 방안 확인하기" - CTA 노란색).

## 🎬 애니메이션 가이드라인 (Animation Flow)
*   **진입(Enter):** 모듈이 화면에 나타날 때, 위험 레벨 컬러가 배경 전체를 빠르게 스캔하듯 '스윕(Sweep)' 효과로 강조되어야 합니다.
*   **변화(Transition):** 데이터 수치 변화 시에는 숫자가 튀는 듯한 (Bouncy/Spring) 효과와 함께 이전 값에서 새로운 값으로 부드럽게 전환됩니다.