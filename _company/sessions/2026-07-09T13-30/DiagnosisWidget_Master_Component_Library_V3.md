# 🎨 DiagnosisScoreWidget 마스터 컴포넌트 라이브러리 (V3.0)

## 🎯 개요 및 목적
이 문서는 '아지트아트컴페니'의 핵심 측정 지표인 **진단 점수 위젯(Diagnosis Score Widget)**의 모든 상태와 상호작용을 정의합니다. 코다리가 구현할 로직과 디자이너가 제시하는 비주얼 가이드라인을 통합하여, 외부 편집자와 개발자가 혼동 없이 에셋을 제작하고 검증하는 단일 진실 공급원(Single Source of Truth) 역할을 합니다.

## 🎨 디자인 시스템 원칙 준수
*   **Primary Color (신뢰/안정):** Dark Blue (`#0A2463`) - 위젯의 기본 배경, 제목 영역에 사용되어 전문성과 신뢰도를 확보합니다.
*   **Accent Color (행동 유도/기회):** Accent Yellow (`#FFD700`) - 점수 변화가 긍정적일 때(Gain), 또는 사용자에게 즉각적인 행동을 요구할 때(CTA) 강조하여 사용됩니다.
*   **Pain Indicator:** 경고성을 가지되, 패닉 상태를 유발하지 않도록 강렬한 색상과 대비되는 텍스트 처리가 필수입니다.

## ⚙️ 컴포넌트 구조 정의 (Atomic Design Principle)
DiagnosisWidget은 다음의 독립적이고 재사용 가능한 모듈(Component)로 구성됩니다:

1.  **Score Display Component:** 현재 점수와 변화 추이를 보여주는 핵심 숫자 영역.
2.  **Status Indicator Component:** 위젯이 속한 단계(Phase)를 시각적으로 알려주는 게이지/아이콘.
3.  **Narrative Text Component:** 사용자의 상태에 맞는 설명 및 조언 텍스트.
4.  **CTA Button Component:** 다음 액션으로 유도하는 버튼 (예: '진단 리포트 보기', '코칭 상담 신청').

## 📈 Phase별 시각적 가이드라인 (Codari 로직 반영)
| 위젯 상태 (Phase) | Score 범위 | Status Indicator 디자인 및 색상 | Narrative Text 컨셉 | CTA 강조점 (Accent Yellow 활용) | 예시 목업/레퍼런스 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Crisis** | 0-30점 | 경고 게이지, 배경에 노란색과 어두운 회색의 강한 대비. (Critical) | "심각한 수준의 기술적/재무적 Gap이 감지되었습니다." | '즉시 진단 리포트 확인' 버튼을 가장 크게 강조. | **[Mockup-P1]** |
| **Phase 2: Warning** | 31-60점 | 경고 게이지, 주황색 계열의 점진적 경고 색상 사용. (Caution) | "현재 상태는 위험합니다. 체계적인 개선이 필요합니다." | '맞춤 커리큘럼 설계 받기' 버튼을 강조. | **[Mockup-P2]** |
| **Phase 3: Improvement** | 61-85점 | 상승하는 그래프와 녹색/파란색 계열의 안정적인 변화 추이 표시. (Steady) | "노력 대비 성과가 가시적으로 개선되고 있습니다. 유지하세요." | '성장 로드맵 보기' 버튼을 강조하여 지속성을 유도. | **[Mockup-P3]** |
| **Phase 4: Optimal** | 86-95점 | 가장 안정적인 파란색 계열, 최고 점수 달성 그래프 표시. (Stable) | "현재 매우 이상적입니다. 최상위 레벨의 성과를 유지하세요." | '다음 단계 목표 설정하기' 버튼을 강조하여 다음 성장 동기 부여. | **[Mockup-P4]** |
| **Phase 5: Mastery/Gain** | 96-100점 | 가장 밝고 풍부한 색상(골드 계열), 완벽한 마스터리 그래프 표시. (Goal Achieved) | "최적의 성과를 달성하셨습니다! 지속적인 관리가 중요합니다." | **'자세히 알아보기/수익화 전략 상담'** 등 수익 연결 CTA 강조. | **[Mockup-P5]** |

## 📐 컴포넌트 상세 스펙 (Figma Implementation Notes)
*   **Score Display:** 숫자(Montserrat Bold, Size 72pt), 변화 화살표(Directional Arrow Icon). 이전 점수 대비 증감 폭을 `#FFD700`으로 처리하여 시선을 사로잡습니다.
*   **Status Indicator:** 단순 색상 변경이 아닌, **배경색 그라데이션**과 함께 경고 메시지 팝업(Tooltip) 기능을 포함해야 합니다. (개발팀 지침 참고).
*   **Interaction Flow:** 위젯 클릭 시, 해당 Phase에 맞는 구체적인 가이드라인 페이지로 이동하는 애니메이션 프로토타입이 반드시 구현되어야 합니다.

---
**[참조 파일]**: `/Users/iyeongjae/Desktop/초보프로젝트/_company/Assets/BrandSystemKit/01_StyleGuide.fig` (컬러 및 타이포그래피 팔레트)