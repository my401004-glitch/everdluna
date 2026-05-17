import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function App() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Switch mode
      const nextIsFocus = !isFocus;
      setIsFocus(nextIsFocus);
      setTimeLeft(nextIsFocus ? FOCUS_TIME : BREAK_TIME);
      setIsRunning(false); // Stop when phase ends, user has to start next phase
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isFocus]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isFocus ? FOCUS_TIME : BREAK_TIME);
  };

  const switchMode = (mode) => {
    setIsRunning(false);
    setIsFocus(mode === 'focus');
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentage = isFocus 
    ? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100 
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Cute decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide flex items-center justify-center gap-2">
            {isFocus ? <Brain className="text-pink-400" /> : <Coffee className="text-indigo-400" />}
            {isFocus ? 'Focus Time!' : 'Break Time~'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isFocus ? 'Stay productive, you got this! 💪' : 'Relax and recharge! ☕️'}
          </p>
        </div>

        {/* Mode Switchers */}
        <div className="flex justify-center gap-4 mb-8 bg-slate-700/50 p-1.5 rounded-full">
          <button
            onClick={() => switchMode('focus')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
              isFocus 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
              !isFocus 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative flex justify-center items-center mb-10">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-slate-700"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className={`transition-all duration-1000 ease-linear ${isFocus ? 'stroke-pink-500' : 'stroke-indigo-500'}`}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={120 * 2 * Math.PI}
              strokeDashoffset={120 * 2 * Math.PI - (percentage / 100) * 120 * 2 * Math.PI}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-black text-white tracking-tight tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-slate-400 font-medium mt-2 animate-pulse">
              {isRunning ? 'Running...' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600 hover:text-white transition-all active:scale-95"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-xl ${
              isFocus 
                ? 'bg-gradient-to-br from-pink-400 to-pink-600 shadow-pink-500/40 hover:from-pink-300 hover:to-pink-500' 
                : 'bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-indigo-500/40 hover:from-indigo-300 hover:to-indigo-500'
            }`}
          >
            {isRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
