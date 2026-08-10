# 🎨 아지트아트컴페니 디자인 시스템 가이드북 V2.0 (핵심 컴포넌트 라이브러리)

## ✨ 🎯 목표: Diagnosis Score 위젯 표준화 및 개발 핸드오프
이 문서는 모든 UI/UX 요소의 '기준점'을 제시합니다. Figma 프로토타입 제작에 앞서, 디자인과 기술 사양(Tech Spec) 간의 불일치를 제거하고 컴포넌트의 재사용성을 극대화하는 것을 목표로 합니다.

---

## 🎨 I. 디자인 시스템 원칙 (Design Principles)
1.  **Pain $\rightarrow$ Gain 강조:** 모든 수치와 시각적 요소는 '현재의 문제(Risk)'를 제시한 후, '솔루션 적용을 통한 이득(ROI)'으로 명확히 연결되어야 합니다. [근거: Designer 검증된 지식]
2.  **데이터 중심 디자인 (Data-Driven):** 모든 색상/레이아웃은 임의가 아닌, 백엔드 API(`Diagnosis Score` JSON 스키마)에서 전달되는 데이터에 의해 결정됩니다.
3.  **Hierarchy & Focus:** Dark Blue (`#0A2463`)를 배경 및 신뢰 영역에 사용하고, Accent Yellow (`#FFD700`)는 **오직 '경고/기회/CTA' 상태**에만 사용합니다.

## 🌈 II. 컬러 팔레트 (Color Palette)
| 용도 | 코드 | 역할 및 설명 | 적용 범위 | [근거: Designer 검증된 지식] |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Trust** | `#0A2463` (Dark Blue) | 신뢰성, 전문성. 배경, 헤더, 주 정보 영역. | 전체 시스템의 기반 색상. | O |
| **Accent Warning/Gain** | `#FFD700` (Yellow) | 경고(Pain), 기회(Gain), CTA. 데이터 상태 변화 강조. | 위험 수치 표시, 버튼 활성화 상태. | O |
| **Background/Neutral** | `#F5F5F5` (Grey) | 본문 배경, 데이터 테이블의 구분선. 가독성 확보. | 텍스트와 데이터를 담는 영역. | O |
| **Success State** | `#4CAF50` (Green) | 목표 달성, 양호한 상태(Score > High). | 위젯 내부 수치 표시. | [추측] |

## 🔡 III. 타이포그래피 (Typography)
*   **헤드라인 (H1/H2):** Montserrat Bold (`[근거: Designer 검증된 지식]`) - 강력한 메시지 전달력 확보.
*   **본문/데이터:** Noto Sans KR Regular/Medium (`[근거: Designer 검증된 지식]`) - 높은 가독성 및 데이터 제시 적합성.

## 🧩 IV. 핵심 컴포넌트 상세 사양 (Diagnosis Score Widget)
### 1. 위젯 구조 (Component Structure)
*   **전체 크기:** 반응형, 최소 너비 300px 권장.
*   **구성 요소:** [A] 헤더(Widget Title) $\rightarrow$ [B] 메인 스코어 표시 영역 $\rightarrow$ [C] 세부 위험 지표 (Sub-Metrics).

### 2. 상태 정의 및 동작 사양 (State & Behavior - **가장 중요**)
| 속성 | 설명 | 데이터 기반 결정 로직 | 시각적 구현 가이드라인 | [근거: sessions/2026-08-10T08:43/designer.md] |
| :--- | :--- | :--- | :--- | :--- |
| **Score 값** | `score_value` (예: 75) | API에서 직접 수신하는 정수형 데이터. | Noto Sans KR, Bold 처리. 크고 눈에 띄게 배치. | O |
| **위험 레벨** | `risk_level` (High/Medium/Low) | 점수의 범위를 기준으로 정의됨. (예: $<40$ = High Risk) | 전체 위젯의 배경색 또는 경계선 색상 결정. | O |
| **헤더 메시지** | `status_message` (문구) | 현재 스코어에 맞는 해석 문구 ('주의 필요', '양호한 수준'). | Montserrat Bold, 2줄 이내로 간결하게 배치. | O |
| **CTA 활성화** | `is_cta_active` (Boolean) | 위젯이 최종 결론을 내릴 때만 `True`. | Yellow Accent를 사용한 버튼(`[문제 해결하기]`) 형태로 구현. | O |

### 3. [ Figma Prototype 구체화 지침 ]
*   **State Transition:** High Risk $\rightarrow$ Medium Risk $\rightarrow$ Low Risk로 변화하는 애니메이션을 반드시 정의해야 합니다 (예: Yellow 깜빡임 $\rightarrow$ Dark Blue 안정화).
*   **Interaction:** 위젯 전체를 클릭 가능한 영역으로 정의하고, 클릭 시 '해결책 제시' 페이지(Next Step)로 부드럽게 전환되도록 프로토타이핑합니다.