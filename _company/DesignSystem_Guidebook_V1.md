# 🎨 아지트아트컴페니 디자인 시스템 가이드라인 (V1.0)
## 🚀 개요 및 목표
이 문서는 모든 콘텐츠 제작에 사용되는 통일된 시각적 언어(Visual Language)를 정의하며, 개발팀과 콘텐츠 기획자 간의 사양 불일치를 방지하는 것을 목표로 합니다. 핵심 메시지인 '좌절에서 승리로의 변곡점 (Pain $\rightarrow$ Gain)' 프레임워크가 모든 컴포넌트에 녹아들어야 합니다.

## 🎨 1. 컬러 팔레트 (Color Palette)
모든 색상은 명확한 목적(Purpose)과 연결되어야 하며, HEX 코드를 기준으로 정의합니다.

| 이름 | HEX 코드 | 용도 및 의미 | 적용 예시 |
| :--- | :--- | :--- | :--- |
| **Primary/Trust (신뢰)** | `#0A2463` | 배경, 헤더, 주요 정보 섹션. 전문성과 신뢰감을 확보합니다. | 메인 타이틀 배경, 핵심 진단 결과 강조 박스. |
| **Accent/Gain (기회/성장)** | `#FFD700` | CTA 버튼, 긍정적 수치(Gain), 기회 발견 지점. 즉각적인 행동 유도. | "무료 리포트 받기" 버튼, 목표 달성률 표시. |
| **Warning/Pain (위험/주의)** | `#FF6B6B` | 위험 수치(Risk), 경고 메시지, 개선 필요 영역. 시선 집중을 통한 긴급성 부여. | '이탈 위험 지표' 위젯 배경, 낮은 점수 구간 표시. |
| **Neutral/Background (기본)** | `#F5F5F5` | 본문 텍스트 배경, 데이터 표의 구분선 등 가독성을 유지하는 영역. | 일반적인 데이터 설명 영역. |
| **Success (성공)** | `#4CAF50` | 목표 달성 및 성공적으로 개선된 수치를 나타내는 보조 색상. | 최종 '성장' 섹션 하이라이트. |

## 🔡 2. 타이포그래피 시스템 (Typography System)
가독성과 메시지 전달력에 따라 폰트를 분리하여 사용합니다.

| 용도 | 폰트 패밀리 | 가중치(Weight) | 역할 및 목적 |
| :--- | :--- | :--- | :--- |
| **Headline/Title (헤드라인)** | Montserrat | Bold (700) | 가장 강력한 메시지 전달. Pain, Gain의 핵심 키워드에 사용. |
| **Body Text (본문 텍스트)** | Noto Sans KR | Regular (400) | 구체적인 데이터와 설명 텍스트. 높은 가독성 확보. |
| **Label/Metadata (라벨)** | Noto Sans KR | Medium (500) | 그래프의 축 제목, 위젯의 소제목 등 보조 정보에 사용. |

## 🧩 3. 핵심 컴포넌트 사양 정의 (Component Specifications)

### A. Diagnosis Score 위젯
*   **목적:** 사용자에게 현재 상태를 직관적으로 전달하고 개선 동기를 부여합니다.
*   **구조:** [Score Display] + [Severity Indicator] + [Call to Action Button].
*   **상태별 사양:**
    *   **Poor (위험):** 배경 `#FF6B6B`에 근접한 붉은색 경고 표시, 제목에 '🔴 위험' 강조. (Pain 단계)
    *   **Average (주의):** 배경 색상 중립적, 라벨로 `Needs Improvement` 제시.
    *   **Good (성장/기회):** Accent Yellow (`#FFD700`)를 활용한 상승 곡선 애니메이션 및 '📈 기회 발견' 문구 강조. (Gain 단계)

### B. KPI 그래프 모듈
*   **목적:** 시간 경과에 따른 변화(Growth History)를 시각화합니다.
*   **유형:** 라인 차트 (Line Chart).
*   **규칙:** **항상 시작점은 Pain, 끝점은 Gain의 형태로 설계되어야 합니다.** 그래프의 기울기가 가파를수록 메시지가 강력해집니다.

### C. CTA 버튼 컴포넌트
*   **Primary Button (최종 목표):** 배경 `#FFD700`, 텍스트 Dark Blue (`#0A2463`). 모서리 둥글기(Border Radius)는 8px로 통일합니다.
*   **Secondary Button (정보 제공):** 투명 배경, 테두리만 `Dark Blue` 사용.

## 🌐 4. 정보 계층 구조 및 플로우 (Information Hierarchy & Flow)
1. **Hook (Pain 제시):** 가장 크고 강렬한 헤드라인(Montserrat Bold)으로 시작합니다. 현재의 문제점/손실을 명확히 보여줍니다. (`#FF6B6B` 활용).
2. **Evidence (객관적 데이터):** Diagnosis Score 위젯 및 KPI 그래프를 배치하여, Pain이 감성적인 느낌에 그치지 않고 '데이터'로 증명됨을 보여줍니다.
3. **Solution & Gain (해결책 제시):** Accent Yellow (`#FFD700`)가 폭발적으로 사용되며, 얻게 될 이득(ROI)과 CTA 버튼으로 자연스럽게 연결됩니다.

***