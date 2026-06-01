# 📊 현빈 KPI 대시보드 설계안 (v1.0)

## 목적: B2B 수익화 전략을 숫자로 증명하는 시각화 자료 생성

### 1 단계: 수익화 흐름도 (Revenue Flow Diagram)
```mermaid
graph TD
    A[YouTube 무료 Gap Score 진단] -->|CTA 버튼 클릭 | B(데모 페이지 리디렉션)
    B --> C[B2C 구독자 등록 / B2B 데모 신청]
    C --> D{유형별}
    D -->|B2C 개인 | E[Starter Pack ₩39,000/월]
    D -->|B2B 아카데미 | F[PoC 데모 매뉴얼 → Enterprise Pack 협상]
    
    subgraph 수익화 모듈 [현금 흐름]
        E --> G{이탈 방지}
        G -->|Starter Pack 3개월 할인| H[₩10,800 추가 매출/인당]
        F --> I[아카데미 연간 계약]
        I --> J[평균 ₩540,000/계약 건 (12 개월 기준)]
    end
    
    G -.-> K[LTV 극대화: 6 개월 유지율 75% 목표]
    J -.-> K
```

### 2 단계: ROI 계산기 시각화 구성 요소
| 섹션 | 표시 내용 | 연동 데이터소스 |
|------|-----------|-----------------|
| Gap Score 진단 결과 | 현재 레벨 vs 목표 레벨 차트 | `developer.md` Mock API |
| 아카데미 계약 건수 | 월별 계약 트렌드 (선 그래프) | 실제 매출 DB (PayPal 연동 후) |
| YouTube 데모 페이지 방문자 수 | CTR, Conversion Rate, Source breakdown | 유튜브 분석 + 구글 애널리틱스 |
| 개별 학생 LTV 예측 | 3 개월 유지율 × 월 구독료 × 신규 유입 | `business.md` 가격 전략 |

### 3 단계: 다음 액션 (48 시간 내 완료)
1. **Designer** → PoC 데모 매뉴얼의 비주얼 가이드라인 적용 및 대시보드 목업 생성  
   - 산출물: `sessions/2026-06-01T08-50/poC_visual_mockup.fig`
2. **코다리** → Gap Score 진단 Mock API 데이터 최종 완성 (데모 페이지 연동용)  
   - 산출물: `developer.md` + 실제 응답 JSON 파일

📊 평가: 진행중 — YouTube 데이터를 기반으로 CTR/Conversion Rate 측정 전략을 수립하는 중입니다