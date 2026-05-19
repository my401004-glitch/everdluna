// src/pages/challenge.tsx
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { AudioEngine, NOTE_FREQS } from '../components/music/AudioEngine';
import { PitchDetector } from '../components/music/PitchDetector';
import '../styles/challenge.css';

const AudioHelper = new AudioEngine();
const Tracker = new PitchDetector();

export default function ChallengePage() {
  const [mode, setMode] = useState<'ear' | 'sight'>('ear');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetNote, setTargetNote] = useState<string>('');
  const [choices, setChoices] = useState<string[]>([]);
  const [detectedNote, setDetectedNote] = useState<string>('듣는 중...');
  const [isSinging, setIsSinging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [isShaking, setIsShaking] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 문제 생성
  const generateQuestion = () => {
    const notes = Object.keys(NOTE_FREQS);
    // 현재 레벨에 따라 범위 제한
    const limit = 4 + currentLevel * 3;
    const pool = notes.slice(0, Math.min(limit, notes.length));
    const target = pool[Math.floor(Math.random() * pool.length)];
    setTargetNote(target);

    // 4개 선택지 구성
    const incorrect = pool.filter(n => n !== target);
    const shuffledIncorrect = incorrect.sort(() => 0.5 - Math.random()).slice(0, 3);
    const finalChoices = [target, ...shuffledIncorrect].sort(() => 0.5 - Math.random());
    setChoices(finalChoices);

    setTimeLeft(Math.max(3, 8 - currentLevel)); // 레벨이 오를수록 빨라짐
    setGameState('playing');
  };

  // 소리 재생 (청음 모드)
  const playCurrentTarget = () => {
    if (!targetNote) return;
    const freq = NOTE_FREQS[targetNote];
    AudioHelper.playTone(freq, 'triangle', 1.0);
  };

  // 시간 카운트다운 루프
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
    setScore(prev => prev + 100 * (streak + 1));
    setStreak(prev => prev + 1);
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 500);

    if ((score + 100) % 500 === 0) {
      setCurrentLevel(prev => prev + 1);
    }
    generateQuestion();
  };

  // 실패 처리
  const handleFail = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
    setStreak(0);
    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setGameState('gameover');
      } else {
        generateQuestion();
      }
      return nextLives;
    });
  };

  // 객관식 선택 시 (청음 모드)
  const handleChoice = (selected: string) => {
    if (selected === targetNote) {
      handleSuccess();
    } else {
      handleFail();
    }
  };

  // 시창 감지 루프
  useEffect(() => {
    if (mode === 'sight' && isSinging && gameState === 'playing') {
      let matchCount = 0;
      Tracker.startTracking((freq) => {
        const result = PitchDetector.getNoteFromFreq(freq);
        if (result) {
          setDetectedNote(result.note);
          if (result.note === targetNote) {
            matchCount++;
            if (matchCount >= 8) { // 8프레임 연속 일치 시 (약 0.5초)
              Tracker.stopTracking();
              setIsSinging(false);
              handleSuccess();
            }
          } else {
            matchCount = 0;
          }
        } else {
          setDetectedNote('소리 없음');
        }
      }).catch(err => {
        alert(err.message);
        setIsSinging(false);
      });
    }

    return () => {
      Tracker.stopTracking();
    };
  }, [isSinging, mode, gameState, targetNote]);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setLives(3);
    setCurrentLevel(1);
    generateQuestion();
  };

  return (
    <div className="game-container">
      <Head>
        <title>MR.BEAST MUSIC CHALLENGE</title>
      </Head>

      {/* 헤더 & 스탯 */}
      <header className="game-header">
        <div className="logo">⚡ BEAST EAR ⚡</div>
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
            🔥 청음 모드 (Ear)
          </button>
          <button 
            className={`mode-btn ${mode === 'sight' ? 'active' : ''}`}
            onClick={() => { setMode('sight'); setGameState('idle'); }}
          >
            🎤 시창 모드 (Vocal)
          </button>
        </div>

        {gameState === 'idle' && (
          <div>
            <h1 className="question-title">
              {mode === 'ear' 
                ? '들리는 음정을 맞춰라!' 
                : '보이는 음정을 정확히 불러라!'}
            </h1>
            <p className="quest-desc">
              {mode === 'ear'
                ? '가장 높은 스트릭을 달성해 랭킹 보드에 이름을 남기세요!'
                : '마이크를 허용하고 실시간으로 음정을 분석합니다.'}
            </p>
            <button className="action-btn" onClick={startGame}>챌린지 시작 🚀</button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <h2 className="question-title">
              {mode === 'ear' ? '이 음정은 무엇일까요?' : `표시된 음을 노래하세요: ${targetNote}`}
            </h2>

            {mode === 'ear' ? (
              <div>
                <button className="action-btn" onClick={playCurrentTarget}>🔊 소리 다시 듣기</button>
                <div className="choice-grid">
                  {choices.map((choice, i) => (
                    <button key={i} className="choice-btn" onClick={() => handleChoice(choice)}>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="visualizer-box">
                  <span className="detected-pitch">{detectedNote}</span>
                </div>
                <button 
                  className="action-btn" 
                  onClick={() => setIsSinging(prev => !prev)}
                >
                  {isSinging ? '⏹ 감지 중지' : '🎙 노래하기 시작'}
                </button>
              </div>
            )}

            {/* 프로그레스 바 타이머 */}
            <div className="progress-bar-container">
              <div 
                className={`progress-bar ${timeLeft <= 2 ? 'critical' : ''}`}
                style={{ width: `${(timeLeft / (Math.max(3, 8 - currentLevel))) * 100}%` }}
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
    </div>
  );
}
