# 🖼️ Hook 1: 예측형 경고 (Predictive Warning) - 최종 썸네일 스펙 v3

## ✨ 디자인 목표
'노력의 실패(Pain)'를 시각적 데이터 오류로 증명하고, '시스템 도입의 필요성(Gain)'을 정밀한 UI/UX로 제시하여 CTR을 극대화합니다.

## 📐 레이아웃 가이드라인 (16:9 비율)
*   **구도:** 대각선 분할 구도 (좌하단 - Pain / 우상단 - Gain).
*   **폰트:** Title - Montserrat Bold, Body - Noto Sans KR.

## 🎨 색상 팔레트 및 사용 규칙
| 역할 | 코드 | 용도 | 비고 |
| :--- | :--- | :--- | :--- |
| **Pain Background (기본)** | `#1A305D` (Dark Blue 계열) | 배경, 부정적인 감정 영역. 어둡지만 전문성이 느껴지는 톤. | Dark Blue보다 미묘하게 채도를 낮춰 절망감을 부여합니다. |
| **Warning Highlight** | `#FFC700` (Accent Yellow) | Gap Score의 '경고 지점', 위험 수치, 실패 주파수 표시. | 경고색은 반드시 굵게 처리하고, 주변에 빛 번짐(Glow) 효과를 줍니다. |
| **Solution/Data** | `#2A4D75` (Mid Blue) | 시스템 UI 요소, 로드맵 배경, 신뢰감 부여 영역. | Pain Zone과 명확히 구분되지만 Dark Blue 계열을 유지합니다. |
| **Text Color (Primary)** | `#F5F5F5` (Off-White/Light Grey) | 주요 헤드라인 텍스트. 높은 가독성 확보. |

## 📸 섹션별 시각적 요구사항

### 1. Pain Zone (좌하단 / 좌측 영역)
*   **메인 비주얼:** 파형 그래프(Waveform Graph). 목표 주파수와 현재 측정된 주파수가 명확하게 분리되어야 합니다.
    *   `Goal Line`: Mid Blue로 깔끔하게 그려져 '이상적인 지점'을 제시합니다.
    *   `Actual Wave`: `#1A305D` 배경에서 불안정하게 떨리거나 목표선에서 크게 이탈하는 파형으로 표현됩니다.
    *   **경고 표시:** Actual Wave가 Goal Line과 벌어지는 갭(Gap) 영역에 Warning Highlight (`#FFC700`)를 적용하고, 여기에 '⚠️ Gap Score: -X%'라는 문구를 배치합니다.

### 2. Gain Zone (우상단 / 우측 영역)
*   **메인 비주얼:** AI 시스템의 UI 스크린샷 목업처럼 디자인된 '진단 결과 카드' 또는 '로드맵'.
*   **텍스트 내용:**
    *   헤드라인: "AI 기반 성장 로드맵 제시" (Montserrat Bold, Mid Blue).
    *   핵심 데이터: `Next Step Focus:` / `Required Improvement:`와 같이 구체적이고 실행 가능한 지표를 제시합니다.
*   **CTA 요소:** 최종적으로 '클릭하여 진단받기' 버튼을 배치하되, 이 버튼에만 가장 강력한 Accent Yellow를 사용하고 입체감을 부여합니다.

---