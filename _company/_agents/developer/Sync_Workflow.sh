#!/bin/bash
# Sync_Workflow.sh: 로컬 작업 폴더와 GitHub 동기화를 위한 워크플로우 스크립트
# 작성자: 코다리 (Senior Fullstack Engineer)

# --- 환경 설정 ---
PROJECT_DIR=$(pwd)
REPO_NAME="your-repo-name" # TODO: 실제 GitHub 리포지토리 이름으로 변경 필요

echo "--- 🔄 Git 동기화 시작: $(date) ---"

# 1. 로컬 변경 사항 확인 및 스테이징
if ! git diff --quiet; then
    echo "📝 로컬 변경 사항 감지됨. Staging 중..."
    git add .
else
    echo "✅ 로컬 변경 사항 없음."
fi

# 2. 커밋 (변경 사항이 있을 경우에만)
if git diff --staged --quiet; then
    echo "💡 스테이징된 변경 사항 없음."
else
    COMMIT_MESSAGE="[AutoSync] $(date +'%Y-%m-%d %H:%M') - Automated Sync"
    echo "💾 커밋 실행: $COMMIT_MESSAGE"
    git commit -m "$COMMIT_MESSAGE"
fi

# 3. 원격 저장소 동기화 (Push/Pull)
echo "🌐 원격 저장소 동기화 시작..."
if git pull origin main; then
    echo "📥 원격에서 최신 변경 사항을 성공적으로 Pull 완료."
else
    echo "❌ 원격 Pull 중 오류 발생. 수동 확인 필요."
fi

if git push origin main; then
    echo "📤 로컬 변경 사항을 GitHub로 Push 완료."
else
    echo "❌ 원격 Push 중 오류 발생. 인증 또는 권한을 확인하세요."
fi

echo "--- ✅ Git 동기화 프로세스 종료 ---"
exit 0