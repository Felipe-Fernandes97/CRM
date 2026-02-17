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
  Settings,
  TrendingUp,
} from 'lucide-react';

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

export default function TechStackCarousel() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.15);
    }, 16);
    return () => clearInterval(interval);
  }, [paused]);

  const count = techStack.length;
  const radius = 280;

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-10 lg:mb-16 text-center">
        Funcionalidades do CRM
      </h2>

      {/* Círculo giratório */}
      <div
        className="relative"
        style={{
          width: `${radius * 2 + 120}px`,
          height: `${radius * 2 + 120}px`,
        }}
      >
        {techStack.map((tech, i) => {
          const Icon = tech.icon;
          const angle = (360 / count) * i + rotation;
          const angleRad = (angle * Math.PI) / 180;

          // Responsivo: usa radius menor em telas pequenas via JS
          const r = radius;
          const centerX = r + 60;
          const centerY = r + 60;

          const x = centerX + r * Math.cos(angleRad);
          const y = centerY + r * Math.sin(angleRad);

          // Normalizar ângulo entre 0-360 para determinar direção do tooltip
          const normalizedAngle = ((angle % 360) + 360) % 360;

          // Tooltip aponta para fora do círculo baseado na posição do ícone
          let tooltipStyle: React.CSSProperties = {};

          if (normalizedAngle >= 315 || normalizedAngle < 45) {
            // Direita → tooltip vai para direita
            tooltipStyle = { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '12px' };
          } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
            // Baixo → tooltip vai para baixo
            tooltipStyle = { left: '50%', top: '100%', transform: 'translateX(-50%)', marginTop: '12px' };
          } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
            // Esquerda → tooltip vai para esquerda
            tooltipStyle = { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '12px' };
          } else {
            // Cima → tooltip vai para cima
            tooltipStyle = { left: '50%', bottom: '100%', transform: 'translateX(-50%)', marginBottom: '12px' };
          }

          return (
            <div
              key={i}
              className="absolute group"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: hoveredIndex === i ? 100 : 10,
              }}
              onMouseEnter={() => {
                setHoveredIndex(i);
                setPaused(true);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setPaused(false);
              }}
            >
              {/* Card do ícone */}
              <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
                <div
                  className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-2xl backdrop-blur-md border-2 cursor-pointer shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: hoveredIndex === i ? `${tech.color}30` : `${tech.color}15`,
                    borderColor: hoveredIndex === i ? tech.color : `${tech.color}50`,
                    boxShadow: hoveredIndex === i
                      ? `0 8px 30px ${tech.color}50`
                      : `0 4px 20px ${tech.color}20`,
                  }}
                >
                  <Icon
                    className="h-7 w-7 sm:h-9 sm:w-9 lg:h-12 lg:w-12"
                    style={{ color: tech.color }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs lg:text-sm text-white/80 font-medium text-center whitespace-nowrap group-hover:text-white transition-colors duration-300">
                  {tech.label}
                </span>
              </div>

              {/* Tooltip no hover - aparece para fora do círculo */}
              {hoveredIndex === i && (
                <div
                  className="absolute z-200 w-64 p-4 rounded-xl border-2 backdrop-blur-xl shadow-2xl hidden lg:block"
                  style={{
                    ...tooltipStyle,
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
        })}
      </div>
    </div>
  );
}
