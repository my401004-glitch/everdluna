# ✨ 마케팅 자산 시스템 가이드라인 V2.0 (A/B 테스트 최종 Mockup Spec)

**[목적]**
코다리 에이전트가 설계한 `DynamicContentResponse` 스키마의 변수를 활용하여, A/B 테스트 그룹별로 가장 높은 전환율을 유도하는 유튜브 썸네일 및 인스타그램 광고 카드의 **최종 시각화 매뉴얼**을 제공합니다. 본 가이드라인은 모든 디자인 에셋 제작의 기준으로 사용되어야 합니다.

**[핵심 브랜딩 원칙 상기]**
*   **Pain $\rightarrow$ Gain 프레임워크:** 모든 레이아웃은 '위험(Risk)' 제시 후, '해결책/이득(Gain)'으로 시선을 유도해야 합니다.
*   **컬러 팔레트:** Primary (신뢰): Dark Blue (`#0A2463`) / Accent (행동 유도/기회): Yellow (`#FFD700`) / Background: Grey (`#F5F5F5`).
*   **폰트 시스템:** Title: Montserrat Bold / Body: Noto Sans KR.

---

### 📺 1. 유튜브 썸네일 Mockup Specification (1280x720px)

#### A. 공통 레이아웃 구조 (Global Layout Structure)
| 영역 | 크기 (Pixel) | 목적 및 내용 | 디자인 가이드라인 |
| :--- | :--- | :--- | :--- |
| **Pain Zone** | 좌상단 1/3 섹션 | 시청자의 가장 큰 고통점(Risk)을 강렬한 문구로 제시. | 배경: Dark Blue (`#0A2463`). 대비되는 밝은 서브헤드라인 사용. `[근거: Designer 검증된 지식]` (Pain $\rightarrow$ Gain) |
| **Transition Zone** | 중앙 1/3 섹션 | '하지만', '해결책이 있다'는 변곡점을 제시하는 시각적 전환 영역. | 배경: Neutral Grey (`#F5F5F5`). 강조 노란색(`FFD700`)으로 경계 처리. **API Variable:** `visualGuide`를 활용하여 애니메이션 효과가 들어갈 자리 확보. |
| **Gain Zone** | 우측 1/3 섹션 | 최종적인 이득(ROI)과 구체적 결과를 명확하게 제시 (CTA 직전). | 배경: 밝은 대비의 화이트 또는 Light Blue. 핵심 수치(`[API Variable: headline]`)를 Yellow로 강조. |
| **제목 배치** | 하단 전체 폭 | 간결하고 임팩트 있는 제목. 폰트는 Montserrat Bold, 최대 8자 이내 권장. |

#### B. A/B 테스트 그룹별 디테일 설계 (Group Specific Design)

**[A 그룹: '시간 부족' Pain점 공략]**
*   **타겟 페르소나:** 바쁘고 결과에만 집착하는 입시생.
*   **메인 카피 변환 목표:** "수많은 연습 시간 vs. 단기간의 확실한 점프"
*   **Pain Zone (`[API Variable: headline]`):** **"맨날 하는데 왜 안 될까? 😭"** (강렬하고 감성적인 문구, 빨간색 계열 사용 가능하나 Yellow 액센트 유지 권장)
*   **Gain Zone (`[API Variable: subHeadline]`):** "AI 활용으로 주 5시간 만에 레벨업!" (숫자와 'AI' 키워드 강조)
*   **Visual Guide:** `visualGuide.type` = chart, `description` = 가파르게 상승하는 그래프 애니메이션.

**[B 그룹: '기술적 난이도' Pain점 공략]**
*   **타겟 페르소나:** 체계적인 방법론을 원하는 진지한 학습자.
*   **메인 카피 변환 목표:** "감(感)에 의존하는 시대는 끝났다"
*   **Pain Zone (`[API Variable: headline]`):** **"막연히 연습해서는 안 됩니다."** (권위적이고 명확한 톤의 문구).
*   **Gain Zone (`[API Variable: subHeadline]`):** "과학적으로 증명된 보컬 트레이닝 커리큘럼 제시!" (체계성, 'Science' 키워드 강조)
*   **Visual Guide:** `visualGuide.type` = icon, `description` = 복잡한 이론을 단순화하는 인포그래픽 아이콘 배열.

**[C 그룹: '비용/경제성' Pain점 공략]**
*   **타겟 페르소나:** 비용 효율성을 중요시하는 현실적인 학부모/입시생.
*   **메인 카피 변환 목표:** "돈 낭비를 막고, 최적의 투자로 결과를 얻는 법"
*   **Pain Zone (`[API Variable: headline]`):** **"비싼 레슨? 돈만 쓰고 끝날까 봐 불안합니다."** (경제적 리스크를 자극).
*   **Gain Zone (`[API Variable: subHeadline]`):** "최대 비용 대비 최대 효과(ROI) 보장 시스템 공개!" ('투자', '절감' 키워드 강조, Yellow로 ROI 수치 강조).
*   **Visual Guide:** `visualGuide.type` = video, `description` = 실제 트레이닝 환경의 간접 체험 영상 썸네일 (신뢰도를 높이는 비주얼).

---

### 📱 2. 인스타그램 광고 카드 Mockup Specification (1080x1080px)

**[핵심 원칙]**
*   광고는 스크롤을 멈추게 하는 '시각적 충격'과 '즉각적인 질문'에 초점을 맞춰야 합니다.
*   텍스트를 최소화하고, 중앙의 **Pain Point Question** 영역을 가장 크게 배치합니다.

**[공통 레이아웃 구조]**
1.  **Top Hook:** (Dark Blue 배경) 강력한 후킹 문구와 이모지 사용.
2.  **Core Visual:** (Neutral Grey/White) 시선을 사로잡는 메인 일러스트 또는 이미지 (변화 전/후 대비).
3.  **CTA Area:** (Yellow 강조) '더 알아보기', '무료 진단' 등 버튼과 간결한 텍스트 배치.

**[A/B 테스트 그룹별 디테일 설계]**

*   **A Group Mockup Focus:** **시간 압박감 시각화.**
    *   *Visual:* 타이머가 돌아가는 이미지 + 좌절하는 학생의 실루엣 (Pain).
    *   *Copy:* "⏰ 시간 낭비 STOP! 단 5주 만에 달라진다?"
*   **B Group Mockup Focus:** **구조적 변화 시각화.**
    *   *Visual:* 복잡하게 얽힌 전선이 깔끔한 회로도처럼 정리되는 애니메이션/이미지 (Pain $\rightarrow$ Gain).
    *   *Copy:* "🤔 감(感)으로 하셨나요? 이제는 과학입니다."
*   **C Group Mockup Focus:** **경제적 이득 시각화.**
    *   *Visual:* 비싼 레슨 비용 지출 그래프와, 낮은 비용으로 높은 성과를 얻는 비교 그래프 (Pain vs. Gain).
    *   *Copy:* "💸 돈 낭비 없이, 진짜 결과를 만나는 방법."

---
**[API 통합 요약]**
모든 디자인 요소는 코다리 에이전트가 설계한 다음 변수들을 매개로 작동해야 합니다.
1. `headline` (핵심 가치 메시지)
2. `subHeadline` (상세 설명/기대 효과)
3. `visualGuide` (시각 자료의 종류와 컨셉)