# 📐 상호작용 포인트 정의 및 디자인 스펙 (Interaction Points Spec)
## 프로젝트: 실용음악 AI 활용 진단 프로그램 (A-01 & A-02 에셋 기반)
**목표:** 사용자 경험(UX)의 핵심 지점(Critical Interaction Points)을 식별하고, 이 상호작용 데이터를 KPI 측정 시스템에 통합하기 위한 디자인 및 데이터 구조 요구사항 정의.

---

### 💡 1. 기본 원칙 (Design Philosophy for Data Tracking)
모든 추적 포인트는 단지 '클릭' 자체를 기록하는 것이 아니라, **사용자가 특정 정보를 얼마나 오래 고민하고(Attention), 어떤 흐름으로 이동했는지(Flow)**를 측정하여 진단 서비스의 신뢰도를 높이는 데 기여해야 합니다.

*   **[근거: Designer 검증된 지식]**: Pain $\rightarrow$ Gain 프레임워크를 데이터로 증명해야 함.
*   **추적 대상:** 단순 클릭 외에 **Hover (마우스 오버), Scroll Depth (스크롤 깊이), Dwell Time (체류 시간)** 등 미세 상호작용을 우선적으로 설계합니다.

---

### 🎯 2. 핵심 상호작용 포인트 목록 (Critical Interaction Points List)
A-01(진단 리포트)과 A-02(솔루션/학습 모듈)를 통틀어 가장 중요한 5가지 포인트를 정의하고, 각 지점별 추적 사양을 명시합니다.

| # | 상호작용 영역 (Interaction Zone) | 발생 조건 (Trigger) | 데이터 포인트 (Data Point - Dev Input) | 디자인/KPI 근거 (Design Rationale) |
| :---: | :--- | :--- | :--- | :--- |
| **IP-01** | **진단 결과 요약 섹션 진입 (A-01)** | 사용자가 'Gap Score' 영역을 처음 로드할 때. | `View_Event`, `Start_Time`, `Asset_ID` (`Diagnosis_Summary`) | **[KPI 핵심]**: 사용자가 가장 먼저 접하는 정보의 체류 시간 측정. 초기 흥미 유발 지점 분석. |
| **IP-02** | **Pain Point 상세 설명 (A-01)** | 특정 약점 항목(예: 리듬 패턴 부족)에 마우스가 올라갈 때 (`Hover`). | `Interaction_Type` = Hover, `Asset_ID`, `Duration` (ms), `Coordinates` | **[KPI 핵심]**: 사용자가 '위험'을 인식하는 시각적 접점을 찾습니다. 가장 많은 시간을 할애하는 약점 파악에 필수. |
| **IP-03** | **솔루션/학습 모듈 진입 CTA (A-01 $\rightarrow$ A-02)** | 사용자가 '해결책 보기' 버튼을 클릭할 때 (`Click`). | `Interaction_Type` = Click, `Source_Page`, `Target_Module_ID`, `Exit_Confirmation` (Y/N) | **[KPI 핵심]**: 리포트에서 학습 모듈로의 전환율(Conversion Rate) 측정. 가장 중요한 Funnel 게이트입니다. |
| **IP-04** | **개별 학습 콘텐츠 플레이 버튼 (A-02)** | 사용자가 특정 트레이닝 에셋의 재생 버튼을 클릭할 때 (`Click`). | `Interaction_Type` = Click, `Module_ID`, `Asset_ID`, `Attempt_Count` (재시도 횟수) | **[KPI 핵심]**: 학습 몰입도 및 효능감 측정. 특정 트레이닝 유형(예: 화성학 vs 리듬)의 선호도 분석. |
| **IP-05** | **진단 결과 요약 재탐색 (A-01)** | 사용자가 A-02로 갔다가 다시 A-01으로 돌아와 'Gap Score'를 확인하는 경우 (`Scroll/Back`). | `Flow_Event`, `Source` $\rightarrow$ `Destination`, `Time_Delta` (시간 간격) | **[KPI 핵심]**: 서비스의 재방문 의도 및 사용자의 정보 탐색 순환 패턴 분석. 낮은 이탈률 예측에 중요. |

---

### ⚙️ 3. 개발팀 전달용 기술 요구사항 (Technical Implementation Specs for Codari)
이 표는 위의 IP-01~IP-05를 구현하기 위해 백엔드 시스템(KpiEventLoggerService)과 프론트엔드 스크립트가 반드시 준수해야 할 데이터 구조입니다.

**① 로깅 스키마 확장 요구사항:**
*   기존의 `Session_Details` 테이블 외에, **최소한 다음 3가지 필드를 포함하는 미세 상호작용 전용 로그(MicroInteractionLog)**를 생성해야 합니다. (이는 Codari가 설계할 `schema_update/micro_interaction_log.sql` 파일과 연결됩니다.)

**② 필수 데이터 구조:**
| 필드명 | 타입 | 설명 | 추적 목적 | 예시 값 |
| :--- | :--- | :--- | :--- | :--- |
| `event_id` | UUID | 고유 이벤트 식별자 (필수) | 모든 로그의 원본 트래킹. | `a3b4c5d6-1234-...` |
| `session_fk` | INT | 연결된 세션 ID (FK) | 어떤 사용자 흐름에 속하는지 매핑. | 10987 |
| `interaction_type` | ENUM | 상호작용 유형 | **`hover`, `click`, `scroll_depth`, `view`** 중 하나. | `hover` |
| `asset_id` | VARCHAR | 상호작용한 에셋의 ID | 어떤 요소에서 발생했는지 식별. | `A-01_RHYTHM_DEF` |
| `timestamp` | DATETIME | 이벤트 발생 시각 (밀리초 단위 권장) | 정확한 순서와 시간 간격 분석. | `2026-06-23 14:35:21.456` |
| `context_data` | JSONB | 추가 상황 정보 (필수 유연성 확보 영역) | IP-02 구현 시, `{ "coordinates": [x, y], "duration_ms": 500 }`와 같은 복합 데이터 저장. | `{...}` |

---
**[디자인 가이드라인 요약]**
*   이 스펙에 따라 제작되는 모든 페이지 컴포넌트는 추적 이벤트가 발생하기 쉬운 **'경계선(Boundary)'**을 명확히 시각화해야 합니다 (예: 인터랙티브 영역에 미세한 그림자나 포인터 효과 추가).
*   CTA 버튼은 항상 Accent Yellow (`#FFD700`)를 사용하고, 마우스를 올리면 Hover State가 즉시 활성화되도록 구현하여 `Hover` 이벤트를 유도합니다.