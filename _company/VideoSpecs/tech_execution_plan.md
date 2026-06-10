# 🎬 영상 제작 통합 기술 실행 계획 및 API 연동 테스트 항목

## 🎯 목표
Writer의 최종 스크립트, Designer의 시각 가이드라인(Dark Blue / Accent Yellow), 그리고 코다리가 정의한 VFX 스펙을 기반으로, 모든 콘텐츠 요소가 시스템적으로 구현될 수 있도록 **데이터 흐름(Data Flow)**과 **기술적 계약(API Contract)**을 확정합니다.

## ⚙️ 1단계: 핵심 데이터 모델 재확인 (Source of Truth)
모든 비주얼/사운드 이벤트는 다음 API 응답 스키마에 의존해야 합니다.

| 요소 | 설명 | 근거 기술 사양 | 필수 필드 |
| :--- | :--- | :--- | :--- |
| **Diagnosis Score** | 사용자 진단 결과 및 점수 (Growth/Engagement/Monetization) | `api/v1/diagnosis_score` | `{ score: number, growth: number, engagement: number, monetization: number }` |
| **Context ID** | 해당 영상이 기반하는 사용자의 세션 또는 문제 정의 ID | 시스템 전역 | String (UUID 권장) |
| **Script Event Data** | 스크립트의 시간대별 핵심 데이터 포인트 (Pain/Gain 전환 지점) | `video_vfx_specs.md` | `{ time: "00:00:15", trigger_type: "DATA_SHOCK", message: "..." }` |

## 🎨 2단계: 시각적 & 기술적 통합 매핑 (The Pipeline)
스크립트의 스토리보드(Writer/Designer 산출물)를 다음 세 가지 핵심 컴포넌트로 분해합니다.

### A. [DATA SHOCK INDEX] 구현 요구사항
*   **Trigger:** 스크립트 내에서 '객관적 데이터'가 언급되는 시점 (`Script Event Data`의 `trigger_type: DATA_SHOCK`).
*   **Visual Requirement (Designer):** Dark Blue 배경 위에 Accent Yellow로 강조되는 **시각화 차트/지표**.
*   **Technical Implementation:**
    1.  API 호출: `GET /api/v1/diagnosis_score?contextId={Context ID}`
    2.  데이터 처리: 응답값의 세 가지 KPI(Growth, Engagement, Monetization)를 추출합니다.
    3.  VFX Logic (코다리): 각 KPI별로 **'Gap Score Depth'**와 비교하여 현재 점수가 얼마나 낮은지(`Low Gap`) 또는 높은지(`High Potential`)에 따라 차트의 색상과 애니메이션(Accent Yellow → Blue/Red Gradient)이 변하도록 State Machine을 설계해야 합니다.

### B. [THE HOOK] 구현 요구사항
*   **Trigger:** 영상 초반 5초 이내, 가장 강렬한 메시지 전달 시점 (Writer 산출물 참조).
*   **Visual Requirement (Designer):** 최대 대비를 활용하는 타이포그래피와 짧은 사운드 스파이크.
*   **Technical Implementation:** API 호출 없이 **하드코딩된 템플릿 로직**을 사용합니다. 단, 이 후크가 성공적으로 재생되었다는 기록(`Hook_Played: True`)을 로그로 남겨야 합니다.

### C. [FALLBACK LOGIC] (가장 중요)
*   만약 `api/v1/diagnosis_score` 호출이 실패하거나 (예: 네트워크 오류, DB 연결 끊김), 필요한 Context ID를 찾지 못할 경우, 영상은 **'오류 화면(Fallback Screen)'**을 보여주며 강제 종료되어서는 안 됩니다.
*   대신, 미리 녹화된 고품질의 '시스템 점검 중입니다. 곧 더 정확한 데이터가 제공됩니다.'라는 템플릿 클립과 함께 **최소한의 일반 정보성 콘텐츠(Generic CTA)**를 재생하도록 로직을 구현해야 합니다.

## 🧪 3단계: 필수 API 연동 테스트 항목 (Test Cases)
이것은 개발팀에 전달할 가장 구체적인 명세입니다. 모든 기능 구현 전에 반드시 이 테스트 케이스가 통과되어야 합니다.

| ID | 테스트 시나리오 | 예상 액션 (Input) | 기대 결과 (Output/Assertion) | 실패 시 대응 (Fallback Check) |
| :--- | :--- | :--- | :--- | :--- |
| **T-01** | **성공적인 진단 데이터 로드** | 유효한 `Context ID`와 사용자 레벨(Premium)을 API에 전송. | 📈 모든 KPI가 성공적으로 반환되며, VFX 스펙(`video_vfx_specs.md`)에 정의된 'High Potential' 애니메이션이 정상 작동함. | (N/A) - Primary Path |
| **T-02** | **권한 기반 접근 제한 테스트** | 유효하지만 무료 사용자 레벨을 가진 `Context ID`를 전송. | 🚫 API가 `Growth` 또는 `Monetization` 필드를 누락시키거나, '접근 권한 부족' 에러 코드를 반환해야 함. (RBAC 구현 검증) | Fallback Screen으로 전환하며 "Premium 기능은 구독이 필요합니다." 메시지 출력. |
| **T-03** | **네트워크 실패 테스트** | API 호출 시 네트워크 연결을 강제로 끊거나 500 Internal Server Error를 발생시킴. | 🛡️ 클라이언트 측에서 비동기 오류 핸들러가 정상 작동하여, '시스템 점검 중' Fallback 화면을 재생하고 CTA 애니메이션이 최소한으로 동작함. | **최우선 검증 항목.** 무조건 Fallback Screen으로 전환되어야 함. |
| **T-04** | **데이터 타입 불일치 테스트** | API가 `score` 필드를 문자열(`"abc"`)로 반환하는 등 데이터 스키마를 위반한 경우. | 🚨 클라이언트 측에서 강제 캐스팅 또는 로깅을 통해 경고를 출력하고, 기본값(Default Value)으로 시각화 컴포넌트가 동작해야 함. (크래시 방지) | Fallback Screen 대신 "데이터 포맷 오류" 메시지를 보여주고 수동 디버깅 코드를 실행할 위치를 표시함. |