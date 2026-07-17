// DiagnosticRequestPayload: 모든 진단 및 비즈니스 트래킹 데이터를 수용하는 통합 타입 정의
export interface DiagnosticRequestPayload {
    userContext: UserContext; // 사용자 컨텍스트 (ID, Role 등)
    diagnosisType: string;   // 수행한 진단 유형 (e.g., 'Growth', 'Engagement')
    rawInputData: any[];     // 원본 테스트 데이터 배열
    abTestPayload?: {         // A/B 테스트 및 Pricing 민감도 트래킹 객체
        mostInterestedModule: string | null; // 사용자가 가장 관심을 가진 모듈명 (e.g., 'Pitching', 'Harmony')
        priceTierViewed: string | null;     // 사용자가 조회한 가격 티어 ('Basic', 'Pro', 'Enterprise')
    };
}

// UserContext 및 DiagnosisResult 등 다른 관련 타입은 기존 파일을 참조합니다.