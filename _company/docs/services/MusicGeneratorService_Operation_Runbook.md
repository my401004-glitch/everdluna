# 🎵 MusicGeneratorService 운영 Runbook (V1.0)

## 🎯 목적
본 문서는 MusicGeneratorService의 배포, 초기화, 그리고 서비스 중 예기치 않은 장애 발생 시 담당자가 취해야 할 표준 절차(SOP)를 정의하여 시스템의 기술적 안정성을 확보하는 것을 목표로 합니다.

## 🛠️ 아키텍처 개요
- **입력:** Diagnosis_Results (JSON Schema 기반). 반드시 `context_id`와 진단 점수(`score`)가 포함되어야 함.
- **핵심 로직:** 진단 데이터 $\rightarrow$ 음악 스타일/분위기 매핑 $\rightarrow$ 외부 AI 합성 API 호출 $\rightarrow$ 사운드 에셋 ID 반환.
- **기술 스택:** TypeScript, FastAPI (가정), AWS S3 연동.

## 🚀 배포 및 초기화 체크리스트 (Go-Live 전 최종 점검)
1. [ ] **환경 변수 검증**: `MUSIC_API_KEY`, `DIAGNOSIS_SCHEMA_VERSION` 등이 환경에 정확히 설정되었는가?
2. [ ] **DB 스키마 연동 확인**: 서비스가 참조하는 최소 필수 테이블(`Diagnosis_Results`)의 존재 및 접근 권한을 확인했는가?
3. [ ] **모니터링 설정**: API 응답 지연(Latency)에 대한 경고 임계치(Threshold)를 설정하고, 5xx 에러 발생 시 알림 시스템이 활성화되었는가?

## 🚨 장애 대응 절차 (Troubleshooting Guide)
| 오류 코드/상황 | 원인 추정 | 조치 방법 | 담당자 |
| :--- | :--- | :--- | :--- |
| **503 Service Unavailable** | 외부 AI 합성 API 호출 실패 또는 과부하. | 1. 캐시된 에셋을 우선 사용하고, 2. 재시도 로직(Retry Logic)에 따라 최대 3회까지 지연 재호출 시도. | 백엔드 개발팀 (Codari) |
| **400 Bad Request** | 입력 데이터 스키마 불일치 (예: `context_id` 누락). | 클라이언트 측 호출 로직을 수정하여 필수 필드를 체크하게 하고, 에러 메시지를 상세화한다. | 백엔드/프론트팀 협의 |
| **Timeout (5초 초과)** | 외부 API 응답 지연. | 서비스 레이어에서 타임아웃 제한(Timeout)을 명확히 설정하고, 사용자에게 '잠시 후 다시 시도해주세요' 안내를 한다. | 백엔드 개발팀 (Codari) |

## 🐛 단위 테스트 및 통합 테스트 결과
*   **최종 검증 상태:** [테스트 통과 확인 완료]
*   **주요 발견 사항:** 예외 경로 처리 로직을 강화하여, 필수 입력 데이터가 누락될 경우 서비스 전체가 다운되지 않도록 분리했습니다. (Graceful Degradation 확보)