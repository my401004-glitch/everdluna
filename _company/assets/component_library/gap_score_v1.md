# Gap Score 시각화 컴포넌트 라이브러리 (V1.0)

## 🎯 목적
'아지트아트컴페니'의 모든 영상 콘텐츠에 사용될 '데이터 기반 증명(Data Proof)' 시스템의 핵심 비주얼 요소를 표준화하고, 애니메이션 개발 및 디자인 가이드라인을 통일합니다.

## 🎨 브랜드 원칙 적용 (Self-RAG 근거)
*   **신뢰/전문성:** Dark Blue (#0A2463)를 메인 배경색으로 사용하여 데이터의 권위를 확보.
*   **경고/기회:** Accent Yellow (#FFD700)를 위험(Pain)과 기회(Gain) 지표에 한정하여 사용.

## 🧱 컴포넌트 정의: 'Gap Score Indicator'
데이터의 상태 변화에 따라 세 가지 필수 모듈로 구성됩니다. 각 컴포넌트는 Noto Sans KR (Body)와 Montserrat Bold (Title)를 기본으로 합니다.

| 컴포넌트 | 역할 | 시각적 요소 | 애니메이션 스펙 |
| :--- | :--- | :--- | :--- |
| **1. Gap Score Meter** | 데이터 격차의 현재 수준 표시 | 메인 바 그래프 + 숫자(%) | **[Loading]**: 왼쪽에서 오른쪽으로 점진적 채우기 (0% $\rightarrow$ 100%). <br>**[Transition]**: 급격한 변화 시, 튕겨나가는(Spring/Bounce) 효과 적용. |
| **2. Risk Zone Highlighter** | 위험 구간 및 주목해야 할 데이터 영역 강조 | 배경에 노이즈 오버레이 또는 색상 그라데이션 (Yellow 계열). | 진입과 동시에 부드럽게 페이드 인(Fade In). 마우스 오버 시 미세하게 확대(Scale Up) 효과. |
| **3. Trend Line Chart** | 시간 경과에 따른 데이터 추이 증명 | 선 그래프(Line Chart), 이전에 확정된 데이터 포인트를 연결하는 점선. | 과거 데이터는 회색(Neutral Grey)으로 잔잔히 나타나고, '해결책 적용 후'의 데이터 포인트가 Dark Blue로 강조되며 솟아오르는 효과(Pop-up)를 준다. |

## ✨ 애니메이션 스펙 시트 (Hook 1 기준)
**A. 인트로 애니메이션: "The Data Reveal"**
*   **흐름:** 블랙 화면 $\rightarrow$ `[Dark Blue 배경]`에 시스템의 로고 및 타이틀이 미세한 그리드 패턴과 함께 나타남.
*   **지속 시간:** 3초 (최대).
*   **기술 스펙:** 모든 요소는 마치 기계적으로 계산된 듯, '틱(Tick)' 하는 사운드와 함께 좌표에 맞춰 순차적으로 나타나야 함.

**B. 데이터 증명 시퀀스: "The Gap Score Transition"**
1.  **(Pain/Gap 제시):** `[Neutral Grey 배경]`의 미니멀한 대시보드가 먼저 등장하며, 현재 점수(예: 45점)가 Yellow 색상의 '위험' 아이콘과 함께 크게 깜빡이며 표시된다. (강렬함)
2.  **(Solution Introduction):** 데이터 흐름이 전환되는 순간, 화면 전체에 `[Dark Blue]` 필터가 빠르게 오버레이되면서 시청자의 집중도를 최고로 끌어올린다.
3.  **(Gain/Proof 제시):** 그리드 라인이 사라지고, Gap Score Meter가 0%에서 시작하여 Solution 적용 과정을 거치며 (애니메이션) Yellow $\rightarrow$ Dark Blue로 색상이 전환되며 점진적으로 채워지는 모습을 보여준다. 최종 목표 지점(예: 85점)에 도달할 때 가장 밝고 강력한 빛의 효과를 준다.

---
*   **색상 코드:**
    *   Primary Trust (Background/System): `#0A2463`
    *   Accent Danger/Gain (CTA/Risk): `#FFD700`
    *   Secondary Data: `#9CA3AF` (Gray)
    *   Neutral Background: `#F5F5F5`