/**
 * @fileoverview Reels 1 콘텐츠에 필요한 모든 동적 마케팅 자산 및 진단 점수 API 계약서 (V3.0)
 * [Purpose] Designer의 비주얼 초안을 코드로 구현하기 위한 백엔드/프론트엔드 데이터 교환 표준 정의.
 */

// =========================================
// 1. Core Diagnosis Score Contract (HOOK / PAIN 구간용)
// 이 엔드포인트는 사용자 ID와 Context ID를 받아 실시간 진단 점수를 반환한다.
export interface BasicDiagnosisInput {
    userId: string; // 인증된 사용자 고유 ID
    contextId?: string; // 현재 콘텐츠 세션 ID (선택적)
}

/**
 * @api GET /api/v1/diagnosis_score
 * @param body BasicDiagnosisInput - 진단 점수 계산을 위한 최소한의 입력 데이터.
 * @returns DiagnosisScoreResponse - 사용자의 객관적 진단 결과를 포함한다.
 */
export interface DiagnosisScoreResponse {
    /** 전체 평균 대비 부족한 핵심 영역 (0~100점) */
    overallGapScore: number; 

    /** A/B 테스트 그룹에 따른 점수 차이 분석 결과. 이 값을 기반으로 색상과 메시지를 분기한다. */
    abTestGroupData: {
        groupName: 'Control' | 'Treatment'; // 예시 값
        scoreDeltaPercentage: number; // (진단점수 - 자가평가) * 100
        isSignificantlyLower: boolean; // 통계적으로 유의미하게 낮은지 여부 (Pain Point 판단 근거)
    };

    /** 진단 결과에 따라 가장 먼저 사용자에게 보여줘야 할 경고 메시지 */
    primaryWarningMessage: string;
}


// =========================================
// 2. Dynamic Marketing Asset Contract (PROBLEM / SOLUTION 구간용)
// 이 엔드포인트는 A/B 테스트 그룹과 콘텐츠 전환 단계(Stage)를 받아 최적의 마케팅 자산을 생성한다.
export enum AdCardTriggerStage {
    PRE_LOSS = 'pre_loss';     // Loss Area 진입 직전 (경고성)
    SOLUTION_FOCUS = 'solution_focus'; // Solution 제시 시점 (희망/가치 강조)
}

/**
 * @api POST /api/v1/dynamic_marketing_assets
 * @param body DynamicAssetInput - 자산 생성을 위한 필수 입력 데이터.
 * @returns DynamicAssetsResponse - 해당 단계에 맞는 최적화된 마케팅 자산 객체 배열.
 */
export interface DynamicAssetInput {
    userId: string; 
    abTestGroup: 'Control' | 'Treatment'; // A/B 테스트 그룹 명시 필수
    currentStage: AdCardTriggerStage; // 현재 Reels 콘텐츠의 논리적 단계 (Pain인지 Solution인지)
    diagnosisResultSummary: DiagnosisScoreResponse; // 이전 엔드포인트에서 받은 종합 점수 데이터
}

export interface DynamicAsset {
    assetType: 'AdCard' | 'CTA_Button' | 'HighlightGraph'; 
    // 자산 유형 정의. (예: 광고 카드, 최종 CTA 버튼, 그래프 강조)
    
    /** 해당 자산을 보여줘야 하는 이유와 근거 */
    displayRationale: string; 

    /** A/B 테스트 변수에 따라 달라지는 핵심 카피라이팅 */
    dynamicHeadline: {
        controlText: string; // Control 그룹용 문구
        treatmentText: string; // Treatment 그룹용 문구
    };

    /** 자산의 시각적 변화를 유도하는 데이터 (색상, 폭 등) */
    visualParameters: {
        primaryColorHex: string; // 예: '#E74C3C' (Loss Area Red)
        secondaryColorHex: string; // 예: '#2ECC71' (Gain Green)
        dimensionRatio: 'Widescreen' | 'Square'; 
    };

    /** 자산에 포함되어야 할 핵심 데이터 지표와 값 */
    kpiMetrics: {
        kpiName: 'Growth' | 'Engagement' | 'Monetization';
        currentValue: number; // 현재 수치 (예: 75%)
        targetThreshold: number; // 목표 기준값 (예: 80%)
    }
}

export interface DynamicAssetsResponse {
    assets: DynamicAsset[];
    // 로직 검증을 위한 API 버전 정보 포함
    apiVersion: 'v1.0'; 
}