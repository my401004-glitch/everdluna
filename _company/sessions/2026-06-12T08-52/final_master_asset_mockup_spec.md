# Final Master Asset Mockup Specification: Pain $\rightarrow$ Proof Visualization

## 1. Design System Summary
*   **Primary Color:** `#0A2463` (Dark Blue) - 신뢰, 안정성
*   **Accent Color:** `#FFD700` (Accent Yellow) - 행동 유도, 기회
*   **Background/Data:** `#F5F5F5` (Neutral Grey) - 가독성
*   **Title Font:** Montserrat Bold
*   **Body Font:** Noto Sans KR

## 2. Layout Structure (16:9 Aspect Ratio)
| Area | Width (%) | Background Color | Content Focus | Key Visual Element |
| :--- | :--- | :--- | :--- | :--- |
| **Left (Pain)** | 30% | `#0A2463` (Dark Blue) | Risk, Loss Visualization | Accent Yellow Warning Icons |
| **Center (System)** | 40% | `#F5F5F5` (Neutral Grey) | Data Flow: Phase 1 $\rightarrow$ 2 $\rightarrow$ 3 | Dark Blue Flow Lines & System Checkmarks |
| **Right (Proof)** | 30% | `#0A2463` (Dark Blue) | Gain, Success Visualization | Accent Yellow Final Results |

## 3. Animation Sequence Specification (Duration: ~8 seconds)
1.  **Start:** Screen flashes with instability (Red/Yellow elements flicker).
2.  **Transition:** Dark Blue $\rightarrow$ Neutral Grey 전환. 흐름선이 활성화되며 시스템 안정성 마크가 나타남.
3.  **End:** 최종 Gain 수치가 Accent Yellow로 확정되며 화면이 안정화됨.

## 4. Developer Implementation Notes (Code Reference)
*   Use CSS transitions for smooth flow animation between sections.
*   Ensure all data visualization elements use the defined color palette strictly.
*   The 'System Stability Mark' must be rendered as a subtle overlay in Phase 2 to confirm Kodari's requirements are met visually.