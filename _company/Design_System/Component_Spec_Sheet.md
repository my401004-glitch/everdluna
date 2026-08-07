# 🧩 데이터-구동형 UI 컴포넌트 사양서 (Diagnostic System Kit V1.0)

## 🌟 목표
본 문서는 `POST /api/v1/validate_diagnosis` 엔드포인트의 **기술적 출력 스키마**를 기반으로, 사용자에게 제공될 모든 시각적 피드백 요소(UI Component)가 어떻게 동작하고 디자인되어야 하는지를 정의한다. 이 사양은 개발팀과 디자인팀 모두가 최종 목업 제작에 따라야 할 Single Source of Truth이다.

## 📋 I. API 출력 스키마 (Developer Input Required)
**[Placeholder: 코다리로부터 확정된 JSON Schema를 여기에 삽입합니다.]**

*   **핵심 지표:** `score` (Number): 진단 점수. (예: 0~100점)
*   **위험도/상태:** `risk_level` (String): 사용자 상태 분류. ("Low", "Medium", "High")
*   **개선 영역:** `improvement_area` (Array of Objects): 구체적인 학습 필요 영역 리스트.

## 🎨 II. 디자인 컴포넌트 매핑 및 사양 규칙

### 1. [핵심 성과 지표 카드] - Score Card Component
*   **매핑 데이터:** `score`
*   **시각화 목표:** 사용자가 자신의 현재 위치를 직관적으로 이해하도록 한다. (Pain $\rightarrow$ Gain 프레임워크 적용)
*   **디자인 규칙:**
    1.  **크기/위치:** 진단 결과 화면의 최상단, 가장 눈에 띄는 중앙 영역에 배치한다.
    2.  **표시 방식:** 숫자와 함께 게이지 바(Gauge Bar)를 결합하여 사용한다.
    3.  **동작 원리 (Critical):** Score가 낮을수록(Pain) 배경의 경고 Yellow (`#FFD700`) 영역이 점유율을 높이고, 높은 점수일수록(Gain) 신뢰 Dark Blue (`#0A2463`) 영역이 점유율을 높인다.

### 2. [위험도/상태 표시] - Risk Level Indicator
*   **매핑 데이터:** `risk_level` (String)
*   **시각화 목표:** 사용자에게 즉각적인 행동 유도(CTA)를 제공한다.
*   **디자인 규칙:**
    1.  **High (위험):** **강한 경고의 Yellow (`#FFD700`) 배경, Montserrat Bold 텍스트.** "즉시 개선 필요" 등의 문구와 함께 CTA 버튼을 강제 노출한다. [근거: Designer 검증된 지식]
    2.  **Medium (주의):** **Yellow-Blue 그라데이션 적용.** "관심 필요", "점검 권장" 등의 중립적 경고 톤으로 접근한다.
    3.  **Low (안정):** Dark Blue 배경에 흰색 텍스트를 사용하여 안정감을 강조하며, '유지'나 '최상위 달성'이라는 긍정 메시지를 전달한다.

### 3. [개선 영역 리스트] - Improvement Area Component
*   **매핑 데이터:** `improvement_area` (Array of Objects)
*   **시각화 목표:** 진단 결과의 근거(Evidence)를 제시하고, 다음 학습 경로를 안내한다.
*   **디자인 규칙:**
    1.  **레이아웃:** 반복되는 카드(Card) 형태로 구성하며, 각 카드는 **[핵심 키워드] (Montserrat Bold)** 와 그에 대한 **[상세 설명] (Noto Sans KR)** 이 포함된다.
    2.  **강조:** 가장 개선이 필요한 상위 3개 항목만 별도의 'Critical Focus' 섹션으로 분리하여 배치하고, 여기에 Accent Yellow를 사용하여 시선을 고정시킨다.

## ✨ III. 자가검증 프로토콜 (Self-RAG Protocol)
모든 UI 컴포넌트의 디자인은 아래의 규칙을 준수해야 한다:
1.  **Pain $\rightarrow$ Gain**: 진단 결과는 반드시 '현재 부족한 점(Pain)'에 대한 경고로 시작하여, 이 시스템을 통해 얻을 수 있는 '미래의 성과(Gain/ROI)'로 자연스럽게 연결되어야 한다. [근거: Designer 검증된 지식]
2.  **데이터 근거 명시:** 모든 주장은 막연한 설명이 아닌, 반드시 API 스키마와 연관된 데이터 값을 기준으로 서술해야 한다.