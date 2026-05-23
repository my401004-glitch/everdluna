# 🛠️ Data Extraction & Validation 연동 테스트 최종 실행 계획 (V2.0)
## 목표 및 배경 [근거: CEO 지시]
본 문서는 `DiagnosisScore` 산출을 위한 데이터 파이프라인의 안정성을 검증하는 것을 목적으로 한다. 특히, 외부에서 들어오는 원천 데이터가 `DataExtractorService`를 거쳐 `Validation Layer`에 의해 필터링되고, 최종적으로 비즈니스 로직(KPI 계산)으로 사용될 때 발생할 수 있는 모든 예외 상황을 커버해야 한다.

## 🎯 테스트 범위 및 필수 전제 조건
1.  **입력 데이터 (Input)**: `data_req_01_v2.md`에 정의된 구조를 따르는 JSON/CSV 형식의 Raw Data.
2.  **처리 모듈**:
    *   `DataExtractorService`: 원시 데이터를 표준화된 내부 스키마로 추출 및 정제 (Normalization).
    *   `ValidationLayer`: 비즈니스 규칙(Business Rule) 기반 검증 수행 (RBAC, KPI 범위 체크 등).
3.  **핵심 지표**: Growth Score, Engagement Score, Monetization Score가 정확히 계산되는지 확인해야 한다.

## 🧪 테스트 시나리오 정의 (Critical Path & Edge Cases)

| ID | 시나리오 유형 | 입력 데이터 상태 (Input State) | 기대 결과 (Expected Output) | 검증 모듈 |
| :---: | :--- | :--- | :--- | :--- |
| **TC-001** | **Happy Path (정상)** | 모든 필수 필드가 정상 값으로 존재하며, KPI 계산 조건 충족. | `Diagnosis_Results` 테이블에 유효한 스코어 및 로그가 성공적으로 기록됨. | 전체 파이프라인 |
| **TC-002** | **Missing Data** | 필수 필드 중 일부(예: `context_id`)가 누락된 경우. | Validation Layer에서 경고(Warning)를 반환하고, 해당 데이터는 DiagnosisScore 계산에 제외되어야 함. (파이프라인은 중단하지 않음.) | ValidationLayer |
| **TC-003** | **Data Type Mismatch** | 숫자가 와야 할 필드에 문자열(`"N/A"`)이 포함된 경우. | DataExtractorService에서 해당 값을 `NULL` 또는 기본값(Default Value)으로 자동 변환 처리해야 함. (오류를 발생시키지 않음.) | DataExtractorService |
| **TC-004** | **RBAC Violation** | 현재 사용자 Role이 접근 권한을 가지지 못한 KPI(`Monetization`) 데이터가 요청된 경우. | Validation Layer에서 `PermissionDeniedError`를 반환하고, 해당 스코어는 0으로 처리되며 에러 로그를 남긴다. [근거: 코다리 검증된 지식] | ValidationLayer |
| **TC-005** | **KPI Out of Range** | KPI 값이 비즈니스적으로 불가능한 값(예: Growth Score가 -100%)인 경우. | Validation Layer에서 `InvalidDataRangeError`를 발생시키고, 시스템은 이전 유효 데이터로 폴백(Fallback) 처리하거나 해당 요청을 거부한다. [근거: 코다리 검증된 지식] | ValidationLayer |

## 💻 구현 계획 및 실행 환경
*   **언어/프레임워크**: TypeScript (Backend API), Python (Scripting Test Utility).
*   **Mocking Strategy**: 실제 DB 연결 전에, `DiagnosisService`의 핵심 함수들(예: `calculate_score()`)을 Mock하여 테스트 케이스를 격리하고 빠르게 실행한다.