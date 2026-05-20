import os
from src.types.ContentManifest import ContentManifest
from src.utils.manifestValidator import validate_content_manifest
# API 호출을 위한 가상의 함수 (실제 구현 필요)
def call_upload_api(manifest: ContentManifest):
    """
    실제 영상 업로드 API를 호출하는 로직이 들어갈 자리입니다.
    API 키 관리 및 Rate Limiting 처리가 필수적입니다.
    """
    print("--- 🎬 API Call Simulation Start ---")
    # 실제로는 requests 라이브러리를 사용하거나, 비동기 클라이언트를 이용해야 합니다.
    if not manifest:
        raise ValueError("Manifest 데이터가 없습니다.")

    video_id = manifest.get('video_title', 'Untitled')[:20].replace(' ', '_') + f"_{manifest.get('content_pillar', 'unknown')}"
    print(f"[INFO] Uploading Content Manifest: {manifest['video_title']}")
    print(f"[SUCCESS] Simulated upload successful for ID: {video_id}")
    return {"status": "success", "uploaded_id": video_id}

def process_and_upload_content(raw_data: dict):
    """
    ContentManifest를 검증하고, 유효할 경우 업로드 파이프라인을 실행하는 메인 함수.
    시스템 안정성을 위해 Validator 모듈 사용이 필수적입니다.
    """
    print("=============================================")
    print("🚀 Starting Content Upload Pipeline...")

    # 1. Manifest 객체 생성 (Raw Data를 Schema에 맞추기)
    try:
        manifest = ContentManifest(**raw_data)
    except Exception as e:
        print(f"[ERROR] Manifest 구조화 실패: {e}")
        return None, "MANIFEST_STRUCTURING_FAILED"

    # 2. 유효성 검증 (가장 중요한 단계!)
    is_valid = validate_content_manifest(manifest)

    if not is_valid:
        print("=============================================")
        print("[FATAL ERROR] Content Manifest Validation Failed!")
        # Validator에서 어떤 필드가 깨졌는지 구체적인 에러 메시지를 받도록 수정해야 함.
        return None, "VALIDATION_FAILED"

    print("[SUCCESS] ✅ Content Manifest passed validation checks.")

    # 3. 업로드 실행 (성공적으로 검증된 데이터만 통과)
    try:
        result = call_upload_api(manifest)
        print("\n✅ Upload Pipeline Completed Successfully!")
        return result, "SUCCESS"

    except Exception as e:
        print(f"\n❌ CRITICAL FAILURE during API Call/Upload: {e}")
        # 여기에 재시도 로직 (Retry Logic) 및 알림 시스템 호출이 필요합니다.
        return None, f"UPLOAD_FAILED: {str(e)}"

if __name__ == "__main__":
    # 테스트용 가짜 데이터 1: 완벽한 Manifest
    good_manifest_data = {
        'video_title': 'AI 기반 학습의 Gap Score 진단법',
        'content_pillar': '실용음악 입시생',
        'target_audience': '예비 실용음악 전공 학생',
        'key_metrics': ['Gap Score', '주파수 안정성'],
        'call_to_action': '무료 진단 테스트 참여하기',
        # ... 나머지 필드들 ...
    }

    print("\n========== 🧪 Test Case 1: Valid Manifest ==========")
    process_and_upload_content(good_manifest_data)

    # 테스트용 가짜 데이터 2: 유효성 검사 실패가 예상되는 Manifest (예: 비어있는 제목 등)
    bad_manifest_data = {
        'video_title': '', # 빈 값으로 Validator를 통과하지 못하게 만듦
        'content_pillar': '테스트',
        'target_audience': '임시 테스트 그룹',
        'key_metrics': ['Bad Data'],
        'call_to_action': '에러 확인하기',
    }

    print("\n========== 🐛 Test Case 2: Invalid Manifest ==========")
    process_and_upload_content(bad_manifest_data)