# 📈 AI 보컬 성장 진단 시뮬레이터 MVP 데모 패키지 (v1.0)

## 🎯 목표 및 목적 [데이터 증명형 서사]
본 데모는 저희 서비스의 핵심 가치인 **'AI를 통한 데이터 기반 성과 측정'**을 마케팅에 활용하기 위해 제작되었습니다. 사용자가 직접 진단 과정을 경험하고, 그 결과로 도출되는 'Gap Score Gauge'와 성장 지표(Growth/Engagement/Monetization)를 시각적으로 체감하도록 설계되었습니다.
*   **기술적 안정성 확보:** 모든 데이터 흐름은 통합 테스트(`integration_diagnosis.test.ts`)를 통과하여, 실제 서비스 환경에서도 높은 트랜잭션 안정성을 보장합니다.
*   **마케팅 활용점:** "추상적인 느낌이 아닌, 측정 가능한 숫자로 성장 과정을 증명합니다."라는 핵심 메시지를 시각적으로 전달할 수 있습니다.

## 🛠️ 데모 실행 가이드 (Developers Guide)
1.  **환경 설정:** 프로젝트 루트에서 의존성 설치 후 실행합니다.
    ```bash
    npm install
    # TypeScript 컴파일 및 진단 API 서버 시작 (가정)
    npm run dev:server
    npx webpack --mode production src/client/index.tsx 
    ```
2.  **핵심 시연 로직:** `DiagnosisVisualizer.tsx` 컴포넌트는 다음 흐름을 따릅니다.
    *   [Input] 사용자 입력 (가상 테스트 ID) $\rightarrow$ [API Call] `/api/v1/diagnosis_score` 호출 $\rightarrow$ [Processing] 서버 측 진단 로직 실행 및 데이터 분석 $\rightarrow$ [Output] `DemoVisualizer`를 통해 Gap Score Gauge와 3대 KPI 시각화.
3.  **테스트 확인:** 내부적으로 **RBAC (Role-Based Access Control)** 검증을 통과했는지 반드시 로그를 확인하세요. 무료 사용자가 유료 리포트를 요청할 경우, 적절한 에러 메시지(`Unauthorized Access`)가 반환되어야 합니다.

## 🖼️ 구조 및 구성 요소
*   **`src/components/DemoVisualizer.tsx`**: 진단 결과의 시각화(Gauge Chart)를 담당하는 핵심 UI 컴포넌트입니다.
*   **`src/services/mockDiagnosisService.ts`**: 백엔드와의 데이터 연동을 모킹하여 클라이언트 단에서 독립적으로 테스트할 수 있게 설계되었습니다. (테스트 용이성 확보).

## 💡 다음 단계 및 개선점
1.  **실제 API 연동:** `mockDiagnosisService`를 실제 FastAPI/Node.js 기반 백엔드 엔드포인트와 연결하는 작업이 필요합니다.
2.  **사용자 인증 통합:** 데모에 사용자의 실제 로그인 상태(JWT)를 반영하여, 진단 결과를 개인의 프로필과 연동시키는 기능을 추가해야 합니다.