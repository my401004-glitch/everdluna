# 🎨 Reels Dynamic Content Generation API 계약 사양서 (Version 3.0)

**[문서 목적]**
본 문서는 아지트아트컴페니의 교육 프로그램 마케팅 콘텐츠(특히 Reels 포맷) 제작에 사용될 동적 자산 생성 시스템의 **최종 기술 인터페이스 및 비즈니스 로직 계약 사양**을 정의한다. 이 문서가 모든 프론트엔드/백엔드 개발, 디자인 에셋 제작의 유일한 Source of Truth(진실의 근원지)이다.

**[적용 범위]**
- **콘텐츠 유형:** 진단 결과 기반 마케팅 콘텐츠 (Pain $\rightarrow$ Gain 프레임워크 적용)
- **핵심 기능:** 사용자 입력 데이터에 따라 시각적 변수(색상, 속도, 텍스트 변화 등)가 실시간으로 변경되는 애니메이션 자산 생성.

---

## 1. 데이터 인터페이스 사양 (Data Interface Schema)

### 1.1. 요청 바디 (Request Body - Input Parameters)
`POST /api/v1/reels/generate` 엔드포인트에 전송되어야 하는 필수 입력값들이다.

| 필드명 | 타입 (Type) | 설명 (Description) | 필수 여부 | 참고 사항 |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | `UUID` | 콘텐츠를 위한 사용자 식별자. 권한 체크의 기반이 됨. [근거: sessions/2026-05-18T13:43] | O | 백엔드에서 유효성 검사 필수. |
| `diagnosis_type` | `string` | 진단 테스트 유형 (예: "Pitch", "FrequencyStability"). | O | 컨텍스트에 따라 변화하는 핵심 변수. |
| `context_id` | `UUID` | 현재 콘텐츠를 소비하는 상황/배경 ID. | O | 리포팅 및 KPI 추적의 기본 키. |
| `pain_score` | `number` | 사용자 진단에서 발견된 가장 큰 '문제' 점수 (0.0 ~ 1.0). [근거: sessions/2026-05-18T14:34] | O | 시각적 표현의 **강도**를 결정함. |
| `gain_score` | `number` | 시스템이 제공하는 '해결책'에 대한 기대 점수 (0.0 ~ 1.0). [근거: sessions/2026-05-18T14:34] | O | 시각적 표현의 **희망**을 결정함. |
| `target_kpi` | `string[]` | 콘텐츠가 집중적으로 강조해야 할 KPI (예: ["Growth", "Monetization"]). [근거: sessions/2026-05-18T43] | O | 여러 개의 키워드 배열 허용. |

### 1.2. 응답 바디 (Response Body - Output Data)
애니메이션 에셋을 생성하는 데 필요한 모든 메타데이터와 시각 파라미터가 포함된다.

| 필드명 | 타입 (Type) | 설명 (Description) | 예시 값 | 중요도 |
| :--- | :--- | :--- | :--- | :--- |
| `asset_id` | `UUID` | 생성된 자산의 고유 식별자. | `a1b2c3d4...` | High |
| `key_frames` | `JSON[]` | 각 스크립트 구간(Key Frame)별 애니메이션 파라미터 배열. [근거: sessions/2026-07-20T05:21] | `{time: 2s, color: '#ff0000', alpha: 0.8}` | Critical |
| `visual_params` | `JSON` | 콘텐츠 전반에 적용될 스타일 변수 정의 (색상 팔레트, 속도 곡선 등). [근거: sessions/2026-07-20T05:36] | `{primary_color: '#1e90ff', speed_curve: 'easeOut'}` | High |
| `cta_data` | `JSON` | CTA 영역에 표시되어야 할 텍스트와 액션 데이터. | `{text: "무료 진단 시작", link: "/start"}` | Critical |

---

## 2. 핵심 비즈니스 로직 및 계약 정의 (Business Logic Contract)

### 2.1. 동적 시각 변수 매핑 규칙
*   **Pain Score $\rightarrow$ 색상/강도:** `pain_score` 값이 높을수록(가까울수록 1에 가까움), 콘텐츠의 초기 배경색은 **'경고성 빨간 계열'**로 시작하고, 애니메이션 속도는 **불안정하게 빠르게 떨리는 모션**이 적용되어야 한다. [근거: sessions/2026-07-20T03:51]
*   **Gain Score $\rightarrow$ 색상/속도:** `gain_score` 값이 높을수록, 콘텐츠는 점진적으로 **'신뢰를 주는 파란 계열'**로 전환되며, 모션은 **일정하고 상승하는 곡선(Smooth Curve)**을 유지해야 한다.
*   **KPI 강조 (Growth):** 해당 KPI가 `target_kpi`에 포함되면, 관련 텍스트 요소는 모든 섹션에서 가장 크고 대비되는 색상으로 *반복적으로 깜빡이며* 강조되어야 한다. [근거: sessions/2026-05-18T43]

### 2.2. 권한 기반 콘텐츠 제어 (RBAC Enforcement)
백엔드 로직은 요청된 `user_id`와 `diagnosis_type`에 따라 접근 가능한 자산과 정보를 제한해야 한다.
*   **비활성 사용자:** 'Growth' KPI 관련 고급 리포트나 특정 기능의 CTA는 노출을 막고, **"무료 진단만 가능합니다."**라는 메시지를 표시하는 것이 원칙이다. [근거: sessions/2026-05-18T13:43]
*   **결제 상태 체크:** 시스템은 반드시 사용자 계정의 결제 상태를 확인하여, 유료 콘텐츠에 대한 접근 시도 발생 시 즉시 403 Forbidden 에러와 함께 적절한 안내 메시지를 반환해야 한다.

---

## 3. 기술 구현 및 테스트 계획 (Implementation & Test Plan)
*   **API 엔드포인트:** `GET /api/v1/diagnosis_score` (진단 점수 조회용), `POST /api/v1/reels/generate` (실제 자산 생성 요청).
*   **테스트 케이스:**
    1.  최악의 시나리오 테스트: Pain Score 0.9, Gain Score 0.1일 때, 애니메이션이 어떻게 작동하는지(색상 변화 및 속도 급변)를 검증한다.
    2.  권한 우회 시도 테스트: 결제되지 않은 사용자가 유료 자산의 `asset_id`를 직접 요청했을 때 접근 거부되는지 확인한다.

**[최종 승인]**
본 계약 사양은 Designer, 개발팀(Backend/Frontend), 기획팀 간의 합의 하에 V3.0으로 최종 확정된다. 이 이후 변경 사항은 반드시 공식 문서 개정을 통해 관리되어야 한다.