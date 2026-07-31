# ✨ 아지트아트컴페니 - Funnel Flow Audit Map (P0 구현 설계 v1.0)
**작성 목적:** 사용자의 유입부터 구독 갱신까지 전 과정을 분석하고, 핵심 가치(AI 진단 데이터)에 대한 **기술적 접근 통제 장벽(Gatekeeping)**을 정의하여 P0 기능의 위치와 흐름을 명확히 한다. [근거: CEO 지시사항]
**핵심 원칙:** 모든 유료화는 '데이터'나 '독점적인 시간/횟수'에 대한 제한으로 구현되어야 하며, 이는 시스템 레벨에서 강제(Gate)되어야 함. [근거: 현빈 검증된 지식 - sessions/2026-05-18]

---

## 🚀 I. 사용자 여정 단계 (User Journey Stages)
| 스테이지 | 목표 (Goal) | 주요 액션 (Action) | 핵심 감정 상태 (Emotion) |
| :---: | :---: | :---: | :---: |
| **1. 인지/유입 (Awareness)** | 문제 인식 및 해결책 검색 | YouTube 시청, SNS 광고 노출 | "나만 힘든가?", "어떻게 해야 할까?" (불안) |
| **2. 관심/체험 (Interest/Trial)** | 서비스의 핵심 가치 체험 및 기대감 형성 | 무료 진단 테스트 참여 (녹음 과제 제출), 웹사이트 탐색 | "이거 나한테 도움이 될까?", "한 번 해보고 싶다." (기대) |
| **3. 전환 (Conversion)** | 문제점 구체화 및 해결책 구매 결정 | 유료 기능/구독 플랜 결제, 모듈 선택 | "이걸로 진짜 성장할 수 있겠다!" (확신) |
| **4. 유지/충성도 (Retention)** | 학습 습관 형성 및 장기적 목표 달성 | 정기적인 콘텐츠 소비, 코칭 피드백 활용, 다음 목표 설정 | "꾸준히 하면 되겠지." (동기 부여) |

---

## 🔐 II. P0 게이팅 포인트 분석 (Gatekeeping Points & Technical Requirements)
Funnel Map 상에서 가장 중요한 지점(P0 Gate)은 **'진단 데이터의 깊이와 범위'**를 통제하는 것입니다. 이는 기술적 인증과 결합되어야 합니다.

### 🟢 A. 무료 진입 게이트 (Free Entry Gate: 리드 확보)
*   **위치:** Interest/Trial 단계, 랜딩 페이지 핵심 CTA 영역.
*   **기능:** **'무료 진단 테스트 참여'**만 허용.
*   **기술적 요구사항 (P0):**
    1.  `Authentication Check`: 비로그인 사용자의 경우, 최소한의 이메일 인증 또는 소셜 로그인으로 세션을 확보해야 합니다. [근거: 코다리 작업 계획]
    2.  `Scope Limiting`: 녹음 파일 업로드 및 기본 데이터 분석(Pitch Deviation Index만 제한적으로 제공)은 무료로 허용하되, **'진단 리포트 다운로드'는 1회성으로 제한**합니다. [근거: 현빈 검증된 지식 - sessions/2026-05-18]
    3.  `Data Collection`: 녹음 파일 업로드 시 `progress_id`, `pitch_deviation_index`, `breath_efficiency_score` 등 필수 메타데이터를 확보합니다. [근거: 현빈 검증된 지식 - sessions/2026-05-18]

### 🟡 B. 구독 게이트 (Subscription Gate: 매출 발생)
*   **위치:** Conversion 단계, 진단 리포트 상세 분석 페이지 / 프리미엄 모듈 접근 시.
*   **기능:** **'Gap Score 기반의 맞춤형 성장 로드맵/추가 학습 모듈 전체 개방'.**
*   **기술적 요구사항 (P0):**
    1.  `Role-Based Access Control (RBAC)`: 사용자 역할 테이블(`user_role`)을 확인하여 `is_subscribed = TRUE`인 경우에만 프리미엄 콘텐츠 접근이 가능하도록 시스템 레벨에서 차단해야 합니다. [근거: 코다리 작업 계획, 지난 의사결정 로그]
    2.  `Payment Verification`: 구독 상태 변경은 결제 게이트웨이(Stripe/PayPal)의 **성공적인 트랜잭션 완료**가 확정된 후에만 `user_role` 테이블에 기록되어야 합니다. [근거: 현빈 검증된 지식 - sessions/2026-05-18]
    3.  `Feature Gating`: '감성적 해석력' 분석 모듈(Emotional Consistency Score) 등 복잡하고 고가치인 AI 진단 결과는 구독자에게만 제공합니다.

### 🔴 C. LTV/핵심 데이터 게이트 (High-Value Gate: 이탈 방지 및 재구매 유도)
*   **위치:** Retention 단계, 사용자 대시보드 / 최종 보고서 다운로드 영역.
*   **기능:** **'전체 기간 성장 추이 분석 리포트(Time Series Report)'** 제공. (가장 강력한 Pain Point 해결 장치).
*   **기술적 요구사항 (P0):**
    1.  `Data Aggregation & Security`: 사용자가 업로드한 모든 진단 데이터(`progress_id`)를 시간 순서대로 집계하고, 이 종합 리포트(PDF/CSV)는 **구독 기간 중 횟수 제한을 두거나**, **최상위 등급 구독자에게만 무제한 제공**합니다.
    2.  `Module Dependency`: 새로운 고가치 모듈(예: '실전 라이브케어 시뮬레이터')은 반드시 유료 구독 상태여야 접근 가능하며, 이 모듈 사용 기록이 다시 `progress_id`에 누적됩니다.

---

## 💡 III. KPI 연결점 (KPI Integration Points)
| 단계 | 목표 KPI | 측정 방법 및 데이터 연동 | 근거 |
| :---: | :---: | :---: | :---: |
| **Awareness $\rightarrow$ Interest** | Trial Sign-up Rate (TSR) | 무료 진단 테스트 제출 횟수 / 유입자 수. [근거: A 게이트] | 잠재 고객의 Pain Point 인식 측정. |
| **Interest $\rightarrow$ Conversion** | Free to Paid Conversion Rate (FPR) | 무료 사용자가 구독 플랜 결제에 성공한 비율. [근거: B 게이트] | '데이터 부족'을 구매 동기로 전환하는 효율성 측정. |
| **Conversion $\rightarrow$ Retention** | LTV / Churn Rate | 구독 갱신 주기, 재사용 빈도(DAU/MAU). [근거: C 게이트] | 시스템이 지속적으로 가치를 제공하고 있음을 증명해야 함. |

---