# Visual Asset Mapping Guide (최종 확정 가이드라인)

## 목표
영상 편집팀을 위한 자막 및 그래픽 시안 적용 규칙 문서

---

## 1. 디자인 시스템 요약 (Brand System Summary)

이 모든 비주얼 요소는 채널의 핵심 정체성('좌절에서 승리로의 변곡점')에 기반하여 다음 색상 팔레트와 타이포그래피를 엄격하게 준수해야 합니다.

### 1.1. 컬러 팔레트 (Color Palette)
*   **Primary Color (신뢰/안정):** Dark Blue (`#0A2463`) - 배경, 주요 정보 영역에 사용하여 신뢰감을 구축합니다.
*   **Accent Color (행동 유도/기회):** Accent Yellow (`#FFD700`) - 이탈 위험(Pain) 및 최종 이득(Gain), CTA 강조에 사용하여 즉각적인 시선을 유도합니다.
*   **Background/Data Color:** Neutral Grey (`#F5F5F5`) - 데이터 영역의 명확성을 확보하고 Dark Blue와의 대비를 유지합니다.

### 1.2. 타이포그래피 (Typography)
*   **Title Type (헤드라인):** Montserrat Bold - 핵심 메시지(Pain, Gain) 강조에 사용됩니다.
*   **Body Type (본문/데이터):** Noto Sans KR - 구체적인 데이터 및 상세 설명 텍스트에 사용하여 높은 가독성을 보장합니다.

---

## 2. 콘텐츠 구조와 시각화 매핑 규칙 (Content Structure & Visualization Mapping)

마스터 스크립트의 각 섹션은 영상 내에서 'Pain → Gain' 프레임워크를 따르며, 이에 상응하는 Gap Score 시각화 에셋을 배치해야 합니다.

### 2.1. 마스터 스크립트 구조 분석

| 섹션 이름 | Timecode (예시) | 콘텐츠 목표 | 시각화 요구사항 |
| :--- | :--- | :--- | :--- |
| **Hook** | 00:00-00:15 | 강력한 경고 제시 (Pain 극대화) | 높은 이탈 위험 수치 시각화 및 즉각적 주의 집중 |
| **Problem_Area** | 00:15-00:45 | Gap Score 진단 시작 구간 (현재의 손실 명확화) | Accent Yellow로 위험 지표 강조 |
| **Solution_Intro** | 00:45-01:30 | 솔루션 제시 및 기대 이득(Gain) 소개 | Dark Blue 배경 + Yellow 이득 수치 |
| **Result_Showcase** | 이후 구간 | 성과 입증 (Pain → Gain의 극적인 변화 시각화) | Before/After 대비 그래프 |

### 2.2. Gap Visualization 에셋 적용 규칙

`final_Gap_Visualization_Assets.json`에 정의된 각 시각화 요소는 아래 규칙에 따라 영상에 삽입되어야 합니다.

1.  **Pain 지점 강조 (Risk Highlighting):** 'Problem_Area' 구간에서는 **Accent Yellow (`#FFD700`)**을 사용하여 현재의 위험 수치(Gap Score)를 명확히 표시합니다. 이는 시청자에게 즉각적인 경고 메시지를 전달해야 합니다.
2.  **Gain 지점 강조 (Opportunity Highlighting):** 'Solution_Intro' 및 최종 'Result_Showcase' 구간에서는 **Dark Blue (`#0A2463`)**를 배경으로 사용하고, 이득 수치를 **Accent Yellow (`#FFD700`)**로 강조하여 긍정적인 기회(Gain)를 시각화합니다.
3.  **데이터 레이블링:** 모든 데이터 값과 설명 텍스트는 **Noto Sans KR (Body Type)**를 사용하며, 배경은 **Neutral Grey (`#F5F5F5`)**를 유지하여 정보의 가독성을 극대화합니다.
4.  **헤드라인 강조:** 섹션 제목(Hook, Problem_Area 등)은 **Montserrat Bold (Title Type)**를 사용하여 강력한 메시지 전달력을 확보합니다.

---

## 3. 최종 검증 흐름 (Final Verification Flow)

편집팀은 다음 순서대로 시각화 에셋을 배치하여 데이터의 논리적 흐름을 완벽히 반영해야 합니다.

1.  **스크립트 확인:** 마스터 스크립트(`master_script.json`)를 참조하여 타임코드별 콘텐츠 목표를 파악합니다.
2.  **에셋 매핑:** 해당 타임코드의 내용(Pain/Gain)과 일치하는 `final_Gap_Visualization_Assets.json` 항목을 찾습니다.
3.  **스타일 적용:** 섹션별 규칙(2.2)에 따라 색상 및 폰트 스타일을 최종 결정하고 시안을 제작합니다.

> *예시:* **Hook (00:00-00:15)** 구간에서는 'Pain' 영역의 Gap Score를 **Accent Yellow**로 강조하여 즉각적인 흥미 유발에 집중합니다.

이 가이드라인은 모든 시각적 결과물이 데이터 기반의 논리적 흐름과 브랜드 톤을 일치시키도록 보장합니다.
