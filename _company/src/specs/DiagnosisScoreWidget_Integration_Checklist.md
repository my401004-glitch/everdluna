# 📺 Diagnosis Score Widget: 통합 실현 가능성 검증 체크리스트 v1.0
## 📄 목적 및 범위
본 문서는 'AI 보컬 진단 시스템'의 핵심 컴포넌트인 `DiagnosisScoreWidget`이 기술적 백엔드 상태 변화($W_n$)와 Designer가 정의한 시각적 요구사항(Master Visual Guidebook)을 완벽하게 동기화하여, 최종 영상 콘텐츠로 구현될 수 있는지 단계별로 검증하는 체크리스트입니다.

---
## 📍 핵심 로직 이해 (기술 스펙 요약)
*   **백엔드 입력:** 사용자 세션 데이터 (Pitch Stability, Frequency Range 등) $\rightarrow$ Diagnosis Score($S_{raw}$)
*   **핵심 계산식 ($W_n$):** $W_n = f(S_{raw}, \text{User Role}) \rightarrow \text{Phase/Score}$
*   **출력 데이터:** `DiagnosisResult` (JSON 스키마 준수)

## 🧪 단계별 통합 검증 매트릭스 (Process & Tech-Visual Mapping)
| Step ID | 기술적 상태 변화 (Tech Trigger) | 시스템 로직 ($W_n$ 결과) | 시각적 요구사항 (Visual Spec) | 애니메이션/연출 지침 (Direction Cue) | 구현 난이도 (T/D/E) | 검증 여부 (Y/N) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **[A]** | 진단 시작 / 데이터 로딩 | N/A (대기 상태) | [Master Visual Guidebook 참조] - 미니멀한 배경, 로딩 스피너. | *연출:* 긴장감을 조성하는 느린 줌 인(Zoom-in). <br>*사운드:* 낮은 주파수의 잔잔한 음향 효과. | T/D/E (Low) | [체크 필요] |
| **[B]** | 초기 데이터 입력 완료 | $W_n$ 계산 시작 전 (Input Phase) | 1차 지표(Raw Data) 표시. 그래프 형태의 실시간 변화 시각화 (Line Graph). | *연출:* 빠르게 데이터가 쌓이는 듯한 애니메이션. <br>*사운드:* 박동감 있는 비트 추가. | T/D/E (Medium) | [체크 필요] |
| **[C]** | Phase 진단 결정 및 점수 산출 | $W_n$ 결과에 따른 4가지 Phase 확정 (Crisis, Warning 등). | **Diagnosis Score Widget 활성화.** 단계별 색상 변화(Primary Color, Secondary Color)가 즉시 적용. | *연출:* 가장 중요한 전환점. 충격적인 시각 효과 (Jolt Effect). <br>*사운드:* 긴장감이 최고조에 달하는 사운드 큐 사용. | T/D/E (High) | [체크 필요] |
| **[D]** | 결과 해석 및 피드백 제공 | `Diagnosis_Results` 테이블 저장 완료, KPI(Growth 등) 계산 로직 실행. | Growth Curve 시각화. 개선점(`Gap Score Depth`)을 텍스트/차트로 명확히 제시. | *연출:* 논리적 설명 모드로 전환 (Calm tone). 데이터가 차분하게 '펼쳐지는' 효과. <br>*사운드:* 해결책 제시와 함께 사운드가 안정화됨. | T/D/E (Medium) | [체크 필요] |
| **[E]** | 최종 CTA 및 다음 행동 유도 | N/A (End State). | 명확한 Call-to-Action (CTA) 영역 표시. (예: '다음 단계 진입', '강의 구매') | *연출:* 미래지향적이고 희망적인 톤으로 전환. 화면 전체가 밝아지는 효과. <br>*사운드:* 웅장하고 긍정적인 사운드 아웃트로. | T/D/E (Low) | [체크 필요] |

---
## ✅ 검증 체크리스트 항목별 확인 사항
1. **[Tech Flow Check]:** 모든 상태 변화(A $\to$ B $\to$ C $\to$ D $\to$ E)가 기술적으로 API 호출 및 DB 트랜잭션을 거쳐 발생할 수 있는가? (Yes/No: ?)
2. **[Visual Consistency Check]:** 각 단계에서 요구되는 시각적 요소와 색상 팔레트가 Master Visual Guidebook의 톤앤매너를 위반하지 않는가? (Yes/No: ?)
3. **[Timing & Pacing Check]:** 기술 변화에 따른 애니메이션 타이밍이 내러티브 흐름(Story Arc)과 일치하는가? (Yes/No: ?)