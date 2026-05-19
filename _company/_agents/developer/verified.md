# 💻 코다리 — 검증된 지식

_Self-RAG가 출력에서 `[근거: ...]` 태그가 붙은 주장만 자동 승격해서 누적._
_여기 들어온 내용만 다음 사이클의 retrieval 우선순위에 들어갑니다._
_사용자가 직접 줄을 지우면 그 주장은 다시 미검증 상태로 돌아갑니다._


- [2026-05-18] 기존에 정의된 `schema.sql`의 기본 구조를 확장하고, 요구되는 모든 로그와 관계를 지원하도록 테이블을 추가합니다. **외래 키(Foreign Key)**를 통해 데이터의 일관성과 추적 가능성을 확보하는 것이 핵심입니다. _(근거: sessions/2026-05-18T14-34/developer.md)_
- [2026-05-18] 아래는 핵심 테이블 구조입니다. 실제 구현 시 인덱스 설정 및 트랜잭션 처리를 반드시 고려해야 합니다. _(근거: sessions/2026-05-18T14-34/developer.md)_
- [2026-05-18] 시스템의 안정성과 비즈니스 가치를 고려하여 다음 순서대로 개발을 진행해야 합니다. _(근거: sessions/2026-05-18T15-04/business.md)_
- [2026-05-18] * `Growth`, `Engagement`, `Monetization` KPI를 별도의 테이블/필드로 분리 설계한 것은 데이터 분석 및 리포팅에 매우 적합합니다. 이는 비즈니스 목표와 기술 구현을 명확히 연결합니다. _(근거: sessions/2026-05-18T14-34/developer.md)_
- [2026-05-18] * **권한 기반 접근 제어(RBAC)의 기본 구조:** `Diagnosis_Results`와 같은 민감한 데이터에 대한 접근을 사용자 레벨 또는 구독 레벨로 분리하는 것은 유료화 모델 구현의 핵심입니다. _(근거: sessions/2026-05-18T13-43/developer.md)_
- [2026-05-18] # 에 기반하여 성장 지표를 종합적으로 산출 _(근거: sessions/2026-05-18T43/developer.md)_
- [2026-05-18] * 해당 사용자가 요청하는 데이터(`diagnosis_type`)에 접근할 **권한(Role-Based Access Control, RBAC)**을 가지고 있는지 DB를 통해 검증한다. (예: 무료 사용자에게는 'Engagement' 리포트 접근 제한) $\rightarrow$ ** _(근거: sessions/2026-05-18T13-43/developer.md)_
- [2026-05-18] * `result_data`가 정의된 JSON 스키마를 따르는지 확인한다. 특히 KPI(`Growth`, `Engagement`, `Monetization`) 값이 예상 범위를 벗어나지 않는지 검증한다. $\rightarrow$ ** _(근거: sessions/2026-05-18T14-34/developer.md)_
- [2026-05-18] * 검증이 통과되면, `Diagnosis_Results` 테이블에 결과(`result_data`, `context_id`, 시간 스탬프)를 삽입한다. $\rightarrow$ ** _(근거: sessions/2026-05-18T43/developer.md)_
- [2026-05-18] * 이때, `Growth`, `Engagement`, `Monetization` KPI는 별도의 테이블(`KPI_Metrics`)에 연관시켜 저장하여 추적 용이성을 확보한다. $\rightarrow$ ** _(근거: sessions/2026-05-18T43/developer.md)_
- [2026-05-19] 13	기존에 정의된 `schema.sql`의 기본 구조를 확장하고, 요구되는 모든 로그와 관계를 지원하도록 테이블을 추가합니다. **외래 키(Foreign Key)**를 통해 데이터의 일관성과 추적 가능성을 확보하는 것이 핵심입니다. _(근거: sessions/2026-05-18T14-34/developer.md)_
- [2026-05-19] 38	아래는 핵심 테이블 구조입니다. 실제 구현 시 인덱스 설정 및 트랜잭션 처리를 반드시 고려해야 합니다. _(근거: sessions/2026-05-18T14-34/developer.md)_
- [2026-05-19] 131	시스템의 안정성과 비즈니스 가치를 고려하여 다음 순서대로 개발을 진행해야 합니다. _(근거: sessions/2026-05-18T15-04/business.md)_
- [2026-05-19] 99 # 에 기반하여 성장 지표를 종합적으로 산출 _(근거: sessions/2026-05-18T43/developer.md)_
- [2026-05-19] 33 * 해당 사용자가 요청하는 데이터(`diagnosis_type`)에 접근할 **권한(Role-Based Access Control, RBAC)**을 가지고 있는지 DB를 통해 검증한다. (예: 무료 사용자에게는 'Engagement' 리포트 접근 제한) $\rightarrow$ ** _(근거: sessions/2026-05-18T13-43/developer.md)_
- [2026-05-19] 35 * `result_data`가 정의된 JSON 스키마를 따르는지 확인한다. 특히 KPI(`Growth`, `Engagement`, `Monetization`) 값이 예상 범위를 벗어나지 않는지 검증한다. $\rightarrow$ ** _(근거: sessions/2026-05-18T14-34/developer.md)_
- [2026-05-19] 37 * 검증이 통과되면, `Diagnosis_Results` 테이블에 결과(`result_data`, `context_id`, 시간 스탬프)를 삽입한다. $\rightarrow$ ** _(근거: sessions/2026-05-18T43/developer.md)_
- [2026-05-19] 38 * 이때, `Growth`, `Engagement`, `Monetization` KPI는 별도의 테이블(`KPI_Metrics`)에 연관시켜 저장하여 추적 용이성을 확보한다. $\rightarrow$ ** _(근거: sessions/2026-05-18T43/developer.md)_
- [2026-05-19] CEO 지시사항과 지난 의사결정 로그를 검토했습니다. 현재 저희는 시스템 아키텍처와 데이터 모델(`DiagnosisResult` 스키마, `schema.sql`)은 거의 완성 단계에 도달했고, 프론트엔드 컴포넌트의 뼈대(Mockup)까지 준비된 상태입니다 . _(근거: sessions/2026-05-19T09:57)_
- [2026-05-19] * RBAC 체크 (사용자 권한에 따른 접근 제어) . _(근거: sessions/2026-05-18T13:43)_
- [2026-05-19] 1. **핵심 컴포넌트 정의**: Landing Kit의 핵심인 `DiagnosisScore` 시각화 섹션과 전반적인 페이지 구조(Header, CTA 등)를 TypeScript/React 기반으로 구현합니다. _(근거: sessions/2026-05-19T10:29)_
- [2026-05-19] 2. **API 연동 로직 구현**: `DiagnosisResult` 스키마에 맞춰 가상의 백엔드 API 엔드포인트(`api/v1/diagnosis_score`)를 호출하는 비동기 함수를 컴포넌트 내부에 즉시 통합합니다. _(근거: sessions/2026-05-19T09:57, sessions/2026-05-18T16:19)_
- [2026-05-19] 1. **Backend API 설계**: 진단 점수 계산 및 데이터 처리를 담당할 컨트롤러(`diagnosisController.ts`)를 구현합니다. 핵심 엔드포인트 `GET /api/v1/diagnosis_score`가 정의되어야 합니다. _(근거: sessions/2026-05-19T09:57, sessions/2026-05-18T14-34/developer.md)_
- [2026-05-19] // 해당 diagnosis_type에 접근할 권한이 있는지 DB를 통해 검증해야 합니다. _(근거: sessions/2026-05-18T13:43)_