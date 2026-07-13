# 🧪 API 연동 및 데이터 흐름 통합 검증 프로토콜 (V2.0)
**작성 주체:** 💻 코다리 (시니어 풀스택 엔지니어)
**버전:** 2.0
**목표:** Writer의 메시지('Gap Score' 기반 진단)와 Designer의 Mockup(결제 페이지)을 기술적으로 완벽하게 통합하기 위한 시스템 전반의 안정성 및 데이터 무결성 검증 절차를 정의합니다.

---

## 1. 아키텍처 개요 및 흐름도 (The Data Flow Contract)
*   **입력:** 사용자 진단 테스트 결과 (`user_input: {frequency, pitch_variance, etc.}`)
*   **과정 1 (Backend - API Gateway):** 입력 데이터 수신 $\rightarrow$ **[RBAC 검증]** 사용자의 권한 확인 (무료/유료) $\rightarrow$ **[데이터 파싱 및 정규화]** 데이터를 표준 스키마에 맞춤.
*   **과정 2 (Backend - Diagnosis Controller):** 진단 로직 실행 $\rightarrow$ `Growth`, `Engagement`, `Monetization` KPI 계산 $\rightarrow$ 최종 JSON 응답 생성.
*   **출력:** `{ diagnosis_score: "C-", gap_level: "High", recommendation: "..." }` 형태의 표준화된 API 응답.

---

## 2. 테스트 케이스 매트릭스 (Test Case Matrix)

### A. 데이터 무결성 및 백엔드 로직 검증
| ID | 테스트 항목 | 전제 조건/입력값 | 기대 결과 (Expected Output) | 실패 시 동작 (Fallback Plan) | 관련 비즈니스 목표 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T-D01** | 기본 Gap Score 산출 | 정상적인 진단 데이터 입력 (모든 필드 존재) | 유효한 `diagnosis_score` 및 `gap_level` 반환. | 에러 코드 422: '데이터 누락'와 함께 필수 입력 필드 리스트 제공. | 신뢰성 확보 |
| **T-D02** | 데이터 범위 이탈 처리 | Pitch Variance가 물리적으로 불가능한 값 (예: -50Hz)으로 입력됨. | 경고 메시지 반환 및 유효값으로 클리핑(Clamping). | `null` 또는 0 처리 후, 사용자에게 데이터 재입력 요청. | 시스템 안정성 |
| **T-D03** | KPI 값 추적 로직 | 진단 결과가 정상적으로 성공했을 때 (Success Path) | `KPI_Metrics` 테이블에 해당 세션의 Growth/Eng/Mon 기록이 트랜잭션으로 저장됨을 DB 검증. | 실패 시, API 응답만 반환하고 로그(Log) 시스템에 오류를 기록함. | 비즈니스 가치 추적 |

### B. 권한 기반 접근 제어 (RBAC) 및 수익화 검증
| ID | 테스트 항목 | 전제 조건/입력값 | 기대 결과 (Expected Output) | 실패 시 동작 (Fallback Plan) | 관련 비즈니스 목표 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T-R01** | 무료 사용자 진단 접근 | 인증된 'Free User'로 요청. Gap Score가 낮음(A+). | `diagnosis_score`만 제공하고, 결제 페이지의 핵심 CTA(`[구독하기]`)는 비활성화 상태/미노출 처리됨. | 에러 메시지 대신, **"유료 기능을 사용하려면 구독이 필요합니다."** 라는 명확한 문구를 화면에 표시. | 유료화 전환율 확보 |
| **T-R02** | 구독자 진단 접근 | 인증된 'Premium User'로 요청. Gap Score가 낮음(A+). | 모든 `diagnosis_score` 및 상세 리포트 데이터 제공. 결제 페이지 CTA 활성화. | 정상 동작. | 서비스 가치 증대 |

### C. 프론트엔드-백엔드 통합 시나리오 검증 (Integration Flow)
| ID | 테스트 항목 | 전제 조건/입력값 | 기대 결과 (Expected Output) | 관련 비즈니스 목표 |
| :--- | :--- | :--- | :--- | :--- |
| **T-I01** | A/B 테스트 연동 (데이터 기반 확신형) | T-D01을 통해 'Gap Score: C-'와 '주파수 편차 30% 감소'라는 데이터를 받음. | Mockup의 **[데이터 증명 섹션]**에 이 데이터가 *자동으로* 채워지고, `Before/After` 비교 UI가 정상적으로 렌더링됨. | 데이터 바인딩 오류 발생 시, 기본 Fallback 값(placeholder)을 보여주고 개발팀에게 알림 전송. | 신뢰도 극대화 |
| **T-I02** | A/B 테스트 연동 (감성적 갈망형) | T-D01을 통해 'Gap Score: C-'와 '주파수 편차 30% 감소'라는 데이터를 받음. | Mockup의 **[시스템 강조 섹션]**에 이 데이터가 *강조*되어 표시되며, 감성적인 CTA(버튼 색상/문구)와 기술적 근거가 동시에 제시됨. | (T-I01과 동일) | 공감 및 행동 유도 |

---