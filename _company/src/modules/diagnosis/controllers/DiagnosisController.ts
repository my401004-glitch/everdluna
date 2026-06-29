/**
 * 진단 점수 계산 및 API 요청을 처리하는 컨트롤러 (핵심 로직)
 */
import { Controller, Get, Param, Body, HttpStatus, HttpException } from '@nestjs/common';
import { DiagnosisInputDto, DiagnosisResultDto } from '../dto/DiagnosisResultDto';
// Mock 서비스 호출 가정: 실제 DB 접근 및 복잡한 비즈니스 로직을 분리합니다.
import { DiagnosticService } from '../services/DiagnosticService'; 

@Controller('api/v1')
export class DiagnosisController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  /**
   * @description 진단 점수 및 분석 결과를 도출하는 핵심 엔드포인트.
   * @param inputDto - 요청 바디에 담긴 진단 타입 및 사용자 정보.
   * @returns DiagnosisResultDto 형태의 최종 결과물.
   */
  @Get('diagnosis_score')
  async getDiagnosisScore(@Body() inputDto: DiagnosisInputDto) {
    // 1. [가드] 필수 입력값 검증 (Robustness)
    if (!inputDto || !inputDto.diagnosisType) {
      throw new HttpException('진단 타입을 반드시 제공해야 합니다.', HttpStatus.BAD_REQUEST);
    }

    try {
      // 2. [비즈니스 로직 실행] 서비스 계층에서 모든 복잡한 검증 및 계산 수행
      const result = await this.diagnosticService.calculateScore(inputDto.diagnosisType, inputDto.userId);
      return result; // 최종적으로 스키마가 지켜진 객체 반환
    } catch (error) {
      console.error('Diagnosis Score Calculation Failed:', error);
      // 3. [에러 핸들링] 비즈니스 로직 실패 시 사용자 친화적 에러 메시지 제공
      throw new HttpException('시스템 오류로 진단 결과를 도출할 수 없습니다. 관리자에게 문의하세요.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}