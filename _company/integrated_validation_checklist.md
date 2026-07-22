# ✨ 통합 검증 체크리스트 (KPI Validator 연동)

**목표:** 데이터(점수 변화) $\rightarrow$ 비즈니스 로직 $\rightarrow$ 시각 자산(애니메이션/색상)의 완벽한 흐름 매핑 및 테스트.

## 📋 진단 점수 기반 이벤트 트리거 정의
| 점수 변화 구간 (Input Trigger) | 감정적 서사 변화 (Story Arc) | 비즈니스 로직 처리 (Service Layer Action) | 요구되는 시각 자산/효과 (Designer Asset Spec) | 검증 담당자 | 완료 여부 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pain Point 발견** (0-3점) | 좌절 / 문제 인식 | `DiagnosisService.calculatePain(input)` 호출 및 위험 요소 리포트 생성 | `#FF9800` 경고색, '오류 지점' 강조 애니메이션, 충격적인 통계 차트. | Codari/Designer | [미완] |
| **해결책 제시** (3-7점) | 노력 / 가능성 발견 | `DiagnosisService.calculateImprovement(input)` 호출 및 개선 과제 제시 | `#0A2463` 신뢰색, '개선 방향'을 나타내는 점진적 성장 그래프 애니메이션. | Codari/Designer | [미완] |
| **승리 변곡점** (7-10점) | 성취 / 최종 목표 달성 | `DiagnosisService.finalizeReport(input)` 호출 및 최종 점수 확정 | `#FFD700` 액센트 색상, 'Success' 타이포그래피, 화려한 승리 애니메이션. | Codari/Designer | [미완] |

## ⚙️ 기술 검증 항목
1.  **API 연동:** `diagnosisController.ts`가 진단 점수 변화를 실시간으로 받아 처리할 수 있는가? (Yes/No)
2.  **데이터 흐름:** 계산된 KPI 점수가 모든 시각적 자산 로직에 정확하게 전달되는가? (예: Growth Score > 7이면, Yellow Accent Color가 활성화되어야 함.)
3.  **오류 처리:** 데이터 전송 실패나 비정상적인 입력 값이 들어올 때 사용자에게 친절한 메시지를 출력하는가?