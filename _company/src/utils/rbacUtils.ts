export function canAccessReport(diagnosisType: string, userRole: Role): boolean {
    // RBAC 로직 구현 예시: 무료 사용자는 Engagement 리포트만 접근 가능하다고 가정
    if (userRole === 'FREE') {
        return diagnosisType === 'ENGAGEMENT';
    }
    // 그 외 모든 역할은 기본적으로 접근 허용 (유료 모델 확정 시 조정 필요)
    return true; 
}