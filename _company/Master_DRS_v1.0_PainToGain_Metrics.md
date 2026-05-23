# 📊 마스터 데이터 요구사항 명세서: Pain $\rightarrow$ Gain 측정 기준 (M-DRS v1.0)
**버전:** 1.0
**목표:** 실용음악 입시생의 '성장 과정'을 객관적이고 설득력 있게 수치화하여, 교육기관과 학습자에게 '노력의 증명(Proof of Effort)'을 제공하는 데이터 구조를 정의한다.
**주요 적용 프레임워크:** Pain $\rightarrow$ Gain (서사 중심)

## 📌 섹션 1. 핵심 KPI 및 측정 기준 정의

| 서사적 요소 (Narrative Element) | 사용자 니즈 (User Need/Pain Point) | 목표 데이터 지표 (Metric) | 데이터 설명 및 계산 방식 |
| :--- | :--- | :--- | :--- |
| **Pain: 불안함** | "음정이 자꾸 흔들려요." / "노력해도 늘지 않는 것 같아요." | 1. 평균 음정 편차 점수 (Avg Pitch Deviation Score) | 목표 피치 대비 실제 녹음된 평균 세미톤 오차 값. $\text{Score} = \text{Abs}(\text{Actual Pitch} - \text{Target Pitch})$. **(핵심 진단 지표)** [근거: sessions/2026-05-18T13:43/researcher.md] |
| **Pain: 부족한 근육** | "지속적으로 소리를 내기 힘들어요." / "호흡이 금방 떨어져요." | 2. 평균 호흡 지속 시간 (Avg Breath Duration) | 일정 음정 구간을 유지하는 데 필요한 최소 안정적 호흡 시간(초). 시간이 길수록 높은 점수. **(기술 스킬 지표)** [근거: sessions/2026-05-18T13:43/researcher.md] |
| **Gain: 성장** | "예전엔 안 되던 게 이제는 가능해요." / "실력이 늘고 있다는 확신이 들어요." | 3. 발전율 (Rate of Improvement, RoI) | $t_n$ 시점 데이터와 $t_{n-1}$ 시점 데이터를 비교한 **변화량**의 정규화된 점수. $\text{RoI} = \frac{|\text{Metric}_{t_n} - \text{Metric}_{t_{n-1}}|}{\text{Initial Metric}}$. **(가장 중요한 KPI)** [근거: sessions/2026-05-17T17-18/researcher.md] |
| **Process: 노력** | "내가 얼마나 많이 했는지 아무도 몰라줘요." | 4. 학습 참여 빈도 및 지속 시간 (Engagement Count) | 주간 연습 세션 수, 누적 피드백 반영 수정 연습량(분). **(노력의 증명)** [근거: sessions/2026-05-18T13:43/researcher.md] |

## 🛠️ 섹션 2. 데이터 요구사항 상세 명세 (Data Requirements Specification - DRS)

| 필드 이름 (Field Name) | 설명 (Description) | 자료 유형 (Data Type) | 수집 출처 (Source System) | 검증 규칙 (Validation Rule / Constraint) |
| :--- | :--- | :--- | :--- | :--- |
| `session_id` | 개별 학습 세션 고유 식별자 | UUID/String | API Input / Client Device | Non-null, Unique Index. |
| `timestamp` | 데이터 측정 시간 (UTC) | DateTime | System Clock | Must be monotonically increasing per user. |
| `user_id` | 사용자 ID | Integer | User Profile DB | Foreign Key constraint. |
| **`avg_pitch_dev_score`** | 평균 음정 편차 점수 (Metric 1) | Float | AI Diagnosis Engine | Range: [0.0, 5.0]. 0에 가까울수록 우수함. |
| **`avg_breath_duration`** | 평균 호흡 지속 시간 (Metric 2) | Float | Audio Analysis Module | Range: [1.0, 30.0] 초. > 1초는 최소 요구치. |
| `target_score` | 목표 달성 점수 (예: 합격 예상 점수) | Integer | Manual Input / Model Prediction | 임의 값 설정 가능. 로드맵 설계 시 사용. |
| **`roi_value`** | 발전율 (Rate of Improvement, Metric 3) | Float | Calculation Layer (Backend) | $t_{n-1}$ 데이터가 존재해야 계산 가능. |
| `practice_duration_min` | 해당 세션의 총 연습 시간(분) | Integer | Client Device Log | $\ge 5$분일 경우만 유효한 데이터를 인정한다. |

## 🚀 섹션 3. Pain $\rightarrow$ Gain 콘텐츠 기획 연동 체크리스트 (Content Planning Checklist)

| 단계 | 목표 서사/메시지 | 데이터가 증명해야 할 것 (Proof Point) | 필요한 기능/산출물 |
| :--- | :--- | :--- | :--- |
| **Pain Identification** | "당신은 지금 이 부분에서 좌절하고 있습니다." | `avg_pitch_dev_score`가 높은 구간의 시각적 증거. (수치화) | 진단 결과 리포트, 'Before' 비교 그래프. |
| **Solution 제시** | "하지만 이 방법을 통해 개선할 수 있습니다." | `avg_breath_duration`이 특정 목표치를 달성하는 과정 시뮬레이션. (로드맵 제시) | 커리큘럼/연습 과제 모듈 (Technical Skill). |
| **Gain 증명** | "당신은 실제로 이렇게 발전했습니다!" | **RoI 값의 급격한 상승세**를 시간 흐름에 따라 보여주는 '성장 그래프'. | 레벨업 시스템, 성장 리포트 ('After' 비교 시각화). |

---