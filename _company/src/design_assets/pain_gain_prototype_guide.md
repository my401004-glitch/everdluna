# 🎨 Designer: Pain Point 인터랙티브 프로토타이핑 가이드 (Figma)

## 1. 목표 및 범위 정의
*   **목표:** MVP의 핵심 흐름(진단 시작 $\rightarrow$ 결과 확인 $\rightarrow$ 다음 액션 제안)에서 발생하는 **기술적/사용자 경험적 오류 지점(Pain Points)**을 시각화하고, 이를 해결하는 **최적의 UX 솔루션(Gain Points)**이 실제로 상호작용하도록 프로토타입을 제작한다.
*   **범위:** Figma 파일 내에 독립적인 컴포넌트와 연결된 3가지 핵심 실패 흐름에 초점을 맞춘다.

## 2. 필수 컴포넌트 세트 (Design System 적용)
모든 컴포넌트는 [근거: Designer 검증된 지식]에서 확정된 컬러/타이포그래피를 따릅니다.

| 컴포넌트 | 용도 및 상태 | 핵심 디자인 규칙 | 코드 연동 고려 사항 |
| :--- | :--- | :--- | :--- |
| **Error Card (Pain)** | API 실패, 서버 오류 등 치명적 문제 발생 시. | Dark Blue 배경, Accent Yellow 경고 아이콘 필수 사용. *절대* '오류'라는 단어만 쓰지 않고, 원인을 공감형 문구로 설명한다. [근거: sessions/2026-06-29T05-22/designer.md] | `API_ERROR` 상태 코드와 연결되어야 함. |
| **Validation Alert (Pain)** | 사용자 입력값 오류 (예: 이메일 형식 불일치, 필수 필드 누락). | 연한 Red 계열의 경고 박스. 해당 입력 필드 옆에 붙여서 원인과 해결책을 명시한다. | `FRONTEND_VALIDATION` 상태와 연결되어야 함. |
| **Recovery Prompt (Gain)** | 문제 발생 후, 사용자가 다음 행동을 취할 수 있도록 유도하는 컴포넌트. | Accent Yellow의 버튼(CTA)이 가장 두드러져야 한다. '다시 시도', '설정 변경' 등 명확한 액션 옵션을 제공한다. | `ACTION_SUCCESS` 상태가 아님에도 불구하고, 시스템적 해결책을 제시하여 사용자 이탈을 막는다. |
| **Empty State View** | 데이터 로딩 실패 또는 결과물이 없을 때. | 텅 빈 공간에 좌절감을 주지 않는 '스토리텔링' 형태의 메시지를 넣고, 다음 액션을 가이드한다. (예: "아직 점수가 없지만, 이 과정으로 시작해보세요.") | `NO_DATA` 상태 코드와 연결되어야 함. |

## 3. 인터랙티브 플로우 시나리오 (Proto-Flow)
Figma Prototype에서 다음과 같은 흐름을 구현합니다.

1.  **[Start] 진단 버튼 클릭 $\rightarrow$ [Transition 1] 로딩 스피너 활성화.** (로딩 중 불안감 최소화 필요.)
2.  **Case A: Success:** 데이터가 정상적으로 도착 $\rightarrow$ **결과 확인 페이지 노출.** (Gain Point UI)
3.  **Case B: Failure (API Error):** `diagnosis_score` API 호출 시, 서버에서 에러 코드(예: 401 Unauthorized)를 반환하는 경우 $\rightarrow$ **Error Card (Pain)**가 나타나며, 사용자에게 '로그인 필요'라는 구체적 해결책을 제시한다.
4.  **Case C: Failure (Validation):** 진단 과정 중 특정 필드(예: 목표 설정) 입력이 누락된 경우 $\rightarrow$ 해당 필드에 **Validation Alert (Pain)**가 빨간색으로 표시되고, 사용자가 수정하도록 유도된다.

## 4. 코딩 연동 요청 사항
코다리에게 이 컴포넌트들이 단순히 디자인으로 끝나는 것이 아니라, 실제 API 응답 구조(JSON)의 특정 필드 값에 따라 **조건부로 렌더링**되어야 함을 강조합니다. (예: `if response.error_code == 401` $\rightarrow$ Error Card 컴포넌트 활성화)