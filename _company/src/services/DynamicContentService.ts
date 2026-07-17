import { DynamicContentResponse, ContentGenerationRequest } from '../interfaces/DynamicContentSchema';
// 가정: DB 연결 및 진단 결과 가져오기 함수가 존재한다고 가정합니다.
// import { getDiagnosisResultById } from '../db/diagnosisRepository'; 

/**
 * A/B 테스트 그룹과 진단 결과를 기반으로 마케팅 콘텐츠 변수를 생성하는 서비스 계층.
 * 이 곳에서 실제 비즈니스 로직(어떤 카피를 넣을지)이 구현됩니다.
 */
export const DynamicContentService = {
    /**
     * @param request - ContentGenerationRequest 타입의 요청 객체
     * @returns 동적으로 생성된 마케팅 콘텐츠 변수 구조 (DynamicContentResponse)
     */
    generateContent: async (request: ContentGenerationRequest): Promise<DynamicContentResponse> => {
        console.log(`[Service] A/B 그룹 ${request.ab_group}에 대한 콘텐츠 생성 시작...`);

        // 1. DB에서 진단 결과 데이터 가져오기
        // const diagnosisData = await getDiagnosisResultById(request.diagnosis_id);
        // if (!diagnosisData) throw new Error("진단 결과를 찾을 수 없습니다.");

        const { ab_group, diagnosis_id } = request;

        let headline: string;
        let subHeadline: string;
        let keyFeatureDescription: string;
        let visualGuideType: 'chart' | 'icon' | 'video';
        let ctaText: string;
        let ctaActionUrl: string;

        // 2. A/B 테스트 그룹에 따른 로직 분기 처리 (가장 중요한 비즈니스 로직)
        if (ab_group === 'A') {
            // [로직]: '가격 민감도'를 높인 가설 기반 콘텐츠 (예: 비용 절감 강조)
            headline = "합리적인 가격으로 전문성을 경험하세요.";
            subHeadline = "최소한의 투자로 최대의 성과를 내는 커리큘럼을 확인해보세요.";
            keyFeatureDescription = "월 구독 모델 기반의 합리적인 진도 관리 시스템";
            visualGuideType = 'chart'; // 비용 대비 효율 그래프
            ctaText = "가격 플랜 알아보기";
            ctaActionUrl = "/pricing/affordable";

        } else if (ab_group === 'B') {
            // [로직]: '권위'와 '성공 사례'를 강조한 가설 기반 콘텐츠
            headline = "업계 최고 강사진의 검증된 커리큘럼을 경험하세요.";
            subHeadline = "실제 합격생들의 성공 스토리와 체계적인 과정을 확인하세요.";
            keyFeatureDescription = "1:1 피드백이 포함된 전문가 케어 시스템";
            visualGuideType = 'video'; // 졸업식/성공 사례 영상
            ctaText = "성공 사례 더 보기";
            ctaActionUrl = "/case-study";

        } else { // ab_group === 'C'
            // [로직]: '결과'와 '명확한 목표 제시'에 초점을 맞춘 콘텐츠 (예: 구체적인 스킬 향상)
            headline = "3개월 만에 달라지는 보컬의 비밀을 발견하세요.";
            subHeadline = "정량적 데이터(Gap Score)로 측정하는 체계적인 성장 로드맵입니다.";
            keyFeatureDescription = "주간별 목표치와 진도 관리를 통한 명확한 성과 가시화";
            visualGuideType = 'icon'; // 스킬 레벨업 아이콘 애니메이션
            ctaText = "진단 테스트 시작하기";
            ctaActionUrl = "/free-diagnosis";
        }

        // 3. 최종 응답 객체 조합 및 반환
        return {
            headline: headline,
            subHeadline: subHeadline,
            visualGuide: {
                type: visualGuideType,
                description: `${ab_group} 그룹에 최적화된 시각 자료 (예: ${visualGuideType} 애니메이션)`,
                assetId: `V${Math.floor(Math.random() * 10) + 1}-${ab_group}` // 임시 Asset ID 생성
            },
            ctaButton: {
                text: ctaText,
                actionUrl: ctaActionUrl,
                priority: ab_group === 'C' ? 'high' : 'medium'
            },
            keyFeatureDescription: keyFeatureDescription
        };
    }
};