#!/bin/bash
# monitor_sync.sh: Git 동기화 프로세스 모니터링 및 로깅 스크립트
# 작성자: 영숙 (Personal Assistant)

SYNC_SCRIPT="/Users/iyeongjae/Desktop/초보프로젝트/_company/_agents/developer/Sync_Workflow.sh"
LOG_FILE="./sync_monitor.log"

echo "==============================================" >> $LOG_FILE
echo "[$(date +'%Y-%m-%d %H:%M:%S')] 💡 동기화 모니터링 시작." >> $LOG_FILE

# 실제 동기화 스크립트 실행 및 종료 코드 저장
$SYNC_SCRIPT
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✅ 성공: Git Sync 완료. 모든 프로세스가 정상적으로 작동했습니다." >> $LOG_FILE
else
    # 종료 코드가 0이 아니면 에러로 간주하고 경고 메시지 기록
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] 🚨 실패: Git Sync 실행 오류 발생! (Exit Code: $EXIT_CODE). 로그를 확인해주세요." >> $LOG_FILE
fi

echo "==============================================" >> $LOG_FILE