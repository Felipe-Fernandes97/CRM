'use client';

import {
  Users,
  UserPlus,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

/* ─── Stat Card (topo) ─── */
interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  barColor: string;
  iconBg: string;
}

function StatCard({ title, value, change, icon, trend, barColor, iconBg }: StatCardProps) {
  return (
    <Card padding="none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            <div className="mt-2 flex items-center gap-1.5">
              {trend === 'up' ? (
                <ArrowUpRight className="h-3.5 w-3.5" style={{ color: '#10b981' }} />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />
              )}
              <span
                className="text-xs font-semibold"
                style={{ color: trend === 'up' ? '#10b981' : '#ef4444' }}
              >
                {trend === 'up' ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground">vs mês anterior</span>
            </div>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${iconBg}20` }}
          >
            {icon}
          </div>
        </div>
        {/* Mini sparkline visual */}
        <div className="mt-4 flex items-end gap-[3px] h-8">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{ height: `${h}%`, backgroundColor: barColor, opacity: 0.6 }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Gráfico de barras ─── */
function BarChart() {
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET'];
  const yLabels = [160, 120, 80, 40];

  return (
    <Card padding="none">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <CardTitle>Vendas Mensais</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
              <span className="text-xs text-muted-foreground">Receita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#60a5fa' }} />
              <span className="text-xs text-muted-foreground">Novos Clientes</span>
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="relative h-52">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-muted-foreground w-8">
            {yLabels.map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          {/* Grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-b" style={{ borderColor: 'rgba(29, 78, 216, 0.15)' }} />
            ))}
          </div>
          {/* Bars */}
          <div className="absolute left-10 right-0 bottom-6 top-0 flex items-end justify-between gap-2 px-2">
            {[65, 50, 80, 95, 60, 75, 85, 45, 70].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full flex gap-[2px] items-end" style={{ height: '100%' }}>
                  <div
                    className="flex-1 rounded-t"
                    style={{ height: `${h}%`, backgroundColor: '#3b82f6' }}
                  />
                  <div
                    className="flex-1 rounded-t"
                    style={{ height: `${Math.max(20, h - 20)}%`, backgroundColor: '#60a5fa' }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* X-axis labels */}
          <div className="absolute left-10 right-0 bottom-0 flex justify-between px-2">
            {months.map((m) => (
              <span key={m} className="text-[10px] text-muted-foreground flex-1 text-center">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Origens dos leads (gauge/donut style) ─── */
function LeadSources() {
  const sources = [
    { name: 'Website', value: 38.4, hex: '#2563eb' },
    { name: 'Indicação', value: 27.2, hex: '#3b82f6' },
    { name: 'Redes Sociais', value: 19.8, hex: '#60a5fa' },
    { name: 'Outros', value: 14.6, hex: '#93c5fd' },
  ];

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Origem dos Leads</CardTitle>

        {/* Gauge */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="8"
                strokeDasharray={`${38.4 * 2.51} ${251 - 38.4 * 2.51}`} strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">38.4%</span>
              <span className="text-[10px] text-muted-foreground">Website</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {sources.map((source) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: source.hex }} />
                <span className="text-sm text-muted-foreground">{source.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{source.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Performance Cards ─── */
function PerformanceCards() {
  const metrics = [
    { label: 'Taxa Conversão', values: [50, 60, 50, 50], trend: '+12%', positive: true },
    { label: 'Tempo Médio', values: [50, 60, 50, 50], trend: '-8%', positive: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} padding="none">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
            <div className="flex items-end gap-[2px] h-10 mb-2">
              {metric.values.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${v}%`, backgroundColor: 'rgba(37, 99, 235, 0.5)' }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold"
                style={{ color: metric.positive ? '#10b981' : '#ef4444' }}
              >
                {metric.trend}
              </span>
              <span className="text-[10px] text-muted-foreground">vs mês anterior</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ─── Pipeline ─── */
function Pipeline() {
  const stages = [
    { stage: 'Contato Inicial', count: 23, value: 125000, hex: '#93c5fd' },
    { stage: 'Qualificação', count: 15, value: 89000, hex: '#60a5fa' },
    { stage: 'Proposta', count: 8, value: 67000, hex: '#3b82f6' },
    { stage: 'Negociação', count: 5, value: 45000, hex: '#2563eb' },
    { stage: 'Fechamento', count: 3, value: 32000, hex: '#1d4ed8' },
  ];

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Funil de Vendas</CardTitle>
        <div className="space-y-3">
          {stages.map((item) => (
            <div key={item.stage} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.stage}</span>
                <span className="text-xs text-muted-foreground">
                  {item.count} oport.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: '#1e293b' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.count / 23) * 100}%`, backgroundColor: item.hex }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground w-20 text-right">
                  {formatCurrency(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Atividade Recente ─── */
function RecentActivityCard() {
  const activities = [
    { id: '1', type: 'lead' as const, title: 'Novo lead cadastrado', desc: 'João Silva - Tech Solutions', time: 'Há 5 min', iconColor: '#3b82f6' },
    { id: '2', type: 'deal' as const, title: 'Negociação fechada', desc: 'Contrato anual - R$ 45.000', time: 'Há 1h', iconColor: '#2563eb' },
    { id: '3', type: 'client' as const, title: 'Cliente convertido', desc: 'Maria Santos - ABC Corp', time: 'Há 2h', iconColor: '#60a5fa' },
    { id: '4', type: 'task' as const, title: 'Reunião agendada', desc: 'Follow-up com prospect', time: 'Há 3h', iconColor: '#93c5fd' },
  ];

  return (
    <Card padding="none">
      <div className="p-5">
        <CardTitle className="mb-4">Atividade Recente</CardTitle>
        <div className="space-y-3">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${a.iconColor}15`, color: a.iconColor }}
              >
                {a.type === 'lead' && <UserPlus className="h-4 w-4" />}
                {a.type === 'client' && <Users className="h-4 w-4" />}
                {a.type === 'deal' && <DollarSign className="h-4 w-4" />}
                {a.type === 'task' && <Target className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
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

      {/* Row 1: Stat Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de Leads"
          value="12.132"
          change={12}
          icon={<UserPlus className="h-5 w-5" style={{ color: '#3b82f6' }} />}
          trend="up"
          barColor="#3b82f6"
          iconBg="#3b82f6"
        />
        <StatCard
          title="Total de Clientes"
          value="2.982"
          change={-4}
          icon={<Users className="h-5 w-5" style={{ color: '#60a5fa' }} />}
          trend="down"
          barColor="#60a5fa"
          iconBg="#60a5fa"
        />
        <StatCard
          title="Receita do Mês"
          value={formatCurrency(156780)}
          change={23}
          icon={<DollarSign className="h-5 w-5" style={{ color: '#2563eb' }} />}
          trend="up"
          barColor="#2563eb"
          iconBg="#2563eb"
        />
      </div>

      {/* Row 2: Gráfico + Origens */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BarChart />
        </div>
        <LeadSources />
      </div>

      {/* Row 3: Performance + Pipeline + Atividades */}
      <div className="grid gap-4 lg:grid-cols-3">
        <PerformanceCards />
        <Pipeline />
        <RecentActivityCard />
      </div>
    </div>
  );
}
