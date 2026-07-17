export interface DynamicContentResponse {
    headline: string; 
    subHeadline: string; 
    visualGuide: {
        type: 'chart' | 'icon' | 'video'; 
        description: string; 
        assetId: string;
    };
    ctaButton: {
        text: string; 
        actionUrl: string; 
        priority: 'high' | 'medium';
    };
    keyFeatureDescription: string;
}

export interface ContentGenerationRequest {
    ab_group: 'A' | 'B' | 'C';
    diagnosis_id: string;
    user_role: 'free' | 'premium';
}