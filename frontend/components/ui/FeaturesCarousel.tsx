'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Building2,
  Target,
  FileText,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Intuitivo',
    description: 'Visualize métricas importantes, gráficos de vendas e performance da equipe em tempo real.',
    color: '#60a5fa',
  },
  {
    icon: UserPlus,
    title: 'Gestão de Leads',
    description: 'Capture, qualifique e converta leads em clientes com funil de vendas otimizado.',
    color: '#34d399',
  },
  {
    icon: Users,
    title: 'Clientes & Empresas',
    description: 'Mantenha cadastro completo de clientes e empresas com histórico detalhado.',
    color: '#a78bfa',
  },
  {
    icon: Target,
    title: 'Pipeline de Oportunidades',
    description: 'Acompanhe oportunidades em cada etapa do funil com drag-and-drop intuitivo.',
    color: '#f97316',
  },
  {
    icon: FileText,
    title: 'Negociações',
    description: 'Gerencie propostas, contratos e fechamentos com acompanhamento completo.',
    color: '#06b6d4',
  },
  {
    icon: CheckSquare,
    title: 'Atividades & Tarefas',
    description: 'Organize ligações, reuniões, follow-ups e tarefas com lembretes automáticos.',
    color: '#10b981',
  },
  {
    icon: MessageSquare,
    title: 'Comunicações',
    description: 'Centralize emails, WhatsApp, ligações e anotações em um único lugar.',
    color: '#8b5cf6',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Avançados',
    description: 'Análise detalhada de vendas, conversões e performance com gráficos personalizados.',
    color: '#f59e0b',
  },
  {
    icon: Zap,
    title: 'Automações',
    description: 'Automatize tarefas repetitivas e acelere seu processo de vendas.',
    color: '#ec4899',
  },
];

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const goToFeature = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-full flex items-center justify-center p-12 overflow-hidden">
      <div className="w-full max-w-2xl">
        {/* Carousel Track */}
        <div className="relative min-h-[400px] overflow-hidden mb-16">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                >
                  {/* Feature Card */}
                  <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-10 shadow-2xl">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-300"
                        style={{
                          backgroundColor: `${feature.color}20`,
                          border: `2px solid ${feature.color}40`,
                        }}
                      >
                        <Icon className="h-10 w-10" style={{ color: feature.color }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <span className="text-white/60 text-xs uppercase tracking-[3px] font-bold block mb-3">
                        Funcionalidade {index + 1} de {features.length}
                      </span>
                      <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-[#94a3b8] leading-relaxed text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 bg-black/95 px-6 py-4 rounded-full backdrop-blur-xl border-2 border-white/10 shadow-2xl mx-auto w-fit">
          {features.map((_, index) => (
            <div
              key={index}
              onClick={() => goToFeature(index)}
              className={`h-3.5 rounded-full cursor-pointer transition-all duration-400 border-2 ${
                currentIndex === index
                  ? 'bg-white w-10 border-white/80'
                  : 'bg-white/30 w-3.5 border-white/40 hover:bg-white/50 hover:scale-110 hover:border-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
