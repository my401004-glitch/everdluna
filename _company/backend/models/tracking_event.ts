/**
 * @description 사용자 행동 추적 이벤트 기록 모델 (Tracking Events)
 * 이 모델은 모든 외부 접점에서 발생하는 유효한 상호작용(클릭, 다운로드, 특정 페이지 진입 등)을 기록하여 KPI 산출의 기초가 됩니다.
 */
export interface TrackingEvent {
    /** Unique ID for the event. */
    event_id: string; 
    
    /** Foreign Key to the user who triggered the event. (nullable if anonymous) */
    user_id?: string | null; 
    
    /** The specific source of traffic/action (e.g., youtube, instagram, google). */
    source: 'youtube' | 'instagram' | 'google' | 'direct';
    
    /** The campaign or content series name (e.g., Part2_Reels, FreeChecklistDownload). */
    campaign_name: string;
    
    /** 
     * UTM Parameter tracking data. 필수적으로 포함되어야 하는 매개변수입니다.
     * 예: ?utm_source=youtube&utm_medium=reel&utm_campaign=part2
     */
    utms?: { [key: string]: string };

    /** 
     * The specific point in the funnel this event represents (e.g., 'viewed_hook', 'clicked_cta').
     * 이는 CTR 계산의 분모와 분자를 결정합니다.
     */
    funnel_step: 'initial_engagement' | 'data_interest' | 'conversion_attempt';

    /** 
     * 이벤트가 발생한 시점 (UTC 기준). 시간 추적은 필수입니다.
     */
    timestamp: Date;

    /** 
     * 해당 행동이 얼마나 가치가 있는지 점수화합니다 (예: 1~5점). 
     * 데이터 분석가가 후처리하여 활용할 수 있도록 합니다.
     */
    engagement_score?: number;
}