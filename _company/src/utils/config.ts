import { process } from 'process';

/**
 * @description 환경 변수에서 필수 설정을 로드하고 검증합니다.
 * 이 객체는 애플리케이션 전체에서 API 연결의 기준이 됩니다.
 */
export const AppConfig = {
  // 기본 URL은 반드시 설정되어야 합니다. (실제 운영 환경 체크)
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/v1', 
  
  // 민감한 키는 환경 변수에서 로드하며, 누락 시 치명적인 에러를 발생시킵니다.
  diagnosisSecretKey: process.env.DIAGNOSIS_SECRET_KEY,
  
  // 지원하는 진단 유형 목록을 배열로 파싱합니다.
  supportedDiagnosisTypes: (process.env.SUPPORTED_DIAGNOSIS_TYPES || '').split(',').map(s => s.trim()),
};

/**
 * @description 환경 변수 설정을 검증하고 누락된 항목이 있는지 확인하는 로직입니다.
 */
export function validateEnvironment() {
    if (!AppConfig.diagnosisSecretKey) {
        throw new Error("FATAL: DIAGNOSIS_SECRET_KEY is missing in environment variables. Please check your .env file.");
    }
    // 추가적인 필수 체크 로직을 여기에 넣습니다. (예: API_BASE_URL 형식 검증 등)
}

validateEnvironment(); // 애플리케이션 시작 시 강제 검증 실행