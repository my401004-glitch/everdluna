// ⚙️ 초기 API 연결 구조 정의 파일 (Mockup 및 인터페이스)
export const API_BASE_URL = "/api/v1"; // 백엔드 API 경로 가정

export interface DiagnosisService {
  getDiagnosisScore(diagnosisId: string): Promise<ApiDiagnosisResponse>;
}

// 실제 구현은 백엔드와 연동되므로, 여기서는 인터페이스만 정의합니다.
export class DiagnosisServiceImplementation implements DiagnosisService {
  async getDiagnosisScore(diagnosisId: string): Promise<ApiDiagnosisResponse> {
    console.log(`[API Call] Fetching diagnosis for ID: ${diagnosisId}`);
    // TODO: 실제 API 호출 로직을 여기에 구현합니다. (백엔드 연결 예정)
    throw new Error("API Implementation not yet connected.");
  }
}