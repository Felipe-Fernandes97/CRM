'use client';

import { useState } from 'react';
import {
  Phone,
  Users,
  Mail,
  MapPin,
  CheckSquare,
  RefreshCw,
  Plus,
  Calendar,
  Clock,
  User,
  Building2,
  MoreHorizontal,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Flag,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';

/* ─── Types ─── */
type ActivityType = 'ligacao' | 'reuniao' | 'follow_up' | 'email' | 'tarefa' | 'visita';
type ActivityStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada' | 'atrasada';
type ActivityPriority = 'baixa' | 'media' | 'alta' | 'urgente';

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  tipo: ActivityType;
  status: ActivityStatus;
  prioridade: ActivityPriority;
  dataInicio: string;
  dataFim: string | null;
  responsavel: string;
  cliente: string;
  empresa: string;
  observacoes: string;
}

/* ─── Mock Data ─── */
const mockActivities: Activity[] = [
  {
    id: '1',
    titulo: 'Ligar para João Silva - Follow up proposta ERP',
    descricao: 'Retornar ligação sobre a proposta enviada na semana passada.',
    tipo: 'ligacao',
    status: 'pendente',
    prioridade: 'alta',
    dataInicio: '2025-02-10T09:00:00',
    dataFim: '2025-02-10T09:30:00',
    responsavel: 'Felipe Santos',
    cliente: 'João Silva',
    empresa: 'Tech Solutions',
    observacoes: 'Cliente demonstrou interesse na demo.',
  },
  {
    id: '2',
    titulo: 'Reunião de apresentação - Global Imports',
    descricao: 'Apresentar solução de migração cloud para o time de TI.',
    tipo: 'reuniao',
    status: 'em_andamento',
    prioridade: 'urgente',
    dataInicio: '2025-02-10T14:00:00',
    dataFim: '2025-02-10T15:30:00',
    responsavel: 'Felipe Santos',
    cliente: 'Carlos Lima',
    empresa: 'Global Imports',
    observacoes: 'Preparar slides e ambiente de demo.',
  },
  {
    id: '3',
    titulo: 'Enviar proposta revisada - Nova Tech',
    descricao: 'Ajustar valores conforme negociação e reenviar.',
    tipo: 'email',
    status: 'pendente',
    prioridade: 'media',
    dataInicio: '2025-02-11T10:00:00',
    dataFim: null,
    responsavel: 'Ana Costa',
    cliente: 'Rafael Souza',
    empresa: 'Nova Tech',
    observacoes: 'Desconto de 8% aprovado pela gerência.',
  },
  {
    id: '4',
    titulo: 'Follow-up pós reunião - Omega Services',
    descricao: 'Enviar ata da reunião e próximos passos.',
    tipo: 'follow_up',
    status: 'concluida',
    prioridade: 'media',
    dataInicio: '2025-02-08T11:00:00',
    dataFim: '2025-02-08T11:30:00',
    responsavel: 'Felipe Santos',
    cliente: 'Pedro Rocha',
    empresa: 'Omega Services',
    observacoes: 'Ata enviada por email. Aguardando retorno.',
  },
  {
    id: '5',
    titulo: 'Visita técnica - Beta Systems',
    descricao: 'Visitar cliente para levantamento de requisitos do app.',
    tipo: 'visita',
    status: 'pendente',
    prioridade: 'alta',
    dataInicio: '2025-02-12T09:00:00',
    dataFim: '2025-02-12T12:00:00',
    responsavel: 'Ana Costa',
    cliente: 'Julia Mendes',
    empresa: 'Beta Systems',
    observacoes: 'Levar equipamento para testes.',
  },
  {
    id: '6',
    titulo: 'Preparar contrato - Smart Digital',
    descricao: 'Elaborar contrato de suporte premium conforme proposta aceita.',
    tipo: 'tarefa',
    status: 'atrasada',
    prioridade: 'urgente',
    dataInicio: '2025-02-07T08:00:00',
    dataFim: '2025-02-07T18:00:00',
    responsavel: 'Felipe Santos',
    cliente: 'Ana Costa',
    empresa: 'Smart Digital',
    observacoes: 'Prazo expirado. Priorizar imediatamente.',
  },
  {
    id: '7',
    titulo: 'Ligação de qualificação - DataFlow',
    descricao: 'Primeiro contato para entender necessidades de migração.',
    tipo: 'ligacao',
    status: 'concluida',
    prioridade: 'baixa',
    dataInicio: '2025-02-06T16:00:00',
    dataFim: '2025-02-06T16:20:00',
    responsavel: 'Ana Costa',
    cliente: 'Lucas Mendes',
    empresa: 'DataFlow',
    observacoes: 'Lead qualificado. Agendar reunião técnica.',
  },
  {
    id: '8',
    titulo: 'Reunião interna - Pipeline review',
    descricao: 'Revisão semanal do pipeline de vendas com a equipe.',
    tipo: 'reuniao',
    status: 'pendente',
    prioridade: 'media',
    dataInicio: '2025-02-13T10:00:00',
    dataFim: '2025-02-13T11:00:00',
    responsavel: 'Felipe Santos',
    cliente: '',
    empresa: '',
    observacoes: 'Preparar relatório de métricas.',
  },
];

/* ─── Helpers ─── */
function formatDateTime(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ─── Config Maps ─── */
const typeConfig: Record<ActivityType, { label: string; color: string; bg: string; icon: typeof Phone }> = {
  ligacao: { label: 'Ligação', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Phone },
  reuniao: { label: 'Reunião', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: Users },
  follow_up: { label: 'Follow-up', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: RefreshCw },
  email: { label: 'E-mail', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: Mail },
  tarefa: { label: 'Tarefa', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckSquare },
  visita: { label: 'Visita', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30', icon: MapPin },
};

const statusConfig: Record<ActivityStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pendente: { label: 'Pendente', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Clock },
  em_andamento: { label: 'Em andamento', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: PlayCircle },
  concluida: { label: 'Concluída', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckCircle2 },
  cancelada: { label: 'Cancelada', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30', icon: XCircle },
  atrasada: { label: 'Atrasada', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertCircle },
};

const priorityConfig: Record<ActivityPriority, { label: string; color: string; dot: string }> = {
  baixa: { label: 'Baixa', color: 'text-gray-400', dot: 'bg-gray-400' },
  media: { label: 'Média', color: 'text-yellow-400', dot: 'bg-yellow-400' },
  alta: { label: 'Alta', color: 'text-orange-400', dot: 'bg-orange-400' },
  urgente: { label: 'Urgente', color: 'text-red-400', dot: 'bg-red-400' },
};

/* ─── Badges ─── */
function TypeBadge({ tipo }: { tipo: ActivityType }) {
  const config = typeConfig[tipo];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function PriorityBadge({ prioridade }: { prioridade: ActivityPriority }) {
  const config = priorityConfig[prioridade];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

/* ─── Summary Cards ─── */
function SummaryCards({ activities }: { activities: Activity[] }) {
  const total = activities.length;
  const pendentes = activities.filter((a) => a.status === 'pendente' || a.status === 'em_andamento').length;
  const concluidas = activities.filter((a) => a.status === 'concluida').length;
  const atrasadas = activities.filter((a) => a.status === 'atrasada').length;

  const cards = [
    { label: 'Total Atividades', value: total.toString(), icon: CheckSquare, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
    { label: 'Pendentes', value: pendentes.toString(), icon: Clock, color: 'text-yellow-400', colorBg: 'bg-yellow-500/10' },
    { label: 'Concluídas', value: concluidas.toString(), icon: CheckCircle2, color: 'text-green-400', colorBg: 'bg-green-500/10' },
    { label: 'Atrasadas', value: atrasadas.toString(), icon: AlertCircle, color: 'text-red-400', colorBg: 'bg-red-500/10' },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-[#94a3b8]">{card.label}</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.colorBg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Detail Panel ─── */
function DetailPanel({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-[#2a3146] bg-[#0f1420] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{activity.titulo}</h2>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <TypeBadge tipo={activity.tipo} />
              <StatusBadge status={activity.status} />
              <PriorityBadge prioridade={activity.prioridade} />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Início</span>
            <p className="mt-1 text-sm font-medium text-white">{formatDateTime(activity.dataInicio)}</p>
          </div>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Fim</span>
            <p className="mt-1 text-sm font-medium text-white">{formatDateTime(activity.dataFim)}</p>
          </div>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Responsável</span>
            <p className="mt-1 text-sm font-medium text-white">{activity.responsavel}</p>
          </div>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Empresa</span>
            <p className="mt-1 text-sm font-medium text-white">{activity.empresa || '—'}</p>
          </div>
        </div>

        {/* Description */}
        {activity.descricao && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-white">Descrição</h3>
            <p className="text-sm text-[#94a3b8]">{activity.descricao}</p>
          </div>
        )}

        {/* Notes */}
        {activity.observacoes && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Observações</h3>
            <p className="text-sm text-[#94a3b8]">{activity.observacoes}</p>
          </div>
        )}

        {/* Close */}
        <div className="flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-[#252d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f3a50] transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Activity Row ─── */
function ActivityRow({ activity, onClick }: { activity: Activity; onClick: () => void }) {
  const typeConf = typeConfig[activity.tipo];
  const TypeIcon = typeConf.icon;

  return (
    <div onClick={onClick} className="group flex items-center gap-4 rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4 transition-all hover:border-blue-500/30 cursor-pointer">
      {/* Type Icon */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeConf.bg}`}>
        <TypeIcon className={`h-5 w-5 ${typeConf.color}`} />
      </div>

      {/* Title & Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{activity.titulo}</h4>
        <div className="mt-1 flex items-center gap-3 text-xs text-[#94a3b8]">
          {activity.empresa && (
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {activity.empresa}</span>
          )}
          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {activity.responsavel}</span>
        </div>
      </div>

      {/* DateTime */}
      <div className="hidden md:flex flex-col items-end text-xs text-[#94a3b8]">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateTime(activity.dataInicio)}</span>
        {activity.dataFim && (
          <span className="mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(activity.dataFim)}</span>
        )}
      </div>

      {/* Priority */}
      <div className="hidden sm:block">
        <PriorityBadge prioridade={activity.prioridade} />
      </div>

      {/* Status */}
      <StatusBadge status={activity.status} />

      {/* View */}
      <button className="rounded p-1.5 text-[#94a3b8] opacity-0 transition-opacity hover:bg-[#252d3f] hover:text-white group-hover:opacity-100">
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Page ─── */
export default function AtividadesPage() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | 'todos'>('todos');
  const [filterType, setFilterType] = useState<ActivityType | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = activities.filter((a) => {
    const matchStatus = filterStatus === 'todos' || a.status === filterStatus;
    const matchType = filterType === 'todos' || a.tipo === filterType;
    const matchSearch =
      searchTerm === '' ||
      a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  return (
    <div>
      <PageHeader
        title="Atividades"
        subtitle="Gerencie suas tarefas, ligações, reuniões e follow-ups"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Atividades' },
        ]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Nova Atividade
          </Button>
        }
      />

      {/* Summary */}
      <SummaryCards activities={activities} />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3">
        {/* Search + Type filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 py-2 pl-10 pr-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 shrink-0 text-[#94a3b8]" />
            {(['todos', 'ligacao', 'reuniao', 'follow_up', 'email', 'tarefa', 'visita'] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFilterType(tipo)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterType === tipo
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-[#94a3b8] hover:bg-[#252d3f] hover:text-white border border-transparent'
                }`}
              >
                {tipo === 'todos' ? 'Todos' : typeConfig[tipo].label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <Flag className="h-4 w-4 shrink-0 text-[#94a3b8]" />
          {(['todos', 'pendente', 'em_andamento', 'concluida', 'cancelada', 'atrasada'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-[#94a3b8] hover:bg-[#252d3f] hover:text-white border border-transparent'
              }`}
            >
              {status === 'todos' ? 'Todos' : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {filtered.map((activity) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            onClick={() => setSelectedActivity(activity)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a3146] py-12">
            <CheckSquare className="mb-3 h-8 w-8 text-[#94a3b8]" />
            <p className="text-sm text-[#94a3b8]">Nenhuma atividade encontrada</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <DetailPanel
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}
