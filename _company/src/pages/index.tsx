// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header'; // Assuming components exist
import DiagnosisScoreCard from '../components/DiagnosisScoreCard';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';

// 타입 정의 (API Contract 기반)
interface DiagnosisResult {
  growth: number; // 0~100
  engagement: number; // 0~100
  monetization: number; // 0~100
  message?: string; // 사용자에게 보여줄 피드백 메시지
}

// API 호출 시뮬레이션 (실제로는 FastAPI/Flask 백엔드가 담당)
const fetchDiagnosisScore = async (): Promise<DiagnosisResult> => {
  console.log("API Call: Fetching diagnosis score...");
  // 🚨 실제 환경에서는 axios 또는 fetch를 사용하여 /api/v1/diagnosis_score 로 호출해야 합니다.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Network delay simulation
  
  // 임시 데이터 반환 (Mock Data)
  return {
    growth: Math.floor(Math.random() * 30) + 40, // 40-70
    engagement: Math.floor(Math.random() * 20) + 50, // 50-70
    monetization: Math.floor(Math.random() * 10) + 30, // 30-40
    message: "현재 데이터 분석 결과, 'Engagement' 영역에 집중적인 노력이 필요합니다."
  };
};

const LandingPage: React.FC = () => {
  const [scoreData, setScoreData] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDiagnosisScore();
        setScoreData(data);
      } catch (e) {
        console.error("Failed to fetch score:", e);
        setError("데이터 로딩에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Head>
        <title>아지트아트컴페니 | 실용음악 AI 진단 리포트</title>
      </Head>
      <Header />
      <main>
        {/* Hero Section: Problem Statement & Hook */}
        <section className="hero-section py-24 bg-darkblue">
          <div className="container text-center text-white">
            <h1 className="text-5xl font-bold mb-4">막연한 연습은 이제 그만. 데이터로 증명하는 실력 향상 시스템.</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">AI가 진단한 Gap Score를 통해, 당신이 놓치고 있는 성장의 지점을 정확히 파악하고 목표 기반으로 학습하세요.</p>
          </div>
        </section>

        {/* Core Feature: Diagnosis Score (API 연동 핵심) */}
        <section className="py-20 bg-lightgray">
            <div className="container max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">✨ Gap Score 진단 결과</h2>
                {isLoading ? (
                    <div className="text-center py-10"><p className="text-lg text-gray-600">데이터 분석 중... 잠시만 기다려주세요. ⏳</p></div>
                ) : error ? (
                    <div className="text-center py-10"><p className="text-lg text-red-500">{error}</p></div>
                ) : scoreData ? (
                    <DiagnosisScoreCard data={scoreData} />
                ) : null}
            </div>
        </section>

        {/* Simulator Integration Section */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 rounded-2xl p-8 shadow-xl backdrop-blur-md">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border border-indigo-500/30">
                Premium Planner
              </span>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">대표자님 전용 5개년 10억 로드맵 시뮬레이터</h3>
              <p className="text-gray-300 max-w-2xl mx-auto mb-6 text-sm leading-relaxed">
                20년의 학원 운영 노하우와 2년의 F&B 프랜차이즈 지식을 결합한 B2B SaaS 기업 가치 및 영업이익 성장 모델입니다. 
                SaaS 구독료, 가입 학원 수, 컨설팅 비용 등 핵심 변수를 직접 조정하며 5년 안에 자산 10억 원을 만드는 구체적인 경로를 확인해 보세요.
              </p>
              <a 
                href="/financial_freedom_roadmap.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition duration-200 hover:-translate-y-0.5"
              >
                📈 성장 시뮬레이터 실행하기
              </a>
            </div>
          </div>
        </section>

        {/* Features & Solution Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-16">왜 아지트아트컴페니의 AI 진단 시스템을 써야 할까요?</h2>
            {/* 여기에 다른 Features 컴포넌트들이 들어갑니다. */}
          </div>
        </section>

        {/* CTA & Pricing Section (Monetization Focus) */}
        <section className="py-20 bg-darkblue/90">
             <div className="container max-w-4xl mx-auto text-center p-10 rounded-lg shadow-2xl bg-darkblue/80">
                <h3 className="text-3xl font-bold mb-4">더 깊이 있는 분석, 유료 모듈로 경험하세요.</h3>
                <p className="mb-8 text-gray-200">무료 진단만으로는 알 수 없는 심화 데이터와 맞춤 커리큘럼을 구독하고, 전문가 수준의 피드백을 받아가세요.</p>
                {/* PricingSection 컴포넌트 사용 */}
                <PricingSection /> 
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;