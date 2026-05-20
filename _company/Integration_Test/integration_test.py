import json
import os
from typing import Dict, List

# 가상 경로 설정 (실제 프로젝트 구조에 맞게 수정 필요)
SCRIPT_FILE = "../data/master_script.json"
MANUAL_FILE = "../data/production_manual.json"

def load_data(file_path: str) -> dict | None:
    """파일을 로드하고 JSON 파싱 오류를 처리합니다."""
    if not os.path.exists(file_path):
        print(f"[ERROR] 파일을 찾을 수 없습니다: {file_path}")
        return None
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON 디코딩 실패: {e}")
        return None

def run_e2e_integration_test(script_data: dict, manual_data: dict) -> List[str]:
    """
    마스터 스크립트와 프로덕션 매뉴얼을 기반으로 E2E 통합 테스트를 실행합니다.
    반환값은 발견된 모든 오류 리스트입니다.
    """
    print("⚙️ [INFO] --- E2E 시스템 통합 테스트 시작 ---")
    errors = []

    if not script_data or not manual_data:
        return ["FATAL: 스크립트 또는 매뉴얼 데이터 로드 실패. 검증을 중단합니다."]

    # 1. 필수 에셋 ID 목록 추출 (매뉴얼 기반)
    required_assets = set(manual_data.get('visual_assets', []))
    if not required_assets:
        errors.append("WARNING: Production Manual에서 사용되는 비주얼 애셋 리스트가 감지되지 않았습니다.")

    # 2. 스크립트의 각 타임코드별로 검증 수행
    for segment, data in script_data.get('segments', {}).items():
        timecode = data.get('start_time')
        if not timecode: continue

        print(f"   -> 검사 중: Timecode {timecode} (Segment: {segment})")

        # 2-1. 논리적 데이터 체크 (Gap Score, KPI 등)
        required_kpis = data.get('data_requirements', {}).get('kpi')
        if required_kpis and 'GapScore' in required_kpis:
            # GapScore가 요구되지만 매뉴얼에 해당 시각화 가이드라인이 없는 경우
            is_mapped = any(asset['id'] == 'GAP_SCORE' for asset in manual_data.get('assets', []))
            if not is_mapped and required_kpis:
                errors.append(f"[LOGIC ERROR] {timecode}: Gap Score 데이터가 요구되나, 매뉴얼에 해당 시각화 에셋 정의가 없습니다.")

        # 2-2. 비주얼 에셋 매핑 체크 (핵심)
        required_assets_for_segment = data.get('visual_requirements', {}).get('asset_ids', [])
        if required_assets_for_segment:
            for asset_id in required_assets_for_segment:
                # 🚨 이 부분이 가장 중요합니다. 필요한 에셋이 매뉴얼에 정의되어 있는지 확인해야 합니다.
                if asset_id not in required_assets and 'GAP_SCORE' != asset_id:
                    errors.append(f"[VISUAL ERROR] {timecode}: 요구된 비주얼 에셋 ID '{asset_id}'가 Production Manual 전체에서 발견되지 않았습니다. (매핑 실패)")

    print("✅ [SUCCESS] --- E2E 통합 테스트 완료 ---")
    return errors

def main():
    # ⚠️ 실제 실행 시, 이 더미 파일들이 JSON 형태로 존재해야 합니다.
    script_data = load_data(SCRIPT_FILE)
    manual_data = load_data(MANUAL_FILE)
    
    if script_data and manual_data:
        errors = run_e2e_integration_test(script_data, manual_data)
        print("\n=====================================")
        if errors:
            print("🔴 [TEST FAIL] 시스템 통합 오류 발견:")
            for error in errors:
                print(f"   - {error}")
            return False # 실패 반환
        else:
            print("🟢 [TEST PASS] 모든 스크립트와 에셋 간의 매핑이 성공적으로 검증되었습니다.")
            return True # 성공 반환

if __name__ == "__main__":
    main()