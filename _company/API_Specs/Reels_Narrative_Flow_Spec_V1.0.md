# 📚 Reels 마케팅 영상 스토리라인 및 비즈니스 로직 사양 (Version 1.0)

**[목적]**
이 문서는 기술적으로 완성된 API 계약(Codari V3.0)을 활용하여, 실용음악 입시생의 감정적 불안감을 자극하고 궁극적으로 유료 모듈 구매를 유도하는 **최종 콘텐츠 스토리텔링 로직 및 KPI 연결점**을 정의한다. 이 사양은 마케팅 메시지(Writer), 비주얼 구현(Designer), 데이터 흐름(Codari)의 통합 지침서이다.

---

## 1. 핵심 프레임워크: Pain $\rightarrow$ Gain (기술적 객관화 기반 서사 구조)

**A. [PAIN] 불안감 유발 및 문제 인식 (The Hook & Problem)**
*   **목표:** 학생이 "나만 이런가?"라는 공감을 느끼고, 자신의 부족함(Pain Point)을 수치적으로 인지하게 만든다.
*   **활용 API 데이터:** `Pitch Deviation Index`의 높은 편차, `Breath Efficiency Score`의 낮은 점수 등 **'현재 상태 측정값'.**
*   **KPI 목표:** 시청 지속률 (Audience Retention Rate: 70% 이상) 및 공감 댓글 유도.

**B. [TRANSITION] 객관적 원인 분석 (The Diagnosis)**
*   **목표:** 감성적인 좌절을 '객관적인 데이터'로 치환하여, 문제를 개인의 의지 문제가 아닌 **'기술적 결함(Gap)'**으로 정의한다.
*   **활용 API 데이터:** `Gap Score` 산출 및 핵심 부족 과제 3가지 제시 (예: "호흡 패턴의 비효율성", "특정 음역대에서의 떨림").
*   **KPI 목표:** '진단 테스트'에 대한 흥미 유발 및 가치 인식.

**C. [GAIN] 해결책 제시 및 행동 촉구 (The Solution & CTA)**
*   **목표:** 문제를 해결할 수 있는 **명확하고 구체적인 경로(Minimum Viable Module List)**를 제시하며, 구독 서비스의 필요성을 각인시킨다.
*   **활용 API 데이터:** `Recommended Modules` 리스트와 이 모듈을 통해 얻게 될 '잠재 성장치(Potential Gap)' 시각화.
*   **KPI 목표:** 전환율 (Conversion Rate: 진단 $\rightarrow$ 무료 체험/결제).

---

## 2. 단계별 콘텐츠 로직 및 KPI 연결 테이블

| 스토리 단계 | 핵심 메시지 / 사용자 감정 변화 | API 활용 데이터 필드 | 필수 비주얼 변수 (Designer) | 유도할 다음 액션 (CTA) | 측정 KPI |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[A] Pain** (0-15초) | "노력하는데 왜 안 될까?" $\rightarrow$ 좌절, 의문 | `Pitch Deviation Index` (높음), 낮은 점수 데이터 시각화. | 불안감을 상징하는 톤앤매너 (어둡고 흔들리는 영상, 빨강 계열). | **"원인이 궁금하다면? 진단해봐."** (클릭 유도) | CTR (진단 페이지 이동율) |
| **[B] Transition** (15-40초) | "아, 이건 내 의지 문제가 아니었구나. 구체적인 Gap이 있었네." $\rightarrow$ 깨달음, 흥미 | `Gap Score` 및 3가지 핵심 부족 과제 리스트 (`recommended_modules`). | 데이터가 차트/그래프로 명확하게 분리되는 시각적 변화 (빨강 $\rightarrow$ 회색). | **"정확한 원인이 알고 싶다면? 무료 진단 테스트."** | Engagement Rate (댓글 참여도, 저장) |
| **[C] Gain** (40-60초) | "이렇게 개선할 수 있구나. 내가 이 정도 성장 잠재력이 있었네!" $\rightarrow$ 희망, 결심 | `Potential Gap` 및 `Recommended Modules`의 성공적인 결과 예측치 (`progress_id`). | 명확하고 밝은 톤앤매너 (파란색/골드 계열), 목표 달성 시퀀스 애니메이션. | **"지금 바로 성장의 첫 단추를 채워보세요."** (구독 페이지 유도) | Conversion Rate (유료 전환율) |

---