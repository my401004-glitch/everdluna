# 🎨 Diagnosis Score Display 컴포넌트: 최종 디자인 사양서 (V3.0)
**[목표]**: 학생의 '현재 상태(Pain)'와 '잠재적 개선 가능성(Gain)'을 재무적 논리(ROI)에 기반하여 시각화함으로써, 학습 콘텐츠 몰입도 및 CTA 전환율 극대화.

---

## 💡 Part 1. 시스템 핵심 로직: Pain $\rightarrow$ Gain 프레임워크 적용
모든 시각 요소는 이 단일의 재무적 논리 흐름을 따라야 합니다.

### A. 개념 정의 (The Narrative Flow)
1.  **Pain Zone (위험 인식):** 현재 지식/능력 부족으로 인한 '잠재적 손실(Risk)'을 수치로 제시합니다.
    *   **시각화:** Dark Blue 배경 위에 Accent Yellow 경고 표시를 사용하며, 하락세 또는 낮은 점수를 강조합니다.
    *   **메시지 톤:** 객관적 데이터 기반의 '문제 제기' (Shock & Awe).
2.  **Transition Zone (개입/해결):** 프로그램 참여나 학습을 통해 '변곡점'에 도달함을 알립니다.
    *   **시각화:** 경고색(Yellow)에서 중립색(Blue-Grey)으로 점진적으로 변화하며, 성장 곡선 그래프를 사용합니다.
3.  **Gain Zone (결과 확신):** 솔루션 적용 후 얻게 될 '재무적 이득/성장 가능성(ROI)'을 수치로 제시합니다.
    *   **시각화:** Accent Yellow와 Dark Blue의 조화를 통해 '기회'와 '확실한 전문성'을 동시에 전달합니다. 상승세 또는 높은 점수를 강조합니다.

---

## 🎨 Part 2. 비주얼 시스템 가이드라인 (Visual System Guideline)
| 요소 | 설정 값 | 적용 목적 및 규칙 | 근거 |
| :--- | :--- | :--- | :--- |
| **Primary Color (신뢰/안정)** | Dark Blue (`#0A2463`) | 배경, 헤더, 안정적인 정보 섹션. 전문성 기반의 '기준점' 역할을 합니다. | [Self-RAG] |
| **Accent Yellow (CTA/Gain)** | Accent Yellow (`#FFD700`) | 1. Gap Score가 위험 수준일 때의 경고 표시 (Pain).<br>2. 최종 CTA 버튼, 그리고 Gain Zone의 핵심 성과 수치 강조. | [Self-RAG] |
| **Neutral Grey (배경)** | Neutral Grey (`#F5F5F5`) | 데이터 및 본문 텍스트 배경. Dark Blue와의 대비를 통해 가독성을 극대화합니다. | [Self-RAG] |
| **Title Typography** | Montserrat Bold | 모든 핵심 메시지(Pain, Gain 제목)에 사용되어 강력한 시각적 임팩트를 제공합니다. (H2/H3 레벨) | [Self-RAG] |
| **Body Typography** | Noto Sans KR Regular | 구체적인 데이터 값 및 설명 텍스트에 사용하여 높은 가독성을 보장합니다. | [Self-RAG] |

---

## 🖥️ Part 3. 컴포넌트 명세: DiagnosisScoreDisplay (Technical Spec)
### A. 구조적 요구사항 (Functional Logic)
1.  **데이터 입력:** `Diagnosis_Results` JSON 구조를 받아야 함. (예: `{ "score": 75, "gap_level": "Medium", "status": "Improvement Needed" }`)
2.  **핵심 컴포넌트:** 점수 표시 영역 + 변화 추이 그래프 + 상태 메시지 카드.

### B. 시각적 레이아웃 상세 (Visual Layout Details)
1.  **스코어 위젯 (Score Widget):**
    *   **위치:** 섹션 최상단, 가장 큰 가시성 확보.
    *   **표현 방식:** 원형/막대 그래프와 숫자 조합.
    *   **색상 로직:**
        *   **Pain State (< 60점):** 배경 Dark Blue를 사용하고, 점수 숫자에 Accent Yellow의 '위험 경고' 오버레이 적용. (즉각적 주의 환기)
        *   **Neutral/Gain State (> 75점):** Dark Blue 기반에 청량한 느낌을 주는 파란색 계열(Dark Blue에서 약간 밝게 조정)을 사용하여 신뢰감을 높임.

2.  **변화 추이 그래프 (Trend Graph):**
    *   **기능:** 시간 경과에 따른 점수 변화를 보여주는 Line Chart.
    *   **시각적 강조:** 'Pain' 구간의 데이터 포인트는 **Accent Yellow 마커**로 표시하고, 이탈/성장의 변곡점 지점을 명확하게 강조합니다. (이동 경로의 시작점)

3.  **상태 메시지 카드 (Status Card):**
    *   **역할:** 현재 점수와 Gap Score에 대한 해석을 제공.
    *   **Pain State 시 텍스트 예시:** "❌ **경고:** 현 학습법으로는 [X] 지점에서 재무적 손실 위험이 높습니다." (Emphasis: Yellow)
    *   **Gain State 시 텍스트 예시:** "✅ **기회 포착:** 체계적인 접근을 통해 최대 [Y]%의 성장 ROI를 확보할 수 있습니다." (Emphasis: Dark Blue/Yellow 조합)

---

### 📝 Designer 검토 의견 및 Coder 인계 사항
*   **Coder에게 전달:** 이 사양서가 컴포넌트 개발의 유일한 진실 출처(SSOT)입니다. 기능 구현 시, **'재무적 논리 흐름 (Pain $\rightarrow$ Gain)'**을 반드시 염두에 두고 UI/UX를 설계해야 합니다.
*   **Writer에게 전달:** 스크립트를 작성할 때, 이 사양서의 '상태 메시지 카드 텍스트 예시'와 동일한 어조(Tone)로 후킹 문구를 조정해 주세요.