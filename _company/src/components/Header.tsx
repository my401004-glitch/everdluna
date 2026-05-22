// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-darkblue sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
                <div className="text-2xl font-extrabold text-yellow-400">
                    AziatArt.AI 🎵
                </div>
                <nav className="flex items-center">
                    <a href="#diagnosis" className="ml-8 text-gray-300 hover:text-white transition duration-150">진단</a>
                    <a href="#features" className="ml-8 text-gray-300 hover:text-white transition duration-150">기능</a>
                    <a href="/financial_freedom_roadmap.html" target="_blank" rel="noopener noreferrer" className="ml-8 text-yellow-400 hover:text-yellow-300 font-semibold transition duration-150">📈 10억 로드맵 시뮬레이터</a>
                    <a href="#pricing" className="ml-8 py-2 px-4 bg-yellow-500 text-darkblue rounded-md hover:bg-yellow-600 transition duration-150">시작하기</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;