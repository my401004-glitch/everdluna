import * as request from 'supertest';
import express from 'express';
import { DiagnosisScore } from '../../types/DiagnosisTypes'; // 가상의 타입 정의 파일
import { getMockApp } from './mockServerSetup'; // Mock 서버 설정 유틸리티

// 진단 점수 API의 통합 테스트 스펙
describe('API Integration Test: Diagnosis Score Contract Validation', () => {
  let app;

  beforeAll(() => {
    // 실제 서비스가 아닌, 테스트를 위한 목(Mock) Express 앱을 사용합니다.
    app = getMockApp(); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully return a diagnosis score object when valid input is provided', async () => {
    // [검증 시나리오 1] 일반적인 유효한 데이터 케이스 (성공)
    const mockPayload = {
      diagnosis_type: 'VOCAL_RANGE', // 진단 유형 지정
      context_id: 'user-abcde',
      input_data: {
        min_freq_hz: 150,
        max_freq_hz: 350,
        required_octaves: 2.5,
        // ... 기타 입력 데이터 필드
      }
    };

    const response = await request(app)
      .post('/api/v1/diagnosis_score') // 테스트할 엔드포인트
      .send(mockPayload)
      .expect(200);

    // [검증 내용] 응답 바디가 DiagnosisScore 스키마를 따르는지 확인합니다.
    expect(response.body).toHaveProperty('score'); 
    expect(typeof response.body.score).toBe('number'); // 점수는 반드시 숫자여야 함
    expect(response.body).toHaveProperty('key_improvement_area'); // 핵심 개선 영역 필드 필수

    // 추가 검증: 성장 지표가 유효한 범위에 있는지 확인 (Business Logic Contract)
    if (response.body.diagnosis_type === 'VOCAL_RANGE') {
        const scoreData = response.body as DiagnosisScore;
        expect(scoreData.growth).toBeGreaterThanOrEqual(0); // Growth는 0 이상이어야 함
        expect(scoreData.engagement).toBeLessThanOrEqual(100); // Engagement는 최대치 제한 확인
    }
  });

  it('should return a 403 Forbidden error if the user lacks access to the requested diagnosis type (RBAC check)', async () => {
    // [검증 시나리오 2] 권한 검사 실패 케이스 (RBAC)
    const restrictedPayload = {
      diagnosis_type: 'ADVANCED_HARMONY', // 유료/고급 진단 유형을 요청
      context_id: 'free-user-xyz', // 무료 사용자에게서 호출
      input_data: {}
    };

    await request(app)
      .post('/api/v1/diagnosis_score')
      .send(restrictedPayload)
      .expect(403); // 403 Forbidden 기대
  });

  it('should return a 422 Unprocessable Entity error if input data violates schema constraints', async () => {
    // [검증 시나리오 3] 데이터 형식 오류 케이스 (스키마 위반)
    const invalidPayload = {
      diagnosis_type: 'VOCAL_RANGE',
      context_id: 'user-abcde',
      input_data: {
        min_freq_hz: "NotANumber", // 숫자가 와야 할 곳에 문자열 입력 (타입 에러)
        max_freq_hz: 350,
        required_octaves: 2.5,
      }
    };

    await request(app)
      .post('/api/v1/diagnosis_score')
      .send(invalidPayload)
      .expect(422); // 422 Unprocessable Entity 기대
  });
});