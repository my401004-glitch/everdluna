# 📐 Designer Asset & Dimension Specification (V1.0)

## 🎯 목적
`DiagnosisController` 및 `KPI Validator`가 안정적으로 작동하고, 최종 콘텐츠 제작에 필요한 시각 자산의 기술적 최소 요구사항을 확정합니다. 모든 에셋은 **재사용성과 편집 용이성(Master Production Spec)**을 최우선으로 합니다.

## 🖼️ A. 필수 비주얼 에셋 (Visual Assets)
| 에셋 타입 | 사용 목적 | 예상 크기/해상도 (Dimension) | 파일 포맷 및 요구사항 |
| :--- | :--- | :--- | :--- |
| **Background Clip** | 진단 점수 변화에 따른 분위기 조성 | 1920x1080 (4K 업스케일 대비 여유 공간 확보 권장) | ProRes 또는 High Bitrate MP4. 움직임 패턴(Motion Vector)이 예측 가능해야 함. |
| **KPI 시각화 그래프** | Growth, Engagement, Monetization 추이를 보여주는 차트 | 1920x540 (와이드 비율 최적화) | After Effects 프로젝트 파일 (.aep) 또는 SVG 기반의 벡터 애니메이션 소스 제공 필수. 데이터 바인딩 포인트(Keyframe Points) 명시 필요. |
| **텍스트 오버레이** | 핵심 메시지 강조 (`Gap Score: 75점`) | 가변적 (폰트 크기 80pt 이상 기준) | 브랜드 폰트셋 (TTF/OTF). 다양한 배경색(Dark/Light)을 위한 대비 색상 팔레트 제공 필수. |
| **전환 효과 (Transition)** | Scene A $\rightarrow$ Scene B 전환 시의 감정적 싱크를 담당 | - | *모션 그래프* 기반의 트랜지션 템플릿 세트 (.mogrt 또는 After Effects 프리셋). 시간 축(Timeline)에 대한 명확한 제어점을 제공해야 함. |

## 📊 B. 데이터 매핑 및 차원 (Data Mapping & Dimension)
1.  **KPI 시각화:** `DiagnosisController`가 반환하는 JSON 구조(`kpis: { growth: N, engagement: N, monetization: N }`)를 1대1로 매칭하여 그래프의 X축(시간/단계)과 Y축(점수)을 정의합니다.
2.  **Gap Score Depth:** 이 수치는 단순 숫자가 아닌, '변화율' 또는 '잠재력 지표'로 해석되어야 하므로, **시각적으로 명확한 변곡점(Inflection Point)** 애니메이션이 필수입니다. (예: 낮은 점수에서 급격히 상승할 때의 시각적 임팩트)

## ⚠️ Designer to Codari Checklist
*   [ ] 모든 에셋은 최종 영상 길이(예: 90초)를 고려하여 제작되어야 함.
*   [ ] **데이터 바인딩**: 애니메이션 소스는 *수동 키프레임 조정이 아니라*, API 또는 데이터 변경에 따라 값이 업데이트될 수 있는 구조여야 합니다. (프로덕션 환경 필수 요구사항)