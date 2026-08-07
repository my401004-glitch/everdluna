# 🚀 시스템 아키텍처 및 데이터 플로우 다이어그램 (V1.0)
## 🎯 목표: 데이터 입력 $\rightarrow$ 진단 결과 도출 $\rightarrow$ 사용자 피드백 경험 완성

### 🌐 A. 전체 시스템 개요 (The Big Picture Flow)
*   **진입점:** 사용자의 활동 로그/데이터 입력 (Raw Data Input)
*   **처리 과정:** 백엔드 API 호출 및 데이터 검증 $\rightarrow$ 핵심 진단 로직 실행
*   **출력점:** 최종 결과값(Diagnosis Score)을 기반으로 한 시각화된 사용자 경험 제공

### 🧱 B. 프로세스 단계별 플로우 (Process Flow Diagram)

| # | 단계명 | 주체 | 입력 데이터 | 처리 로직 및 API 호출 | 출력 데이터/결과물 |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **데이터 수집 & 전송 (Input)** | 사용자 $\rightarrow$ 프론트엔드 | 활동 로그, 설문 응답 등 원시 데이터 ($\text{Raw Data}$) | - | API 요청 Payload (JSON) |
| **2** | **API 호출 및 유효성 검사 (Validation)** | 시스템 백엔드 | Raw Data | `POST /api/v1/validate_diagnosis` 호출. 코다리(ValidatorService)가 정의한 체크포인트 강제 적용. | 🟢 **Valid Diagnosis:** 진단 점수 Contract v1.0<br>🔴 **Invalid Diagnosis:** 오류 메시지 및 문제 영역 지정 |
| **3** | **진단 결과 산출 (Core Logic)** | 시스템 백엔드 | Valid Diagnosis (DiagnosisScore) | `growth`, `engagement`, `monetization` 3가지 KPI 기반 점수 계산. 목표 대비 Gap Score 도출. | $\text{Contract v1.0}$에 정의된 구조의 최종 진단 데이터 |
| **4** | **프론트엔드 시각화 (Visualization)** | 프론트엔드 / UI 컴포넌트 | DiagnosisScore, Context Data | 🔹 **Pain/Gain Framing 적용:** 핵심 메시지(`[근거: sessions/2026-05-19T04:14/designer.md]`)를 활용하여 시각화 구조 설계. <br>🔸 `Diagnostic_Feedback_Panel` 컴포넌트 호출. | 사용자가 인지하는 최종 '피드백 패널' 및 개선 액션 플랜 (CTA) |

### ✨ C. UX/UI 목업 최종 가이드라인 통합
이전의 Component Spec Sheet과 Feedback Panel을 이 시스템 흐름에 맞게 재배치하고, 모든 요소가 **Pain $\rightarrow$ Gain** 프레임워크를 따르도록 구조화합니다.

1.  **상단 섹션 (The Hook & Diagnosis):**
    *   [Headline] Montserrat Bold 사용. Pain(위험)을 가장 먼저 제시하며 시선을 사로잡습니다.
    *   [핵심 지표] Gap Score를 Accent Yellow(`#FFD700`)로 강조하여 위험도를 즉각적으로 인지시킵니다. (예: "⚠️ 당신의 현재 학습 경로, 3개월 후 성과에 빨간불입니다.")

2.  **중단 섹션 (The Diagnosis Breakdown):**
    *   Contract v1.0 구조(`growth`, `engagement`, `monetization`)를 명확한 카드 UI로 분리하여 보여줍니다.
    *   각 KPI 점수 아래에는 **'문제점(Pain)' 설명 (Noto Sans KR)**과 함께, 해당 문제점이 발생한 원인 데이터를 근거로 제시해야 합니다.

3.  **하단 섹션 (The Solution & CTA):**
    *   **Gain 프레임워크:** 이 시스템을 사용함으로써 얻을 수 있는 '미래의 긍정적 결과(ROI)'를 Dark Blue 배경에 배치하여 신뢰감을 높입니다.
    *   **Call to Action (CTA):** 반드시 Accent Yellow(`#FFD700`)로 강조하며, 다음 단계 행동을 유도합니다.

---