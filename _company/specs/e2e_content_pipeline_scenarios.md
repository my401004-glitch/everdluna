# 🧪 E2E 콘텐츠 생산 파이프라인 검증 시나리오 (Test Specification)

## 🎯 목표
데이터 진단 결과(KPI Metrics)를 입력으로 받아, 논리적으로 가장 설득력 있고 교육적인 구조의 영상 스크립트 및 타임라인을 출력하는 과정을 End-to-End로 검증한다.

## 📝 전제 조건 (Dependencies)
1.  **입력 데이터:** `Diagnosis_Results` 테이블에서 조회된 최종 KPI Metrics (`Growth`, `Engagement`, `Monetization`)와 원본 Context ID가 필수다.
2.  **핵심 로직:** 이 테스트는 단순히 데이터를 보여주는 것이 아니라, **데이터 패턴에 따른 '다음 액션 플랜'을 메시지로 변환하는 비즈니스 로직(Service Layer)**의 검증이다.

## 🧪 핵심 테스트 시나리오 (Test Cases)

| ID | Test Case Name | 입력 KPI 데이터 (예시) | 기대 결과 (Output Contract) | 검증 목표 |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **완벽한 성장 패턴 (Ideal)** | Growth: High, Engagement: High, Monetization: Mid | 1. 제목/훅: '지속 가능한 성장의 공식 공개' <br> 2. 메시지: "현재 추세 유지 및 A 영역 집중." <br> 3. Timeline: 성공 사례 제시 $\rightarrow$ 다음 단계 가이드 (Low Risk) | 최적의 데이터 패턴을 가장 긍정적인 스토리텔링으로 전환하는가? |
| **TC-02** | **위험 경고 패턴 (Critical)** | Growth: Low, Engagement: High, Monetization: Low | 1. 제목/훅: '⚠️ 이 지표를 놓치면 학원이 위험합니다.' <br> 2. 메시지: "당장 B 영역의 문제를 해결해야 합니다." <br> 3. Timeline: 문제점 제시 $\rightarrow$ 원인 분석 $\rightarrow$ 즉각적인 액션 플랜 (High Urgency) | 경고 신호가 발생했을 때, 사용자에게 공포감과 동시에 구체적인 해결책을 제시하는가? |
| **TC-03** | **불균형 패턴 (Imbalance)** | Growth: High, Engagement: Low, Monetization: High | 1. 제목/훅: '성장만 믿으면 안 되는 이유' <br> 2. 메시지: "현재 성장은 일시적입니다. 지속 가능성을 위한 C 영역 확보가 시급합니다." <br> 3. Timeline: 성공 지표 제시 $\rightarrow$ 약점(Engagement)의 정의 및 해결책 모색 (Gap Analysis 중심) | 특정 KPI만 높고 다른 것이 낮은 경우, 어떤 관점에서 불균형을 설명할 것인가? |
| **TC-04** | **데이터 부족/미정 패턴 (Edge Case)** | 모든 KPI: Null 또는 Missing | 1. 제목/훅: '데이터 분석이 필요한 이유' <br> 2. 메시지: "현재 데이터가 불완전하여 정확한 진단이 어렵습니다." <br> 3. Timeline: 테스트 완료 및 서비스 가입 유도 (CTA 중심) | 입력 데이터 자체가 불안정할 때, 시스템 크래시 없이 사용자에게 명확하게 안내하는가? |

### 💻 [2단계] 기술적 구현 계획: 핵심 서비스 레이어 정의

위 시나리오를 성공적으로 수행하려면, `diagnosisController.ts`와 같은 컨트롤러 계층이 아닌, 비즈니스 로직만을 담는 **순수 함수(Pure Function) 기반의 'Content Generator Service'**가 필요합니다.

#### 1. 인터페이스 (API Contract):
*   **엔드포인트:** `POST /api/v1/generate_video_script`
*   **입력 바디:** `{ contextId: string, kpis: { growth: number, engagement: number, monetization: number } }`
*   **출력 바디 (Schema):**
    ```typescript
    interface VideoScriptOutput {
      titleHook: string; // [🚨필독] 이런 형식의 훅 제목
      coreMessage: string; // 핵심 주장 및 진단 내용
      timelineStructure: TimelineStep[]; // 시간대별 구성 요소 배열
      ctaText: string; // 최종 CTA 문구 (무료 컨설팅 등)
    }

    interface TimelineStep {
      timeRangeSeconds: number; // 예: 0s - 30s
      sectionType: 'Problem_Statement' | 'Evidence_Data' | 'Solution_Guide' | 'Conclusion';
      visualComponent: string; // 예: 'Statistic Card', 'Graph Animation'
      narrationScript: string; // 이 구간의 음성 스크립트
    }
    ```

#### 2. 필요한 개발 작업 (Action Plan):
이 계약을 구현하기 위해, 저는 다음 파일을 생성하고 API 로직을 정의하겠습니다.

<create_file path="src/services/contentGeneratorService.ts">/**
 * @fileoverview Content Generator Service: KPI 데이터를 받아 영상 스크립트 및 타임라인을 구조화하는 핵심 비즈니스 로직 (Pure Function).
 * 이 서비스는 외부 데이터베이스 접근 없이 오직 입력된 KPI 값만을 기반으로 콘텐츠 논리를 생성해야 합니다.
 */

import { VideoScriptOutput, TimelineStep } from '../types/videoTypes';

/**
 * 진단 결과를 바탕으로 영상 스크립트 전체를 구조화합니다. (핵심 로직)
 * @param kpis - Growth, Engagement, Monetization의 최종 수치 데이터.
 * @returns 생성된 VideoScriptOutput 객체.
 */
export function generateVideoScript(kpis: { growth: number; engagement: number; monetization: number }): VideoScriptOutput {
    // 🚨 중요: 모든 비즈니스 로직은 여기에 작성되어야 합니다.
    // 예를 들어, 만약 Growth가 높고 Engagement가 낮으면 (TC-03), '지속 가능성'에 초점을 맞춘 메시지를 반환해야 합니다.

    let titleHook: string;
    let coreMessage: string;
    let timelineStructure: TimelineStep[] = [];
    let ctaText: string;

    // 1. 데이터 패턴 분석 및 핵심 주장 도출 (가장 복잡한 로직)
    if (kpis.growth < 0.5 && kpis.engagement > 0.8) { // TC-02 예시 조건
        titleHook = "🚨필독: 이 학생, 다음 달에 학원을 떠날 확률이 높은 결정적 지표가 있습니다.";
        coreMessage = "지금 가장 시급한 문제는 '성장 속도'가 아니라 '유지력(Engagement)' 확보입니다. 즉각적인 개입이 필요합니다.";
        ctaText = "무료 진단 보고서를 받아 위험 요소를 분석하세요.";

        // 2. 타임라인 구성 (강조점: 문제 제기 -> 원인 분석 -> 해결책)
        timelineStructure = [
            { timeRangeSeconds: 0, sectionType: 'Problem_Statement', visualComponent: 'Urgency Title Card', narrationScript: titleHook },
            { timeRangeSeconds: 15, sectionType: 'Evidence_Data', visualComponent: 'KPI Trend Graph (Low Growth)', narrationScript: "데이터를 보면..." },
            // ... 나머지 단계 구현
        ];

    } else if (kpis.growth > 0.8 && kpis.engagement > 0.7) { // TC-01 예시 조건
        titleHook = "📈지속 가능한 성장의 공식: 데이터로 증명하는 학생 관리법";
        coreMessage = "성장과 참여가 균형을 이루는 '황금 비율'을 찾아야 합니다.";
        ctaText = "우리 학원의 최적화된 성장 로드맵을 무료 컨설팅으로 확인하세요.";

        // 2. 타임라인 구성 (강조점: 성공 사례 제시 -> 유지 방법 안내)
        timelineStructure = [
            { timeRangeSeconds: 0, sectionType: 'Problem_Statement', visualComponent: 'Positive Title Card', narrationScript: titleHook },
            // ... 나머지 단계 구현
        ];

    } else { // TC-04 및 기본 케이스 처리
        titleHook = "🔎우리 학원 학생의 잠재력을 데이터로 발견하는 방법";
        coreMessage = "정확한 진단을 위해서는 더 많은 Context와 시간이 필요합니다. 저희가 도와드리겠습니다.";
        ctaText = "무료 심층 진단 테스트를 신청하세요.";
        timelineStructure = [
            // ... 기본 구조 구현
        ];
    }

    return {
        titleHook,
        coreMessage,
        timelineStructure,
        ctaText
    };
}