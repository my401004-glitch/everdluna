/**
 * src/utils/dataValidator.ts
 * 
 * [Purpose] 디자인 아트워크의 시각적 요소(색상 강조, 애니메이션)가 의존하는 최소한의 데이터 계약을 정의하고 검증합니다.
 * 이 유틸리티는 API 응답 객체를 받아서, 필수 필드가 누락되었거나 타입이 잘못된 경우 즉시 에러를 발생시켜 렌더링을 막습니다.
 * @param data - 백엔드에서 받은 진단 결과 데이터.
 * @returns 검증된 데이터를 반환하거나, 실패 시 에러를 던집니다.
 */

export interface DiagnosisResult {
  // 핵심 메트릭 (KPI)
  growthScore: number; // 성취도 점수 (0~100). Gap Score 계산에 사용됨.
  engagementIndex: number; // 참여 지표. 낮은 값은 위험 신호로 활용.
  monetizationPotential: number; // 수익화 잠재력 지표. 텍스트 설명의 근거가 됨.

  // 필수 메타데이터 (Layout & Context)
  diagnosisType: 'vocational' | 'academic'; // 현재 진단 유형에 따라 레이아웃 분기 처리 필요
  contextId: string; // 이 리포트가 연결된 특정 학생/프로젝트 ID (추적성 확보).

  // Gap Score 계산을 위한 원본 데이터
  rawScoreData?: {
    timeSpentMinutes: number;
    feedbackCount: number;
    improvementRatePercent: number;
  };
}

/**
 * @description 백엔드 API 응답의 구조적 무결성을 검증하는 함수.
 * 모든 시각화 요소가 의존하는 데이터 필드의 존재 유무와 타입을 확인합니다.
 * @param data - 진단 결과 객체.
 * @throws {Error} 필수 필드가 누락되거나 타입이 틀릴 경우 발생.
 */
export const validateDiagnosisData = (data: any): DiagnosisResult => {
  if (!data) {
    throw new Error("❌ Data Validation Failed: Input data cannot be null or undefined.");
  }

  // 1. 필수 필드 존재 여부 검증
  const requiredFields: Array<'growthScore' | 'engagementIndex' | 'monetizationPotential' | 'diagnosisType' | 'contextId'> = [
    'growthScore', 
    'engagementIndex', 
    'monetizationPotential', 
    'diagnosisType', 
    'contextId'
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`❌ Data Validation Failed: Missing mandatory field '${field}' from the response.`);
    }
  }

  // 2. 타입 및 범위 검증
  const validateNumber = (key: keyof typeof data, min: number, max: number) => {
    const value = data[key];
    if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
      throw new Error(`❌ Data Validation Failed: Field '${String(key)}' must be a number between ${min} and ${max}. Received: ${value}`);
    }
  };

  // KPI 값 검증 (Growth Score는 0~100%가 일반적이라고 가정)
  validateNumber('growthScore', 0, 100);
  validateNumber('engagementIndex', 0, 100);
  validateNumber('monetizationPotential', 0, 100);

  // 3. 최종 데이터 구조 확정 및 반환 (Type Casting)
  const validatedData: DiagnosisResult = {
    growthScore: data.growthScore,
    engagementIndex: data.engagementIndex,
    monetizationPotential: data.monetizationPotential,
    diagnosisType: data.diagnosisType,
    contextId: String(data.contextId), // 안전하게 문자열로 변환
  };

  // 원본 데이터가 있다면 추가 검증
  if (typeof data.rawScoreData === 'object' && data.rawScoreData !== null) {
    validatedData['rawScoreData'] = data.rawScoreData;
  } else if (!data.rawScoreData) {
     console.warn("⚠️ Warning: rawScoreData is missing. Advanced visualization features might be limited.");
  }


  return validatedData;
};