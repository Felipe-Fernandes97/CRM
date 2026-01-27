'use client';

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

/* ─── Support Tickets / Métricas ─── */
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

/* ─── Revenue Chart ─── */
function RevenueChart() {
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN'];
  const values = [40, 65, 45, 80, 55, 70];

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Receita</CardTitle>
        <div className="relative h-36">
          <div className="absolute inset-0 flex items-end justify-between gap-3 px-2">
            {values.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-orange-500 to-orange-400"
                  style={{ height: `${v}%` }}
                />
                <span className="text-[10px] text-[#94a3b8]">{months[i]}</span>
              </div>
            ))}
          </div>
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

/* ─── Dashboard Page ─── */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Olá, ${user?.nome?.split(' ')[0]}!`}
        subtitle="Aqui está o resumo das suas atividades"
      />

      {/* Row 1: Pipeline + Performance + Activities */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SalesPipeline />
        </div>
        <div className="flex flex-col gap-4">
          <PerformanceOverview />
          <SupportTickets />
        </div>
        <RecentActivities />
      </div>

      {/* Row 2: Revenue + Task List */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart />
        <TaskList />
      </div>
    </div>
  );
}
