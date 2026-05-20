from datetime import datetime
import json
from typing import Optional
# 이 파일은 API와 DB 트랜잭션의 계약 역할을 합니다.

class DiagnosisResult:
    """진단 결과를 담는 모델 (읽기 전용, 조회 시 사용)"""
    def __init__(self, user_id: int, kpis: dict, context_data: dict):
        self.user_id = user_id
        self.kpis = kpis # Growth, Engagement, Monetization 딕셔너리
        self.context_data = context_data
        self.result_date = datetime.utcnow()

    def to_json(self) -> str:
        return json.dumps({"user_id": self.user_id, "kpis": self.kpis, "date": self.result_date.isoformat()})

class UserProgressPlan:
    """AI가 생성한 학습 계획 모델 (쓰기 전용, Part 3 핵심)"""
    def __init__(self, user_id: int, plan_title: str, details: dict):
        self.user_id = user_id
        self.plan_title = plan_title # 예: "Part 1 Gap 해소 집중 트레이닝"
        self.details = details     # {"module": ["scale", "rhythm"], "duration": "30m"}

    def serialize(self) -> dict:
        return {
            "user_id": self.user_id,
            "plan_title": self.plan_title,
            "details": self.details
        }

# -------------------- 로직 검증 (Validation Step) ---------------------

def validate_progress_update(data: dict):
    """UserProgress 업데이트 요청 데이터의 유효성을 검사합니다."""
    user_id = data.get("user_id")
    progress_data = data.get("progress_data", {})
    if not user_id or not progress_data:
        raise ValueError("Missing required User ID or Progress Data.")

    # 로직 검증: 완료 항목이 항상 'status' 키를 가져야 합니다.
    for item in progress_data.get("completed", []):
        if "item" not in item or "status" not in item:
            raise ValueError(f"Invalid progress item format found: {item}")
    return True

# -------------------- 끝 --------------------