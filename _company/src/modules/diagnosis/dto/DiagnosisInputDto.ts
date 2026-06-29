/**
 * 진단 API 요청 바디 정의 (요청 파라미터)
 */
import { IsString, IsOptional } from 'class-validator';

export class DiagnosisInputDto {
  @IsString()
  readonly diagnosisType: string; // 예: "VOCAL_GROWTH", "PERFORMANCE_SKILL"

  @IsOptional()
  readonly userId: string; // 현재 인증된 사용자 ID (RBAC 체크에 사용)
}