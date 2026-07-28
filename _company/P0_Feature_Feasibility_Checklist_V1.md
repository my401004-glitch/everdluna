# 🔬 핵심 P0 기능 실현 가능성 및 UX 검토 체크리스트 (Ver 1.0)

**작성 목적:** QA 실패 로그 기반의 기술적 결함(Technical Defects)을 비즈니스 가치와 연결하고, 확정된 디자인 시스템 V2.0의 구현 적합성을 확인하여 최종 로드맵에 반영하기 위함.
**참조 문서:**
1.  [Design System]: sessions/2026-07-28T05:02/designer.md (최종 스타일 가이드)
2.  [Business Logic]: P0_Business_Req_Spec.md (Hyunbin이 작성할 파일)
3.  [Technical Specs]: qa_automation_runner 실행 로그 기반의 상세 Defect Log (Kodari가 작성할 파일)

---

## I. 검토 대상 핵심 사용자 플로우 정의 (User Flow Map)
*   **주요 시나리오:** 사용자가 '자신의 현재 상태(Pain)'를 진단하고, 시스템을 통해 해결책('Gain')을 얻어 유료 상품으로 전환하는 과정.
*   **플로우 1: [진단 및 위험 감지] - Gap Score 산출 단계**
    *   **Goal:** 사용자가 스스로 '위험(Risk)'을 인지하게 만든다. (Pain $\rightarrow$ Blue/Yellow)
    *   **트리거:** 초기 진입 페이지 또는 테스트 실행 버튼 클릭.
    *   **기대되는 UX 컴포넌트:** 실시간 점수 카운터, 위험 영역 하이라이팅(Accent Yellow), 전문 용어 해설 툴팁.

*   **플로우 2: [솔루션 제시 및 확신] - 리포트 페이지 도달 단계**
    *   **Goal:** 진단된 문제에 대한 명확한 해결책과 신뢰도를 제공한다. (Gain $\rightarrow$ Dark Blue)
    *   **트리거:** Gap Score 산출 후, 상세 분석 보고서 로딩.
    *   **기대되는 UX 컴포넌트:** 데이터 시각화 차트(Dark Blue 배경), 전문적인 근거 자료 제시 섹션, 명확한 다음 단계 안내.

*   **플로우 3: [전환 및 실행] - CTA (Call to Action) 영역 도달 단계**
    *   **Goal:** 사용자가 망설임 없이 결제/상담 요청 버튼을 누르게 한다.
    *   **트리거:** 모든 정보 검토 후, 최종 액션 유도 섹션 진입.
    *   **기대되는 UX 컴포넌트:** 대비가 강한 CTA 버튼 (Accent Yellow), 간결하고 직관적인 혜택 요약(Benefit Summary).

---

## II. 기능별 실현 가능성 및 디자인 체크리스트 (Feasibility & Design Check)

| P0 기능/요소 | 비즈니스 요구사항 (Why?) [Hyunbin] | 기술적 제약 (What?) [Kodari] | 디자인 적합성 (How?) [Designer] | 검토 결과 (Pass/Fail) | Action Item |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gap Score 계산** | Gap Score가 낮은 사용자에게 '위험' 경고 표시 필수. (매출 직결) | `DiagnosisScore` API의 데이터 타입/스키마 오류 수정 필요. (UnboundLocalError 관련) | Accent Yellow를 사용한 시각적 경고 처리(Highlight). Montserrat Bold 헤드라인 적용. | [ ] 대기 | 기술 스펙 기반, 위젯 컴포넌트 재설계 및 테스트 필요. |
| **진단 결과 차트** | 핵심 지표 3가지 변화 추이 명확히 제시해야 함. (신뢰도 확보) | 데이터 로딩 시 API 호출 제한/타임아웃 처리 로직 추가 필수. | Dark Blue 배경의 라인 차트(Line Chart). Noto Sans KR로 구체적 설명 제공. | [ ] 대기 | **기술 안정화 후, 데이터 바인딩 테스트가 우선.** |
| **최종 CTA 버튼** | 명확한 '다음 단계' 제시 (예: 1:1 컨설팅 예약) | 사용자 인증(Auth) 모듈과 연동되는 최종 API 호출 필요. | Accent Yellow 배경의 대형 버튼 컴포넌트. 실패 시 에러 메시지 처리 필수. | [ ] 대기 | **UX/UI Pass.** 단, 백엔드 `auth_api` 안정화가 선행되어야 함. |
| **사용자 인터페이스 전반** | 모든 정보는 '좌절 $\rightarrow$ 승리'의 논리를 따라야 한다. (브랜드 톤) | - | Dark Blue(신뢰)와 Accent Yellow(기회/위험) 대비 구조 유지. | [ ] 대기 | 현재 V2.0 시스템으로 전반적 통일성 확보 가능. |

---