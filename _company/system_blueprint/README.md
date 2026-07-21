# 아지트아트컴페니: 콘텐츠 제작 시스템 청사진 (V1.0)

## 🎯 목표
본 문서는 실용음악 AI 활용 교육 프로그램의 모든 콘텐츠가 일관된 품질과 기술적 안정성을 유지하며 생산되도록 하는 **최종 표준 작업 매뉴얼**이자, 향후 개발에 필요한 아키텍처 설계도입니다.

## 🏗️ 시스템 구성 요소 (Core Components)
1.  **데이터 레이어:** `Diagnosis_Results` 테이블을 중심으로 모든 KPI(Growth, Engagement, Monetization)가 기록됩니다. 데이터 무결성을 위해 RBAC 검증이 필수입니다. [근거: sessions/2026-05-18T13:43]
2.  **API 레이어:** 콘텐츠의 핵심 로직을 담당하는 `diagnosisController.ts` (GET /api/v1/diagnosis_score)가 존재합니다. 모든 데이터 요청은 이 게이트웨이를 거쳐야 합니다. [근거: sessions/2026-05-19T09:57]
3.  **프론트엔드 컴포넌트:** `DiagnosisScoreComponent`는 핵심 시각화 요소입니다. 모든 콘텐츠는 이 컴포넌트의 디자인 가이드라인을 따릅니다. [근거: sessions/2026-05-19T10:29]

## 🔄 워크플로우 (Content Production Flow)
| 단계 | 담당 에이전트 | 입력 자산 (Input) | 주요 산출물 (Output) | 필수 검증 지점 |
| :--- | :--- | :--- | :--- | :--- |
| **1. 기획/스크립팅** | Writer | 회사 목표, 트렌드 분석, KPI 가설 | 최적화된 스크립트 + CTA 초안 | *논리적 흐름 검증* |
| **2. 비주얼 자산 구축** | Designer | 색상 팔레트, 핵심 애니메이션 소스 | 고해상도 시각 클립 라이브러리 (Master Assets) | `Gap Score` 변화 트래킹 에셋 통합 확인 |
| **3. 오디오/편집 마스터링** | Luna/Editor | 스크립트, 비주얼 자산, BGM 아크 | 최종 렌더링 Master Video 파일 | **KPI Validator Pass:** 모든 감정적 전환 지점의 사운드-비주얼 동기화 체크 (기술 안정성) [근거: sessions/2026-07-21T08:21] |
| **4. 배포 및 측정** | Leo | Master Video, 최종 캡션 | 실제 플랫폼 업로드 콘텐츠 + 초기 성과 지표 데이터 | `my_videos_check` 도구 실행 필수 (데이터 확보) [근거: sessions/2026-07-20T8:21] |

## ✅ 다음 콘텐츠 제작 체크리스트
*   [ ] 모든 KPI는 DB에 저장 가능한 구조인가? (`KPI_Metrics`)
*   [ ] API 게이트웨이(`diagnosisController.ts`)를 통해 데이터 요청 및 검증 로직을 거치는가? (RBAC 포함)
*   [ ] 최종 영상물은 `editing_guide.md`의 트랜지션 타이밍에 따라 오디오-비주얼 싱크가 완벽한가?

---