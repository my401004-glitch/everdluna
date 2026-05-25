# Project Charter v3.0: Pitch-Driven Validation Stage
**목표:** 아지트아트컴페니의 MVP를 '기술 데모'가 아닌, '투자 유치용 문제 해결 솔루션(Solution)'으로 포지셔닝하고 시장의 재무적 가치를 증명한다.

**기간:** 1주 (다음 주까지 최종 스크립트 완성 목표)
**핵심 지표 (KPI):** 발표 후 운영자가 추가 질문을 할 만한 논리적 허점(Gap)을 최소화하는 것.

---
## 🎯 3단계 통합 워크플로우 재정의
1. **[진단 단계: Pain Point 인식]**: 학원 대표에게 '데이터 오류가 있는 부분'을 충격적으로 제시 (Storytelling).
    * *담당:* 현빈, Writer
2. **[검증 단계: AI 진단 및 근거 제시]**: 객관적 데이터와 로직으로 문제의 심각성을 증명 (Technical Proof).
    * *담당:* 코다리, Designer
3. **[해결/수익화 단계: ROI 제안 및 계약 유도]**: 해결책을 통해 운영자가 얻게 될 '재정적 이득'만 강조하고 구체적인 도입 로드맵 제시 (Business Conclusion).
    * *담당:* 현빈

## 🛠️ 에이전트별 핵심 Action Item
1. **현빈:** 학원 대표 시뮬레이션 페르소나(예: 예산에 민감한 원장 A)를 설정하고, 이 캐릭터가 던질 수 있는 가장 날카로운 재무적 질문 5개를 정의할 것. (Output: Question List)
2. **코다리:** 현빈이 제기한 각 질문에 대해, 시스템이 어떤 API 호출(`diagnosis_score`, `user/progress` 등)와 어떤 형태의 데이터 시각화(Chart Type)로 답변해야 하는지 매핑하는 상세 플로우를 작성할 것. (Output: Flowchart & Tech Spec)
3. **Writer/Designer:** 위 1, 2번 산출물을 받아 '스크립트 A' (인트로 $\rightarrow$ 문제 제기 $\rightarrow$ 솔루션 제시 $\rightarrow$ 마무리) 형식의 발표 대본 초안을 작성할 것.

**우선순위:** 현빈 $\rightarrow$ 코다리 $\rightarrow$ Writer/Designer 순으로 진행하여, 각 단계마다 결과물을 즉시 통합 검토합니다.