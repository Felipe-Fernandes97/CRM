'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  GripVertical,
} from 'lucide-react';
import { Card, CardTitle, Badge } from '@/components/ui';
import { PageHeader } from '@/components/layout';

/* ─── KPI Card ─── */
function KPICard({
  title,
  value,
  change,
  changePositive,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card padding="none">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              changePositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {changePositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1">{title}</p>
      </div>
    </Card>
  );
}

/* ─── Donut Chart ─── */
function DonutChart({
  value,
  label,
  color,
  size = 100,
}: {
  value: number;
  label: string;
  color: string;
  size?: number;
}) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ height: size, width: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#252d3f" strokeWidth="8" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-xs text-[#94a3b8]">{label}</span>
    </div>
  );
}

/* ─── Bar Chart ─── */
function BarChartComponent({
  data,
  labels,
  color,
  title,
}: {
  data: number[];
  labels: string[];
  color: string;
  title: string;
}) {
  const maxVal = Math.max(...data);

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">{title}</CardTitle>
        <div className="flex items-end gap-2 h-40">
          {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#94a3b8]">{val}</span>
              <div
                className="w-full rounded-t-md transition-all duration-300 min-h-[4px]"
                style={{
                  height: `${(val / maxVal) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.8,
                }}
              />
              <span className="text-[10px] text-[#94a3b8]">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Area/Line Chart ─── */
function AreaChart({
  title,
  data,
  labels,
  color,
  total,
  change,
  changePositive,
}: {
  title: string;
  data: number[];
  labels: string[];
  color: string;
  total: string;
  change: string;
  changePositive: boolean;
}) {
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const width = 400;
  const height = 120;
  const padding = 10;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - ((v - minVal) / range) * (height - padding * 2),
  }));

  function smoothPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) / 3;
      const cp1y = pts[i].y;
      const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) / 3;
      const cp2y = pts[i + 1].y;
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i + 1].x},${pts[i + 1].y}`;
    }
    return path;
  }

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;
  const gradientId = `grad-${title.replace(/\s/g, '')}`;

  return (
    <Card padding="none">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{total}</span>
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                changePositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {changePositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {change}
            </span>
          </div>
        </div>
        <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i / 3) * (height - padding * 2)}
              x2={width - padding}
              y2={padding + (i / 3) * (height - padding * 2)}
              stroke="#252d3f"
              strokeWidth="0.5"
            />
          ))}
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#0f1420" strokeWidth="1.5" />
          ))}
          {labels.map((label, i) => (
            <text
              key={i}
              x={padding + (i / (labels.length - 1)) * (width - padding * 2)}
              y={height + 14}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
}

/* ─── Performance por Usuário ─── */
function UserPerformance() {
  const users = [
    { nome: 'João Silva', cargo: 'Vendedor', vendas: 45, meta: 50, receita: 'R$ 125.000', conversao: 32 },
    { nome: 'Maria Santos', cargo: 'Vendedor', vendas: 38, meta: 40, receita: 'R$ 98.500', conversao: 28 },
    { nome: 'Carlos Lima', cargo: 'Gerente', vendas: 52, meta: 55, receita: 'R$ 180.000', conversao: 35 },
    { nome: 'Ana Costa', cargo: 'Vendedor', vendas: 29, meta: 35, receita: 'R$ 72.000', conversao: 22 },
    { nome: 'Pedro Rocha', cargo: 'Vendedor', vendas: 41, meta: 45, receita: 'R$ 110.500', conversao: 30 },
  ];

  return (
    <Card padding="none">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Performance por Usuário</CardTitle>
          <Trophy className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="space-y-4">
          {users
            .sort((a, b) => b.vendas - a.vendas)
            .map((user, i) => {
              const percent = Math.round((user.vendas / user.meta) * 100);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-400">
                          {user.nome.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.nome}</p>
                        <p className="text-[10px] text-[#94a3b8]">{user.cargo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{user.receita}</p>
                      <p className="text-[10px] text-[#94a3b8]">
                        {user.vendas}/{user.meta} vendas · {user.conversao}% conversão
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-[#1a1f2e]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percent, 100)}%`,
                          backgroundColor: percent >= 100 ? '#34d399' : percent >= 80 ? '#60a5fa' : '#f59e0b',
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium min-w-[40px] text-right ${
                        percent >= 100 ? 'text-green-400' : percent >= 80 ? 'text-blue-400' : 'text-yellow-400'
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Card>
  );
}

/* ─── Funil de Conversão ─── */
function ConversionFunnel() {
  const stages = [
    { label: 'Leads Gerados', value: 1250, color: '#60a5fa' },
    { label: 'Qualificados', value: 840, color: '#a78bfa' },
    { label: 'Proposta Enviada', value: 420, color: '#f59e0b' },
    { label: 'Negociação', value: 280, color: '#f97316' },
    { label: 'Fechados', value: 156, color: '#34d399' },
  ];

  const maxVal = stages[0].value;

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Funil de Conversão</CardTitle>
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const widthPercent = (stage.value / maxVal) * 100;
            const conversionFromPrev =
              i > 0 ? Math.round((stage.value / stages[i - 1].value) * 100) : 100;

            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white">{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{stage.value}</span>
                    {i > 0 && (
                      <span className="text-[10px] text-[#94a3b8]">({conversionFromPrev}%)</span>
                    )}
                  </div>
                </div>
                <div className="h-6 rounded-md bg-[#1a1f2e] overflow-hidden">
                  <div
                    className="h-full rounded-md flex items-center justify-center transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: `${stage.color}40`,
                      borderLeft: `3px solid ${stage.color}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-[#252d3f] flex items-center justify-between">
          <span className="text-xs text-[#94a3b8]">Taxa de conversão total</span>
          <span className="text-sm font-bold text-green-400">
            {Math.round((stages[stages.length - 1].value / stages[0].value) * 100)}%
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ─── Ciclo de Venda ─── */
function SalesCycle() {
  const stages = [
    { label: 'Primeiro Contato', dias: 2.5 },
    { label: 'Qualificação', dias: 4.2 },
    { label: 'Apresentação', dias: 3.8 },
    { label: 'Proposta', dias: 5.1 },
    { label: 'Negociação', dias: 6.3 },
    { label: 'Fechamento', dias: 2.1 },
  ];

  const totalDias = stages.reduce((acc, s) => acc + s.dias, 0);
  const maxDias = Math.max(...stages.map((s) => s.dias));

  return (
    <Card padding="none">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Ciclo de Venda</CardTitle>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-[#94a3b8]" />
            <span className="text-sm font-bold text-white">{totalDias.toFixed(0)} dias</span>
          </div>
        </div>
        <div className="space-y-3">
          {stages.map((stage, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-[#94a3b8] w-28 shrink-0">{stage.label}</span>
              <div className="flex-1 h-4 rounded bg-[#1a1f2e] overflow-hidden">
                <div
                  className="h-full rounded bg-blue-500/60 flex items-center justify-end pr-1 transition-all duration-500"
                  style={{ width: `${(stage.dias / maxDias) * 100}%` }}
                >
                  <span className="text-[9px] text-white font-medium">{stage.dias}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Draggable Card ─── */
interface ReportSection {
  id: string;
  colSpan: string;
  component: React.ReactNode;
}

function DraggableCard({
  section,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  section: ReportSection;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (id: string) => void;
  isDragOver: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(section.id)}
      onDragOver={(e) => onDragOver(e, section.id)}
      onDrop={() => onDrop(section.id)}
      className={`${section.colSpan} group relative transition-all ${
        isDragOver ? 'scale-[1.01] ring-2 ring-blue-500/30 rounded-xl' : ''
      }`}
    >
      <div className="absolute top-2 right-2 z-10 rounded-lg bg-[#252d3f]/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-[#94a3b8]" />
      </div>
      {section.component}
    </div>
  );
}

/* ─── Página de Relatórios ─── */
export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  const [sections, setSections] = useState<ReportSection[]>([
    {
      id: 'receita',
      colSpan: 'lg:col-span-1',
      component: (
        <AreaChart
          title="Receita Mensal"
          data={[85000, 92000, 78000, 110000, 105000, 125000, 138000]}
          labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']}
          color="#60a5fa"
          total="R$ 733.000"
          change="+15.8%"
          changePositive={true}
        />
      ),
    },
    {
      id: 'leads',
      colSpan: 'lg:col-span-1',
      component: (
        <AreaChart
          title="Novos Leads vs Conversões"
          data={[180, 220, 195, 250, 230, 280, 310]}
          labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']}
          color="#34d399"
          total="1.665"
          change="+22%"
          changePositive={true}
        />
      ),
    },
    {
      id: 'funil',
      colSpan: 'lg:col-span-1',
      component: <ConversionFunnel />,
    },
    {
      id: 'ciclo',
      colSpan: 'lg:col-span-1',
      component: <SalesCycle />,
    },
    {
      id: 'origem',
      colSpan: 'lg:col-span-2',
      component: (
        <BarChartComponent
          title="Vendas por Origem"
          data={[45, 32, 28, 22, 18, 11]}
          labels={['Site', 'Indicação', 'LinkedIn', 'Google', 'Evento', 'Cold Call']}
          color="#60a5fa"
        />
      ),
    },
    {
      id: 'metas',
      colSpan: 'lg:col-span-1',
      component: (
        <Card padding="none">
          <div className="p-5">
            <CardTitle className="mb-4">Metas do Período</CardTitle>
            <div className="flex flex-col items-center gap-6">
              <DonutChart value={83} label="Meta de Receita" color="#60a5fa" />
              <DonutChart value={72} label="Meta de Leads" color="#34d399" />
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 'performance',
      colSpan: 'lg:col-span-3',
      component: <UserPerformance />,
    },
  ]);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setSections((prev) => {
      const draggedIndex = prev.findIndex((s) => s.id === draggedId);
      const targetIndex = prev.findIndex((s) => s.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const updated = [...prev];
      const [dragged] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, dragged);
      return updated;
    });

    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div>
      <PageHeader
        title="Relatórios & Métricas"
        subtitle="Acompanhe o desempenho do seu time e indicadores de vendas"
        actions={
          <div className="flex gap-1 rounded-lg bg-[#252d3f] p-1">
            {[
              { value: '7d', label: '7 dias' },
              { value: '30d', label: '30 dias' },
              { value: '90d', label: '90 dias' },
              { value: '12m', label: '12 meses' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value as typeof periodo)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  periodo === p.value
                    ? 'bg-blue-500 text-white'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* KPIs (fixos, não arrastáveis) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard title="Taxa de Conversão" value="24.8%" change="+3.2%" changePositive={true} icon={Target} color="#60a5fa" />
        <KPICard title="Ticket Médio" value="R$ 8.450" change="+12.5%" changePositive={true} icon={DollarSign} color="#34d399" />
        <KPICard title="Ciclo Médio de Venda" value="24 dias" change="-2 dias" changePositive={true} icon={Clock} color="#a78bfa" />
        <KPICard title="Vendas no Período" value="156" change="+18%" changePositive={true} icon={TrendingUp} color="#f59e0b" />
      </div>

      {/* Cards arrastáveis */}
      <div className="grid gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <DraggableCard
            key={section.id}
            section={section}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragOver={dragOverId === section.id}
          />
        ))}
      </div>
    </div>
  );
}
