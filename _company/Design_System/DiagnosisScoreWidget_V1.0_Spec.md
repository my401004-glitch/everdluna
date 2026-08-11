# 📐 [컴포넌트 명세서] Diagnosis Score 위젯 (v1.0)
**목표:** 사용자에게 데이터 기반의 '현재 상태(Pain)'와 '개선 가능성(Gain)'을 즉각적으로 인식시키고, 다음 액션(CTA)으로 유도하는 핵심 시각 컴포넌트.
**활용 컨텍스트:** 모든 진단 리포팅 페이지 (Landing Page, 결과 보고서 등).

## 1. 위젯 개요 및 목표 상태 정의
Diagnosis Score는 점수 자체보다 **점수가 의미하는 바(Severity)**를 강조해야 합니다. 시각적 표현은 '경고/기회'의 이분법에 초점을 맞춥니다.

| 요소 | 설명 | 디자인 원칙 (Self-RAG 근거) |
| :--- | :--- | :--- |
| **Primary Metric** | 최종 진단 점수(Score). 가장 크게 표시되어야 함. | Montserrat Bold, 최대의 시선 집중도 확보. [근거: sessions/2026-05-19...] |
| **Severity Indicator** | 점수의 위험도를 색상과 아이콘으로 즉시 인지시킴. | Accent Yellow를 중심으로 3단계 컬러 코딩 (Green $\rightarrow$ Yellow $\rightarrow$ Red). [근거: Designer 검증된 지식] |
| **Interpretation Text** | 이 점수가 사용자에게 의미하는 바를 설명. (Pain/Gain 프레임워크 적용) | Noto Sans KR, 명확한 가독성을 유지하며 전문적인 톤을 전달해야 함. [근거: sessions/2026-05-19...] |
| **Action CTA** | 다음 단계로의 행동 유도 버튼 (가장 중요한 액션). | Accent Yellow를 배경으로 사용하여 즉각적인 클릭을 유도합니다. [근거: Designer 검증된 지식] |

## 2. 컴포넌트 구조 및 레이아웃 (Wireframe/Layout)
**전체 크기:** 가로 100% (반응형 기준), 최소 너비 600px 이상 확보 권장.
**레이아웃 분할:** 3단 구조를 채택하여 정보의 위계질서를 명확히 합니다.

1.  **[상단: 점수/Severity]**: 가장 크고 시각적인 영역 (점수와 컬러 블록).
2.  **[중앙: 해석 텍스트]**: 전문성 있는 설명(Pain $\rightarrow$ Gain) 제공.
3.  **[하단: CTA 버튼]**: 최종 액션 유도.

### 상세 스펙 정의:
*   **폰트:** Title (Montserrat Bold), Body (Noto Sans KR Regular).
*   **Spacing:** 섹션 간 패딩은 최소 48px를 확보하여 답답함을 해소합니다.

## 3. 위젯 상태(States) 및 시각적 요구사항
개발팀이 반드시 고려해야 할 세 가지 핵심 상태와 그에 따른 디자인 가이드를 정의합니다.

### State A: Critical / High Risk (빨간색 경고)
*   **Score Range:** 0~49점대 (예시).
*   **Severity Color:** Red (`#D32F2F` - Warning/Critical).
*   **Visual Cue:** 점수 숫자 주변에 '⚠️ 위험' 아이콘을 배치하고, Background를 연한 Red 계열로 처리하여 긴장감을 조성합니다.
*   **Interpretation Text (Pain):** "현재의 방식으로는 이탈 위험이 높습니다."와 같이 강력하게 불안감을 자극하는 문구 사용.
*   **CTA:** `[즉시 솔루션 받기]`

### State B: Moderate / Warning (노란색 경고)
*   **Score Range:** 50~79점대 (예시).
*   **Severity Color:** Accent Yellow (`#FFD700`).
*   **Visual Cue:** 점수와 함께 '⚠️ 개선 필요' 아이콘 배치. 배경은 중립적인 그레이를 유지하되, 노란색으로 포인트를 줍니다.
*   **Interpretation Text (Gain):** "현재 상태는 안정적이나, 몇 가지 영역의 보완이 필요합니다."처럼 문제 해결의 가능성을 제시하는 문구 사용.
*   **CTA:** `[세부 진단 리포트 받기]`

### State C: Excellent / Low Risk (파란색 신뢰)
*   **Score Range:** 80~100점대 (예시).
*   **Severity Color:** Primary Blue (`#0A2463`).
*   **Visual Cue:** 점수 주변에 '✅ 우수' 아이콘 배치. 배경은 깨끗한 Neutral Grey로 전문성을 강조합니다.
*   **Interpretation Text (Gain):** "현재 시스템을 유지하고, 이 강점을 극대화하는 전략이 필요합니다."처럼 현상 유지를 통한 기회 창출을 제시합니다.
*   **CTA:** `[성장 로드맵 확인하기]`

## 4. Figma 구현 및 프로토타입 요구사항 (Handoff Guide)
1.  **Interaction Flow:** 마우스를 위젯의 점수 영역에 올리면(Hover), Score가 작은 애니메이션(Scale-up)과 함께 Severity Color가 미묘하게 변하는 인터랙션을 적용해야 합니다.
2.  **Data Binding:** 이 컴포넌트는 데이터 바인딩을 기본으로 하므로, 실제 Figma에서는 Dummy Data 3세트(A, B, C State)를 반드시 분리하여 테스트 가능한 프로토타입으로 구현해야 합니다.

---