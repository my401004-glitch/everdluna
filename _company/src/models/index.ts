export interface UserContext {
    userId: string;
    tier: 'Basic' | 'Pro' | 'Enterprise';
    usage_count: number;
}

export interface PerformanceHistory {
    history_id?: string;
    user_id: string;
    context_type: string;
    diagnosis_result_id?: string;
    attempted_access_kpi?: string | null;
    is_restricted: boolean;
    recorded_at?: Date;
    metric_value?: any;
    session_type?: string;
}
