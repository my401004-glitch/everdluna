# 🎵 AI 음악 합성 파이프라인 통합 테스트 계획 (Integration Test Plan)

**목표:** 진단 데이터(KPI, 스크립트 콘텍스트)를 입력받아 일관성 있고 품질 높은 오디오 파일을 안정적으로 생성하는지 검증한다.

## 1. 전제 조건 및 아키텍처
*   **API 엔드포인트:** `POST /api/v1/ai-music/synthesize`
*   **입력 데이터 스키마:** `MusicSynthesisRequestPayload` (참조: src/api/ai-music/musicSynthesisApiContract.ts)
*   **핵심 원칙:** 요청의 모든 필드는 필수적이며, 특히 `primaryKpiFocus`와 `contextSummaryKeywords`는 음악의 감성(Mood)을 결정하는 핵심 요소이다.

## 2. 테스트 케이스 정의 (Test Cases)

| ID | Test Case 명 | 입력 데이터 변경점 | 기대 결과 (Expected Result) | 검증 항목 및 실패 시나리오 |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **(성공 경로)** 표준 성공 케이스 | `Growth`, "좌절 $\rightarrow$ 성장" | Status: SUCCESS, 유효한 URL 반환. 오디오 파일이 Uplifting 분위기여야 함. | 1. HTTP 200 OK 확인. 2. `audioUrl` 존재 여부 및 MP3 형식 확인. 3. 메타데이터(`moodTags`)가 입력 키워드와 일치하는지 검증. |
| **TC-02** | **(경계값)** 최소 길이 요청 | `min`: 5초, `max`: 10초 (짧은 영상) | Status: SUCCESS. 오디오 길이가 짧고 긴장감 위주의 사운드여야 함. | 음악의 분위기 변화가 급격하지 않고 일관성을 유지하는지 확인. |
| **TC-03** | **(실패 경로 1)** 필수 키워드 누락 | `contextSummaryKeywords`: [] (빈 배열) | Status: ERROR, 적절한 에러 메시지 반환. | 400 Bad Request 응답 코드와 "Context keywords are required" 등의 명확한 오류 코드를 확인. |
| **TC-04** | **(실패 경로 2)** 비정상 KPI 입력 | `primaryKpiFocus`: 'InvalidType' (존재하지 않는 값) | Status: ERROR, 유효성 검증 실패 메시지 반환. | 백엔드에서 강제 Enum 체크를 수행하는지 확인. |
| **TC-05** | **(시스템 부하)** 장시간 합성 요청 | `requiredDurationSeconds`: {min: 120, max: 180} (3분) | Status: PROCESSING_PENDING, 추정 완료 시간 반환. | 비동기 처리 로직이 정상 작동하며, Polling Endpoint가 유효한지 확인 필요. |

## 3. 테스트 실행 계획
1.  **단위 테스트 (Unit Test):** API 스키마 검증 (`MusicSynthesisRequestPayload`의 모든 필드 타입 체크).
2.  **통합 테스트 (Integration Test):** 위 TC-01, TC-02, TC-05와 같은 실제 데이터 흐름을 시뮬레이션하여 End-to-End로 테스트합니다.