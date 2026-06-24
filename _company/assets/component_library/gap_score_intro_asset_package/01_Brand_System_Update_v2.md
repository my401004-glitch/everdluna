# 🎨 Gap Score 인트로 애니메이션 디자인 시스템 업데이트 (V2.0)
**[적용 근거]:** 코다리 개발자님의 `GapScoreVisualizationComponent`가 안정화된 로직을 기반으로 함.
**[목표]:** 단순 목업 수준을 넘어, 실제 모션 그래픽 툴(After Effects/Principle 등)에서 바로 구현 가능한 애니메이션 규칙 정의.

## 1. 핵심 원칙: '데이터 증명의 시각적 언어'
*   **변곡점 강조:** 모든 데이터 변화는 **Dark Blue (신뢰)** $\rightarrow$ **Yellow (경고/기회)**의 색상 대비를 통해 명확히 인지되어야 함.
*   **흐름 구조화:** 정보가 파편적으로 나타나지 않고, 항상 'Gap Score'라는 통합된 시스템을 타고 이동하는 느낌(데이터 스트림)을 유지해야 함.

## 2. 애니메이션 키프레임별 스펙 (3종 세트)
### A. Pain/Risk 발생 순간 (Initial Gap Detection)
*   **비주얼:** 화면 중앙에 큰 'Missing Data' 또는 'Critical Gap Detected' 텍스트가 강렬하게 깜빡이며 등장 (Montserrat Bold, Yellow).
*   **애니메이션 규칙:** 데이터 라인(Dark Blue)이 갑자기 끊어지며 **노이즈/글리치 효과**를 일으킨 후, 커다란 삼각형 경고 아이콘(`⚠️`)과 함께 `Gap Score: [높은 수치]`가 붉은색 계열로 깜빡이며 나타남.
*   **속도:** 빠르고 불안정하며(Fast & Erratic), 시청자의 긴장감을 최고조로 끌어올리는 것이 목표.

### B. Data 증명/분석 순간 (Visualization Process)
*   **비주얼:** Gap Score가 실시간으로 계산되는 '시스템 대시보드' 컨셉의 데이터 흐름이 화면에 펼쳐짐.
*   **애니메이션 규칙:** 파란색(Dark Blue)을 메인 컬러로 사용하여, 여러 개의 작은 데이터 포인트들이 유기적으로 움직이며 중앙의 핵심 Gap Score 수치를 향해 **수렴하는 모션**. 마치 레이더 스캔처럼 보이게 처리하여 '분석 중'임을 강조.
*   **속도:** 일정한 템포(Steady & Measured)를 유지하며, 신뢰감과 전문성을 느끼게 함.

### C. Gain/Solution 발견 순간 (The Breakthrough)
*   **비주얼:** 데이터 흐름이 명확하게 특정 패턴을 찾아내며 '솔루션' 영역에 도달함.
*   **애니메이션 규칙:** 불안정했던 Yellow 경고 신호가 안정화되며, **Accent Yellow (`#FFD700`)의 밝은 빛**과 함께 깨끗한 녹색 계열의 데이터 라인이 획득된 'ROI(Return on Investment)'를 시각적으로 폭발하며 보여줌.
*   **속도:** 갑작스러운 정지(Sudden Stop) 후, 안정되고 강력하게(Powerful & Stable) 마무리하여 카타르시스를 제공함.

## 3. 사용 컴포넌트 라이브러리 업데이트
*   **[Component]:** `DataFlowLine` - 애니메이션 트랙에 활용될 기본 데이터 흐름 라인 (Dark Blue $\rightarrow$ Yellow).
*   **[Component]:** `GapIndicator` - Gap Score가 발생할 때마다 재활용되는 경고/기회 아이콘 세트.