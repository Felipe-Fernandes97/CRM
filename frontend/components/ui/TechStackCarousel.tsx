'use client';

import { useState } from 'react';
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
  Settings,
  TrendingUp,
} from 'lucide-react';
import OrbitingWords from './OrbitingWords';

const techStack = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    color: '#60a5fa',
    description: 'Visão geral do sistema com métricas, gráficos e indicadores de performance em tempo real'
  },
  {
    icon: UserPlus,
    label: 'Leads',
    color: '#34d399',
    description: 'Gestão de potenciais clientes, captura e qualificação de leads para conversão'
  },
  {
    icon: Users,
    label: 'Clientes',
    color: '#a78bfa',
    description: 'Cadastro completo de clientes com histórico, contatos e informações detalhadas'
  },
  {
    icon: Building2,
    label: 'Empresas',
    color: '#f97316',
    description: 'Gestão de empresas parceiras e seus dados corporativos centralizados'
  },
  {
    icon: Target,
    label: 'Oportunidades',
    color: '#06b6d4',
    description: 'Acompanhamento de oportunidades de vendas com pipeline visual e previsões'
  },
  {
    icon: FileText,
    label: 'Negociações',
    color: '#10b981',
    description: 'Controle de propostas comerciais, documentos e fechamento de vendas'
  },
  {
    icon: CheckSquare,
    label: 'Atividades',
    color: '#8b5cf6',
    description: 'Agendamento e controle de tarefas, reuniões e follow-ups da equipe'
  },
  {
    icon: MessageSquare,
    label: 'Comunicações',
    color: '#f59e0b',
    description: 'Histórico completo de interações com clientes por email, telefone e chat'
  },
  {
    icon: BarChart3,
    label: 'Relatórios',
    color: '#ec4899',
    description: 'Análises e relatórios detalhados de vendas, performance e métricas do negócio'
  },
  {
    icon: Zap,
    label: 'Automações',
    color: '#3b82f6',
    description: 'Fluxos automatizados de trabalho para otimizar processos e aumentar produtividade'
  },
  {
    icon: Settings,
    label: 'Configurações',
    color: '#14b8a6',
    description: 'Personalização do sistema, preferências de usuário e configurações gerais'
  },
  {
    icon: TrendingUp,
    label: 'Performance',
    color: '#f43f5e',
    description: 'Indicadores de desempenho individual e da equipe com metas e objetivos'
  },
];

interface CardProps {
  tech: typeof techStack[0];
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  position: 'top' | 'bottom' | 'left' | 'right';
}

function TechCard({ tech, index, hoveredIndex, setHoveredIndex, position }: CardProps) {
  const Icon = tech.icon;

  return (
    <div
      key={`tech-${index}`}
      className={`group relative flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${
        hoveredIndex === index ? 'z-100' : 'z-10'
      }`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div
        className="relative flex h-14 w-14 sm:h-18 sm:w-18 lg:h-24 lg:w-24 items-center justify-center rounded-xl sm:rounded-2xl backdrop-blur-md border-2 transition-all duration-300 cursor-pointer shadow-lg group-hover:shadow-2xl group-hover:scale-110"
        style={{
          backgroundColor: `${tech.color}15`,
          borderColor: `${tech.color}50`,
          boxShadow: `0 4px 20px ${tech.color}20`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${tech.color}30`;
          e.currentTarget.style.borderColor = `${tech.color}`;
          e.currentTarget.style.boxShadow = `0 8px 30px ${tech.color}50`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${tech.color}15`;
          e.currentTarget.style.borderColor = `${tech.color}50`;
          e.currentTarget.style.boxShadow = `0 4px 20px ${tech.color}20`;
        }}
      >
        <Icon
          className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 transition-transform duration-300 group-hover:scale-110"
          style={{ color: tech.color }}
        />
      </div>
      <span className="text-[10px] sm:text-xs lg:text-sm text-white/80 font-medium text-center group-hover:text-white transition-colors duration-300">
        {tech.label}
      </span>

      {/* Tooltip */}
      {hoveredIndex === index && (
        <div
          className={`absolute ${
            position === 'top'
              ? 'bottom-full mb-4 left-1/2 -translate-x-1/2'
              : position === 'bottom'
              ? 'top-full mt-4 left-1/2 -translate-x-1/2'
              : position === 'left'
              ? 'right-full mr-6 top-1/2 -translate-y-1/2'
              : 'left-full ml-2 top-1/2 -translate-y-1/2'
          } z-200 ${
            position === 'left' || position === 'right' ? 'w-60' : 'w-72'
          } p-4 rounded-xl border-2 backdrop-blur-xl shadow-2xl animate-in fade-in ${
            position === 'top'
              ? 'slide-in-from-bottom-2'
              : position === 'bottom'
              ? 'slide-in-from-top-2'
              : position === 'left'
              ? 'slide-in-from-right-2'
              : 'slide-in-from-left-2'
          } duration-200 hidden lg:block`}
          style={{
            backgroundColor: `${tech.color}20`,
            borderColor: `${tech.color}80`,
            boxShadow: `0 8px 32px ${tech.color}40`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5" style={{ color: tech.color }} />
            <h3 className="font-semibold text-white text-sm">{tech.label}</h3>
          </div>
          <p className="text-xs text-white/90 leading-relaxed">{tech.description}</p>
        </div>
      )}
    </div>
  );
}

export default function TechStackCarousel() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tooltipPositions: Record<number, 'top' | 'bottom' | 'left' | 'right'> = {
    0: 'top',    // Dashboard
    1: 'top',    // Leads
    2: 'top',    // Clientes
    3: 'top',    // Empresas
    4: 'left',   // Oportunidades
    5: 'right',  // Negociações
    6: 'left',   // Atividades
    7: 'right',  // Comunicações
    8: 'bottom', // Relatórios
    9: 'bottom', // Automações
    10: 'bottom',// Configurações
    11: 'bottom',// Performance
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-10 lg:mb-16 text-center">
        Funcionalidades do CRM
      </h2>

      {/* Layout Responsivo */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 items-center w-full max-w-5xl overflow-visible">
        {/* Linha 1 - 4 ícones */}
        <div className="flex gap-4 sm:gap-6 lg:gap-8 justify-center">
          {techStack.slice(0, 4).map((tech, idx) => (
            <TechCard
              key={`row1-${idx}`}
              tech={tech}
              index={idx}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              position={tooltipPositions[idx] || 'top'}
            />
          ))}
        </div>

        {/* Linhas 2 e 3 - Com animação orbital no meio */}
        <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 w-full justify-center">
          {/* Coluna Esquerda - 2 ícones */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <TechCard
              tech={techStack[4]}
              index={4}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              position={tooltipPositions[4] || 'left'}
            />
            <TechCard
              tech={techStack[6]}
              index={6}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              position={tooltipPositions[6] || 'left'}
            />
          </div>

          {/* Animação Orbital no Meio */}
          <div className="flex items-center justify-center">
            <OrbitingWords />
          </div>

          {/* Coluna Direita - 2 ícones */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <TechCard
              tech={techStack[5]}
              index={5}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              position={tooltipPositions[5] || 'right'}
            />
            <TechCard
              tech={techStack[7]}
              index={7}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              position={tooltipPositions[7] || 'right'}
            />
          </div>
        </div>

        {/* Linha 4 - 4 ícones */}
        <div className="flex gap-4 sm:gap-6 lg:gap-8 justify-center">
          {techStack.slice(8, 12).map((tech, idx) => (
            <TechCard
              key={`row4-${idx}`}
              tech={tech}
              index={idx + 8}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              position={tooltipPositions[idx + 8] || 'bottom'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
