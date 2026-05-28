# 🚀 파일럿 프로그램 수익화 전략 및 KPI 정의 (Pilot Program Pricing & Success Criteria)

## 1. 핵심 목표
파일럿 테스트의 성공 기준을 **'기능이 작동하는가'**에서 **'수익 모델이 검증되는가'**로 변경합니다. 초기 참여자는 '선정된 대상'이라는 느낌을 주어 충성도를 높이고, 이를 바탕으로 이후 LTV(유료 전환) 를 증명합니다.

## 2. 가격 전략 (Pilot Pricing Model)
| 항목 | 상세 내용 |
| :--- | :--- |
| **초기 참여비 (Entry Fee)** | $49~$60 (예: 1 회성 파일럿 프로그램 참가비). 이 비용은 '진단 리포트'와 '1 대 1 멘토링 시간'을 포함합니다. 초기 현금 흐름(Cash Flow) 확보 및 CAC(고객 획득 비용) 분산용입니다. |
| **성공 후 전환 (Conversion)** | 파일럿 종료 시점, Gap Score 진단을 통해 '입시 합격 가능성'이 높음을 입증한 학생에게 Pro Student Plan ($39/월) 을 제안합니다. Entry Fee 중 $20 를 환급하거나 '1 개월 무료 구독' 조건으로 전환 유도합니다. |
| **B2B 파트너십 (Referral)** | 파일럿 학원 운영자에게 '성공 사례' 1 건당 추천 수수료(예: $30~$50) 를 지급하는 구조를 제안합니다. 이는 향후 B2B 확장용 채널 개발에 기여합니다. |

## 3. 성공 KPI 및 측정 지표
| KPI 항목 | 목표치 (파일럿 종료 시점) | 측정 방법 |
| :--- | :--- | :--- |
| **Conversion Intent** | 60% 이상 (Entry Fee 납부자 중 Pro Plan 구매 의도 조사 응답) | 파일럿 종료 후 설문지 (Likert 척도: '구매 의사' 질문 포함) |
| **Data Richness** | Gap Score, 호흡 효율성 등 핵심 지표 100% 수집 | 시스템 로그 및 데이터베이스 조회 (진단 모듈 실행 횟수 대비 저장된 데이터 비율) |
| **Unit Economics** | Entry Fee 수익 - 운영 비용 < $5 (1 인당) | 회계 명세서 (파일럿 프로그램별 수익/비용 분석) |

## 4. 다음 단계 (Action Items for Co-dari)
코다리에게 전달할 최소 기능 범위(MFS):
- **Data Collection API:** Gap Score, Pitch Deviation Index 등 핵심 지표 수집 로직 구현 (Entry Fee 납부자만 접근 가능한 엔드포인트).
- **Onboarding Flow:** Entry Fee 결제 후 바로 '진단 과제'를 제시하는 UI 흐름 (사용자가 가치를 느끼도록 유도).
- **Report Generation MVP:** 파일럿 종료 시점, Gap Score 진단 리포트를 자동으로 생성하여 PDF 로 출력하는 기능 구현.

---