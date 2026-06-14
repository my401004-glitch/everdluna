# 🎓 AI 기반 학습 추천 시스템 (Curriculum Engine) 명세서

## 🎯 1. 목적 및 목표
본 엔진은 사용자가 진단받은 데이터(Diagnosis_Results)를 바탕으로, 현재 가장 부족하거나 성장이 필요한 영역을 식별하고, 해당 영역에 최적화된 **'학습 콘텐츠 모듈'**의 순서와 내용을 추천하는 것을 목표로 합니다.

*   **핵심 원리:** Gap Score $\rightarrow$ Weakness Identification $\rightarrow$ Remediation Path 제시
*   **KPI 연결:** 진단 결과(Diagnosis_Results)가 어떤 KPI(`Growth`, `Engagement`, `Monetization`)에 영향을 미쳤는지 분석하여, 가장 큰 개선 폭이 필요한 영역을 최우선 학습 모듈로 지정합니다.

## ⚙️ 2. 데이터 입력 (Input Contract)
엔진은 다음의 구조화된 데이터를 입력으로 받습니다.

1.  **Diagnosis_Results:** 사용자의 진단 결과 전체 JSON 스키마. [근거: sessions/2026-05-18T14-34/developer.md]
    *   필수 포함 필드: `diagnosis_type`, `failed_kpis` (어떤 KPI가 실패했는지 리스트), `weakness_areas` (구체적인 취약점 키워드).
2.  **User Profile:** 사용자의 현재 레벨, 구독 상태 등 RBAC 체크에 필요한 정보. [근거: sessions/2026-05-18T13:43/developer.md]

## 🚀 3. 핵심 로직 플로우 (The Core Logic)
**A. 진단 및 분석 단계 (Analysis Phase)**
1.  `failed_kpis` 리스트를 순회하며, 가장 점수 하락 폭이 크거나(Magnitude), 사용자가 접근 권한을 가지고 있으나 미진행된(`RBAC 체크 필요`) KPI 그룹을 식별합니다.
2.  식별된 KPI들을 매핑하여, 해당 문제를 해결하기 위한 **'핵심 학습 주제 (Core Topic)'**를 추출합니다.

**B. 콘텐츠 추천 단계 (Recommendation Phase)**
1.  추출된 '핵심 학습 주제'에 따라 미리 정의된 모듈 풀(Module Pool)에서 최적의 경로를 찾아냅니다.
2.  경로는 반드시 **[문제 제시] $\rightarrow$ [원리 설명/예시 제공] $\rightarrow$ [실습 문제]** 순서로 구성되어야 합니다.

**C. 출력 및 안내 단계 (Output Phase)**
1.  사용자에게 추천 모듈의 목록과 각 모듈을 학습함으로써 얻게 될 기대 효과(Expected Gain)를 명확히 제시합니다. 이 과정에서 **Accent Yellow (`#FFD700`)** 색상을 사용하여 '다음 행동'에 대한 시선 집중을 유도해야 합니다.

## 🎨 4. 콘텐츠 모듈 구성 예시 (Module Definition Example)
| Module ID | 주제 (Topic) | 난이도 | 목표 KPI | 예상 소요 시간 | 비주얼 연출 포인트 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MOD-01 | 기초 리듬 구조 분석 | 초급 | Engagement | 5분 | *Pain:* 복잡한 박자표가 깨지는 모션 / *Gain:* 정렬된 시각적 패턴 |
| MOD-02 | 코드 진행의 화성학 원리 | 중급 | Growth | 10분 | *Process:* 음계와 코드 관계를 그래프로 점진적 확장 (모션 그래픽 필수) |
| MOD-03 | 장르별 창작 기법 심화 | 고급 | Monetization | 20분 | *Action:* 실제 작곡 DAW 화면을 활용한 시뮬레이션 인터페이스 제공 (가상 API 연동) |

---

### [기술적 검증 및 후속 조치]
이 명세서(`Curriculum_Engine_Spec.md`)는 다음의 기술적 구현 단계를 요구합니다:

1.  **백엔드:** 추천 로직을 처리하는 새로운 컨트롤러/서비스 레이어 (`RecommendationService`) 개발 필요. [근거: sessions/2026-05-18T14-34/developer.md]
2.  **프론트엔드:** 추천된 모듈 목록을 표시하고, 사용자가 학습 경로를 '선택'할 수 있는 UI 컴포넌트 개발 필요. [근거: sessions/2026-05-19T10:29]

이 문서를 바탕으로 다음 사이클에서는 이 로직에 맞는 Mock API 스크립트를 업데이트하고, 이를 시각화하는 프론트엔드 컴포넌트 구현을 시작하겠습니다.