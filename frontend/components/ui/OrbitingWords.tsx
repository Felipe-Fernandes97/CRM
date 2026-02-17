'use client';

import { useEffect, useState } from 'react';

const orbitingWords = [
  { text: 'Leads', color: '#34d399', delay: 0, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
  { text: 'Vendas', color: '#60a5fa', delay: 1.25, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
  { text: 'Clientes', color: '#a78bfa', delay: 2.5, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
  { text: 'Análises', color: '#f59e0b', delay: 3.75, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
  { text: 'Automação', color: '#3b82f6', delay: 5, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
  { text: 'Sucesso', color: '#10b981', delay: 6.25, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
  { text: 'Pipeline', color: '#06b6d4', delay: 7.5, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
  { text: 'Métricas', color: '#ec4899', delay: 8.75, radiusMobile: 100, radiusDesktop: 140, duration: 10 },
];

export default function OrbitingWords() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 lg:w-87.5 lg:h-70">
      {/* Palavra Central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 tracking-tighter animate-pulse-slow"
          style={{ fontFamily: "'Bitcount Grid Double', monospace" }}
        >
          Orbyte
        </h1>
        <div className="h-0.5 w-16 lg:w-20 bg-linear-to-r from-transparent via-blue-400 to-transparent mt-2 lg:mt-3 animate-pulse-slow"></div>
      </div>

      {/* Círculos de Órbita (decorativos) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-full border border-blue-500/10 animate-spin-slow"></div>
        <div className="absolute w-44 h-44 sm:w-52 sm:h-52 lg:w-65 lg:h-65 rounded-full border border-cyan-500/10 animate-spin-slower"></div>
      </div>

      {/* Palavras Orbitando */}
      {mounted && orbitingWords.map((word, index) => {
        const angle = (index * 360) / orbitingWords.length;
        const radius = isMobile ? word.radiusMobile : word.radiusDesktop;

        return (
          <div
            key={word.text}
            className="absolute inset-0 flex items-center justify-center animate-orbit"
            style={{
              animationDuration: `${word.duration}s`,
              animationDelay: `${word.delay * -1}s`,
            }}
          >
            <div
              className="absolute font-semibold text-[10px] sm:text-xs whitespace-nowrap px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-default"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translateY(-${radius}px)`,
                color: word.color,
                backgroundColor: `${word.color}15`,
                borderColor: `${word.color}50`,
                boxShadow: `0 4px 20px ${word.color}30`,
              }}
            >
              {word.text}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-orbit {
          animation: orbit linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 40s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
