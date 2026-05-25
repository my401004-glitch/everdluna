# 파일럿 고객 WTP 검증 CTA 매트릭스 (Ver 1.0)

## 목표: 학원 운영자에게 가장 효과적인 구매 유도 지점 및 가격 민감도 파악
## 테스트 대상: 스타터 패키지 (3개월 구독, 할인 적용)의 최적 판매 시나리오 확정.

---
### 🎯 **페인 포인트 자극 단계 (Phase 1: 문제 인식)**
**[핵심 질문]**: "현재 입시생들이 가장 부족한 것은 '개인의 재능'이 아니라, '데이터로 증명되는 객관적인 성장 서사(Narrative)'입니다. 이 서사를 만드는 데 시간이 많이 걸리죠?" [근거: 현빈 검증된 지식 - 2026-05-18]
**[운영자 반응 예상]**: "맞아요. 학생들 실력은 보이는데, 이걸 '합격'이라는 결과로 연결하는 객관적인 레포트가 부족해요." (Pain Point 확인)

### 📈 **솔루션 제시 단계 (Phase 2: 가치 증명)**
**[핵심 메시지]**: "저희 AI 시스템은 단순한 녹음 분석을 넘어, '잠재적 Gap Score'와 '최소 필수 학습 모듈 리스트(Minimum Viable Module List)'를 구체적인 그래프로 제시합니다. 이는 학생에게 ‘구체적으로 무엇을 해야 할지’라는 명확성을 제공하여, 학원의 코칭 시간을 획기적으로 절약해줍니다."
**[KPI 강조점]**: **시간 효율성 (Time Efficiency)** 극대화 및 **객관적 데이터(Objective Data)** 확보.

### 💰 **CTA/가격 테스트 단계 (Phase 3: 구매 결정 - A/B 테스트 그룹)**
학원 운영자의 지갑을 열게 할 '마지막 한 방' 시나리오를 3가지로 분리하여 테스트합니다.

**A. [가장 강력한 CTA] - 초기 현금 확보 집중:**
*   **시나리오**: "일단 진단만 받아보고, 가장 부족한 모듈 1~2개에 대한 **Trial Module (1개월 구독)**을 먼저 체험해보세요."
*   **전략적 이점**: 낮은 진입 장벽으로 일단 '구매 행동' 자체를 유도하여 LTV 파이프라인 시작.

**B. [가장 큰 가치] - 전체 서비스 로드맵 제시:**
*   **시나리오**: "저희 시스템의 모든 기능을 이용하시려면, 3개월 동안 **Starter Pack (할인 적용)**을 통해 전 과정을 설계하는 것을 추천합니다. 학원 운영자님의 가장 높은 ROI 지점입니다."
*   **전략적 이점**: 전체 구독 상품으로의 전환(Goal: LTV 극대화).

**C. [최소한의 리스크] - 무료 파일럿 프로그램:**
*   **시나리오**: "일단 저희가 제작한 **'진단 테스트 결과 보고서 템플릿'만**을 먼저 받아보시고, 이 자료를 활용할 수 있는 교육 워크숍(유료)에 참여하는 것이 가장 안전합니다." (최종 단계에서 유료 워크숍으로 연결)
*   **전략적 이점**: 구매 결정이 어려운 운영자에게 낮은 비용의 '교육'을 먼저 판매하여 신뢰 구축.

---
### ⚙️ 코다리: 모의 데이터 수집 스크립트 개발 (Mock Data Collection Script)

<create_file path="/Users/iyeongjae/Desktop/초보프로젝트/_company/mock_data_collection_script.py"># Mock API 테스트를 위한 학원 운영자 진단 시나리오 입력 파일
# 이 스크립트는 실제 고객의 답변을 받기 전, '어떤 데이터가 필요한지'에 대한 구조적 검증을 목표로 합니다.

import json
from datetime import datetime

def run_mock_data_capture():
    """
    학원 운영자에게 던질 Pain Point 질문과 예상되는 입력 데이터를 JSON 포맷으로 정의합니다.
    실제 API 연동 전, 데이터 수집 파이프라인의 구조를 테스트하는 것이 목적입니다.
    """

    print("--- [Mock Data Capture Script] ---")
    mock_data = {
        "session_id": f"mock_{datetime.now().strftime('%Y%m%d_%H%M')}",
        "target_profile": "Academic Academy Director (25-35세)",
        "pain_point_focus": "Time Efficiency & Measurable ROI", # 핵심 Pain Point 정의
        "questions_to_ask": [
            {
                "step": 1,
                "prompt": "현재 학생들의 성장 데이터를 수집하는 데 가장 많은 시간이 소요되는 단계는 무엇이며, 이 과정에서 발생하는 비효율을 점수(0-10)로 평가해주세요.",
                "expected_data_type": ["integer", "string"],
                "example_input": {"time_loss_area": "리포트 종합/분석", "efficiency_score": 8} # 높은 점수 = 큰 Pain Point
            },
            {
                "step": 2,
                "prompt": "현재 사용하는 진단 자료(예: 녹음 파일 분석)만으로는 부족한 '객관적인 지표'가 있다면 무엇이며, 이 지표를 확보할 경우 비용을 얼마까지 감수하시겠습니까?",
                "expected_data_type": ["string", "float"],
                "example_input": {"missing_metric": "호흡 패턴의 시간 경과에 따른 변화 추이", "max_willingness_to_pay": 50.0} # WTP 테스트 항목
            },
            {
                "step": 3,
                "prompt": "만약 저희 시스템을 도입한다면, 가장 먼저 해결하고 싶은 단 하나의 '핵심 과제(Gap Score)'를 지정해주세요.",
                "expected_data_type": ["string"],
                "example_input": {"priority_gap": "가창력의 일관성 부족 (Emotional Consistency)"}
            }
        ],
        "status": "Ready for Simulation Testing"
    }

    print(json.dumps(mock_data, indent=4))
    return mock_data

if __name__ == "__main__":
    run_mock_data_capture()