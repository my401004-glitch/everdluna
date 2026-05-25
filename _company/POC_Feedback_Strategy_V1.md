# 📊 POC 세션별 핵심 논의 흐름 (Funnel & Pain Point Mapping)

## 📌 목적
실제 학원 운영자에게 우리 프로그램이 제공할 수 있는 '가장 강력한 재정적 가치(ROI)'를 확인하고, 그들의 진정한 구매 장벽과 니즈를 데이터화한다.

## 💡 세션별 질문 구조 (질문 의도 명시)
1. **[Pain Point 발굴]** "현재 가장 시간/비용을 많이 쓰고 있지만, 체계적으로 해결하지 못하고 있는 부분이 무엇입니까?" (→ *우리가 놓치고 있는 경쟁사 대비 Pain Point를 도출*)
2. **[가치 인식 검증]** "만약 이 프로그램이 '학생들의 평균 입시 합격률 N% 상승'을 객관적인 데이터로 증명한다면, 현재 운영 비용 대비 어느 정도의 투자 가치를 두시겠습니까?" (→ *가격 민감도 및 ROI 수용 범위 측정*)
3. **[사용자 저항점 테스트]** "이 프로그램을 도입할 때 내부적으로 가장 반발하거나 어렵다고 예상되는 부분은 무엇입니까? (예: 기존 강사와의 교육 방식 충돌, 초기 비용 부담 등)" (→ *실제 시장의 조직적/문화적 장벽 파악*)

## 🔑 핵심 트래킹 KPI (Conversation-based KPIs)
| 지표명 | 측정 목표 | 정의 및 수치화 기준 | 활용 목적 |
| :--- | :--- | :--- | :--- |
| **Pain Point Match Rate** | 우리 프로그램의 진단 결과가 학원 운영자의 '최대 Pain'와 일치하는 정도. | 0~5점 (1점: 무관심, 5점: 즉각적인 문제로 인지) | 제품의 시장 적합성(Product-Market Fit) 검증. |
| **ROI 수용 범위** | 학원 운영자가 지불할 의사가 있는 최소/최대 예산 구간. | 금액 단위 (Minimum / Maximum Budget Range) | 가격 전략 최종 확정 근거 마련. |
| **Actionable Next Step Count** | 세션 종료 후, 다음 행동(예: 데모 시연 요청, 계약서 검토 등)을 구체적으로 언급한 횟수. | 개수 (N회) | POC의 성공률 지표. |

---

#### 💻 코다리 (Developer): 데이터 수집 및 분석 시스템 스키마 구축
이러한 전략적 데이터를 저장하고 추후 대시보드에서 시각화할 수 있도록, 실질적인 DB 필드를 정의합니다.

<create_file path="POC_Data_Schema_V1.sql">-- 테이블명: poc_session_feedback (파일럿 프로그램 운영자별 피드백 기록)

CREATE TABLE poc_session_feedback (
    id SERIAL PRIMARY KEY,
    operator_id INT NOT NULL,          -- POC 참여 학원 ID 연결
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 1. 기본 정보 및 결과
    poc_result VARCHAR(50) NOT NULL,   -- 'Commit' (계약), 'Delay', 'Dismiss' 등
    overall_impression TEXT,            -- 운영자가 느낀 전체적인 프로그램의 인상 (자유 서술)

    -- 2. 현빈 전략 기반 측정 필드 (KPI Tracking)
    pain_point_match_score INT CHECK (pain_point_match_score >= 1 AND pain_point_match_score <= 5), -- Pain Point Match Rate (1~5점)
    identified_pain_keywords TEXT,      -- 운영자가 직접 언급한 핵심 키워드 (예: "학생 이탈률", "시간 대비 비효율")
    suggested_improvement_area VARCHAR(255), -- 운영자가 제시한 개선 요구사항

    -- 3. 재무적 가치 측정 필드
    min_budget REAL,                     -- 최소 지불 의사 금액 (NULL 허용)
    max_budget REAL,                     -- 최대 지불 의사 금액 (NULL 허용)
    value_proposition_accepted BOOLEAN, -- 'ROI 증명'에 대한 수용 여부 (True/False)

    -- 4. 액션 플랜 및 후속 조치
    next_action_required VARCHAR(100),  -- 필요한 다음 행동 (예: "Follow-up Demo", "Pricing Call")
    follow_up_deadline DATE              -- 추후 팔로우업 목표일
);