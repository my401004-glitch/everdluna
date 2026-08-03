# 🔊 통합 콘텐츠 크로스 플랫폼 사운드 동기화 가이드 (v2.0)

## 1. 핵심 원칙: 모듈성 및 볼륨 계층 구조 유지
*   **Voiceover(VO)**는 모든 포맷에서 절대적 최우선 트랙(Volume 1.0)을 유지합니다.
*   BGM은 항상 **`0.25`~`0.3`** (나레이션 중심 콘텐츠 기준)으로 낮게 설정하여, 메시지 전달에 방해가 되지 않도록 합니다.

## 2. 플랫폼별 사운드 볼륨 및 길이 조정 가이드라인

| 포맷 | 비율 | 목표 분위기 / 핵심 BGM 모듈 | 사운드 특징 및 적용 방법 |
| :--- | :--- | :--- | :--- |
| **YouTube (Long Form)** | 16:9 | Cinematic Pop (Uplifting) | - `audio_master_blueprint.json`에 정의된 전체 오디오 아크를 최대한 유지합니다. <br>- 사운드 모듈(`Tension Build-up SFX`, `Solution Uplift Loop`)을 사용하여 스토리의 *서사적 깊이*를 확보합니다. |
| **Instagram Reels** | 9:16 | High Energy / Hook Focus | - BGM 루프 시간을 5~8초로 강제 축소합니다. <br>- 시작과 끝에 `Tension Build-up SFX`와 강력한 리듬을 배치하여 '훅(Hook)'을 극대화하고, 중앙의 메시지 전달 구간은 배경음악 비중을 낮춥니다. |
| **웹/배포용 (Micro)** | 1:1 또는 4:5 | Minimal Tech / Info Focus | - BGM 대신 `Analysis Transition Pad`와 같은 *미니멀한 사운드 이펙트*를 주력으로 사용합니다. <br>- VO의 명확한 전달에 집중하며, 배경음은 거의 존재하지 않는 것이 좋습니다. |

## 3. 최종 검증 항목 (QA Checklist)
*   [ ] 모든 콘텐츠는 전환점마다 `Tension Build-up SFX`가 적절하게 삽입되었는지 확인했습니다.
*   [ ] BGM의 루프 지점이 오디오 아크의 변화(Peak/Valley)와 정확히 일치하는지 검토해야 합니다. (기술적 재검증 필요)