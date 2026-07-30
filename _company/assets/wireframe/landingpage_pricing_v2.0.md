# 랜딩 페이지 - 요금제 비교 섹션 와이어프레임 명세 (V2.0)

**[섹션 목표]:** 사용자에게 'Pro' 티어를 가장 합리적이고 필수적인 선택지로 느끼게 하여 전환율 극대화.
**[전체 배경]:** Neutral Grey (#F5F5F5)

## 🎨 디자인 시스템 적용 원칙
1.  **Primary Color (신뢰/안정):** Dark Blue (#0A2463). 섹션 배경, 헤더에 사용.
2.  **Accent Color (행동 유도/기회):** Accent Yellow (#FFD700). 가격 표시, CTA 버튼, 'Best Value' 배지에 사용.
3.  **Typography:** Montserrat Bold (제목), Noto Sans KR (본문)

## 📐 컴포넌트 상세 구조: Pricing Card Component (재사용 필요)

### [Card Template Structure]
```markdown
[카드 컨테이너 - 너비 비율 X%]
    <div style="background-color: #FFF; border: 2px solid #ddd; padding: 30px;">
        <!-- 1. 제목 및 강조 배지 -->
        <h1>{티어 이름}</h1>
        <p class="subtitle">{핵심 가치 설명}</p>
        {Best Value Badge - Pro 카드의 경우 배경색 변경 및 위치 조정}

        <!-- 2. 가격 영역 (가장 높은 시각적 중요도) -->
        <div style="margin: 20px 0;">
            <span class="price">₩{가격} / 월</span>
            <button class="cta-btn" style="background-color: #FFD700; color: #0A2463;">지금 시작하기</button>
        </div>

        <!-- 3. 핵심 기능 목록 (Feature List) -->
        <ul class="feature-list">
            <li>✅ {기능 1}</li>
            <li>✅ {기능 2}</li>
            <li>⭐ {핵심 차별화 기능 3 - 이 기능을 가장 강조할 것}</li>
        </ul>

        <!-- 4. 가격 책정 근거 (신뢰성 확보) -->
        <p class="reasoning">💰 {가격 책정의 논리적 이유}</p>
    </div>
```

### [A] Starter Tier (30% 너비) - 진입 장벽 최소화
*   **제목:** Gap Score 리포트 (최초 진단)
*   **핵심 가치 설명:** AI가 객관적으로 제시하는 현재의 문제점 인식.
*   **가격 영역:** ₩19,000 / 월
*   **핵심 기능:** 1회 Gap Score 리포트 제공, 기본 학습 모듈 추천 목록 확인.
*   **가격 책정 근거:** 낮은 진입 장벽을 통한 초기 사용자 확보 (Trial/Entry Point).

### [B] Pro Tier (40% 너비) - ⭐Best Value⭐ (시각적 강조 필수)
*   **제목:** 맞춤형 성장 로드맵 설계 및 코칭
*   **핵심 가치 설명:** 가장 효율적인 경로를 제시받고, 구체적인 행동 계획을 세우는 단계. **(전환 유도 목표)**
*   **가격 영역:** ₩39,000 / 월
*   **핵심 기능:** 무제한 Gap Score 리포트 접근 및 추적, **최소 5단계 맞춤형 학습 로드맵 제공**, 심화 기술/감성 피드백 (AI 기반).
*   **가격 책정 근거:** 가장 높은 가치(행동 가능한 계획)를 제공하며, 사용자의 장기적인 성장에 필요한 핵심 서비스.

### [C] Master Tier (30% 너비) - 완성도 극대화
*   **제목:** 아티스트 완성을 위한 전 과정 밀착 코칭
*   **핵심 가치 설명:** 전문가의 시선으로 작품을 완성하고, 시장에 진입하는 경험까지 지원.
*   **가격 영역:** ₩69,000 / 월
*   **핵심 기능:** Pro 기능 포함 + 모든 데이터 접근권, **영상 제작 스타일 가이드 제공**, 인간 코치 역할의 감성적 서사 코칭 접근.
*   **가격 책정 근거:** 최고 수준의 결과물(완성된 아티스트 경험)을 원하는 전문가 및 전업 예술가를 위한 프리미엄 포지션.