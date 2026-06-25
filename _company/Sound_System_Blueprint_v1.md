# 🎵 아지트아트컴페니: 통합 사운드 디자인 시스템 (Sonic System Blueprint) v1.0

## 🎯 목적 및 적용 범위
본 블루프린트는 모든 교육 콘텐츠 영상의 오디오 품질과 감정적 일관성을 유지하기 위한 표준 가이드라인입니다. 단순 BGM 생성이 아닌, **사건(Event) 기반 사운드 디자인**을 지향합니다.

## 🎧 I. 핵심 청각 모듈 (Core Sonic Modules)
| 이벤트 (Visual Event) | 소리 역할 (Sonic Role) | 추천 사운드 에셋 (Asset ID) | 기술적 지침 (FFmpeg/DAW Note) | 감정 변화 (Emotional Arc) |
| :--- | :--- | :--- | :--- | :--- |
| **1. 문제 제기 (Pain Point)** | 긴장감 조성, 질문 던지기 | `Anxiety_Drone_[ID]` | BPM 70~90 유지. 저주파 대역(Sub-Bass) 강조. 볼륨: BGM 대비 -6dB. | 불안정 $\rightarrow$ 기대 |
| **2. 핵심 정보 노출 (Data Reveal)** | 주목도 향상, 명료한 전환점 | `Swoosh_Reveal_[ID]` | 0.3초 이내의 짧고 빠른 상승(Rise) 톤 사용. 음역대: 중고음 강조. | 흥미 $\rightarrow$ 집중 |
| **3. 해결책 제시 (Solution/Gain)** | 성공, 깨달음, 희망 부여 | `Success_Chime_[ID]` | 밝은 고음역대의 벨(Bell) 계열 또는 아르페지오 사용. 볼륨: 강조 구간에서 일시적 팝업 효과. | 좌절 $\rightarrow$ 만족 (Catharsis) |

## 🎼 II. 배경 음악 (BGM) 가이드라인
*   **기본 BGM:** `[Generation Output]`을 기본 트랙으로 사용하되, **전환(Transition)**이 필요할 때는 반드시 위 모듈 사운드(SFX)를 활용하여 감정선을 주도해야 합니다.
*   **볼륨 최적화 (Mixing Rule):**
    *   나레이션/인터뷰 오버랩 시: BGM 볼륨은 **-12dB ~ -15dB**로 낮춥니다.
    *   데이터 강조(SFX 사용) 시: SFX가 가장 크게 들리도록, 해당 순간에만 배경음악의 볼륨을 일시적으로 하강(Dip)시킵니다.

## 🎬 III. 적용 워크플로우 (Workflow Integration)
1.  **Pre-Mix:** 스토리보드와 사운드 블루프린트 기반으로 전체 오디오 타임라인 초안 구성.
2.  **Drafting:** `Anxiety_Drone` 루프를 배경에 깔고, 중요한 전환 지점에 `Swoosh/Chime`을 배치하여 감정적 흐름 테스트.
3.  **Final Mix:** 나레이션 녹음 후, 최종적으로 모든 오디오 레이어를 합성하고 믹싱합니다.