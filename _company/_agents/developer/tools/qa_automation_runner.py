import subprocess
import json
from datetime import datetime
import os

# --- 설정 경로 (하드코딩 금지 원칙에 따라 환경 변수나 config 파일을 사용하는 것이 좋으나, 현재 구조상 직접 명시) ---
BASE_DIR = "/Users/iyeongjae/Desktop/초보프로젝트/_company/_agents/developer/tools"
STABILITY_REPORT_PATH = os.path.join(os.getcwd(), "sessions/2026-07-13T06-12/System_Stability_Report.md") 
# 실제 report 파일 경로는 세션 로그를 따라야 하지만, 여기서는 임시로 경로를 설정합니다.

def load_stability_report(path):
    """시스템 안정성 보고서에서 주요 실패 지점 리스트를 로드합니다."""
    print(f"[INFO] Loading stability report from: {path}")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            # 실제 구현에서는 Regex 등을 사용해 특정 섹션만 파싱해야 합니다.
            content = f.read()
            return content[:500] # 일단 상위 500자만 로드하여 테스트합니다.
    except FileNotFoundError:
        print(f"[ERROR] Stability Report not found at {path}. Skipping report analysis.")
        return ""

def run_validator(script_name, config_file):
    """단일 검증 스크립트를 실행하고 결과를 파싱합니다."""
    print(f"\n=== Running Validator: {script_name} ===")
    try:
        # subprocess를 사용하여 격리된 환경에서 명령어 실행
        result = subprocess.run(
            ['python3', script_name, '--config', config_file], 
            capture_output=True, text=True, check=True
        )
        return {"status": "PASS", "details": result.stdout}
    except subprocess.CalledProcessError as e:
        # 실패 시 에러 코드를 잡아내어 패스/실패를 판단합니다.
        return {"status": "FAIL", "error": e.stderr, "output": e.stdout}
    except Exception as e:
        return {"status": "CRITICAL_FAIL", "error": str(e)}

def run_qa_pipeline():
    """통합 QA 오케스트레이션 파이프라인을 실행합니다."""
    print("=========================================")
    print("🚀 Initiating Automated QA Pipeline (Pre-Deployment Check)")
    print("=========================================")
    
    # 1. 초기 데이터 수집 및 보고서 분석
    report_content = load_stability_report(STABILITY_REPORT_PATH)
    failure_points = f"Analyzed stability report content snippet:\n{report_content}\n... (Detailed failure points must be parsed from the full document)"

    # 2. 개별 검증 도구 순차 실행 및 결과 수집
    validator_results = {}
    
    # kpi_validator 테스트 로직 통합
    kpi_result = run_validator("kpi_validator.py", "kpi_validator.json")
    validator_results["KPI Validation"] = kpi_result

    # lint_test (코드 스타일 및 형식 검증)
    lint_result = run_validator("lint_test.py", "lint_test.json")
    validator_results["Code Linting"] = lint_result
    
    # 3. 최종 결과 종합 및 보고서 생성
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"Deployment_Readiness_Report_{timestamp}.json"
    
    final_report = {
        "timestamp": timestamp,
        "overall_status": "PASS" if all(r['status'] != 'FAIL' and r['status'] != 'CRITICAL_FAIL' for r in validator_results.values()) else "FAIL",
        "summary": f"QA Pipeline completed. Overall status: {final_report['overall_status']}.",
        "stability_analysis": failure_points, # 보고서 내용을 구조화하여 삽입
        "component_checks": validator_results
    }

    # JSON 파일로 저장 (구조적 데이터 아카이빙)
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(final_report, f, indent=4)
        
    print("\n=========================================")
    print(f"✅ QA Pipeline Finished! Results saved to {output_filename}")
    if final_report['overall_status'] == 'FAIL':
        print("🚨 WARNING: Deployment is BLOCKED due to critical failures. Review the report.")
    else:
        print("🟢 SUCCESS: All automated checks passed. Ready for deployment consideration.")

if __name__ == "__main__":
    run_qa_pipeline()