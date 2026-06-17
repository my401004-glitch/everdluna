# 서비스 레이어의 핵심 비즈니스 로직이 위치합니다.
from typing import Dict, Any
from datetime import datetime

class DiagnosisService:
    """
    진단 결과 처리 및 KPI 추적을 담당하는 핵심 비즈니스 서비스.
    트랜잭션 원자성을 보장해야 합니다 (DB 트랜잭션 관리 필요).
    """

    def __init__(self, db_connection):
        # DB 연결 객체 주입 가정
        self.db = db_connection 

    async def process_diagnosis(self, user_id: int, diagnosis_type: str, raw_data: Dict[str, Any], role: str) -> Dict[str, Any]:
        """
        1. 권한 체크 (RBAC)를 수행합니다.
        2. 진단 결과를 계산하고 DB에 저장(Diagnosis_Results).
        3. KPI 데이터를 추출하여 별도 테이블에 저장(KPI_Metrics).
        4. 트랜잭션을 커밋하거나 롤백합니다.
        """
        # --- 1. 권한 체크 (RBAC) ---
        if role not in ["Premium", "Pro"] and diagnosis_type == "Monetization":
            raise PermissionError("이 진단 타입은 무료 사용자에게는 접근 제한됩니다.")

        # --- 2. 데이터 유효성 검증 (Schema Validation) ---
        # raw_data가 정의된 JSON 스키마를 따르는지 확인하는 로직 추가 필요
        if not self._validate_schema(raw_data):
             raise ValueError("제공된 진단 데이터의 스키마가 유효하지 않습니다.")

        # --- 3. 트랜잭션 시작 및 실행 (실제 DB 커넥션을 사용한다고 가정) ---
        try:
            # [1] Diagnosis_Results 저장
            result_id = await self._save_diagnosis_results(user_id, diagnosis_type, raw_data)

            # [2] KPI 추출 및 별도 테이블 저장 (원자성 확보의 핵심)
            kpis = self._extract_kpis(raw_data)
            await self._save_kpi_metrics(result_id, kpis)

            return {"success": True, "diagnosis_id": result_id, "message": "진단 및 KPI 추적 성공"}
        except Exception as e:
            # 에러 발생 시 모든 작업 취소 (Rollback)
            print(f"🚨 트랜잭션 실패. 롤백 진행: {e}")
            raise

    def _validate_schema(self, data: Dict[str, Any]) -> bool:
        """실제 JSON 스키마를 따르는지 검증하는 가상 메서드."""
        # 실제 구현 시 Pydantic 또는 같은 라이브러리 사용 권장
        return 'score' in data and isinstance(data['score'], (int, float))

    async def _save_diagnosis_results(self, user_id: int, diagnosis_type: str, raw_data: Dict[str, Any]) -> int:
        # 실제 DB INSERT 로직
        print("-> [DB] Diagnosis_Results 테이블에 결과 저장 완료.")
        return 1001 # 가상 ID 반환

    async def _save_kpi_metrics(self, result_id: int, kpis: Dict[str, float]):
        # 실제 DB INSERT 로직 (KPI_Metrics)
        print("-> [DB] KPI_Metrics 테이블에 Growth/Engagement/Monetization 데이터 저장 완료.")

    def _extract_kpis(self, raw_data: Dict[str, Any]) -> Dict[str, float]:
        # 진단 결과에서 핵심 KPI를 추출하는 로직 (예시)
        return {
            "Growth": raw_data.get("score", 0) * 0.7,
            "Engagement": raw_data.get("relevance_score", 0),
            "Monetization": raw_data.get("potential_value", 0)
        }