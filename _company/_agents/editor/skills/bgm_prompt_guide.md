# 🎵 BGM 생성용 프롬프트 및 장르 가이드

이 문서는 로컬 음악 생성 모델(MusicGen/ACE-Step)을 사용하여 비즈니스 퍼널과 영상의 감정 흐름에 최적화된 BGM을 생성하기 위한 핵심 지식 및 스펙 가이드입니다.

---

## 1. 프롬프트 작성 기본 원칙
* **영어(English) 작성**: 모델 가중치 학습 특성상 영문 태그와 서술이 훨씬 더 좋은 품질의 오디오를 생성합니다.
* **추상적 묘사 지양**: "노래잘하게 만드는 음악", "기분 좋은 배경음" 같은 추상적 키워드는 피하고 구체적인 악기, 분위기, BPM을 명시합니다.
* **구조적 태깅**: `[분위기/감정]`, `[핵심 악기]`, `[템포/BPM]`, `[장르]` 형태의 조합형 구조를 사용합니다.
  - *예시: `calm and hopeful mood, soft acoustic guitar, gentle piano chords, 90 BPM, lo-fi pop`*

---

## 2. 'Pain $\rightarrow$ Gain' 감정선별 음악 프롬프트 템플릿

우리 회사의 B2B 실용음악 교육 및 ROI 리스크 마케팅 영상 시리즈는 시청자의 심리를 흔드는 **Pain $\rightarrow$ Gain** 구조를 취합니다. 각 구간에 맞는 분위기의 BGM 프롬프트 표준 템플릿입니다.

### ⚠️ 1단계: Pain (도입부 - 문제 제기 / 경고 / 위기감)
* **목표**: 학원 운영의 비효율이나 데이터 누락 등의 리스크를 충격적으로 전달하여 주의를 집중시킵니다.
* **사운드 특징**: 마이너(Minor) 키, 무겁거나 긴장감 도는 신스 패드, 시계 초침 같은 반복적 소리, 낮은 템포.
* **추천 프롬프트**:
  - `tense dynamic atmospheric synth pad, clock ticking sound effects, dark cinematic minor key, slow tempo 70 BPM, corporate danger mood`
  - `heavy sub-bass drone, minimal industrial electronic beat, mystery and worry atmosphere, 75 BPM`

### 📊 2단계: Analysis & Transition (중반부 - 데이터 분석 / 리스크 진단 / 해결책 실마리)
* **목표**: 객관적인 지표와 분석 로직(예: Gap Score, LTV)을 냉철하고 이성적으로 설명하는 구간입니다.
* **사운드 특징**: 미니멀한 리듬, 뮤트된 악기(일렉 기타, 피치카토 현악기), 정적이지만 일정한 박자.
* **추천 프롬프트**:
  - `minimal tech house beat, muted electric guitar riff, analytical and focused mood, moderate tempo 100 BPM, corporate software UI background`
  - `light synth plucks, electronic clicks and pops, clear and simple rhythmic background music, 95 BPM, ambient tech`

### 🎉 3단계: Gain (후반부 - 해결책 확정 / 자신감 / ROI 개선 / CTA)
* **목표**: 솔루션 도입 후의 재무 안정화 및 운영 효율성 향상을 보여주며 유료 베타 테스트나 채널 구독으로 유도합니다.
* **사운드 특징**: 메이저(Major) 키, 밝고 풍성한 어쿠스틱 기타, 따뜻한 피아노, 전진하는 드럼 비트, 빌드업.
* **추천 프롬프트**:
  - `uplifting cinematic acoustic pop, bright grand piano chords, warm acoustic guitar strumming, confident driving drums, major key, hopeful mood, 110 BPM`
  - `inspirational corporate indie rock, driving guitar riff, happy and energetic drums, success and growth atmosphere, 115 BPM`

---

## 3. 로컬 모델 성능/속도 최적화 팁
* **duration_sec 설정**: BGM 길이는 최종 영상 길이에 정확하게 맞추거나, 영상보다 5~10초 정도 여유 있게 길게 생성한 뒤 `music_to_video.py`에서 fade-out 또는 cut 처리를 하는 것이 안전합니다.
* **모델 교체 지식**:
  - 빠른 프로토타이핑/테스트: `musicgen-small` 사용 (300MB, 30초 내 생성)
  - 최종 렌더링 및 배포용 A/V 에셋: `musicgen-large` 또는 `acestep-base` 사용 (3.3GB~10GB, 고품질 사운드 디테일 확보)
