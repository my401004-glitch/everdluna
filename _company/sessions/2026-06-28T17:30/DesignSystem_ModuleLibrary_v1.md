# 🎨 아지트아트컴페니 디자인 시스템 모듈 라이브러리 (v1.0)

## 🎯 목표 및 원칙
*   **목표:** 모든 콘텐츠(썸네일, 인트로/아웃트로, 데이터 시각화)에 걸쳐 통일된 브랜드 경험을 제공하고, 제작 속도와 일관성을 극대화한다.
*   **핵심 컨셉:** Pain $\rightarrow$ Gain (좌절에서 승리로의 변곡점). 모든 컴포넌트는 이 흐름을 시각적으로 증명해야 한다.

## 🌈 컬러 시스템 표준 (Color Palette Standard)
| 이름 | 코드 (HEX) | 용도 및 의미 | 적용 규칙 |
| :--- | :--- | :--- | :--- |
| **Primary Trust** | `#0A2463` | 신뢰, 전문성. 배경, 헤더, 주 정보 섹션. | 주요 텍스트와 명암 대비를 통해 안정감 제공. (Dark Blue) |
| **Accent CTA/Gain** | `#FFD700` | 기회, 이득, 경고(Pain), 최종 CTA. | 모든 수치적 강조점과 클릭 유도 요소에 제한적으로 사용. (Yellow) |
| **Neutral Background** | `#F5F5F5` | 본문 및 데이터 배경. | 가독성 극대화를 위해 주요 콘텐츠와 분리 배치. |
| **Secondary Contrast** | `#3A4C62` | 중간 톤, 그래프 구분선, 보조 정보. | Primary Blue의 강도를 낮춰 깊이감을 더함. |

## 🅰️ 타이포그래피 시스템 (Typography Standard)
*   **Headline/Key Message:** Montserrat Bold (가장 강력한 메시지를 전달하는 핵심 키워드에 사용).
*   **Body/Data Display:** Noto Sans KR Regular/Medium (데이터 및 상세 설명을 위한 높은 가독성 유지).

---

## ⚙️ [Component 1] 동적 타이틀 카드 템플릿 (Dynamic Title Card Template)
*   **용도:** 영상 인트로, 핵심 메시지 전환 지점.
*   **레이아웃 (화면 비율: 16:9):**
    1.  **배경:** Solid Dark Blue (`#0A2463`) 또는 깊은 그라디언트.
    2.  **메인 헤드라인 (Pain/Gain):** Montserrat Bold, 흰색 텍스트 사용. 크기는 화면의 60%를 차지하도록 설정. (예: `[❌ 실패]`, `[✅ 성공]`).
    3.  **핵심 강조 박스 (CTA Trigger):** 메인 헤드라인 하단에 Accent Yellow (`#FFD700`) 배경의 직사각형을 배치하고, 여기에 구체적인 수치나 행동 유도 문구(예: 'AI 활용 85% 효율 증가!')를 Noto Sans KR로 삽입.
*   **애니메이션 지시:** Pain $\rightarrow$ Gain으로 전환될 때, Yellow 강조 박스가 폭발적으로 커지는 듯한 효과 적용 (Momentum Effect).

## 💾 [Component 2] 범용 데이터 흐름 모듈 (Universal Data Flow Module)
*   **용도:** API 기반의 프로세스 설명, 기술적 스토리보드 시각화.
*   **구조:** **[INPUT DATA (PAIN)] $\rightarrow$ [PROCESS BLOCK (SOLUTION)] $\rightarrow$ [OUTPUT SCORE (GAIN)]** 3단계 순차 구조를 가짐.
    1.  **Input Block (좌측):** 배경은 Dark Blue의 낮은 투명도 (`#0A2463` / opacity 50%)로 설정. Pain 요소를 나타내는 그래프나 수치(빨간색 계열) 배치.
    2.  **Process Block (중앙):** 중앙에 가장 크게 위치하며, 배경은 Accent Yellow를 살짝 사용한 그라디언트로 주목도를 높임. 이 공간에 시스템의 핵심 작동 원리/로직을 다이어그램 형태로 삽입.
    3.  **Output Block (우측):** 배경은 Dark Blue와 명확히 대비되는 밝은 톤으로 설정하고, 최종 Gain 수치(초록색 또는 Yellow)를 가장 크게 배치하여 성과 증명을 완료함.

## 🖼️ [Component 3] 모듈형 썸네일 키트 (Modular Thumbnail Template Kit)
*   **용도:** 모든 주제의 CTR 극대화를 위한 기본 틀.
*   **레이아웃 규칙:** 텍스트와 비주얼 요소를 반드시 분할하여 배치한다.
    1.  **좌측 섹션 (Pain/Hook):** 어둡고 강렬한 색상(Dark Blue)을 배경으로 사용하여 '문제 제기'에 집중하게 함. 여기에 충격적인 수치나 질문형 헤드라인 삽입.
    2.  **우측 섹션 (Solution/Gain):** 밝거나 대비되는 색상(Neutral Grey 또는 Yellow 액센트)을 배경으로 사용하며, 구체적인 해결책과 최종 결과물('성공 예시') 이미지를 배치.
    3.  **통합 요소:** 썸네일의 좌우 경계선을 따라 **Yellow Accent Bar**를 두껍게 삽입하여 시선이 자연스럽게 흐르도록 유도한다.