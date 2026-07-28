# 💻 UI Component System Spec Sheet V2.0 - 개발팀용 명세서
**목표:** 최종 스타일 가이드(V2.0)를 기반으로, 모든 재사용 가능한 컴포넌트의 CSS 및 JS 동작을 정의합니다. (반응형 웹 기준)

## 1. 기본 토큰 변수 정의 (Tokens)
| 이름 | 값 | 용도 | 참고 사항 |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#0A2463` | 주요 배경, 헤더, 신뢰성 영역 | Dark Blue. 주된 전문성을 나타냄. |
| `--color-accent` | `#FFD700` | CTA 버튼, 위험/기회 강조 수치 | Yellow. 시선 집중 및 행동 유도에 사용. |
| `--color-background` | `#F5F5F5` | 일반 본문 영역 배경 | Neutral Grey. 가독성 확보를 위한 대비색. |
| `--font-title` | 'Montserrat', Bold | 핵심 헤드라인 (H1, H2) | 강력한 메시지 전달. |
| `--font-body` | 'Noto Sans KR', Regular | 본문 텍스트 및 데이터 | 높은 가독성 확보. |

## 2. 필수 컴포넌트 스펙: CTA 버튼 (`Button/CTA`)
**A. 기본 상태 (Default)**
*   **CSS:** background-color: var(--color-accent); color: #0A2463; border-radius: 8px; padding: 1rem 2rem; transition: all 0.3s ease;
*   **요구사항:** 버튼 클릭 영역이 넓고(최소 44x44px), 명확한 경계가 있어야 합니다.

**B. 마우스 오버 상태 (Hover State)**
*   **CSS:** background-color: #ffeb80; /* Yellow를 살짝 밝게 */ transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
*   **요구사항:** 미묘하게 떠오르는 듯한 효과(Elevation)로 상호작용감을 부여합니다.

**C. 클릭/활성화 상태 (Active State)**
*   **CSS:** background-color: #ccb300; /* Yellow의 어두운 톤 */ transform: translateY(1px); box-shadow: none;
*   **요구사항:** 즉각적인 피드백을 위해 버튼이 눌리는 듯한 느낌(Depression)을 주어야 합니다.

## 3. 필수 컴포넌트 스펙: 데이터 카드 (`DataCard`)
*   **레이아웃:** 컨테이너는 `padding: 20px; background-color: #ffffff; border-left: 5px solid var(--color-primary);` 로 정의합니다.
*   **핵심 수치 강조:** 카드의 가장 큰 숫자는 반드시 `--color-accent`를 사용하며, 그 주변에 **'⚠️ Potential Gain/Loss'** 라벨을 배치해야 합니다.

---