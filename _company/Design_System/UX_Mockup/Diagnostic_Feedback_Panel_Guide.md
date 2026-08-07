# 🚨 Diagnostic Feedback Panel (v1.0) - [아지트아트컴페니]
## 🎯 목표 및 적용 환경
*   **목표:** 비디오 편집 프로그램의 프리뷰 화면에 데이터 검증 결과를 시스템적인 '진단 보고서' 형태로 표시하여, 교육 콘텐츠의 신뢰도를 시각적으로 극대화한다.
*   **위치:** 메인 플레이어 하단/우측 사이드 패널 (전체 폭 300px 기준)

## 🎨 디자인 스펙 및 컴포넌트 구조
### 1. 기본 레이아웃 (`Container`)
*   **크기:** 가로 100%, 높이 250px (반응형 조정 가능).
*   **배경:** `#FFFFFF` (화이트) 또는 Dark Blue의 반투명 오버레이.

### 2. 상태별 모듈 스펙 (`Status Module`)
| 상태 | 배경색/강도 | 메인 헤더 색상 | 경고 표시 | 주요 메시지 영역 스타일 |
| :--- | :--- | :--- | :--- | :--- |
| **SUCCESS** | `#E6F3FF` (밝은 블루) | Dark Blue (`#0A2463`) | 녹색 체크 아이콘(✅) | Noto Sans KR, 회색 텍스트. 시스템 상태 보고용. |
| **WARNING** | `#FFFBE6` (밝은 노랑/크림) | Accent Yellow (`#FFD700`) | 주황색 삼각형 경고(⚠️) | Montserrat Bold, Dark Blue 텍스트. 사용자의 주의를 환기시키는 구조. |
| **FAILURE** | `#FFE8E6` (옅은 빨강) | Reddish-Orange (#CC523B) | 크리티컬 에러 아이콘(❌) | Montserrat Bold, Black 텍스트. 시스템 정지 수준의 문제 강조. |

### 3. 폰트 및 타이포그래피 스펙
*   **제목 (H1 - 진단 유형):** Montserrat Bold / Size: 18px / Color: Dark Blue (`#0A2463`)
*   **경고 메시지 (Headline):** Montserrat Bold / Size: 22px / Color: Accent Yellow (`#FFD700`)
*   **상세 설명 (Body):** Noto Sans KR / Size: 14px / Line Height: 1.6 / Background: `#F5F5F5`

### 4. 액션 요소 스펙 (CTA)
*   **버튼:** `[행동 유도 텍스트]`
    *   **스타일:** Accent Yellow (`#FFD700`) 배경, Dark Blue 테두리, 약간의 그림자 효과(Shadow).
    *   **Hover Effect:** 버튼 색상이 살짝 어두워지며 입체감을 부여.

## 💡 사용 예시 (Failure State Mockup)
**(예: Pitch Stability가 임계치를 벗어난 경우)**

[Diagnostic Report] - Critical Protocol Violation
<span style="color:#FFD700; font-size:22px;">⚠️ 피치 안정성 프로토콜 위반 감지</span>

(Error Code: DATA-PI-301)
지정된 데이터 범위(25~35Hz)를 벗어난 **최저 주파수(28.5Hz)**의 구간이 발견되었습니다. 이는 시스템 요구사항에 미달하며, 콘텐츠 무결성을 위협합니다.

[데이터 수동 보정하기] | [위반 감수하고 계속 진행 (권장 안 함)]