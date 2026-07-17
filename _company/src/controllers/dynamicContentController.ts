import { Request, Response } from 'express'; // Express 프레임워크 사용 가정
import { DynamicContentService } from '../services/DynamicContentService';
import { ContentGenerationRequest } from '../interfaces/DynamicContentSchema';

/**
 * POST /api/v1/dynamic_content_generator
 * A/B 테스트 그룹과 진단 ID를 받아 동적 마케팅 콘텐츠 데이터를 반환하는 컨트롤러.
 */
export const getDynamicContent = async (req: Request, res: Response) => {
    try {
        // 1. 입력값 검증 (가드 로직): A/B 그룹, Diagnosis ID 등이 필수인지 확인
        const { ab_group, diagnosis_id, user_role } = req.body;

        if (!ab_group || !diagnosis_id) {
            return res.status(400).json({ error: "A/B 그룹과 진단 ID는 필수 입력값입니다." });
        }

        // 2. 요청 객체 구성
        const requestPayload: ContentGenerationRequest = { ab_group, diagnosis_id, user_role };

        // 3. 서비스 계층 호출 (핵심 로직 수행)
        const dynamicContentResponse = await DynamicContentService.generateContent(requestPayload);

        // 4. 성공 응답 반환 (디자이너/프론트엔드 사용자가 기대하는 형식)
        res.status(200).json(dynamicContentResponse);

    } catch (error) {
        console.error("콘텐츠 생성 중 오류 발생:", error);
        // 5. 에러 처리: 호출자에게 명확한 실패 사유를 전달
        res.status(500).json({ error: "동적 콘텐츠 데이터를 생성하는 데 실패했습니다.", details: (error as Error).message });
    }
};