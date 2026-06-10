# 🎧 AI 음악 합성 파이프라인 - 통합 API 테스트 시나리오 (Episode 2용)

## 🎯 목적
AI가 분석한 진단 데이터(Gap Score, 주파수 패턴 등)를 기반으로, 교육 콘텐츠에 활용할 고품질의 배경음악 및 음원 예시 파일을 생성하는 `POST /api/v1/generate_audio` 엔드포인트의 기능적 정확성(Functional Accuracy)을 검증한다.

## ⚙️ 전제 조건
*   **엔드포인트:** `POST /api/v1/generate_audio`
*   **입력 데이터 스키마 (JSON Body):**
    ```json
    {
      "source_diagnosis": {
        "gap_score": "0.75",       // 0.0 ~ 1.0 사이의 진단 점수
        "primary_pitch_deviation_hz": 4.2, // 주 음정 편차 (Hz)
        "rhythm_complexity_index": 0.85,  // 리듬 복잡도 지표
        "target_emotion": "Determined Struggle", // 목표 감성 상태 (예: Determined Struggle, Joyful Triumph)
        "key_signature": "C Minor",    // 작곡 키 정보
        "duration_seconds": 12           // 예상 음원 길이
      }
    }
    ```

## ✅ 테스트 케이스 목록 (Test Cases)

| ID | 테스트 목적 | 입력 데이터 시나리오 | 기대 결과 (Expected Output) | 검증 항목 | 비고 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | **정상 흐름 (Baseline)**: 표준 진단 데이터를 통한 음원 생성. | `Gap Score` 중간, `Emotion`: 'Determined Struggle'를 포함하는 일반적인 데이터 셋. | - HTTP Status Code: `200 OK`<br>- Output File URL: 유효한 MP3 파일 제공<br>- 품질: 긴장감과 해결의 느낌이 적절히 혼합된 분위기. | 기능성, 음질 매핑, 응답 시간 (Latency) | Episode 2 메인 콘텐츠용 기본 테스트. |
| **TC-002** | **Edge Case (최소 진단)**: Gap Score가 매우 낮을 때(거의 완벽할 때). | `Gap Score`: "0.1" / `Emotion`: 'Effortless Flow' | - HTTP Status Code: `200 OK`<br>- 품질: 평화롭고 부드러운, 과장되지 않은 톤의 배경음악. (너무 역동적이지 않게 제어 필요) | 감성 매핑 정확도, 지나친 연출 방지 여부 | 시스템이 '최상' 상태를 오버-연출하지 않도록 경계 설정 검증. |
| **TC-003** | **Edge Case (최대 진단)**: Gap Score가 매우 높을 때(큰 결함 발견). | `Gap Score`: "0.95" / `Emotion`: 'Critical Failure' | - HTTP Status Code: `200 OK`<br>- 품질: 긴장감이 극대화되고, 해결의 여지가 보이지 않는 어둡고 불협화음이 강조된 사운드스케이프. (극도의 불안정성 표현) | 감성 매핑 정확도, 경고 신호로서의 활용 가능성 검증. |
| **TC-004** | **Input Validation (Missing Key)**: 필수 파라미터 누락 시. | `source_diagnosis` 객체에서 `gap_score` 필드만 제거한 요청. | - HTTP Status Code: `400 Bad Request`<br>- 응답 Body: "Missing required field: gap_score." 명시적 에러 메시지 반환. | 입력 유효성 검증, 에러 코드 정확도 | 가장 기본적인 방어 로직 테스트. |
| **TC-005** | **Input Validation (Type Mismatch)**: 잘못된 데이터 타입 전송 시. | `gap_score`에 문자열 "High"를 전송. | - HTTP Status Code: `422 Unprocessable Entity`<br>- 응답 Body: "Invalid data type for gap_score. Must be a float." 명시적 에러 메시지 반환. | 타입 검증, 적절한 HTTP 상태 코드 사용 여부 | 백엔드에서 런타임 오류 방어. |

---