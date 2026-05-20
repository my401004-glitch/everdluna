// src/pages/challenge.tsx
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { AudioEngine, NOTE_FREQS } from '../components/music/AudioEngine';
import { PitchDetector } from '../components/music/PitchDetector';
import '../styles/challenge.css';

const AudioHelper = new AudioEngine();
const Tracker = new PitchDetector();

// 피아노 건반 데이터 정의 (C4 ~ C6 2옥타브)
const WHITE_KEYS = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
const BLACK_KEYS = [
  { note: 'C#4', parentIdx: 0 },
  { note: 'D#4', parentIdx: 1 },
  { note: 'F#4', parentIdx: 3 },
  { note: 'G#4', parentIdx: 4 },
  { note: 'A#4', parentIdx: 5 },
  { note: 'C#5', parentIdx: 7 },
  { note: 'D#5', parentIdx: 8 },
  { note: 'F#5', parentIdx: 10 },
  { note: 'G#5', parentIdx: 11 },
  { note: 'A#5', parentIdx: 12 }
];

type CollegeId = 'ewha' | 'khu' | 'hanyang' | 'yonsei' | 'snu';

interface College {
  id: CollegeId;
  name: string;
  badge: string;
  difficulty: string;
  description: string;
}

const COLLEGES: College[] = [
  { id: 'ewha', name: '🌸 이화여대', badge: 'HARD', difficulty: '★★★★☆', description: '반음계 진행 및 급격한 도약형 선율' },
  { id: 'khu', name: '🦁 경희대', badge: 'VERY HARD', difficulty: '★★★★★', description: '재즈 화성 기반 디센딩 및 Altered 텐션 도약' },
  { id: 'hanyang', name: '🦅 한양대', badge: 'HELL', difficulty: '★★★★★★', description: '2성부 대위법 청음 (소프라노/베이스 동시 연주)' },
  { id: 'yonsei', name: '🔵 연세대', badge: 'INFERNO', difficulty: '★★★★★★★', description: '난해한 전조 선율 진행 (C-Key에서 F#-Key 변이)' },
  { id: 'snu', name: '👑 서울대 수석', badge: 'GOD MODE', difficulty: '★★★★★★★★', description: '12음기법 무조성(Atonal) 선율 및 증4도/단9도 난타' }
];

// 화성학 교육 챕터 데이터 구조
interface TheoryItem {
  id: string;
  name: string;
  description: string;
  semitones?: string;
  freqs: number[];
  notes: string[];
}

interface Chapter {
  id: number;
  title: string;
  description: string;
  items: TheoryItem[];
}

const THEORY_CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: '제 1장: 음정학 (Intervals Masterclass)',
    description: '음정은 음악의 가장 최소 단위이자 주파수 비례 관계입니다. 완전/장/단/증감 음정의 고유한 맥놀이(Beats)와 입시 빈출 도약 패턴을 정복합니다.',
    items: [
      { id: 'p1', name: '완전1도 (Perfect 1st)', description: '동일한 음높이를 가진 두 음의 관계 (0반음). 맥놀이가 전혀 없어 완벽한 융합감을 주며, 두 주파수의 비율은 정확히 1:1입니다. 합창이나 기악 조율의 기본이 됩니다.', semitones: '0 semitones', freqs: [261.63, 261.63], notes: ['C4', 'C4'] },
      { id: 'm2', name: '단2도 (Minor 2nd)', description: '반음 1개 거리 (예: C4-Db4). 주파수 비례가 가장 복잡하여 두 파형이 부딪치며 매우 거칠고 날카로운 맥놀이를 생성합니다. 현대 음악의 클러스터나 영화음악의 긴장/공포 씬에 필수적으로 사용됩니다.', semitones: '1 semitone', freqs: [261.63, 277.18], notes: ['C4', 'C#4'] },
      { id: 'M2', name: '장2도 (Major 2nd)', description: '반음 2개 거리 (예: C4-D4). 온음 간격의 진행으로, 선율적 흐름을 만드는 스케일 순차진행의 기본 뼈대입니다. 단2도에 비해 부드러우며 현대 대중음악 화성에서 Add9의 색채로 애용됩니다.', semitones: '2 semitones', freqs: [261.63, 293.66], notes: ['C4', 'D4'] },
      { id: 'm3', name: '단3도 (Minor 3rd)', description: '반음 3개 거리 (예: C4-Eb4). 단조(Minor key)의 성격을 규정짓는 핵심 음정입니다. 어둡고 슬프며, 우수에 찬 감정을 유발합니다. 자연배음 구조에서 비교적 상위에 있어 안정적인 협화음정으로 분류됩니다.', semitones: '3 semitones', freqs: [261.63, 311.13], notes: ['C4', 'D#4'] },
      { id: 'M3', name: '장3도 (Major 3rd)', description: '반음 4개 거리 (예: C4-E4). 장조(Major key)를 규정하는 음정으로 밝고 긍정적인 울림을 줍니다. 주파수 비율은 5:4에 수렴하며, 3화음 구성 시 화음의 색깔을 결정짓는 중추 역할을 합니다.', semitones: '4 semitones', freqs: [261.63, 329.63], notes: ['C4', 'E4'] },
      { id: 'p4', name: '완전4도 (Perfect 4th)', description: '반음 5개 거리 (예: C4-F4). 고대 그리스에서부터 협화음정으로 인정받았으며 주파수 비율은 4:3입니다. 선율적으로는 안정적이나, 저성부(Bass)에서 단독으로 울릴 경우 불협화음정으로 작용해 5도나 3도로 해결되려는 강한 성질을 지닙니다.', semitones: '5 semitones', freqs: [261.63, 349.23], notes: ['C4', 'F4'] },
      { id: 'tritone', name: '증4도 / 감5도 (Tritone)', description: '반음 6개 거리 (예: C4-F#4). 옥타브를 정확히 반으로 나누는 음정으로, 중세 시대에는 악마의 음정(Diabolus in Musica)으로 불려 사용이 금지되었습니다. 도미넌트 7th 코드 내부에서 가이드 톤 역할을 하며 불안정한 성격으로 인해 해결을 극도로 갈구합니다.', semitones: '6 semitones', freqs: [261.63, 369.99], notes: ['C4', 'F#4'] },
      { id: 'p5', name: '완전5도 (Perfect 5th)', description: '반음 7개 거리 (예: C4-G4). 주파수 비가 3:2로 완전1도와 완전8도 다음으로 완벽하게 어우러지는 협화음정입니다. 록 음악의 파워 코드(Power Chord)의 뼈대가 되며, 동양음악의 5음음계 생성 원리(삼분손익법)의 근간이 됩니다.', semitones: '7 semitones', freqs: [261.63, 392.00], notes: ['C4', 'G4'] },
      { id: 'm6', name: '단6도 (Minor 6th)', description: '반음 8개 거리 (예: C4-Ab4). 옥타브 8도에서 장3도를 뺀 자리로, 낭만주의 음악에서 애절함을 표현할 때 극대화되어 나타납니다. 감정의 고조 및 해결을 위한 순차 진행 직전 도약음으로 많이 출제됩니다.', semitones: '8 semitones', freqs: [261.63, 415.30], notes: ['C4', 'G#4'] },
      { id: 'M6', name: '장6도 (Major 6th)', description: '반음 9개 거리 (예: C4-A4). 주파수 비는 5:3에 가깝고 따뜻하며 서정적인 울림을 줍니다. 재즈 화성에서 토닉 코드의 대리 코드로 사용되거나 하프의 아르페지오 진행에서 자주 청취할 수 있습니다.', semitones: '9 semitones', freqs: [261.63, 440.00], notes: ['C4', 'A4'] },
      { id: 'm7', name: '단7도 (Minor 7th)', description: '반음 10개 거리 (예: C4-Bb4). 도미넌트 7th와 마이너 7th의 기본 구성원입니다. 다소 흐릿하고 고독한 느낌을 줍니다. 완전5도 위로 3도를 더한 형태로서 현대 블루스 선율의 근간이 됩니다.', semitones: '10 semitones', freqs: [261.63, 466.16], notes: ['C4', 'A#4'] },
      { id: 'M7', name: '장7도 (Major 7th)', description: '반음 11개 거리 (예: C4-B4). 반음 하나만 더 가면 옥타브(완전8도)가 되는 자리에 있어 극도의 인장력을 만들어 냅니다. 현대 팝 및 시티팝 화성에서 세련되고 몽환적인 감각을 표현할 때 메이저 7th 코드의 최상성부로 자주 등장합니다.', semitones: '11 semitones', freqs: [261.63, 493.88], notes: ['C4', 'B4'] },
      { id: 'p8', name: '완전8도 (Octave)', description: '반음 12개 거리 (예: C4-C5). 주파수 비는 정확히 2:1로, 물리적으로 동일한 배음 구조를 가집니다. 완벽한 일치감을 자아내며 선율의 도약 훈련에서 기준점 역할을 하는 필수 코스입니다.', semitones: '12 semitones', freqs: [261.63, 523.25], notes: ['C4', 'C5'] }
    ]
  },
  {
    id: 2,
    title: '제 2장: 화성 구조와 텐션 (Chords & Altered Tensions)',
    description: '3화음(Triad)과 7화음(7th Chord)의 구성 및 텐션(Tension)의 개념을 학습합니다. 입시에서 화음 성질 청음 시험에 100% 출제되는 코어 영역입니다.',
    items: [
      { id: 'maj_triad', name: '메이저 3화음 (Major Triad)', description: '루트 + 장3도 + 단3도 (예: C-E-G). 자연배음 구조상 가장 낮은 번호의 상위 배음들로 이루어져 우주의 소리라 불릴 정도로 극상의 안정성과 순수하고 밝은 울림을 자랑합니다.', freqs: [261.63, 329.63, 392.00], notes: ['C4', 'E4', 'G4'] },
      { id: 'min_triad', name: '마이너 3화음 (Minor Triad)', description: '루트 + 단3도 + 장3도 (예: C-Eb-G). 3음이 반음 내려감으로써 장조의 완벽한 안정감이 깨져 어둡고 우수 어린 분위기가 형성됩니다. 클래식 및 팝의 슬픈 단조 발라드의 기초 화음입니다.', freqs: [261.63, 311.13, 392.00], notes: ['C4', 'D#4', 'G4'] },
      { id: 'dim_triad', name: '디미니쉬 3화음 (Diminished Triad)', description: '루트 + 단3도 + 단3도 (예: C-Eb-Gb). 완전5도마저 감5도(Tritone)로 찌그러져 극단적인 불안감을 내포합니다. 클래식 대위법과 영화음악에서 공포, 위기, 해결 직전의 압박감을 극대화할 때 활용합니다.', freqs: [261.63, 311.13, 369.99], notes: ['C4', 'D#4', 'F#4'] },
      { id: 'aug_triad', name: '오그멘티드 3화음 (Augmented Triad)', description: '루트 + 장3도 + 장3도 (예: C-E-G#). 5음이 반음 솟구쳐서 옥타브 공간을 꽉 채웁니다. 어딘가 나사 하나가 풀린 듯 신비롭고 몽환적이며, SF 우주 영화의 성간 우주나 꿈속 장면의 사운드 트랙에 단골로 쓰입니다.', freqs: [261.63, 329.63, 415.30], notes: ['C4', 'E4', 'G#4'] },
      { id: 'maj7_chord', name: '메이저 7화음 (Major 7th)', description: '루트 + 장3도 + 완전5도 + 장7도 (예: C-E-G-B). 메이저 코드 위에 팽팽한 긴장감의 장7도 음정을 얹은 형태입니다. 정통 클래식의 맑음과 재즈의 몽환적인 노스탤지어 감성을 관통하는 가장 세련된 화음입니다.', freqs: [261.63, 329.63, 392.00, 493.88], notes: ['C4', 'E4', 'G4', 'B4'] },
      { id: 'min7_chord', name: '마이너 7화음 (Minor 7th)', description: '루트 + 단3도 + 완전5도 + 단7도 (예: C-Eb-G-Bb). 마이너 트라이어드의 우울함 위에 차분한 단7도가 얹어져 편안하면서도 센치한 도시적 라운지 감성을 발산합니다. 재즈/알앤비 음악의 모달 진행에 중추적인 코드입니다.', freqs: [261.63, 311.13, 392.00, 466.16], notes: ['C4', 'D#4', 'G4', 'A#4'] },
      { id: 'dom7_chord', name: '도미넌트 7화음 (Dominant 7th)', description: '루트 + 장3도 + 완전5도 + 단7도 (예: C-E-G-Bb). 장3도와 단7도 사이의 악마의 음정(Tritone)이 화음 내부에 숨어 있어, 극도의 불협화 성향을 지니며 완전4도 아래(I 도)로 강하게 해결(Resolving)하려는 성질을 유발합니다.', freqs: [261.63, 329.63, 392.00, 466.16], notes: ['C4', 'E4', 'G4', 'A#4'] },
      { id: 'm7b5_chord', name: '마이너 7화음 플랫5 (Half-Diminished 7th)', description: '루트 + 단3도 + 감5도 + 단7도 (예: C-Eb-Gb-Bb). 마이너 2-5-1 진행의 출발점으로 사용되며 서정적이면서도 위태로운 화성적 긴장을 표현합니다. 음대 입시 청음에서 구별하기 가장 까다로운 화음 중 하나입니다.', freqs: [261.63, 311.13, 369.99, 466.16], notes: ['C4', 'D#4', 'F#4', 'A#4'] },
      { id: 'b9_tension', name: '얼터드 텐션 플랫나인 (Altered Tension b9)', description: '도미넌트 7화음 위에 루트보다 반음 높은 단9도(b9) 음색을 배치한 형태입니다 (예: C7의 Db). 어두운 재즈 발라드 및 오케스트라의 장엄하고 비극적인 클라이맥스 전조 시그널로 활용됩니다.', freqs: [261.63, 329.63, 466.16, 554.37], notes: ['C4', 'E4', 'A#4', 'C#5'] },
      { id: 's11_tension', name: '리디안 텐션 샵일레븐 (Lydian Tension #11)', description: '메이저 또는 도미넌트 화음 위에 완전4도를 반음 올린 증4도(#11) 성부를 중첩한 극상의 신선함입니다 (예: C7의 F#). 우주적 확장감과 찬란하게 빛나는 신비감을 부여하는 재즈 모던 텐션의 대표 주자입니다.', freqs: [261.63, 329.63, 466.16, 739.99], notes: ['C4', 'E4', 'A#4', 'F#5'] }
    ]
  },
  {
    id: 3,
    title: '제 3장: 고급 대위법과 무조성 (Counterpoint & Serialism)',
    description: '2개 이상의 성부가 독립적으로 전개되는 대위법과 현대음악의 무조성(Atonal) 시스템을 심층 해부합니다. 국내 상위권 대학 실기 시험의 최종 변별력 변수입니다.',
    items: [
      { id: 'diatonic_mod', name: '관계조 전조 (Diatonic Modulation)', description: '으뜸조와 가까운 공통 코드를 징검다리 삼아 딸림조(Dominant)나 버금딸림조(Subdominant)로 흐르듯 열쇠를 바꾸는 기법입니다. 귀에 가장 자연스러운 음악적 전개 방식을 제공합니다.', freqs: [261.63, 392.00, 440.00], notes: ['C4', 'G4', 'A4'] },
      { id: 'chromatic_mod', name: '원격조 전조 (Chromatic Modulation)', description: '공통음이 없는 먼 친척 조성(예: C Major에서 Tritone 간격의 F# Major)으로 충격적으로 변이합니다. 현대 대중음악 후렴구 극강의 드라마틱 고조 기법으로 음정 감각의 급격한 전조 적응력을 요구합니다.', freqs: [261.63, 369.99, 554.37], notes: ['C4', 'F#4', 'C#5'] },
      { id: 'counterpoint_2v', name: '2성부 대위 선율 (Two-Voice Counterpoint)', description: '높은 소프라노 선율과 낮은 베이스 성부가 독립적인 리듬과 방향성(반진행, 병진행)을 갖고 대화하듯 교차 구동합니다. 청음 시 한 성부에 휩쓸리지 않고 두 주파수 레이어를 뇌에서 완전 분리해야 풀이가 가능합니다.', freqs: [261.63, 523.25, 392.00, 329.63], notes: ['C4', 'C5', 'G4', 'E4'] },
      { id: 'dorian_mode', name: '도리안 선법 선율 (Dorian Mode)', description: '자연단음계에서 6번째 음을 반음 올려 밝고 신비로운 중세/민요적 색채를 유발합니다 (예: C-D-Eb-F-G-A-Bb-C). 재즈 및 현대 영상음악의 모달 진행의 가장 대중적인 선법입니다.', freqs: [261.63, 293.66, 311.13, 349.23, 392.00, 440.00, 466.16, 523.25], notes: ['C4', 'D4', 'D#4', 'F4', 'G4', 'A4', 'A#4', 'C5'] },
      { id: 'altered_scale', name: '얼터드 스케일 (Altered Scale)', description: '루트음을 제외한 모든 음(b9, #9, #11, b13)이 임시표(Sharp/Flat)로 도배된 불안정의 극치입니다. 마이너 ii-V-I 진행의 극적인 해소를 이끌어내기 위해 사용되는 고급 입시 선율 분석 재료입니다.', freqs: [261.63, 277.18, 311.13, 329.63, 369.99, 415.30, 466.16, 523.25], notes: ['C4', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4', 'C5'] },
      { id: 'schoenberg_atonal', name: '쇤베르크 12음 무조성 (12-Tone Serialism)', description: '전통적인 화성 중력을 소멸시키기 위해 12개 반음을 단 한 번씩만 사용하여 수평/수직적으로 배열하는 음렬주의 현대 기법입니다. 음들의 유기적 서열을 파괴하여 극도의 혼란스러운 음정 간격을 양산합니다.', freqs: [261.63, 369.99, 349.23, 493.88, 277.18, 440.00, 311.13, 415.30], notes: ['C4', 'F#4', 'F4', 'B4', 'C#4', 'A4', 'D#4', 'G#4'] }
    ]
  }
];

export default function ChallengePage() {
  const [activeTab, setActiveTab] = useState<'theory' | 'practice'>('theory');
  
  // 교육 이론 학습 관련 상태
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedItem, setSelectedItem] = useState<TheoryItem | null>(null);

  // 실습 관련 상태
  const [mode, setMode] = useState<'ear' | 'sight'>('ear');
  const [targetCollege, setTargetCollege] = useState<CollegeId>('ewha');
  const [currentLevel, setCurrentLevel] = useState(1);

  // 8마디 실습 데이터
  const [melody, setMelody] = useState<string[]>([]);
  const [bassMelody, setBassMelody] = useState<string[]>([]);
  const [currentNoteIdx, setCurrentNoteIdx] = useState(0);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);

  // 실습 채점/평가 보고서 상태
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // 피드백/피치 상태
  const [detectedNote, setDetectedNote] = useState<string>('소리 대기 중...');
  const [activePressKey, setActivePressKey] = useState<string | null>(null);
  const [feedbackKey, setFeedbackKey] = useState<{ note: string; status: 'correct' | 'wrong' } | null>(null);

  const [isSinging, setIsSinging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'report'>('idle');
  const [isShaking, setIsShaking] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentNoteIdxRef = useRef(0);
  const targetCollegeRef = useRef<CollegeId>('ewha');

  useEffect(() => {
    targetCollegeRef.current = targetCollege;
  }, [targetCollege]);

  // 이론 학습 예시 음 재생
  const playTheoryExample = () => {
    if (!selectedItem) return;
    if (selectedItem.freqs.length === 1) {
      AudioHelper.playPianoTone(selectedItem.freqs[0], 1.5);
    } else if (selectedItem.id.includes('scale') || selectedItem.id.includes('mode') || selectedItem.id.includes('atonal')) {
      // 스케일/선률 형태는 순차적으로 재생
      AudioHelper.playSequence(selectedItem.freqs, 0.5, 0.2);
    } else {
      // 3화음, 7화음 및 텐션은 동시(Chord) 재생
      AudioHelper.playChord(selectedItem.freqs, 'sine', 1.8);
    }

    // 건반 누름 시각화
    selectedItem.notes.forEach(note => {
      setActivePressKey(note);
      setTimeout(() => setActivePressKey(null), 850);
    });
  };

  // 실습 8마디 생성
  const generate8BarMelody = (collegeId: CollegeId = targetCollege) => {
    const notes = Object.keys(NOTE_FREQS);
    const newMelody: string[] = [];
    const newBass: string[] = [];

    if (collegeId === 'ewha') {
      let currentIdx = notes.indexOf('C4') + Math.floor(Math.random() * 5);
      for (let i = 0; i < 8; i++) {
        const step = Math.floor(Math.random() * 5) - 2;
        currentIdx = Math.max(0, Math.min(notes.indexOf('C5'), currentIdx + step));
        newMelody.push(notes[currentIdx]);
      }
    } 
    else if (collegeId === 'khu') {
      const jazzPool = ['C4', 'E4', 'G4', 'B4', 'Db5', 'F#5', 'Bb5', 'C6', 'Ab4', 'D5', 'G5', 'A5'];
      for (let i = 0; i < 8; i++) {
        newMelody.push(jazzPool[Math.floor(Math.random() * jazzPool.length)]);
      }
    } 
    else if (collegeId === 'hanyang') {
      const sopPool = notes.filter(n => n.includes('5') || n === 'C6');
      const bassPool = notes.filter(n => n.includes('4'));
      for (let i = 0; i < 8; i++) {
        newMelody.push(sopPool[Math.floor(Math.random() * sopPool.length)]);
        newBass.push(bassPool[Math.floor(Math.random() * bassPool.length)]);
      }
    } 
    else if (collegeId === 'yonsei') {
      const cMaj = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'];
      const fsMaj = ['F#4', 'A#4', 'C#5', 'D#5', 'F#5', 'A#5'];
      const dMin = ['D4', 'F4', 'G#4', 'A4', 'D5', 'E5'];
      for (let i = 0; i < 8; i++) {
        if (i < 3) {
          newMelody.push(cMaj[Math.floor(Math.random() * cMaj.length)]);
        } else if (i < 6) {
          newMelody.push(fsMaj[Math.floor(Math.random() * fsMaj.length)]);
        } else {
          newMelody.push(dMin[Math.floor(Math.random() * dMin.length)]);
        }
      }
    } 
    else if (collegeId === 'snu') {
      let prevNote = 'C4';
      newMelody.push(prevNote);
      for (let i = 1; i < 8; i++) {
        const prevFreq = NOTE_FREQS[prevNote];
        const atonalCandidates = notes.filter(n => {
          const f = NOTE_FREQS[n];
          const diff = Math.abs(Math.round(12 * Math.log2(f / prevFreq)));
          return [1, 6, 11, 13].includes(diff);
        });
        const chosen = atonalCandidates.length > 0 
          ? atonalCandidates[Math.floor(Math.random() * atonalCandidates.length)]
          : notes[Math.floor(Math.random() * notes.length)];
        newMelody.push(chosen);
        prevNote = chosen;
      }
    }

    setMelody(newMelody);
    setBassMelody(newBass);
    setCurrentNoteIdx(0);
    currentNoteIdxRef.current = 0;
    
    const limitTime = collegeId === 'snu' ? 15 : collegeId === 'yonsei' ? 18 : 25;
    setTimeLeft(limitTime);
    setGameState('playing');
  };

  const playPianoNote = (note: string) => {
    const freq = NOTE_FREQS[note];
    if (freq) {
      AudioHelper.playPianoTone(freq, 1.2);
      setActivePressKey(note);
      setTimeout(() => setActivePressKey(null), 200);
    }
  };

  const playFullMelody = async () => {
    if (isPlayingMelody || melody.length === 0) return;
    setIsPlayingMelody(true);

    for (let i = 0; i < melody.length; i++) {
      const sopFreq = NOTE_FREQS[melody[i]];
      AudioHelper.playPianoTone(sopFreq, 0.7);
      
      if (targetCollege === 'hanyang' && bassMelody[i]) {
        const bassFreq = NOTE_FREQS[bassMelody[i]] / 2;
        AudioHelper.playPianoTone(bassFreq, 0.7);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsPlayingMelody(false);
  };

  // 타이머 루프
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setMistakes(prev => prev + 1);
      finishAssessment();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState]);

  // 평가 완료 및 리포트 전환
  const finishAssessment = () => {
    setElapsedTime(Math.round((Date.now() - startTime) / 1000));
    setGameState('report');
    Tracker.stopTracking();
    setIsSinging(false);
  };

  const handleSuccess = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 500);
    finishAssessment();
  };

  const handleFail = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    setMistakes(prev => prev + 1);
    AudioHelper.playPianoTone(110, 0.6);
  };

  const handleKeyboardInput = (note: string) => {
    if (gameState !== 'playing' || isPlayingMelody) return;

    playPianoNote(note);
    const target = melody[currentNoteIdx];

    if (note === target) {
      setFeedbackKey({ note, status: 'correct' });
      setTimeout(() => setFeedbackKey(null), 250);

      const nextIdx = currentNoteIdx + 1;
      setCurrentNoteIdx(nextIdx);
      currentNoteIdxRef.current = nextIdx;

      if (nextIdx >= 8) {
        handleSuccess();
      }
    } else {
      setFeedbackKey({ note, status: 'wrong' });
      setTimeout(() => setFeedbackKey(null), 250);
      handleFail();
    }
  };

  // 실시간 보컬 음정 인식 (시창 모드)
  useEffect(() => {
    if (mode === 'sight' && isSinging && gameState === 'playing') {
      let matchCount = 0;
      Tracker.startTracking((freq) => {
        const result = PitchDetector.getNoteFromFreq(freq);
        if (result) {
          setDetectedNote(result.note);
          const target = melody[currentNoteIdxRef.current];

          if (result.note === target) {
            matchCount++;
            const threshold = targetCollegeRef.current === 'snu' ? 4 : 6;
            if (matchCount >= threshold) {
              matchCount = 0;
              AudioHelper.playPianoTone(NOTE_FREQS[target], 0.3);
              
              const nextIdx = currentNoteIdxRef.current + 1;
              setCurrentNoteIdx(nextIdx);
              currentNoteIdxRef.current = nextIdx;

              if (nextIdx >= 8) {
                Tracker.stopTracking();
                setIsSinging(false);
                handleSuccess();
              }
            }
          } else {
            matchCount = 0;
          }
        } else {
          setDetectedNote('소리 대기 중...');
        }
      }).catch(err => {
        alert(err.message);
        setIsSinging(false);
      });
    }

    return () => {
      Tracker.stopTracking();
    };
  }, [isSinging, mode, gameState]);

  const startGame = () => {
    setMistakes(0);
    setStartTime(Date.now());
    generate8BarMelody(targetCollege);
  };

  const getKeyClass = (note: string, isBlack: boolean) => {
    let cls = isBlack ? 'black-key' : 'white-key';
    if (activePressKey === note) cls += ' active-press';
    if (isSinging && detectedNote === note) cls += ' active-press';
    if (feedbackKey && feedbackKey.note === note) {
      cls += feedbackKey.status === 'correct' ? ' feedback-correct' : ' feedback-wrong';
    }
    return cls;
  };

  const getAccuracy = () => {
    const totalAttempts = 8 + mistakes;
    return totalAttempts === 0 ? 0 : Math.round((8 / totalAttempts) * 100);
  };

  const getFeedbackMessage = () => {
    const accuracy = getAccuracy();
    if (accuracy >= 90) {
      return {
        headline: '🌟 합격 안정권 (최우수)',
        body: '선율 파악 능력이 매우 정교합니다. 해당 대학교 입시 청음/시창 영역에서 수석급 성적이 기대됩니다. 다음 단계 챕터의 코드를 더 정밀하게 연마하십시오.'
      };
    } else if (accuracy >= 70) {
      return {
        headline: '📈 발전 가능성 (우수)',
        body: '기초적인 프레이즈는 잘 해결하고 있으나, 반음계나 도약 음정에서 일부 지연이 발생합니다. 화성학 1장 [기초 음정]의 완전5도와 증4도 파트를 집중적으로 반복 청취하십시오.'
      };
    } else {
      return {
        headline: '⚠️ 보완 요망 (기초 부족)',
        body: '음정과 조성의 기준점이 흔들리는 현상이 발생합니다. 2성부나 전조 선율 도전 전에, 1장 및 2장의 기본 화음(Major/Minor Triad) 소리의 고유 진동감을 먼저 귀에 익혀야 합니다.'
      };
    }
  };

  return (
    <div className="game-container">
      <Head>
        <title>AI 실용음악 화성학 아카데미 교실</title>
      </Head>

      {/* 헤더 */}
      <header className="game-header">
        <div className="logo">🎓 <span>AZIT</span> 화성학 아카데미</div>
        <div className="stats-group">
          <div className="stat-item">오늘의 학습 목표: <span className="stat-value">시창청음 & 화성 분석</span></div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => { setActiveTab('theory'); setGameState('idle'); }}
        >
          📖 화성학 이론 교실
        </button>
        <button 
          className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => { setActiveTab('practice'); setGameState('idle'); }}
        >
          🎙 실전 모의고사 (청음/시창)
        </button>
      </div>

      {/* 1. 화성학 이론 교실 탭 */}
      {activeTab === 'theory' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!selectedChapter ? (
            <div className="chapters-grid">
              {THEORY_CHAPTERS.map(ch => (
                <div key={ch.id} className="chapter-card">
                  <div>
                    <div className="chapter-num">Chapter 0{ch.id}</div>
                    <h4 className="chapter-title">{ch.title}</h4>
                    <p className="chapter-desc">{ch.description}</p>
                  </div>
                  <button 
                    className="chapter-action-btn"
                    onClick={() => { setSelectedChapter(ch); setSelectedItem(ch.items[0]); }}
                  >
                    강의실 입장하기 →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="lesson-container">
              <div className="lesson-header">
                <div className="lesson-title-group">
                  <h3>{selectedChapter.title}</h3>
                  <p>이론 개념을 학습하고 하단 건반을 눌러 직접 소리를 확인해 보세요.</p>
                </div>
                <button 
                  className="back-to-chapters"
                  onClick={() => { setSelectedChapter(null); setSelectedItem(null); }}
                >
                  ← 전체 대단원 보기
                </button>
              </div>

              <div className="lesson-content">
                <div className="item-list" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {selectedChapter.items.map(item => (
                    <button
                      key={item.id}
                      className={`theory-item-btn ${selectedItem?.id === item.id ? 'active' : ''}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <span>{item.name}</span>
                      {item.semitones && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.semitones}</span>}
                    </button>
                  ))}
                </div>

                {selectedItem && (
                  <div className="theory-detail-panel">
                    <div>
                      <h4 className="detail-title">{selectedItem.name}</h4>
                      <p className="detail-text">{selectedItem.description}</p>
                    </div>
                    <button 
                      className="action-btn"
                      onClick={playTheoryExample}
                      style={{ marginTop: '1.5rem', width: '100%' }}
                    >
                      🔊 피아노 예시 음 듣기
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. 실전 모의고사 탭 */}
      {activeTab === 'practice' && (
        <main className={`main-display ${isShaking ? 'shake' : ''} ${isPopping ? 'success-pop' : ''}`}>
          <div className="mode-selector">
            <button 
              className={`mode-btn ${mode === 'ear' ? 'active' : ''}`}
              onClick={() => { setMode('ear'); setGameState('idle'); Tracker.stopTracking(); setIsSinging(false); }}
            >
              🎹 입시 청음 평가 (Ear)
            </button>
            <button 
              className={`mode-btn ${mode === 'sight' ? 'active' : ''}`}
              onClick={() => { setMode('sight'); setGameState('idle'); }}
            >
              🎤 입시 시창 평가 (Vocal)
            </button>
          </div>

          {/* 목표 대학 평가 */}
          <div className="college-selector" style={{ marginBottom: '1.5rem' }}>
            {COLLEGES.map(col => (
              <button
                key={col.id}
                className={`college-btn ${targetCollege === col.id ? 'active' : ''}`}
                onClick={() => {
                  setTargetCollege(col.id);
                  setGameState('idle');
                  Tracker.stopTracking();
                  setIsSinging(false);
                }}
              >
                {col.name} ({col.badge})
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
              과제 수준: {COLLEGES.find(c => c.id === targetCollege)?.difficulty}
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
              {COLLEGES.find(c => c.id === targetCollege)?.description}
            </p>
          </div>

          {gameState === 'idle' && (
            <div>
              <h1 className="question-title">
                {mode === 'ear' 
                  ? '입시 출제 8마디 음계 청음 실습' 
                  : '입시 출제 8마디 선율 시창 실습'}
              </h1>
              <p className="quest-desc">
                {mode === 'ear'
                  ? '건반을 똑같이 따라 치며 귀를 훈련하세요. 오답 횟수가 누적됩니다.'
                  : '마이크를 켜고 악보에 따라 정확한 음정으로 노래하세요.'}
              </p>
              <button className="action-btn" onClick={startGame}>평가 시작 🚀</button>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              <h2 className="question-title">
                {targetCollege === 'hanyang' ? '🔊 [2성부 대위법] 소프라노 선율을 완성하세요' : '8마디 과제 진행 중'}
              </h2>

              {/* 8마디 블록 */}
              <div className="melody-container">
                {melody.map((note, index) => {
                  let statusClass = '';
                  if (index < currentNoteIdx) statusClass = 'completed';
                  else if (index === currentNoteIdx) statusClass = 'active';
                  
                  return (
                    <div key={index} className={`melody-bar ${statusClass}`}>
                      <span className="bar-num">{index + 1}마디</span>
                      <span className="bar-note">{mode === 'sight' || index < currentNoteIdx ? note : '?'}</span>
                    </div>
                  );
                })}
              </div>

              {mode === 'ear' ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <button 
                    className="action-btn" 
                    onClick={playFullMelody} 
                    disabled={isPlayingMelody}
                  >
                    {isPlayingMelody ? '🔊 예시 음계 재생 중...' : '🔊 8마디 과제 듣기'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="visualizer-box">
                    <span className="detected-pitch">내 목소리 분석: {detectedNote}</span>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <button 
                      className="action-btn" 
                      onClick={() => setIsSinging(prev => !prev)}
                    >
                      {isSinging ? '⏹ 피치 분석 중지' : '🎙 마이크 감지 시작'}
                    </button>
                  </div>
                </div>
              )}

              {/* 타이머 바 */}
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${(timeLeft / (targetCollege === 'snu' ? 15 : targetCollege === 'yonsei' ? 18 : 25)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {gameState === 'report' && (
            <div className="report-container">
              <h3 className="report-title">📝 실창/청음 종합 학습 리포트</h3>
              
              <div className="report-summary-box">
                <div className="report-stat-row">
                  <span className="report-stat-label">평가 대상 과정</span>
                  <span className="report-stat-val">{COLLEGES.find(c => c.id === targetCollege)?.name} 입시 모의평가</span>
                </div>
                <div className="report-stat-row">
                  <span className="report-stat-label">풀이 총 소요 시간</span>
                  <span className="report-stat-val">{elapsedTime}초</span>
                </div>
                <div className="report-stat-row">
                  <span className="report-stat-label">오답 시도 횟수</span>
                  <span className="report-stat-val" style={{ color: mistakes > 0 ? 'var(--error)' : 'var(--success)' }}>{mistakes}회</span>
                </div>
                <div className="report-stat-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: '0.8rem' }}>
                  <span className="report-stat-label" style={{ fontWeight: 'bold' }}>최종 음정 정확도</span>
                  <span className="report-stat-val" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{getAccuracy()}%</span>
                </div>
              </div>

              <div className="report-summary-box">
                <div className="feedback-text-box">
                  <div className="feedback-headline">{getFeedbackMessage().headline}</div>
                  <div>{getFeedbackMessage().body}</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button className="action-btn" onClick={startGame}>다시 모의평가 풀기 🔄</button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* 입시 평가용 피아노 건반 */}
      <section className="piano-section">
        <h3 className="piano-title">🎹 실시간 연주 및 피치 확인용 가상 건반</h3>
        <div className="piano-keyboard">
          {WHITE_KEYS.map((note) => (
            <div 
              key={note} 
              className={getKeyClass(note, false)}
              onClick={() => handleKeyboardInput(note)}
            >
              {note}
            </div>
          ))}

          {BLACK_KEYS.map((black) => (
            <div 
              key={black.note} 
              className={getKeyClass(black.note, true)}
              style={{ left: `${black.parentIdx * 48 + 34}px` }}
              onClick={() => handleKeyboardInput(black.note)}
            >
              {black.note.replace(/[0-9]/g, '')}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
