# 🌐 UX/UI 마스터 플로우 명세 (Master Flow Specification) v1.0 - Diagnosis Journey

**작성 목적:** 코다리가 구현할 기술적 API(`diagnosisService`)의 모든 상호작용 시점(Loading, Success, Error)에 대한 표준화된 UI/UX 흐름과 애니메이션 규칙을 정의하여, 개발자와 디자이너 간의 '사용 경험 계약'을 확립합니다.

---

## 🎯 A. 핵심 사용자 여정 (The Journey Flow)

**전체 시퀀스:** 진단 시작(Pain Point 제시) $\rightarrow$ 데이터 로딩/처리 과정 $\rightarrow$ 결과 확인 및 액션 제안(Gain Point).
**핵심 원칙:** 사용자는 '막연한 기다림'을 경험해서는 안 됩니다. 모든 대기 시간은 **정보 제공 (Information Delivery)** 또는 **공감 유도 (Empathy Building)**로 채워져야 합니다.

## ⚙️ B. API 상태별 UX/UI 정의 및 애니메이션 규칙

### 1. 로딩 상태 (Loading State)
*   **발생 조건:** 사용자가 진단 버튼을 클릭한 순간부터 백엔드 API 호출(코다리 영역)이 시작되어 결과 데이터(`DiagnosisResu`)가 도착하기 전까지의 시간 (예상 최대 2~3초).
*   **시각적 규칙:**
    *   **배경:** Neutral Grey (`#F5F5F5`)를 유지하되, 배경에 미세한 그리드 패턴(Grid Pattern)을 오버레이하여 전문적인 느낌을 부여합니다.
    *   **애니메이션:** 단순 스피너 사용 금지. 핵심 메시지를 반복적으로 노출하는 **'진행형 질문/재확인 애니메이션'**을 사용합니다. (예: "당신의 잠재력은 측정되고 있습니다...", "가장 중요한 데이터 포인트를 분석 중...")
    *   **CTA:** 진단 버튼이 비활성화되며, 로딩 상태를 나타내는 문구가 중앙에 배치되어야 합니다.

### 2. 성공/결과 표시 상태 (Success State - DiagnosisResu)
*   **발생 조건:** API 호출이 성공적으로 완료되고 `DiagnosisResu` 데이터 구조가 완전히 파싱되었을 때.
*   **시각적 규칙:**
    *   **톤앤매너:** '좌절 $\rightarrow$ 승리'의 변곡점(Turning Point)을 극대화합니다. 결과 페이지 전체에 Dark Blue (`#0A2463`)를 배경으로 사용하여 전문성과 신뢰감을 부여하고, 주요 성과 수치만 Accent Yellow (`#FFD700`)로 강조해야 합니다.
    *   **데이터 흐름:** **Step-by-step 애니메이션 (Reveal Animation)**을 사용합니다. 진단 점수 $\rightarrow$ 문제점(Pain) 리스트 $\rightarrow$ 해결책(Gain) 제안 순으로 데이터가 시간차를 두고 차례대로 나타나야 합니다.
    *   **KPI 시각화:** 핵심 KPI (`Growth`, `Engagement`, `Monetization`)는 단순히 숫자로 나열하지 않고, **'미터기 게이지 (Gauge Meter)'** 또는 **'성장 그래프 (Progress Graph)'** 형태로 시각화하여 즉각적인 성공감을 제공합니다.

### 3. 오류 상태 (Error State)
*   **발생 조건:** API 호출이 실패하거나(예: Network Error), 필수 입력 데이터가 누락되었을 때.
*   **시각적 규칙:**
    *   **톤앤매너:** 불안함을 최소화하고, 시스템의 안정성을 유지하는 방향으로 안내합니다. (빨간색 경고는 최후의 수단).
    *   **UI 컴포넌트:** 오류 메시지는 **Card Component** 형태로 분리되어야 합니다. 이 카드에는 1) 오류 코드/종류 (예: `ERR_NETWORK`), 2) 사용자 친화적 설명, 3) 해결 방법 또는 재시도 버튼이 포함되어야 합니다.
    *   **애니메이션:** 강렬한 경고음이나 애니메이션은 지양합니다. 대신, 부드러운 페이드-인(Fade-in) 효과로 안내 메시지를 전달하며, 사용자에게 **'다음 액션 (Try Again)'**을 유도하는 데 집중해야 합니다.

---
## 📄 C. 에이전트 간 협업 요청 사항 (Action Items for Codari & Writer)

1.  **[💻 코다리]:** 위의 각 상태(Loading, Error)에 대응할 수 있는 **API Mockup 응답값 또는 예외 코드 목록**을 `diagnosisService.ts` 파일의 타입 정의와 주석으로 반드시 추가해 주세요. (예: `if (error_code === 'ERR_TIMEOUT') { throw new ApiError('...', error_code); }`)
2.  **[✍️ Writer]:** 각 상태별로 사용자가 읽게 될 **'UX 카피라이팅'**을 제공해주세요. (특히 Loading State의 3~4가지 버전 문구, Error State의 안내 문구).

---