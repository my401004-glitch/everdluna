import React, { useState, useEffect } from 'react';
import { Music, Activity, Clock, ChevronRight, CheckCircle, AlertTriangle, ArrowRight, PlayCircle, BarChart3, Star, Zap } from 'lucide-react';

// --- Type Definitions (from diagnosis.ts) ---
type DiagnosisType = 'Harmony' | 'PitchDeviation' | 'Rhythm';

interface DiagnosisResult {
  overallGapScore: number;
  isSuccessful: boolean;
  summaryMessage: string;
  kpis: {
    growthScore: number;
    engagementScore: number;
    monetizationPotential: number;
  };
  detailedReportData: {
    weakestAreas: Array<{
      areaName: string;
      score: number;
      recommendation: string;
    }>;
  };
}

export default function MusicEducationApp() {
  const [step, setStep] = useState<'landing' | 'diagnosis' | 'analyzing' | 'result'>('landing');
  const [activeTab, setActiveTab] = useState<DiagnosisType>('Harmony');
  const [progress, setProgress] = useState(0);

  // --- Mock Test Handlers ---
  const handleStartTest = () => {
    setStep('diagnosis');
  };

  const handleFinishTest = () => {
    setStep('analyzing');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('result'), 500);
      }
    }, 100);
  };

  const mockResult: DiagnosisResult = {
    overallGapScore: 68,
    isSuccessful: true,
    summaryMessage: "리듬감은 매우 우수하나, 화성학적 이해도와 피치 정확도에서 주의가 필요합니다. 기초 이론과 피치 트레이닝을 병행하면 폭발적인 성장이 기대됩니다.",
    kpis: {
      growthScore: 0.85,
      engagementScore: 0.92,
      monetizationPotential: 0.88,
    },
    detailedReportData: {
      weakestAreas: [
        { areaName: "화성학 기초 (Harmony)", score: 45, recommendation: "초급 화성학 이론 클래스 마스터하기" },
        { areaName: "피치 정확도 (Pitch)", score: 62, recommendation: "보컬/악기 피치 트레이닝 모듈 1단계" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl tracking-tight">
            <Music className="w-6 h-6" />
            <span>SoundMind AI</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">프로그램 소개</a>
            <a href="#" className="hover:text-white transition-colors">AI 진단</a>
            <a href="#" className="hover:text-white transition-colors">수강 후기</a>
          </div>
          <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all">
            로그인
          </button>
        </div>
      </nav>

      <main className="pt-16 min-h-screen flex flex-col items-center">
        {step === 'landing' && (
          <LandingSection onStart={handleStartTest} />
        )}

        {step === 'diagnosis' && (
          <DiagnosisTestSection 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onFinish={handleFinishTest} 
          />
        )}

        {step === 'analyzing' && (
          <AnalyzingSection progress={progress} />
        )}

        {step === 'result' && (
          <ResultSection result={mockResult} />
        )}
      </main>
    </div>
  );
}

// --- Components ---

function LandingSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20 mb-4">
          <SparklesIcon className="w-4 h-4" />
          데이터 기반 실용음악 교육의 새로운 패러다임
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          당신의 음악적 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Gap</span>을 <br className="hidden md:block"/>
          정확히 진단하고 채워드립니다.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AI가 당신의 화성학, 피치, 리듬 능력을 다각도로 분석하여<br/>
          가장 빠르고 효율적인 맞춤형 학습 로드맵을 제시합니다.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">AI 무료 진단 시작하기</span>
            <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg text-slate-300 transition-all duration-300 flex items-center gap-3">
            <PlayCircle className="w-5 h-5" />
            데모 영상 보기
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 text-left">
          {[
            { icon: <Music className="w-6 h-6 text-indigo-400"/>, title: '화성학 (Harmony)', desc: '코드 진행과 스케일의 이해도를 측정합니다.' },
            { icon: <Activity className="w-6 h-6 text-cyan-400"/>, title: '피치 정확도 (Pitch)', desc: '미세한 음정의 차이를 감지하고 교정합니다.' },
            { icon: <Clock className="w-6 h-6 text-emerald-400"/>, title: '리듬감 (Rhythm)', desc: '그루브와 타이밍, 박자 쪼개기 능력을 분석합니다.' },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <div className="p-3 bg-white/5 rounded-xl inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiagnosisTestSection({ activeTab, setActiveTab, onFinish }: { activeTab: string, setActiveTab: (t: DiagnosisType) => void, onFinish: () => void }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">실력 진단 테스트</h2>
        <p className="text-slate-400">세 가지 핵심 영역에 대한 당신의 현재 상태를 측정합니다.</p>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-8 overflow-x-auto">
        {(['Harmony', 'PitchDeviation', 'Rhythm'] as DiagnosisType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab === 'Harmony' ? '화성학' : tab === 'PitchDeviation' ? '피치' : '리듬'}
          </button>
        ))}
      </div>

      {/* Mock Test Interface */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl min-h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <span className="text-indigo-400 font-medium tracking-widest text-sm uppercase">Question 1 of 5</span>
          <span className="text-slate-500 text-sm">남은 시간: 02:45</span>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-10">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center shadow-inner relative group cursor-pointer border border-slate-700 hover:border-indigo-500 transition-colors">
            <PlayCircle className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full animate-ping bg-indigo-500/20 opacity-0 group-hover:opacity-100" />
          </div>
          
          <h3 className="text-2xl font-medium">
            {activeTab === 'Harmony' && '다음 들려주는 코드의 텐션(Tension) 음은 무엇인가요?'}
            {activeTab === 'PitchDeviation' && '두 음의 피치 차이를 듣고 올바른 설명을 고르세요.'}
            {activeTab === 'Rhythm' && '다음 루프에서 베이스 드럼이 들어가는 박자는?'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
              <button key={i} className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-indigo-600 hover:border-indigo-500 transition-all text-left font-medium">
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onFinish}
            className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            테스트 완료 후 분석하기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyzingSection({ progress }: { progress: number }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500 w-full max-w-md mx-auto px-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke="#6366f1" 
            strokeWidth="8" 
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <Zap className="w-10 h-10 text-indigo-400 animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">AI 분석 중...</h3>
        <p className="text-slate-400">수집된 데이터를 기반으로 Gap Score를 계산하고 있습니다.</p>
        <div className="mt-4 text-3xl font-extrabold text-indigo-400">{progress}%</div>
      </div>
    </div>
  );
}

function ResultSection({ result }: { result: DiagnosisResult }) {
  const gapLevel = result.overallGapScore >= 80 ? 'High' : result.overallGapScore >= 50 ? 'Medium' : 'Low';
  
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold mb-4">당신의 학습 리포트</h2>
        <p className="text-slate-400 text-lg">AI가 분석한 현재의 객관적인 위치와 앞으로의 성장 로드맵입니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Core Gap Score Card */}
        <div className="lg:col-span-1 bg-gradient-to-b from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          
          <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-4">Overall Gap Score</span>
          <div className="text-8xl font-black text-white mb-2 tracking-tighter">
            {result.overallGapScore}
          </div>
          <div className="text-slate-400 font-medium mb-6">/ 100 점 (학습 격차)</div>
          
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
            gapLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {gapLevel} 위험 레벨 (집중 개선 필요)
          </div>
        </div>

        {/* Summary & Weakness Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> 종합 코멘트
            </h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              {result.summaryMessage}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> 시급한 개선 영역
            </h3>
            <div className="space-y-4">
              {result.detailedReportData.weakestAreas.map((area, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 gap-4">
                  <div>
                    <div className="font-bold text-lg mb-1">{area.areaName}</div>
                    <div className="text-sm text-rose-400 font-medium">현재 점수: {area.score}점</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400 mb-2">추천 솔루션</div>
                    <div className="text-sm font-semibold text-indigo-300">{area.recommendation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: '성장 가능성 (Growth)', val: result.kpis.growthScore, color: 'text-emerald-400' },
          { label: '참여도 지수 (Engagement)', val: result.kpis.engagementScore, color: 'text-cyan-400' },
          { label: '잠재력 지표 (Potential)', val: result.kpis.monetizationPotential, color: 'text-purple-400' },
        ].map((kpi, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-sm font-bold text-slate-500 mb-2">{kpi.label}</div>
            <div className={`text-4xl font-black ${kpi.color}`}>
              {(kpi.val * 100).toFixed(0)}<span className="text-xl">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monetization CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-3xl font-extrabold mb-4">이제, 실력을 한 단계 도약할 시간입니다.</h3>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          AI 진단 결과를 바탕으로 설계된 1:1 맞춤형 커리큘럼으로<br/>
          가장 빠르게 당신의 목표에 도달하세요.
        </p>
        <button className="px-10 py-4 bg-white text-indigo-900 rounded-full font-extrabold text-lg hover:scale-105 transition-transform shadow-xl">
          맞춤형 프리미엄 코스 시작하기
        </button>
      </div>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
