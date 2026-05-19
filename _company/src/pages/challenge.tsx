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

export default function ChallengePage() {
  const [mode, setMode] = useState<'ear' | 'sight'>('ear');
  const [targetCollege, setTargetCollege] = useState<CollegeId>('ewha');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);

  // 8마디 음계/멜로디 상태 (2성부 대비로 주/부선율 분리)
  const [melody, setMelody] = useState<string[]>([]);
  const [bassMelody, setBassMelody] = useState<string[]>([]);
  const [currentNoteIdx, setCurrentNoteIdx] = useState(0);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);

  // 피드백/피치 상태
  const [detectedNote, setDetectedNote] = useState<string>('소리 대기 중...');
  const [activePressKey, setActivePressKey] = useState<string | null>(null);
  const [feedbackKey, setFeedbackKey] = useState<{ note: string; status: 'correct' | 'wrong' } | null>(null);

  const [isSinging, setIsSinging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [isShaking, setIsShaking] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentNoteIdxRef = useRef(0);
  const targetCollegeRef = useRef<CollegeId>('ewha');

  // 대학별 변경점 실시간 반영을 위한 ref 동기화
  useEffect(() => {
    targetCollegeRef.current = targetCollege;
  }, [targetCollege]);

  // 대학별 8마디 멜로디 생성 알고리즘
  const generate8BarMelody = (collegeId: CollegeId = targetCollege) => {
    const notes = Object.keys(NOTE_FREQS);
    const newMelody: string[] = [];
    const newBass: string[] = [];

    if (collegeId === 'ewha') {
      // 🌸 이화여대: 반음계 장/단 2도 및 3도 도약 진행
      let currentIdx = notes.indexOf('C4') + Math.floor(Math.random() * 5);
      for (let i = 0; i < 8; i++) {
        const step = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2 반음
        currentIdx = Math.max(0, Math.min(notes.indexOf('C5'), currentIdx + step));
        newMelody.push(notes[currentIdx]);
      }
    } 
    else if (collegeId === 'khu') {
      // 🦁 경희대 (재즈): Major 7th, Dominant 7th, b9, #11, b13 altered 텐션 진행
      const jazzPool = ['C4', 'E4', 'G4', 'B4', 'Db5', 'F#5', 'Bb5', 'C6', 'Ab4', 'D5', 'G5', 'A5'];
      for (let i = 0; i < 8; i++) {
        newMelody.push(jazzPool[Math.floor(Math.random() * jazzPool.length)]);
      }
    } 
    else if (collegeId === 'hanyang') {
      // 🦅 한양대 (2성부): 주선율(Soprano C5-C6)과 방해선율(Bass C4-B4) 동시 구동
      const sopPool = notes.filter(n => n.includes('5') || n === 'C6');
      const bassPool = notes.filter(n => n.includes('4'));
      for (let i = 0; i < 8; i++) {
        newMelody.push(sopPool[Math.floor(Math.random() * sopPool.length)]);
        newBass.push(bassPool[Math.floor(Math.random() * bassPool.length)]);
      }
    } 
    else if (collegeId === 'yonsei') {
      // 🔵 연세대 (급격한 조바꿈): C Major -> F# Major(증4도 조) -> D minor로 전조
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
      // 👑 서울대 수석 (무조성 12음기법): 조성이 없도록 음정 도약. 증4도, 단9도, 장7도만 강제 배치.
      let prevNote = 'C4';
      newMelody.push(prevNote);
      for (let i = 1; i < 8; i++) {
        const prevFreq = NOTE_FREQS[prevNote];
        const atonalCandidates = notes.filter(n => {
          const f = NOTE_FREQS[n];
          const diff = Math.abs(Math.round(12 * Math.log2(f / prevFreq)));
          return [1, 6, 11, 13].includes(diff); // 단2도, 증4도, 장7도, 단9도
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
    
    // 대학 레벨별 타이머 차등 (서울대는 시간 극단적으로 단축)
    const limitTime = collegeId === 'snu' ? 15 : collegeId === 'yonsei' ? 18 : 25;
    setTimeLeft(limitTime);
    setGameState('playing');
  };

  // 피아노 단음 재생
  const playPianoNote = (note: string) => {
    const freq = NOTE_FREQS[note];
    if (freq) {
      AudioHelper.playPianoTone(freq, 1.2);
      setActivePressKey(note);
      setTimeout(() => setActivePressKey(null), 200);
    }
  };

  // 멜로디 재생 (한양대의 경우 2성부 동시 출력)
  const playFullMelody = async () => {
    if (isPlayingMelody || melody.length === 0) return;
    setIsPlayingMelody(true);

    for (let i = 0; i < melody.length; i++) {
      const sopFreq = NOTE_FREQS[melody[i]];
      
      // 주선율 재생
      AudioHelper.playPianoTone(sopFreq, 0.7);
      
      // 베이스 성부 방해선율 동시 재생 (한양대 2성부 대위법용)
      if (targetCollege === 'hanyang' && bassMelody[i]) {
        const bassFreq = NOTE_FREQS[bassMelody[i]] / 2; // 1옥타브 낮춤
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
      handleFail();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState]);

  // 성공 처리
  const handleSuccess = () => {
    // 점수 지급 배율 (서울대/연세대 등 고난이도 대학일수록 기하급수적으로 증가)
    const multiplier = targetCollege === 'snu' ? 5 : targetCollege === 'yonsei' ? 4 : targetCollege === 'hanyang' ? 3 : 2;
    setScore(prev => prev + 1000 * multiplier * (streak + 1));
    setStreak(prev => prev + 1);
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 500);

    setCurrentLevel(prev => prev + 1);
    generate8BarMelody(targetCollege);
  };

  // 실패 처리
  const handleFail = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    setStreak(0);
    
    // 오답 저주음 재생
    AudioHelper.playPianoTone(92.5, 0.8); // Gb2 초저역대 디스코드 음

    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setGameState('gameover');
      } else {
        generate8BarMelody(targetCollege);
      }
      return nextLives;
    });
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
            // 서울대는 오차 0.2초 이내 엄격 판정, 이외 대학은 0.4초
            const threshold = targetCollegeRef.current === 'snu' ? 4 : 6;
            if (matchCount >= threshold) {
              matchCount = 0;
              AudioHelper.playPianoTone(NOTE_FREQS[target], 0.3); // 정답 확인음
              
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
    setScore(0);
    setStreak(0);
    setLives(3);
    setCurrentLevel(1);
    generate8BarMelody(targetCollege);
  };

  // 키보드 상태 클래스
  const getKeyClass = (note: string, isBlack: boolean) => {
    let cls = isBlack ? 'black-key' : 'white-key';
    if (activePressKey === note) cls += ' active-press';
    if (isSinging && detectedNote === note) cls += ' active-press';
    if (feedbackKey && feedbackKey.note === note) {
      cls += feedbackKey.status === 'correct' ? ' feedback-correct' : ' feedback-wrong';
    }
    return cls;
  };

  return (
    <div className="game-container">
      <Head>
        <title>대한민국 5대 음대 입시 청음/시창 챌린지</title>
      </Head>

      {/* 헤더 & 스탯 */}
      <header className="game-header">
        <div className="logo">🎓 음대 입시 챌린지 🎓</div>
        <div className="stats-group">
          <div className="stat-item">Level: <span className="stat-value">{currentLevel}</span></div>
          <div className="stat-item">Score: <span className="stat-value">{score}</span></div>
          <div className="stat-item">Streak: <span className="stat-value">x{streak}</span></div>
          <div className="lives-container">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i}>{i < lives ? '❤️' : '💀'}</span>
            ))}
          </div>
        </div>
      </header>

      {/* 목표 대학 선택 셀렉터 */}
      <div className="college-selector">
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

      {/* 메인 화면 */}
      <main className={`main-display ${isShaking ? 'shake' : ''} ${isPopping ? 'success-pop' : ''}`}>
        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'ear' ? 'active' : ''}`}
            onClick={() => { setMode('ear'); setGameState('idle'); Tracker.stopTracking(); setIsSinging(false); }}
          >
            🎹 입시 청음 (Ear)
          </button>
          <button 
            className={`mode-btn ${mode === 'sight' ? 'active' : ''}`}
            onClick={() => { setMode('sight'); setGameState('idle'); }}
          >
            🎤 입시 시창 (Vocal)
          </button>
        </div>

        {/* 선택된 대학 디테일 정보 */}
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <span style={{ color: 'var(--beast-yellow)', fontWeight: 'bold' }}>
            난이도: {COLLEGES.find(c => c.id === targetCollege)?.difficulty}
          </span>
          <p style={{ color: '#aaa', fontSize: '0.95rem', margin: '0.3rem 0 1rem 0' }}>
            {COLLEGES.find(c => c.id === targetCollege)?.description}
          </p>
        </div>

        {gameState === 'idle' && (
          <div>
            <h1 className="question-title">
              {mode === 'ear' 
                ? '입시 과제 8마디를 완벽히 연주해라!' 
                : '입시 과제 8마디를 악보 없이 시창해라!'}
            </h1>
            <button className="action-btn" onClick={startGame}>입시 시작 🚀</button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <h2 className="question-title">
              {targetCollege === 'hanyang' ? '🔊 [2성부 대위법] 소프라노 선율을 맞추세요!' : '과제 수행 중...'}
            </h2>

            {/* 8마디 악보/음표 */}
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
                  {isPlayingMelody ? '🔊 음계 재생 중...' : '🔊 8마디 과제 듣기'}
                </button>
              </div>
            ) : (
              <div>
                <div className="visualizer-box">
                  <span className="detected-pitch">내 음정: {detectedNote}</span>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <button 
                    className="action-btn" 
                    onClick={() => setIsSinging(prev => !prev)}
                  >
                    {isSinging ? '⏹ 감지 중지' : '🎙 노래하기 시작'}
                  </button>
                </div>
              </div>
            )}

            {/* 타이머 바 */}
            <div className="progress-bar-container">
              <div 
                className={`progress-bar ${timeLeft <= 5 ? 'critical' : ''}`}
                style={{ width: `${(timeLeft / (targetCollege === 'snu' ? 15 : targetCollege === 'yonsei' ? 18 : 25)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div>
            <h1 className="question-title" style={{ color: 'var(--error)' }}>💀 불합격 (GAME OVER) 💀</h1>
            <p className="quest-desc">최종 점수: {score} | 불합격 지점: Level {currentLevel}</p>
            <button className="action-btn" onClick={startGame}>재수 도전 🔄</button>
          </div>
        )}
      </main>

      {/* 피아노 건반 */}
      <section className="piano-section">
        <h3 className="piano-title">🎹 입시 평가용 피아노 건반</h3>
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
              style={{ left: `${black.parentIdx * 44 + 31}px` }}
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
