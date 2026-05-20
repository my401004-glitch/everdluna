import { useState } from 'react';
import { 
  Music, 
  Activity, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  ArrowRight, 
  PlayCircle, 
  Star, 
  Zap, 
  Users, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Search, 
  UserPlus, 
  Download 
} from 'lucide-react';

// --- Type Definitions ---
type DiagnosisType = 'Harmony' | 'PitchDeviation' | 'Rhythm';
type ViewMode = 'student' | 'academy';

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

interface TraineeRecord {
  id: string;
  name: string;
  classType: string;
  latestGapScore: number;
  pitch: number;
  harmony: number;
  rhythm: number;
  attendanceRate: number;
  auditionReadiness: 'Ready' | 'Developing' | 'Needs Work';
  latestTestDate: string;
}

export default function MusicEducationApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const [step, setStep] = useState<'landing' | 'diagnosis' | 'analyzing' | 'result'>('landing');
  const [activeTab, setActiveTab] = useState<DiagnosisType>('Harmony');
  const [progress, setProgress] = useState(0);
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeRecord | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

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
    overallGapScore: 84,
    isSuccessful: true,
    summaryMessage: "K-Pop 메인보컬 데뷔조 수준의 우수한 기본 주파수(F0) 유지력과 음정 제어력을 갖추고 있으나, 고음역 벨팅(Belting) 시 인두강 공명(Singer's Formant) 공간 확장이 더 필요합니다.",
    kpis: {
      growthScore: 0.94,
      engagementScore: 0.89,
      monetizationPotential: 0.95,
    },
    detailedReportData: {
      weakestAreas: [
        { areaName: "성도 공명 조절 (Singer's Formant)", score: 58, recommendation: "2.5kHz ~ 3.2kHz 증폭을 위한 상후두관 조임 압력 최적화" },
        { areaName: "화성 배음 결합력 (Overtone Dynamics)", score: 67, recommendation: "성대 접촉 비율 향상을 위한 가성구 스케일 훈련" }
      ]
    }
  };

  const mockTrainees: TraineeRecord[] = [
    { id: 'T001', name: '카리나 (K)', classType: 'SM 차기 여성 데뷔조 (V)', latestGapScore: 88, pitch: 86, harmony: 80, rhythm: 92, attendanceRate: 98, auditionReadiness: 'Ready', latestTestDate: '2026-05-19' },
    { id: 'T002', name: '윈터 (W)', classType: 'SM 차기 여성 데뷔조 (V)', latestGapScore: 92, pitch: 94, harmony: 88, rhythm: 90, attendanceRate: 99, auditionReadiness: 'Ready', latestTestDate: '2026-05-20' },
    { id: 'T003', name: '이마크 (M)', classType: '글로벌 보이그룹 프로젝트', latestGapScore: 68, pitch: 62, harmony: 58, rhythm: 88, attendanceRate: 85, auditionReadiness: 'Developing', latestTestDate: '2026-05-18' },
    { id: 'T004', name: '닝닝 (N)', classType: 'SM 차기 여성 데뷔조 (V)', latestGapScore: 85, pitch: 88, harmony: 82, rhythm: 80, attendanceRate: 95, auditionReadiness: 'Ready', latestTestDate: '2026-05-17' },
    { id: 'T005', name: '강태민 (T)', classType: '보컬 심화 클래스', latestGapScore: 54, pitch: 48, harmony: 52, rhythm: 62, attendanceRate: 78, auditionReadiness: 'Needs Work', latestTestDate: '2026-05-15' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-[#FF007A]/30">
      {/* Navigation - SM Styled */}
      <nav className="fixed w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
              <span className="text-[#FF007A]">SM</span>
              <span className="text-zinc-400">|</span>
              <span className="text-white tracking-widest text-sm font-semibold">SOUNDMIND AI</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/20 font-bold uppercase tracking-widest">
              OFFICIAL PARTNER
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* View Mode Toggle Switch */}
            <div className="flex p-0.5 bg-zinc-900 rounded-xl border border-zinc-800">
              <button 
                onClick={() => { setViewMode('student'); setStep('landing'); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'student' 
                    ? 'bg-[#FF007A] text-white shadow-lg shadow-[#FF007A]/20' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                트레이니 진단
              </button>
              <button 
                onClick={() => setViewMode('academy')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'academy' 
                    ? 'bg-[#FF007A] text-white shadow-lg shadow-[#FF007A]/20' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                글로벌 아카데미 콘솔
              </button>
            </div>

            <div className="hidden md:flex gap-6 text-xs font-bold tracking-widest text-zinc-300">
              <a href="#" className="hover:text-[#FF007A] transition-colors">ARTISTS</a>
              <a href="#" className="hover:text-[#FF007A] transition-colors">AUDITION</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pt-16 min-h-screen flex flex-col">
        {viewMode === 'student' ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            {step === 'landing' && <LandingSection onStart={handleStartTest} />}
            {step === 'diagnosis' && (
              <DiagnosisTestSection 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onFinish={handleFinishTest} 
              />
            )}
            {step === 'analyzing' && <AnalyzingSection progress={progress} />}
            {step === 'result' && <ResultSection result={mockResult} />}
          </div>
        ) : (
          <AcademyDashboard 
            trainees={mockTrainees}
            onOpenReport={(trainee) => {
              setSelectedTrainee(trainee);
              setReportModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Consultation Report Generator Modal */}
      {reportModalOpen && selectedTrainee && (
        <ConsultationReportModal 
          trainee={selectedTrainee} 
          onClose={() => setReportModalOpen(false)} 
        />
      )}
    </div>
  );
}

// ==========================================
// STUDENT VIEW COMPONENTS - SM ENTERTAINMENT STYLE
// ==========================================

function LandingSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden py-12">
      {/* SM Pink Glow System */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF007A]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF007A]/10 text-[#FF007A] text-xs font-bold border border-[#FF007A]/20 tracking-widest uppercase">
          <Zap className="w-3.5 h-3.5" />
          SM Entertainment Vocal Analysis Standard
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.05] uppercase">
          CHALLENGE YOUR <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007A] via-purple-500 to-cyan-400">VOCAL LIMIT</span>
        </h1>
        
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed tracking-wider font-light">
          SM의 프로페셔널 보컬 분석 기술이 당신의 F0 주파수 편차, <br/>
          성도 포먼트 및 옥타브 화성 안정성을 고밀도로 진단합니다.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="group relative px-10 py-4.5 bg-[#FF007A] hover:bg-[#E0006C] text-white rounded-none font-bold tracking-widest text-sm transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,0,122,0.4)] flex items-center gap-3 overflow-hidden"
          >
            <span>START DIAGNOSIS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-10 py-4.5 bg-transparent border border-zinc-700 hover:border-zinc-200 text-zinc-300 hover:text-white rounded-none font-bold tracking-widest text-sm transition-all duration-300">
            TRAINING SCHEME
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 text-left">
          {[
            { icon: <Music className="w-5 h-5 text-[#FF007A]"/>, title: 'TONE & HARMONY', desc: '곡 해석도와 주파수 음색 밸런스를 측정합니다.' },
            { icon: <Activity className="w-5 h-5 text-purple-400"/>, title: 'PITCH STABILITY', desc: '고음 성대 유지력과 진동 정확도를 분석합니다.' },
            { icon: <Clock className="w-5 h-5 text-cyan-400"/>, title: 'BEAT SYNCOPATION', desc: '정교한 댄스 비트 내 리듬 분배율을 측정합니다.' },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-none bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all duration-300">
              <div className="mb-4 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiagnosisTestSection({ activeTab, setActiveTab, onFinish }: { activeTab: string, setActiveTab: (t: DiagnosisType) => void, onFinish: () => void }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 border-b border-zinc-800 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white">SM Trainee Auditing</h2>
          <p className="text-zinc-400 text-xs mt-1">공인 분석 기준에 근거한 음향 데이터 피드백 테스트</p>
        </div>
        <span className="text-xs text-[#FF007A] font-bold">LEVEL A1-V</span>
      </div>

      <div className="flex gap-2 p-1 bg-zinc-900 rounded-none border border-zinc-800 mb-8 overflow-x-auto">
        {(['Harmony', 'PitchDeviation', 'Rhythm'] as DiagnosisType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-none text-xs font-bold tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-[#FF007A] text-white shadow-lg' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            {tab === 'Harmony' ? 'HARMONY (화성학)' : tab === 'PitchDeviation' ? 'PITCH (음정)' : 'RHYTHM (리듬)'}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-850 p-8 rounded-none min-h-[420px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#FF007A] font-bold tracking-widest text-xs uppercase">VOCAL TRIAL 01</span>
          <span className="text-zinc-500 text-xs">TIMER: 02:45</span>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 my-6">
          {/* Glowing Play Icon */}
          <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center relative group cursor-pointer border border-zinc-800 hover:border-[#FF007A] transition-colors duration-300">
            <PlayCircle className="w-8 h-8 text-[#FF007A] group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full animate-ping bg-[#FF007A]/10 opacity-0 group-hover:opacity-100" />
          </div>
          
          <h3 className="text-lg md:text-xl font-bold max-w-2xl leading-relaxed tracking-wide text-zinc-200">
            {activeTab === 'Harmony' && '아이돌 코러스 파트에서 1도 주 선율 대비 3도 화성 음을 들려줄 때 발생한 배음(Overtone) 간섭 영역은?'}
            {activeTab === 'PitchDeviation' && '고음 애드립 음역대(C5~E5)의 피치 주파수가 기본값 대비 ±12Hz 편차를 보일 때, 해결을 위해 가장 적절한 성대 활성화 근육은?'}
            {activeTab === 'Rhythm' && 'K-Pop 댄스 인트로 비트에서 싱코페이션(당김음) 레이턴시를 최소화하기 위해 악센트를 넣어야 하는 박자를 고르시오.'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {['SYSTEM A: 440Hz / 443Hz 간섭', 'SYSTEM B: 성대 상두 접촉 비율 저하', 'SYSTEM C: 성대 윤상갑상근 활성화 부족', 'SYSTEM D: 성도 포먼트 튜닝 오류'].map((opt, i) => (
              <button key={i} className="p-4 rounded-none border border-zinc-800 bg-zinc-950 hover:bg-[#FF007A] hover:border-[#FF007A] transition-all duration-300 text-left text-xs font-bold tracking-wider">
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button 
            onClick={onFinish}
            className="px-8 py-3 bg-white text-zinc-950 rounded-none font-bold tracking-widest text-xs hover:bg-[#FF007A] hover:text-white transition-colors flex items-center gap-2"
          >
            NEXT MODULE <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyzingSection({ progress }: { progress: number }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500 w-full max-w-md mx-auto px-6 py-12">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#18181b" strokeWidth="6" />
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke="#FF007A" 
            strokeWidth="6" 
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <Zap className="w-8 h-8 text-[#FF007A] animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold tracking-widest uppercase text-white">SM AI COMPUTING</h3>
        <p className="text-zinc-500 text-xs">수집된 주파수 피치 흔들림 및 Gap Score를 분석 중입니다.</p>
        <div className="text-2xl font-black text-[#FF007A] pt-2">{progress}%</div>
      </div>
    </div>
  );
}

function ResultSection({ result }: { result: DiagnosisResult }) {
  const gapLevel = result.overallGapScore >= 80 ? 'Class A (Ready)' : result.overallGapScore >= 50 ? 'Class B' : 'Class C';
  
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="text-center mb-12 space-y-2">
        <h2 className="text-3xl font-black tracking-widest uppercase text-white">SM EVALUATION SHEET</h2>
        <p className="text-zinc-500 text-xs">AI 알고리즘이 도출한 연습생 보컬 핵심 역량 지표</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Gap Score Gauge */}
        <div className="lg:col-span-1 bg-gradient-to-b from-[#FF007A]/10 to-zinc-950 border border-[#FF007A]/20 rounded-none p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF007A] to-transparent opacity-80" />
          
          <span className="text-zinc-400 font-bold tracking-widest text-[10px] uppercase mb-4">SM GAP LEVEL</span>
          <div className="text-8xl font-black text-white mb-2 tracking-tighter">
            {result.overallGapScore}
          </div>
          <div className="text-zinc-500 text-xs font-bold mb-6">/ 100 SCORE</div>
          
          <div className="px-4 py-1.5 rounded-none text-xs font-bold bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]/30 uppercase tracking-widest">
            {gapLevel}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-850 rounded-none p-8">
            <h3 className="text-sm font-bold tracking-widest uppercase mb-3 flex items-center gap-2 text-[#FF007A]">
              <Star className="w-4 h-4" /> TOTAL COMMENTS
            </h3>
            <p className="text-zinc-300 leading-relaxed text-xs font-light">
              {result.summaryMessage}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 rounded-none p-8">
            <h3 className="text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2 text-purple-400">
              <AlertTriangle className="w-4 h-4" /> WEAKNESS TO REPAIR
            </h3>
            <div className="space-y-4">
              {result.detailedReportData.weakestAreas.map((area, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-950 border border-zinc-850 rounded-none gap-4">
                  <div>
                    <div className="font-bold text-xs tracking-widest uppercase mb-1">{area.areaName}</div>
                    <div className="text-xs text-[#FF007A] font-semibold">SCORE: {area.score}</div>
                  </div>
                  <div className="text-right sm:max-w-xs">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">PROPOSED SOLUTION</div>
                    <div className="text-xs font-bold text-zinc-200">{area.recommendation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'VOCAL DEVELOPMENT (성장도)', val: result.kpis.growthScore, color: 'text-emerald-400' },
          { label: 'AUDITION ENGAGEMENT (몰입도)', val: result.kpis.engagementScore, color: 'text-[#FF007A]' },
          { label: 'DEBUT POTENTIAL (데뷔 잠재력)', val: result.kpis.monetizationPotential, color: 'text-cyan-400' },
        ].map((kpi, i) => (
          <div key={i} className="p-6 bg-zinc-900 border border-zinc-850 rounded-none">
            <div className="text-[10px] font-bold text-zinc-500 tracking-wider mb-2">{kpi.label}</div>
            <div className={`text-3xl font-black ${kpi.color}`}>
              {(kpi.val * 100).toFixed(0)}<span className="text-sm">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#FF007A] to-purple-800 rounded-none p-10 text-center relative overflow-hidden">
        <h3 className="text-2xl md:text-3xl font-black tracking-widest uppercase mb-3 text-white">DEBUT TRAINING SYSTEM INVITATION</h3>
        <p className="text-xs text-zinc-200 mb-6 max-w-xl mx-auto leading-relaxed tracking-wider">
          진단 결과 상위 15% 이내 합격 기준을 통과하였습니다. SM 프로페셔널 아티스트 디렉터와 함께하는 1:1 디렉팅 트레이닝 시스템에 정식으로 초대합니다.
        </p>
        <button className="px-10 py-4 bg-zinc-950 text-white hover:bg-white hover:text-zinc-950 rounded-none font-bold text-xs tracking-widest transition-all duration-300">
          APPLY PREMIUM DEBUT CLASS
        </button>
      </div>
    </div>
  );
}

// ==========================================
// B2B ACADEMY VIEW COMPONENTS - SM GLOBAL ACADEMY
// ==========================================

function AcademyDashboard({ 
  trainees, 
  onOpenReport 
}: { 
  trainees: TraineeRecord[]; 
  onOpenReport: (trainee: TraineeRecord) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTrainees = trainees.filter(trainee => 
    trainee.name.includes(searchTerm) || trainee.classType.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full space-y-10 animate-in fade-in duration-500">
      {/* Academy Title and Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-850">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">SM GLOBAL ACADEMY CONSOLE</h1>
          <p className="text-zinc-500 text-xs mt-1">글로벌 데뷔 프로젝트 진행 상황 및 데일리 수강생 보컬 분석 모니터</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2.5 bg-[#FF007A] hover:bg-[#E0006C] rounded-none text-xs font-bold tracking-widest flex items-center gap-2 transition-colors">
            <UserPlus className="w-4 h-4" />
            REGISTER NEW TRAINEE
          </button>
          <button className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-none text-xs font-bold tracking-widest flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            EXPORT EXCEL
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '관리 연습생 수', value: '42 명', change: '차기 보이그룹 프로젝트 가동', trend: 'up', icon: <Users className="w-5 h-5 text-[#FF007A]" /> },
          { label: '평균 AI Gap Score', value: '75.8 점', change: '데뷔 합격 컷 80점', trend: 'up', icon: <Activity className="w-5 h-5 text-purple-400" /> },
          { label: '오디션 통과 유력군', value: '18 명', change: '수강생 대비 42% 수준', trend: 'up', icon: <TrendingUp className="w-5 h-5 text-cyan-400" /> },
          { label: '관리 경보 학생 (이탈군)', value: '2 명', change: '보컬 슬럼프 집중 면담 필요', trend: 'warning', icon: <AlertTriangle className="w-5 h-5 text-rose-400" /> },
        ].map((kpi, idx) => (
          <div key={idx} className="p-6 bg-zinc-900 border border-zinc-850 rounded-none relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">{kpi.label}</span>
              <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-none">{kpi.icon}</div>
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight">{kpi.value}</div>
              <div className={`text-xs font-medium mt-1 tracking-wider ${
                kpi.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
              }`}>{kpi.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trainee List Table */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-none overflow-hidden">
        <div className="p-6 border-b border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-sm font-bold tracking-widest uppercase">SM TRAINEE AUDITING DATABASE</h2>
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="연습생 이름 또는 프로젝트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 rounded-none text-xs focus:outline-none focus:border-[#FF007A] w-full transition-colors font-bold tracking-widest"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-850 bg-zinc-950/60 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                <th className="p-4 pl-6">TRAINEE NAME</th>
                <th className="p-4">PROJECT CLASS</th>
                <th className="p-4 text-center">GAP SCORE</th>
                <th className="p-4 text-center">PITCH</th>
                <th className="p-4 text-center">HARMONY</th>
                <th className="p-4 text-center">RHYTHM</th>
                <th className="p-4 text-center">ATTENDANCE</th>
                <th className="p-4 text-center">AUDITION READY</th>
                <th className="p-4 pr-6 text-right">AUDIT REPORT</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainees.map((trainee) => (
                <tr key={trainee.id} className="border-b border-zinc-850/60 hover:bg-white/[0.01] transition-colors text-xs font-light">
                  <td className="p-4 pl-6 font-bold tracking-widest text-[#FF007A]">{trainee.name}</td>
                  <td className="p-4 font-normal tracking-wide text-zinc-300">{trainee.classType}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-none text-[10px] font-black tracking-widest ${
                      trainee.latestGapScore >= 80 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : trainee.latestGapScore >= 60
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {trainee.latestGapScore}
                    </span>
                  </td>
                  <td className="p-4 text-center text-zinc-300 font-bold">{trainee.pitch}점</td>
                  <td className="p-4 text-center text-zinc-300 font-bold">{trainee.harmony}점</td>
                  <td className="p-4 text-center text-zinc-300 font-bold">{trainee.rhythm}점</td>
                  <td className="p-4 text-center text-zinc-400 font-semibold">{trainee.attendanceRate}%</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold tracking-widest uppercase ${
                      trainee.auditionReadiness === 'Ready' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : trainee.auditionReadiness === 'Developing'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {trainee.auditionReadiness === 'Ready' ? '데뷔유력' : trainee.auditionReadiness === 'Developing' ? '육성중' : '집중케어 ⚠️'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => onOpenReport(trainee)}
                      className="px-3 py-1.5 bg-[#FF007A]/10 hover:bg-[#FF007A] hover:text-white border border-[#FF007A]/20 text-[#FF007A] rounded-none text-[10px] font-bold tracking-widest transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      CREATE REPORT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CONSULTATION REPORT GENERATOR MODAL - SM OFFICIAL STYLE
// ==========================================

function ConsultationReportModal({ 
  trainee, 
  onClose 
}: { 
  trainee: TraineeRecord; 
  onClose: () => void;
}) {
  const [comment, setComment] = useState(
    `${trainee.name} 연습생은 고음 영역 가창 시 성대 근육의 활성 정확도(F0 편차 8Hz 이하)가 우수합니다. 다만 춤을 병행할 때 발생 가능한 코러스 연동 레이턴시를 최소화하기 위해 흉성과 두성을 잇는 성구 전환 훈련(Mix Voice Bridge)을 강화해야 합니다.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-850 w-full max-w-4xl rounded-none overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF007A]" />
            <h3 className="font-bold tracking-widest text-xs uppercase text-zinc-100">SM Entertainment Trainee Audit Report</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white font-bold text-xs tracking-widest uppercase"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-zinc-950/40">
          
          {/* SM Brand Identity Header Block (High Aesthetic SM Pink #FF007A and Chrome Glow Styling) */}
          <div className="bg-gradient-to-r from-[#FF007A] via-[#E0006C] to-purple-900 text-white p-8 rounded-none relative overflow-hidden border border-[#FF007A]/30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">OFFICIAL TRAINEE RECORD</span>
                <h4 className="text-3xl font-black mt-1 uppercase tracking-tighter">{trainee.name} VOCAL EVALUATION</h4>
              </div>
              <div className="text-right">
                <div className="text-white font-black text-xs tracking-widest uppercase">SM A&R DIVISION</div>
                <div className="text-white/60 text-[9px] mt-1">ISSUED DATE: 2026-05-20</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15 text-xs font-bold tracking-wider">
              <div>
                <div className="text-white/60 text-[9px] uppercase tracking-widest">ASSIGNED PROJECT</div>
                <div className="mt-0.5 font-black text-white">{trainee.classType}</div>
              </div>
              <div>
                <div className="text-white/60 text-[9px] uppercase tracking-widest">LATEST ANALYSIS</div>
                <div className="mt-0.5 font-black text-white">{trainee.latestTestDate}</div>
              </div>
              <div>
                <div className="text-white/60 text-[9px] uppercase tracking-widest">PUNCTUALITY RATE</div>
                <div className="mt-0.5 font-black text-white">{trainee.attendanceRate}%</div>
              </div>
              <div>
                <div className="text-white/60 text-[9px] uppercase tracking-widest">SM GAP SCORE</div>
                <div className="mt-0.5 font-black text-white text-[#FFD700]">{trainee.latestGapScore} / 100</div>
              </div>
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Visual Gauge */}
            <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-none flex flex-col items-center text-center justify-center">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">TOTAL AUDIT STABILITY</span>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#18181b" strokeWidth="6" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#FF007A" 
                    strokeWidth="6" 
                    strokeDasharray="251"
                    strokeDashoffset={251 - (251 * trainee.latestGapScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{trainee.latestGapScore}</div>
                  <div className="text-[9px] text-[#FF007A] uppercase tracking-widest font-bold mt-0.5">SCORE</div>
                </div>
              </div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-4">
                {trainee.latestGapScore >= 80 ? '🟢 ELIGIBLE FOR DEBUT' : '🟡 NEEDS INTERMEDIARY REPAIR'}
              </div>
            </div>

            {/* Sub-scores Chart */}
            <div className="md:col-span-2 bg-zinc-900 border border-zinc-850 p-6 rounded-none space-y-5">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">ACOUSTIC FREQUENCY METRICS</span>
              <div className="space-y-4 pt-1">
                {[
                  { label: 'PITCH CONTROL (기본 주파수 F0 오차율)', val: trainee.pitch, color: 'bg-[#FF007A]', labelColor: 'text-[#FF007A]' },
                  { label: 'HARMONICS & OVERTONES (화성 배음 필터 강도)', val: trainee.harmony, color: 'bg-purple-500', labelColor: 'text-purple-400' },
                  { label: 'RHYTHM LATENCY SYNCOPATION (리듬 싱코페이션 편차)', val: trainee.rhythm, color: 'bg-cyan-400', labelColor: 'text-cyan-400' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold tracking-wider">
                      <span className={item.labelColor}>{item.label}</span>
                      <span>{item.val} / 100</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-none overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Teacher Consultation Notes editor */}
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-none space-y-4">
            <h5 className="font-bold flex items-center gap-2 text-xs tracking-widest uppercase text-[#FF007A]">
              <MessageSquare className="w-4 h-4" /> A&R VOCAL COACH REMARKS
            </h5>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-4 bg-zinc-950 border border-zinc-850 rounded-none text-xs text-zinc-300 focus:outline-none focus:border-[#FF007A] transition-colors tracking-wide leading-relaxed font-light"
            />
            <div className="text-[10px] text-zinc-500 flex justify-between tracking-wider font-bold">
              <span>* 리포트 발행 시 해당 코멘트가 연습생 DB 및 오디션 자료에 귀속됩니다.</span>
              <span>{comment.length}자 입력됨</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-850 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-[10px] text-zinc-500 font-bold tracking-wider">
            * SM ENTERTAINMENT A&R EVALUATION PROTOCOL SECURED
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => {
                alert(`[A&R 피드백 전달] ${trainee.name} 연습생 및 담당 디렉터에게 카카오 알림톡으로 전송 완료하였습니다.`);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#FF007A] hover:bg-[#E0006C] text-white font-bold rounded-none text-xs tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              💬 카카오톡 전송
            </button>
            <button 
              onClick={() => {
                alert('SM 공식 진단서 PDF 패키지가 로컬 다운로드되었습니다.');
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 rounded-none text-xs tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF DOWNLOAD
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
