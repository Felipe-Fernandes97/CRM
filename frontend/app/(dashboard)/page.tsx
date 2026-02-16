'use client';

import { useState, useRef } from 'react';
import {
  Users,
  UserPlus,
  Target,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  MessageSquare,
  Calendar,
  FileText,
  GripVertical,
  TrendingUp,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardTitle, CardContent } from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

/* ─── Donut Chart ─── */
function DonutChart({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDash = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#252d3f" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-xs text-[#94a3b8]">{label}</span>
    </div>
  );
}

/* ─── Wave/Area Chart ─── */
function WaveChart({
  title,
  data,
  labels,
  color,
  gradientId,
  total,
  change,
  changePositive,
}: {
  title: string;
  data: number[];
  labels: string[];
  color: string;
  gradientId: string;
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

  // Smooth curve
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

  return (
    <Card padding="none">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{total}</span>
            <span className={`flex items-center gap-0.5 text-xs font-medium ${changePositive ? 'text-green-400' : 'text-red-400'}`}>
              {changePositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {change}
            </span>
          </div>
        </div>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
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
            {/* Area fill */}
            <path d={areaPath} fill={`url(#${gradientId})`} />
            {/* Line */}
            <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            {/* Dots */}
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#0f1420" strokeWidth="1.5" />
            ))}
            {/* Labels */}
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
      </div>
    </Card>
  );
}

/* ─── Sales Pipeline (Kanban) ─── */
function SalesPipeline() {
  const columns = [
    {
      title: 'Primeiro Contato',
      count: 3,
      color: 'bg-blue-500',
      items: [
        { name: 'Tech Solutions', contact: 'João Silva', value: 'R$ 15.000', progress: 80 },
        { name: 'ABC Corp', contact: 'Maria Santos', value: 'R$ 8.500', progress: 60 },
      ],
    },
    {
      title: 'Qualificado',
      count: 2,
      items: [
        { name: 'Global Imports', contact: 'Carlos Lima', value: 'R$ 25.000', progress: 65 },
        { name: 'Smart Digital', contact: 'Ana Costa', value: 'R$ 12.000', progress: 45 },
      ],
    },
    {
      title: 'Proposta',
      count: 2,
      items: [
        { name: 'Omega Services', contact: 'Pedro Rocha', value: 'R$ 32.000', progress: 50 },
        { name: 'Beta Systems', contact: 'Julia Mendes', value: 'R$ 18.500', progress: 40 },
      ],
    },
    {
      title: 'Fechamento',
      count: 1,
      items: [
        { name: 'Nova Tech', contact: 'Rafael Souza', value: 'R$ 45.000', progress: 90 },
      ],
    },
  ];

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Funil de Vendas</CardTitle>
        <div className="grid grid-cols-4 gap-3">
          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.color || 'bg-[#94a3b8]'}`} />
                <span className="text-xs font-medium text-[#94a3b8]">{col.title}</span>
              </div>
              <div className="space-y-2">
                {col.items.map((item) => (
                  <div key={item.name} className="rounded-lg bg-[#252d3f] p-3">
                    <p className="text-xs font-medium text-white">{item.name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{item.contact}</p>
                    <p className="mt-1 text-[10px] font-semibold text-blue-400">{item.value}</p>
                    <div className="mt-2 h-1 w-full rounded-full bg-[#1a1f2e]">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Performance Overview ─── */
function PerformanceOverview() {
  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-6">Visão de Performance</CardTitle>
        <div className="flex items-center justify-center gap-8">
          <DonutChart value={83} label="Meta Receita" color="#60a5fa" />
          <DonutChart value={60} label="Novos Clientes" color="#60a5fa" />
        </div>
      </div>
    </Card>
  );
}

/* ─── Recent Activities ─── */
function RecentActivities() {
  const activities = [
    { icon: UserPlus, text: 'João adicionou um novo contato', sub: '(Nova Corp.)', time: '3h', color: '#60a5fa' },
    { icon: Calendar, text: 'Reunião agendada com', sub: 'Global Corp.', time: '5h', color: '#60a5fa' },
    { icon: FileText, text: 'Sequência 3 Tarefas Fechadas', sub: 'Downloads', time: '1d', color: '#f59e0b' },
    { icon: MessageSquare, text: 'Meeting agendado com', sub: 'BetaTech Corp.', time: '1d', color: '#a78bfa' },
    { icon: Target, text: 'Reunião agendada com Olatiaj', sub: 'Solutions', time: '2d', color: '#f97316' },
  ];

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Atividades Recentes</CardTitle>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${a.color}20`, color: a.color }}
              >
                <a.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white">
                  {a.text} <span className="text-[#94a3b8]">{a.sub}</span>
                </p>
              </div>
              <span className="text-[10px] text-[#94a3b8] shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Support Tickets ─── */
function SupportTickets() {
  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-6">Tickets de Suporte</CardTitle>
        <div className="flex items-center justify-center gap-8">
          <DonutChart value={60} label="Abertos" color="#60a5fa" />
          <DonutChart value={98} label="Resolvidos" color="#94a3b8" />
        </div>
      </div>
    </Card>
  );
}

/* ─── Task List ─── */
function TaskList() {
  const tasks = [
    { text: 'Admin Follow-up com BetaTech', done: true },
    { text: 'Preparar Sot. Intranet', done: false },
    { text: 'Preparar CQ Terminally', done: true },
    { text: 'Preparar Q1 Report', done: true },
    { text: 'Due Dil. & Record', done: false },
    { text: 'Test Terminally', done: false },
  ];

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Lista de Tarefas</CardTitle>
        <div className="grid grid-cols-2 gap-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2">
              {task.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-[#94a3b8]" />
              )}
              <span className={`text-xs ${task.done ? 'text-white' : 'text-[#94a3b8]'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Dashboard Card Wrapper (Draggable) ─── */
interface DashboardSection {
  id: string;
  title: string;
  component: React.ReactNode;
  colSpan: string;
}

function DraggableCard({
  section,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  section: DashboardSection;
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
      className={`${section.colSpan} group relative transition-all ${isDragOver ? 'scale-[1.01] ring-2 ring-blue-500/30 rounded-xl' : ''}`}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 z-10 rounded-lg bg-[#252d3f]/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-[#94a3b8]" />
      </div>
      {section.component}
    </div>
  );
}

/* ─── Dashboard Page ─── */
export default function DashboardPage() {
  const { user } = useAuth();

  const [sections, setSections] = useState<DashboardSection[]>([
    {
      id: 'wave-vendas',
      title: 'Vendas',
      colSpan: 'lg:col-span-1',
      component: (
        <WaveChart
          title="Vendas Mensais"
          data={[32000, 45000, 38000, 52000, 48000, 61000, 58000]}
          labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']}
          color="#60a5fa"
          gradientId="grad-vendas"
          total="R$ 334.000"
          change="+12.5%"
          changePositive={true}
        />
      ),
    },
    {
      id: 'wave-leads',
      title: 'Leads',
      colSpan: 'lg:col-span-1',
      component: (
        <WaveChart
          title="Novos Leads"
          data={[18, 25, 22, 30, 28, 35, 42]}
          labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']}
          color="#34d399"
          gradientId="grad-leads"
          total="200"
          change="+20%"
          changePositive={true}
        />
      ),
    },
    {
      id: 'wave-conversao',
      title: 'Conversão',
      colSpan: 'lg:col-span-1',
      component: (
        <WaveChart
          title="Taxa de Conversão"
          data={[12, 15, 18, 14, 22, 19, 25]}
          labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']}
          color="#a78bfa"
          gradientId="grad-conversao"
          total="25%"
          change="+3.2%"
          changePositive={true}
        />
      ),
    },
    {
      id: 'pipeline',
      title: 'Funil de Vendas',
      colSpan: 'lg:col-span-2',
      component: <SalesPipeline />,
    },
    {
      id: 'activities',
      title: 'Atividades Recentes',
      colSpan: 'lg:col-span-1',
      component: <RecentActivities />,
    },
    {
      id: 'performance',
      title: 'Performance',
      colSpan: 'lg:col-span-1',
      component: <PerformanceOverview />,
    },
    {
      id: 'tickets',
      title: 'Tickets',
      colSpan: 'lg:col-span-1',
      component: <SupportTickets />,
    },
    {
      id: 'tasks',
      title: 'Tarefas',
      colSpan: 'lg:col-span-1',
      component: <TaskList />,
    },
  ]);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

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
        title={`Olá, ${user?.nome?.split(' ')[0]}!`}
        subtitle="Aqui está o resumo das suas atividades"
      />

      {/* Dashboard Grid - Draggable */}
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
