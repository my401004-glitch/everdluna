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
    title: '제 1장: 기초 음정 (Basic Intervals)',
    description: '음정은 두 음 사이의 거리입니다. 입시의 근본이 되는 협화/불협화 음정들의 소리와 진동을 익힙니다.',
    items: [
      { id: 'm2', name: '단2도 (Minor 2nd)', description: '반음 1개 거리 (예: C4-Db4). 매우 강한 불협화성 긴장감을 줍니다.', semitones: '1 semitone', freqs: [261.63, 277.18], notes: ['C4', 'C#4'] },
      { id: 'M2', name: '장2도 (Major 2nd)', description: '반음 2개 거리 (예: C4-D4). 온음 간격의 부드러운 순차진행 음정입니다.', semitones: '2 semitones', freqs: [261.63, 293.66], notes: ['C4', 'D4'] },
      { id: 'm3', name: '단3도 (Minor 3rd)', description: '반음 3개 거리 (예: C4-Eb4). 마이너 코드의 핵심이며 슬픈 느낌을 자아냅니다.', semitones: '3 semitones', freqs: [261.63, 311.13], notes: ['C4', 'D#4'] },
      { id: 'M3', name: '장3도 (Major 3rd)', description: '반음 4개 거리 (예: C4-E4). 메이저 코드의 뼈대이며 밝고 안정적인 느낌을 줍니다.', semitones: '4 semitones', freqs: [261.63, 329.63], notes: ['C4', 'E4'] },
      { id: 'tritone', name: '증4도 / 감5도 (Tritone)', description: '반음 6개 거리 (예: C4-F#4). 악마의 음정이라 불리는 가장 강렬한 불협화음정입니다.', semitones: '6 semitones', freqs: [261.63, 369.99], notes: ['C4', 'F#4'] }
    ]
  },
  {
    id: 2,
    title: '제 2장: 3화음과 7화음 (Triads & 7th Chords)',
    description: '3개 이상의 음이 쌓여 만드는 화성의 색채입니다. 메이저, 마이너, 디미니쉬, 오그멘티드 코드의 청취력을 훈련합니다.',
    items: [
      { id: 'major_triad', name: '메이저 3화음 (Major Triad)', description: '루트 + 장3도 + 단3도 (예: C4-E4-G4). 밝고 명확하며 안정적입니다.', freqs: [261.63, 329.63, 392.00], notes: ['C4', 'E4', 'G4'] },
      { id: 'minor_triad', name: '마이너 3화음 (Minor Triad)', description: '루트 + 단3도 + 장3도 (예: C4-Eb4-G4). 다소 어둡고 차분한 분위기를 만듭니다.', freqs: [261.63, 311.13, 392.00], notes: ['C4', 'D#4', 'G4'] },
      { id: 'dim_triad', name: '디미니쉬 3화음 (Diminished Triad)', description: '루트 + 단3도 + 단3도 (예: C4-Eb4-Gb4). 좁고 잔뜩 수축되어 매우 불안정한 긴장감을 줍니다.', freqs: [261.63, 311.13, 369.99], notes: ['C4', 'D#4', 'F#4'] },
      { id: 'aug_triad', name: '오그멘티드 3화음 (Augmented Triad)', description: '루트 + 장3도 + 장3도 (예: C4-E4-G#4). 위로 크게 확장되어 붕 떠있는 듯한 신비로운 느낌을 줍니다.', freqs: [261.63, 329.63, 415.30], notes: ['C4', 'E4', 'G#4'] }
    ]
  },
  {
    id: 3,
    title: '제 3장: 고급 전조와 무조성 (Advanced Modulation & Atonality)',
    description: '음악의 조성적 변화와 현대 기법입니다. 급격한 조바꿈(Modulation)과 조성이 없는 무조성(Atonality)을 다룹니다.',
    items: [
      { id: 'diatonic_mod', name: '관계조 전조 (Diatonic Modulation)', description: 'C Major에서 가까운 공통음을 가진 G Major 등으로 부드럽게 전조하는 기법입니다.', freqs: [261.63, 392.00, 440.00], notes: ['C4', 'G4', 'A4'] },
      { id: 'chromatic_mod', name: '원격조 전조 (Chromatic Modulation)', description: 'C Major에서 증4도/단2도 등 멀리 떨어진 조성으로 급격히 이동해 시청각적 충격을 자아냅니다.', freqs: [261.63, 369.99, 554.37], notes: ['C4', 'F#4', 'C#5'] },
      { id: 'atonal_scale', name: '12음기법 무조성 (12-Tone Atonality)', description: '특정 으뜸음 없이 12개의 반음을 동등하게 배치하여 중력을 잃어버린 듯한 무조성 상태를 설계합니다.', freqs: [261.63, 369.99, 349.23, 493.88], notes: ['C4', 'F#4', 'F4', 'B4'] }
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
    } else {
      // 코드 또는 복수 음 동시 재생
      AudioHelper.playChord(selectedItem.freqs, 'sine', 1.8);
    }

    // 건반 누름 시각화
    selectedItem.notes.forEach(note => {
      setActivePressKey(note);
      setTimeout(() => setActivePressKey(null), 800);
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
      // 시간 초과 시 오답 누적 후 결과 리포트 출력
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

  // 정답 처리
  const handleSuccess = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 500);
    finishAssessment();
  };

  // 틀렸을 때 처리 (학습을 위한 즉시 피드백, 라이프 제한 제거)
  const handleFail = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    setMistakes(prev => prev + 1);
    AudioHelper.playPianoTone(110, 0.6); // 낮은 오답 진동음
  };

  // 건반 입력 처리 (청음 모드)
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

  // 정확도 백분율 계산
  const getAccuracy = () => {
    const totalAttempts = 8 + mistakes;
    return totalAttempts === 0 ? 0 : Math.round((8 / totalAttempts) * 100);
  };

  // 피드백 코멘트 자동 생성
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
                <div className="item-list">
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
              style={{ left: `${black.parentIdx * 48 + 34}px` }} // 백건 너비 48px에 맞춘 마진 보정
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
