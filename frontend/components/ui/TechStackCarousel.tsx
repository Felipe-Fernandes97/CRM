'use client';

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
  { icon: LayoutDashboard, label: 'Dashboard', color: '#60a5fa' },
  { icon: UserPlus, label: 'Leads', color: '#34d399' },
  { icon: Users, label: 'Clientes', color: '#a78bfa' },
  { icon: Building2, label: 'Empresas', color: '#f97316' },
  { icon: Target, label: 'Oportunidades', color: '#06b6d4' },
  { icon: FileText, label: 'Negociações', color: '#10b981' },
  { icon: CheckSquare, label: 'Atividades', color: '#8b5cf6' },
  { icon: MessageSquare, label: 'Comunicações', color: '#f59e0b' },
  { icon: BarChart3, label: 'Relatórios', color: '#ec4899' },
  { icon: Zap, label: 'Automações', color: '#3b82f6' },
  { icon: Settings, label: 'Configurações', color: '#14b8a6' },
  { icon: TrendingUp, label: 'Performance', color: '#f43f5e' },
];

export default function TechStackCarousel() {
  // Triplicar para garantir loop infinito suave
  const triplicatedStack = [...techStack, ...techStack, ...techStack];

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-12 overflow-hidden">
      {/* Title */}
      <h2 className="text-4xl font-bold text-white mb-16">Funcionalidades do CRM</h2>

      {/* Single Row - Infinite Scroll */}
      <div className="relative w-full overflow-hidden mb-16">
        <div className="flex gap-12 animate-scroll-left">
          {triplicatedStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={`tech-${index}`}
                className="flex flex-col items-center gap-4 min-w-[140px] flex-shrink-0"
              >
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg"
                  style={{
                    backgroundColor: `${tech.color}20`,
                    borderColor: `${tech.color}60`,
                    boxShadow: `0 4px 20px ${tech.color}30`,
                  }}
                >
                  <Icon className="h-12 w-12" style={{ color: tech.color }} />
                </div>
                <span className="text-sm text-white/80 font-medium whitespace-nowrap">
                  {tech.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tagline */}
      <p className="text-center text-white/60 text-lg max-w-2xl leading-relaxed">
        Sistema completo de gestão de relacionamento com cliente, 
        desenvolvido com as melhores tecnologias modernas
      </p>
    </div>
  );
}
