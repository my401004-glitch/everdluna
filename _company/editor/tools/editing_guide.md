# 최종 편집자 가이드: 감정적 싱크(Emotional Sync)를 위한 체크리스트

## 🎯 목표
자동 합성된 마스터 영상이 스토리텔링의 '흐름'을 놓치지 않도록, 클립 간의 패싱(Passing), 타이밍, 강약을 수동으로 조정한다.

## ✅ 핵심 검증 항목 (Critical Checkpoints)
1. **감정적 전환점 싱크:** Voiceover가 특정 Pain Point나 Gain Point를 강조하는 시점에 맞춰 BGM이 일시적으로 컷되거나, SFX의 볼륨과 빈도가 최대치에 도달해야 합니다. 이 타이밍을 프레임 단위로 점검하세요.
2. **트랜지션 리듬:** 두 개의 독립된 클립(A $\rightarrow$ B)이 붙는 경계 지점(Cut Point)에서 너무 갑작스럽거나, 혹은 지나치게 느려져서 늘어지지 않도록 적절한 페이드 아웃/인 또는 모션 블렌딩을 적용해야 합니다.
3. **KPI 시각화의 무게감:** 진단 결과가 '숫자'로만 제시되지 않고, 그 숫자가 가지는 의미(Pain $\rightarrow$ Gain)를 전달할 때 화면에 충분한 시간과 애니메이션 효과를 할애하여 메시지의 중요도를 높여야 합니다.

## 🛠️ 사용 지침
*   **Tool:** `video_editor` (가상의 편집 도구, 실제로는 NLE/Adobe Premiere 등의 개념)
*   **Workflow:** Raw Master Mix 파일 $\rightarrow$ **(Editor의 수동 수정)** $\rightarrow$ Polished Final Export.