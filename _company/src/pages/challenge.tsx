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

export default function ChallengePage() {
  const [mode, setMode] = useState<'ear' | 'sight'>('ear');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);

  // 8마디 음계/멜로디 상태
  const [melody, setMelody] = useState<string[]>([]);
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

  // 레벨별 멜로디 생성 (8음정)
  const generate8BarMelody = () => {
    const notes = Object.keys(NOTE_FREQS);
    // 레벨에 따라 고를 수 있는 음정 범위 확장
    const limit = Math.min(6 + currentLevel * 2, notes.length);
    const pool = notes.slice(0, limit);

    const newMelody: string[] = [];
    for (let i = 0; i < 8; i++) {
      newMelody.push(pool[Math.floor(Math.random() * pool.length)]);
    }

    setMelody(newMelody);
    setCurrentNoteIdx(0);
    currentNoteIdxRef.current = 0;
    setTimeLeft(25); // 8마디 도전이므로 충분한 시간 부여
    setGameState('playing');
  };

  // 피아노 건반 소리 재생 + 건반 누름 효과
  const playPianoNote = (note: string) => {
    const freq = NOTE_FREQS[note];
    if (freq) {
      AudioHelper.playPianoTone(freq, 1.2);
      setActivePressKey(note);
      setTimeout(() => setActivePressKey(null), 200);
    }
  };

  // 8마디 전체 재생 (청음용)
  const playFullMelody = async () => {
    if (isPlayingMelody || melody.length === 0) return;
    setIsPlayingMelody(true);
    const freqs = melody.map(n => NOTE_FREQS[n]);
    await AudioHelper.playSequence(freqs, 0.6, 0.3);
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
    setScore(prev => prev + 500 * (streak + 1));
    setStreak(prev => prev + 1);
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 500);

    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
    }
    generate8BarMelody();
  };

  // 실패 처리
  const handleFail = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    setStreak(0);
    
    // 오답 효과음
    AudioHelper.playPianoTone(110, 0.6); // A2 낮은 주파수 버즈

    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setGameState('gameover');
      } else {
        generate8BarMelody();
      }
      return nextLives;
    });
  };

  // 청음 모드: 건반 입력 시 정오답 체크
  const handleKeyboardInput = (note: string) => {
    if (gameState !== 'playing' || isPlayingMelody) return;

    playPianoNote(note);
    const target = melody[currentNoteIdx];

    if (note === target) {
      // 정답 피드백
      setFeedbackKey({ note, status: 'correct' });
      setTimeout(() => setFeedbackKey(null), 300);

      const nextIdx = currentNoteIdx + 1;
      setCurrentNoteIdx(nextIdx);
      currentNoteIdxRef.current = nextIdx;

      if (nextIdx >= 8) {
        handleSuccess();
      }
    } else {
      // 오답 피드백
      setFeedbackKey({ note, status: 'wrong' });
      setTimeout(() => setFeedbackKey(null), 300);
      handleFail();
    }
  };

  // 시창 모드: 실시간 목소리 감지
  useEffect(() => {
    if (mode === 'sight' && isSinging && gameState === 'playing') {
      let matchCount = 0;
      Tracker.startTracking((freq) => {
        const result = PitchDetector.getNoteFromFreq(freq);
        if (result) {
          setDetectedNote(result.note);
          
          // 현재 맞추고 있는 목표 음정
          const target = melody[currentNoteIdxRef.current];

          if (result.note === target) {
            matchCount++;
            if (matchCount >= 6) { // 약 0.4초간 올바른 음 유지 시
              matchCount = 0;
              // 정답 효과음
              AudioHelper.playPianoTone(NOTE_FREQS[target], 0.4);
              
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
    generate8BarMelody();
  };

  // 키보드 키 상태 클래스 계산
  const getKeyClass = (note: string, isBlack: boolean) => {
    let cls = isBlack ? 'black-key' : 'white-key';
    
    // 사용자가 건반을 눌렀을 때
    if (activePressKey === note) {
      cls += ' active-press';
    }

    // 마이크 시창 시 실시간 음정 하이라이트
    if (isSinging && detectedNote === note) {
      cls += ' active-press';
    }

    // 정오답 피드백
    if (feedbackKey && feedbackKey.note === note) {
      cls += feedbackKey.status === 'correct' ? ' feedback-correct' : ' feedback-wrong';
    }

    return cls;
  };

  return (
    <div className="game-container">
      <Head>
        <title>MR.BEAST 8-BAR PIANO CHALLENGE</title>
      </Head>

      {/* 헤더 & 스탯 */}
      <header className="game-header">
        <div className="logo">⚡ BEAST PIANO ⚡</div>
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

      {/* 메인 화면 */}
      <main className={`main-display ${isShaking ? 'shake' : ''} ${isPopping ? 'success-pop' : ''}`}>
        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'ear' ? 'active' : ''}`}
            onClick={() => { setMode('ear'); setGameState('idle'); Tracker.stopTracking(); setIsSinging(false); }}
          >
            🎹 8마디 청음 (Ear)
          </button>
          <button 
            className={`mode-btn ${mode === 'sight' ? 'active' : ''}`}
            onClick={() => { setMode('sight'); setGameState('idle'); }}
          >
            🎤 8마디 시창 (Vocal)
          </button>
        </div>

        {gameState === 'idle' && (
          <div>
            <h1 className="question-title">
              {mode === 'ear' 
                ? '재생되는 8마디 음계를 듣고 피아노로 연주해라!' 
                : '표시된 8마디 음계를 마이크에 순서대로 불러라!'}
            </h1>
            <p className="quest-desc">
              {mode === 'ear'
                ? '실제 피아노 음원이 재생됩니다. 똑같이 따라 치세요!'
                : '마이크를 켜고 실시간 보컬 음치 탈출에 도전하세요!'}
            </p>
            <button className="action-btn" onClick={startGame}>챌린지 시작 🚀</button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <h2 className="question-title">
              {mode === 'ear' ? '들려주는 8마디 음계를 받아치세요!' : '음계 시창 도전!'}
            </h2>

            {/* 8마디 음계 진척도 인디케이터 */}
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
                  {isPlayingMelody ? '🔊 재생 중...' : '🔊 8마디 멜로디 듣기'}
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
                style={{ width: `${(timeLeft / 25) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div>
            <h1 className="question-title" style={{ color: 'var(--error)' }}>💀 GAME OVER 💀</h1>
            <p className="quest-desc">최종 레벨: {currentLevel} | 최종 스코어: {score}</p>
            <button className="action-btn" onClick={startGame}>다시 도전하기 🔄</button>
          </div>
        )}
      </main>

      {/* 2옥타브 인터랙티브 피아노 섹션 */}
      <section className="piano-section">
        <h3 className="piano-title">🎹 실시간 피아노 건반 (마우스 클릭 또는 음계 확인)</h3>
        <div className="piano-keyboard">
          {/* 백건 렌더링 */}
          {WHITE_KEYS.map((note, index) => (
            <div 
              key={note} 
              className={getKeyClass(note, false)}
              onClick={() => handleKeyboardInput(note)}
            >
              {note}
            </div>
          ))}

          {/* 흑건 렌더링 (백건 위에 절대 좌표로 오버레이) */}
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
