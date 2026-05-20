import { ContentManifest } from '../types/ContentManifest';

/**
 * @description ContentManifest의 구조적 유효성을 검증하는 전용 Validator 클래스.
 * 데이터 파이프라인 안정성 확보를 위해 필수적으로 실행되어야 합니다.
 */
export class ManifestValidator {
  private manifest: Partial<ContentManifest> | null = null;

  /**
   * @param manifest - 검증할 ContentManifest 객체.
   */
  constructor(manifest: Record<string, any>) {
    this.manifest = manifest;
  }

  /**
   * 모든 필수 필드를 순회하며 유효성을 검사합니다.
   * @returns boolean: 검증 성공 여부
   * @throws Error: 특정 필드에 대한 구체적인 에러 메시지 발생 시
   */
  public validate(): boolean {
    const manifest = this.manifest;
    if (!manifest) {
      throw new Error("Validation Failed: ContentManifest가 제공되지 않았습니다.");
    }

    // 1. 필수 필드 존재 여부 체크
    const requiredFields: (keyof ContentManifest)[] = [
      'videoTitle', 'videoDescription', 'thumbnailPath', 'diagnosisContextId', 
      'primaryGapScoreMetric', 'gapVisualizationDataPointA', 'gapVisualizationDataPointB', 
      'creationDate'
    ];

    for (const field of requiredFields) {
      if (!manifest[field] || String(manifest[field]).trim() === "") {
        throw new Error(`Validation Failed: 필수 필드 '${field}'가 누락되었거나 비어 있습니다.`);
      }
    }

    // 2. 데이터 형식 및 논리적 유효성 체크 (KPI 등)
    if (typeof manifest['gapVisualizationDataPointA'] !== 'number' || typeof manifest['gapVisualizationDataPointB'] !== 'number') {
        throw new Error("Validation Failed: Gap Visualization 데이터는 반드시 숫자(Number)여야 합니다.");
    }

    // 3. A/B 테스트 변수 배열 체크 (선택적 필드라도 구조가 맞는지 확인)
    if (manifest['abTestVariables'] && !Array.isArray(manifest['abTestVariables'])) {
        throw new Error("Validation Failed: abTestVariables는 반드시 배열(Array) 형태여야 합니다.");
    }

    console.log("✅ ContentManifest Validation Passed. 시스템이 다음 단계로 진행할 준비가 되었습니다.");
    return true;
  }
}