# 📄 AI 진단 파이프라인 기술 사양서 (Technical Spec) - V2.0: Compliance & Legal Integration

## 🎯 개요 및 목표
본 문서는 실용음악 입시생의 보컬 분석을 수행하는 AI 진단 시스템의 전체 아키텍처를 정의합니다. V2.0에서는 핵심적인 비즈니스 요구사항인 **법률 검토(Legal Review)** 과정을 공식적으로 통합하여, 모든 진단 결과가 법적/윤리적 안정성을 확보했음을 증명할 수 있도록 합니다.

## ⚙️ 시스템 아키텍처 (High Level Flow)
1.  **Input:** 사용자 데이터 및 녹음 파일 입력 $\rightarrow$
2.  **Analysis Layer (Service):** 진단 로직 수행, KPI 산출 및 Gap Score 계산 $\rightarrow$
3.  **Verification Layer (NEW):** **[핵심]** 법률/컴플라이언스 검토 모듈 호출. 해당 결과에 따라 `Compliance_Verification` 레코드 생성 및 승인 여부 확정. $\rightarrow$
4.  **Data Storage:** 최종 진단 결과와 컴플라이언스 기록을 분리하여 저장 (트랜잭션 관리).
5.  **Output:** API를 통해 법적 검증이 완료된 데이터를 프론트엔드로 전송.

## 📚 데이터베이스 스키마 설계 (Schema Design - Part 2)

### A. [Core Tables]
*   **Diagnosis_Results (수정):**
    *   `result_id`: PK
    *   `user_id`: FK
    *   ...
    *   `diagnosis_type`: VARCHAR
    *   `result_data`: JSONB **(필수 추가 필드: `compliance_status` - Enum/String)**
    *   `compliance_record_id`: FK (New)

### B. [NEW] Compliance Tracking Tables
1.  **Compliance_Verification:**
    *   `verification_id`: PK
    *   `result_id`: FK (Diagnosis_Results)
    *   `review_type`: ENUM ('LEGAL', 'ETHICS', 'POLICY') - 검토 유형 정의
    *   `is_compliant`: BOOLEAN - 최종 법적 준수 여부 (TRUE/FALSE)
    *   `approved_by_role`: VARCHAR - 승인한 역할 (예: LEGAL_TEAM, PM)
    *   `review_date`: TIMESTAMP
    *   `legal_basis_document_id`: VARCHAR - 근거가 된 내부 법규/문서 ID

2.  **Legal_Principles:**
    *   `principle_id`: PK
    *   `name`: VARCHAR - 원칙 이름 (예: "데이터 비식별화 원칙")
    *   `description`: TEXT - 상세 설명
    *   `related_to_diagnosis`: BOOLEAN - 이 원칙이 진단에 직접적으로 관련되는지 여부

## 💻 API 엔드포인트 요구사항 (API Contract)

### Endpoint: `GET /api/v1/diagnosis_score`
**Function:** AI 분석 로직을 실행하고, 법적 검증 단계를 포함하여 최종 점수를 반환한다.

**Request Parameters:**
*   `user_id`: 사용자 ID (필수)
*   `file_url`: 진단할 녹음 파일 URL (필수)
*   ...

**Response Body (JSON Example):**
```json
{
  "success": true,
  "score_details": {
    "gap_score": 78.5,
    "kpi_metrics": {
      "growth": 0.6,
      "engagement": 0.9,
      "monetization": 0.4
    },
    // V2.0 추가 필드: 법적 검증 상태 통합
    "legal_compliance": "VERIFIED", // Enum: VERIFIED, PENDING, REJECTED
    "verification_details": {
        "id": "comp-12345",
        "review_type": "LEGAL", 
        "message": "데이터 사용 및 분석 범위가 개인정보보호법을 준수합니다.",
        "related_principles": ["data_anonymization", "consent_scope"]
    }
  },
  "recommendation": "다음 단계는 ...",
  "timestamp": "2026-06-12T..."
}
```

## 🔑 구현 시 중요 체크리스트 (Codeari Checkpoints)
*   **[Critical] 트랜잭션 관리:** 진단 점수 저장 및 `Compliance_Verification` 기록은 반드시 하나의 원자적(Atomic) 트랜잭션으로 처리되어야 합니다. 하나라도 실패하면 전체 작업이 롤백 되어야 합니다.
*   **RBAC 연동:** 컴플라이언스 검토는 일반 사용자 기능이 아니므로, 해당 기능을 호출하는 API 접근에 대해 **최상위 관리자 역할(Admin Role)**만 허용해야 합니다.