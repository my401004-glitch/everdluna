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

// 화성학 교육 챕터 데이터 구조 (정재열의 재즈화성 기반 개편)
interface TheoryItem {
  id: string;
  name: string;
  description: string;
  details: string;
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
    title: '제 1장: 재즈 음정과 다이아토닉 화성학 (Jazz Intervals & Diatonic Harmony)',
    description: '조성 음악의 뼈대를 이루는 음정의 물리적 전위와 메이저 스케일에서 유도되는 7화음 및 선법(Church Modes)의 기본 색채를 분석합니다.',
    items: [
      { 
        id: 'inversion', 
        name: '음정의 전위 (Inversion of Intervals)', 
        description: '기준음과 상성부 음의 위치를 대칭 교환하는 개념입니다.', 
        details: '두 음의 간격을 옥타브 대칭하여 변환하는 원리입니다. 예컨대 장3도(C-E)는 전위 시 단6도(E-C)가 되며, 완전5도(C-G)는 완전4도(G-C)가 됩니다. 입시 실기에서는 화음의 전위형 청음 및 해결 방향을 파악할 때 필수적으로 적용되는 이론입니다.',
        freqs: [261.63, 392.00], 
        notes: ['C4', 'G4'] 
      },
      { 
        id: 'diatonic_triads', 
        name: '다이아토닉 3화음 (Diatonic Triads)', 
        description: '메이저 스케일의 각 음 위에 3도씩 2개의 음을 쌓아 만든 7개의 화음입니다.', 
        details: '스케일 내부 음으로만 구성된 화음군입니다. I, IV, V도는 메이저(Major), iim, iiim, vim도는 마이너(Minor), viim(b5)도는 디미니쉬(Diminished) 구조를 띱니다. 재즈 화성에서 코드 스케일을 분석하고 대리 코드를 산출하기 위한 모든 화성 전개의 시발점이 됩니다.',
        freqs: [261.63, 329.63, 392.00], 
        notes: ['C4', 'E4', 'G4'] 
      },
      { 
        id: 'diatonic_7th', 
        name: '다이아토닉 7화음 (Diatonic 7th Chords)', 
        description: '3화음 위에 3도음(7음)을 추가하여 4성부로 확장한 현대 재즈의 기초 화음입니다.', 
        details: 'IMaj7(Ionian), iim7(Dorian), iiim7(Phrygian), IVMaj7(Lydian), V7(Mixolydian), vim7(Aeolian), viim7b5(Locrian)로 귀결됩니다. 3화음에 비해 7음이 더해져 각 코드의 색채가 극대화되며, 재즈 연주나 편곡 시 기본적인 텐션(9, 11, 13)을 수용하는 안착지 역할을 수행합니다.',
        freqs: [261.63, 329.63, 392.00, 493.88], 
        notes: ['C4', 'E4', 'G4', 'B4'] 
      },
      { 
        id: 'chord_functions', 
        name: '다이아토닉 코드의 기능과 대리 (Functions & Substitutions)', 
        description: '화음이 가지는 3대 화성적 기능(토닉, 서브도미넌트, 도미넌트)과 이를 대리하는 화음군입니다.', 
        details: 'Tonic(I)은 안정, Subdominant(IV)은 이탈, Dominant(V)는 강력한 불안정과 토닉으로의 복귀 성질을 띱니다. 토닉의 안정감을 대신하기 위해 iiim7과 vim7이 대리 코드로 쓰이며, 서브도미넌트는 iim7이 대리하여 재즈의 보편적 코드 진행인 ii-V 진행을 완성시킵니다.',
        freqs: [349.23, 440.00, 523.25, 659.25], 
        notes: ['F4', 'A4', 'C5', 'E5'] 
      },
      { 
        id: 'church_modes', 
        name: '교회 선법 (Diatonic Modes / Church Modes)', 
        description: '메이저 스케일의 시작점을 각기 달리하여 유도하는 7가지 선법적 음계입니다.', 
        details: '아이오니안, 도리안, 프리지안, 리디안, 믹소리디안, 에올리안, 로크리안이 존재합니다. 조성적 화성 진행(Tonal)에서 벗어나, 선법의 독특한 음정 관계가 주는 색채 자체를 강조하는 모달 재즈(Modal Jazz) 및 현대 즉흥 연주 이론의 핵심 기초가 됩니다.',
        freqs: [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33], 
        notes: ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'] 
      }
    ]
  },
  {
    id: 2,
    title: '제 2장: 도미넌트 화성과 대칭 코드 스케일 (Dominant Chords & Altered Scales)',
    description: '곡의 역동성을 불어넣는 세컨더리 도미넌트와 증4도 대리 화성, 얼터드 텐션을 적용한 대칭적/인위적 스케일의 해결 방식을 다룹니다.',
    items: [
      { 
        id: 'secondary_dominant', 
        name: '세컨더리 도미넌트 (Secondary Dominant Chords)', 
        description: '다이아토닉 스케일 1도를 제외한 다른 다이아토닉 코드로 해결하는 임시 도미넌트입니다.', 
        details: '조성 바깥의 음(Non-diatonic tone)을 도입하여 일시적인 전조 효과와 함께 강렬한 화성적 진행감을 부여합니다. 예컨대 C Major Key에서 iim7(Dm7)으로 가기 전 장3도를 강제 도입한 A7(V7/ii)을 연주하는 형태가 보편적이며, 대중음악 및 클래식 편곡에서 가장 빈번하게 출제됩니다.',
        freqs: [261.63, 329.63, 392.00, 466.16], 
        notes: ['C4', 'E4', 'G4', 'A#4'] 
      },
      { 
        id: 'tritone_sub', 
        name: '증4도 대리 화음 (Tritone Substitute / subV7)', 
        description: '동일한 가이드 톤(3, 7음)을 공유하는 증4도 관계의 대리 도미넌트 화음입니다.', 
        details: 'G7(G-B-D-F)의 불안정 가이드톤인 B와 F는 감5도 음정입니다. 이 B와 F를 동일하게 3음과 7음으로 보유하는 화음이 바로 반음 위인 Db7(Db-F-Ab-Cb)입니다. 해결 시 베이스가 Db에서 C로 반음 하행하는 매우 세련된 재즈 특유의 크로매틱 베이스라인 진행을 만듭니다.',
        freqs: [277.18, 349.23, 415.30, 493.88], 
        notes: ['C#4', 'F4', 'G#4', 'B4'] 
      },
      { 
        id: 'extended_dominant', 
        name: '익스텐디드 도미넌트 (Extended Dominant)', 
        description: '세컨더리 도미넌트가 연속적으로 5도 하행(Cycle of 5ths)하며 꼬리를 물고 전개되는 진행입니다.', 
        details: '화성적 인장력을 극대화하기 위해 도미넌트 7화음이 토닉으로 해결되지 않고 다른 도미넌트로 연쇄 이행하는 패턴입니다 (예: III7 - VI7 - II7 - V7 - IMaj7). 연쇄 진행 과정에서 임시표가 복잡하게 얽혀, 입시생들이 실시간 임시표 스케일을 구별할 때 오답률이 가장 높은 구간입니다.',
        freqs: [329.63, 415.30, 493.88, 587.33], 
        notes: ['E4', 'G#4', 'B4', 'D5'] 
      },
      { 
        id: 'altered_chord_scale', 
        name: '얼터드 코드 스케일 (Altered Chord Scale)', 
        description: '도미넌트 코드에서 사용할 수 있는 가장 텐션감이 강한 변형된 음계입니다.', 
        details: '멜로디 마이너 스케일의 7번째 모드에서 파생되며, 1, 3, 7음을 제외한 모든 음이 플랫/샵 텐션(b9, #9, #11, b13)으로 구성되어 있습니다. 현대 재즈 즉흥 연주에서 도미넌트 화성이 토닉 마이너나 토닉 메이저로 해결되기 직전, 극적인 불협화적 해소감을 구현하기 위해 사용됩니다.',
        freqs: [261.63, 277.18, 311.13, 329.63, 369.99, 415.30, 466.16, 523.25], 
        notes: ['C4', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4', 'C5'] 
      },
      { 
        id: 'diminished_types', 
        name: '디미니쉬 코드의 세 분류 (Three Types of Diminished 7th Chords)', 
        description: '음악적 전개 양상에 따른 디미니쉬드 7화음의 세 가지 기능적 구분입니다.', 
        details: '인접한 두 다이아토닉 코드를 반음계적으로 연결하는 Passing Diminished (I-I#dim-ii), 상행하지 않고 하행 해결하는 Descending Diminished (ii-iibdim-I), 토닉이나 도미넌트와 루트를 공유하는 보조적 성격의 Auxiliary Diminished (I-Idim-I)로 구분되어 청음 평가에 출제됩니다.',
        freqs: [261.63, 311.13, 369.99, 440.00], 
        notes: ['C4', 'D#4', 'F#4', 'A4'] 
      }
    ]
  },
  {
    id: 3,
    title: '제 3장: 고급 화성 분석과 모달 진행 (Advanced Harmony & Modal Progression)',
    description: '마이너 키의 3가지 스케일 화성 체계, 라인 클리셰, 병렬 조에서 차용하는 모달 인터체인지 및 입시 평가 최종 단계인 재즈 블루스 포맷을 해부합니다.',
    items: [
      { 
        id: 'minor_diatonic', 
        name: '마이너 다이아토닉 화성 (Minor Key Harmony)', 
        description: '자연/화성/가락단음계의 3대 단음계 구조에서 구축되는 화성 체계입니다.', 
        details: '단조는 메이저 키와 달리 세 종류의 단음계를 복합적으로 활용하여 화성을 구성합니다. 멜로디의 하행 시에는 자연단음계, 도미넌트 종지 시에는 화성단음계, 상행 선율 선율선에서는 가락단음계를 교차 적용하므로 복잡한 3도/7도 음정 변화를 귀로 분간해야 합니다.',
        freqs: [261.63, 311.13, 392.00, 466.16], 
        notes: ['C4', 'D#4', 'G4', 'A#4'] 
      },
      { 
        id: 'line_cliche', 
        name: '라인 클리셰 (Line Cliché)', 
        description: '하나의 화음이 지속되는 동안 단성부(내성 또는 상성)가 반음계적으로 하행/상행하는 선율 진행입니다.', 
        details: '마이너 트라이어드나 메이저 트라이어드 내부에서 루트 음이 반음씩 하행하여 (C - Cmaj7 - C7 - C6 또는 Cm - Cm(Maj7) - Cm7 - Cm6) 화음에 역동성과 애절함을 부여하는 장치입니다. 오케스트레이션 및 영화음악 테마 선율 청음 시험의 단골 출제 항목입니다.',
        freqs: [261.63, 329.63, 392.00, 493.88], 
        notes: ['C4', 'E4', 'G4', 'B4'] 
      },
      { 
        id: 'modal_interchange', 
        name: '모달 인터체인지 화음 (Modal Interchange Chords)', 
        description: '동일한 으뜸음을 공유하는 다른 선법이나 병렬 단조(Parallel Key)에서 차용해오는 화음군입니다.', 
        details: 'C Major Key 곡 전개 중 C minor Key의 다이아토닉 코드인 ivm7(Fm7), bVImaj7(Abmaj7), bVII7(Bb7) 등을 일시 빌려와 연주합니다. 순간적으로 조성의 빛이 바래며 감정을 깊게 가라앉히거나 서정적인 감동을 극대화시키는 현대 고급 실용음악 작곡의 감초 기법입니다.',
        freqs: [349.23, 415.30, 523.25, 622.25], 
        notes: ['F4', 'G#4', 'C5', 'D#5'] 
      },
      { 
        id: 'minor_251', 
        name: '2-5-1 마이너 패턴 (Minor ii-V-I Progression)', 
        description: '마이너 키에서 완결되는 가장 핵심적인 화성 종지 진행 패턴입니다.', 
        details: 'iim7(b5) - V7(b9) - im7 (또는 im6)으로 전개됩니다. ii도 화음의 감5도 울림과 V도 화음의 플랫나인(b9) 텐션이 가지는 강렬한 긴장 구조가 토닉 마이너 화음의 차분함으로 해소되는 과정의 주파수 연동을 명확하게 파악하는 것이 입시 청음의 합격 공식입니다.',
        freqs: [293.66, 349.23, 415.30, 523.25], 
        notes: ['D4', 'F4', 'G#4', 'C5'] 
      },
      { 
        id: 'blues_scale', 
        name: '블루스 스케일과 재즈 블루스 (Blues Scales & Form)', 
        description: '블루 노트(b3, b5, b7)를 탑재한 독특한 6음 음계 및 이를 응용한 12마디 화성 형식입니다.', 
        details: '메이저 스케일에 블루스 고유의 민속적 음정인 b3(Eb), b5(Gb), b7(Bb)을 더해 구성합니다 (C-Eb-F-F#-G-Bb-C). 재즈 블루스는 12마디 형식 속에 세컨더리 도미넌트와 2-5 연동을 결합하여, 실기 시험장에서 즉흥 라인을 영창(시창)하거나 임시표를 받아적는 최종 보스 과제입니다.',
        freqs: [261.63, 311.13, 349.23, 369.99, 392.00, 466.16, 523.25], 
        notes: ['C4', 'D#4', 'F4', 'F#4', 'G4', 'A#4', 'C5'] 
      }
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
    } else if (selectedItem.id.includes('scale') || selectedItem.id.includes('mode') || selectedItem.id.includes('atonal') || selectedItem.id.includes('church') || selectedItem.id.includes('blues')) {
      // 스케일 형태는 순차적으로 재생
      AudioHelper.playSequence(selectedItem.freqs, 0.5, 0.25);
    } else {
      // 화음 및 텐션은 동시(Chord) 재생
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
          <div className="stat-item">오늘의 학습 목표: <span className="stat-value">정재열 재즈 화성학 마스터</span></div>
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
                    </button>
                  ))}
                </div>

                {selectedItem && (
                  <div className="theory-detail-panel" style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '1.5rem' }}>
                    <div>
                      <h4 className="detail-title">{selectedItem.name}</h4>
                      <p className="detail-text" style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                        {selectedItem.description}
                      </p>
                      <p className="detail-text" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {selectedItem.details}
                      </p>
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
