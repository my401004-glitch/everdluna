# 📊 Gap Score 진단 결과 페이지 디자인 스펙 가이드 (V1.0)
## 🎯 목표: Pain $\rightarrow$ Gain의 시각적 증명
이 가이드는 코다리(Developer)가 제공하는 API 데이터 구조에 기반하여, 사용자가 자신의 부족한 점을 인지하고(Pain), 우리가 제시하는 솔루션으로 극복할 수 있다는 확신(Gain)을 주는 인터랙티브 대시보드 목업의 기준입니다.

## 📄 페이지 레이아웃 (Desktop View 기준)
| 영역 | Component Name | 크기 (가상 좌표) | 목적/기능 | 적용 가이드 |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **Input Form** | Top 15% | 사용자 데이터 입력 (Pitch, Range 등). 초기 진입 지점. | Montserrat Bold / Dark Blue 배경. CTA는 Accent Yellow. |
| **B** | **Diagnosis Summary Card (Pain)** | Left 40%, Middle 30% | **현재 상태의 위험도(Risk Score) 시각화.** 가장 먼저 보여주어 위기감을 조성해야 합니다. | Pain 지표에 맞는 '경고색' 활용 필수. 그래프는 하락 추세 강조. |
| **C** | **Solution Insight Card (Gain)** | Right 30% | Gap Score를 통해 발견된 개선 방향 및 솔루션 제시. (우리가 가르쳐줄 것). | Dark Blue 배경에 Accent Yellow로 핵심 수치를 부각. '성장 가능성'을 강조. |
| **D** | **Detailed Metric Visualization** | Bottom 30% | 주요 KPI별 변화 그래프 (Before $\rightarrow$ After). | Noto Sans KR / Neutral Grey 배경. 시간의 흐름(X축)에 따른 데이터 추이를 Line Chart로 보여줍니다. |

## 💡 인터랙션 및 애니메이션 규칙
1.  **진입 시:** 페이지 로딩 시, **B 영역 (Pain)**이 가장 먼저 노출되며 낮은 스코어와 '위험' 경고가 강조됩니다.
2.  **데이터 전환:** 사용자가 [Run Diagnosis] 버튼을 누르면, B 영역의 점수가 계산되는 과정(로딩 애니메이션)을 거쳐 C 영역으로 **시선이 자연스럽게 이동하며 Gain Score가 부각**되어야 합니다 (기술적 흐름과 감성적 스토리텔링 동기화).
3.  **색상 변화:** 초기 진단 데이터가 낮은 스코어일수록 Accent Yellow의 점유율이 높아지고, 개선 목표치를 달성할 때마다 Dark Blue 영역의 비중이 커져야 합니다.

## ⚙️ 코다리 요청 API Data Schema (Design-Driven Request)
프론트엔드가 반드시 받아야 하는 최소 데이터 구조입니다.

```typescript
interface DiagnosisResult {
  gapScore: number; // 전체 Gap Score (0~100, 낮을수록 위험)
  painMetrics: { 
    metricName: string; 
    currentValue: number; 
    riskLevel: 'Low' | 'Medium' | 'High'; // B 영역에 사용
  }[];
  gainPotential: { 
    focusArea: string; 
    targetScore: number; 
    improvementRate: number; // C 영역에 사용
  };
  historicalData: { 
    metricName: string; 
    points: Array<{ stage: string; score: number }>; // D 영역의 Line Chart 데이터
  }[];
}
```