'use client';

import { useState, useEffect } from 'react';
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
  GripVertical,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import api from '@/lib/api';

/* ─── Types ─── */
type ActivityType = 'ligacao' | 'reuniao' | 'follow_up' | 'email' | 'tarefa' | 'visita';
type ActivityStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada' | 'atrasada';
type ActivityPriority = 'baixa' | 'media' | 'alta' | 'urgente';

interface Tarefa {
  id: string;
  texto: string;
  concluida: boolean;
}

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
  tarefas: Tarefa[];
}

/* ─── API Mapping ─── */
function mapFromApi(raw: any): Activity {
  return {
    id: raw.id,
    titulo: raw.titulo || '',
    descricao: raw.descricao || '',
    tipo: raw.tipo || 'tarefa',
    status: raw.status || 'pendente',
    prioridade: raw.prioridade || 'media',
    dataInicio: raw.dataInicio || new Date().toISOString(),
    dataFim: raw.dataFim || null,
    responsavel: raw.responsavel || '',
    cliente: raw.cliente || '',
    empresa: raw.empresa || '',
    observacoes: raw.observacoes || '',
    tarefas: Array.isArray(raw.tarefas) ? raw.tarefas : [],
  };
}

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

  const initialCards = [
    { id: 'total', label: 'Total Atividades', value: total.toString(), icon: CheckSquare, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
    { id: 'pendentes', label: 'Pendentes', value: pendentes.toString(), icon: Clock, color: 'text-yellow-400', colorBg: 'bg-yellow-500/10' },
    { id: 'concluidas', label: 'Concluídas', value: concluidas.toString(), icon: CheckCircle2, color: 'text-green-400', colorBg: 'bg-green-500/10' },
    { id: 'atrasadas', label: 'Atrasadas', value: atrasadas.toString(), icon: AlertCircle, color: 'text-red-400', colorBg: 'bg-red-500/10' },
  ];

  const [cards, setCards] = useState(initialCards);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    setCards([
      { id: 'total', label: 'Total Atividades', value: total.toString(), icon: CheckSquare, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
      { id: 'pendentes', label: 'Pendentes', value: pendentes.toString(), icon: Clock, color: 'text-yellow-400', colorBg: 'bg-yellow-500/10' },
      { id: 'concluidas', label: 'Concluídas', value: concluidas.toString(), icon: CheckCircle2, color: 'text-green-400', colorBg: 'bg-green-500/10' },
      { id: 'atrasadas', label: 'Atrasadas', value: atrasadas.toString(), icon: AlertCircle, color: 'text-red-400', colorBg: 'bg-red-500/10' },
    ]);
  }, [total, pendentes, concluidas, atrasadas]);

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

    setCards((prev) => {
      const draggedIndex = prev.findIndex((c) => c.id === draggedId);
      const targetIndex = prev.findIndex((c) => c.id === targetId);
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
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          draggable
          onDragStart={() => handleDragStart(card.id)}
          onDragOver={(e) => handleDragOver(e, card.id)}
          onDrop={() => handleDrop(card.id)}
          className={`group relative rounded-xl border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4 transition-all cursor-grab active:cursor-grabbing ${dragOverId === card.id ? 'scale-[1.02] ring-2 ring-blue-500/30' : ''}`}
        >
          <div className="absolute top-2 right-2 z-10 rounded-lg bg-[#252d3f]/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-3 w-3 text-[#94a3b8]" />
          </div>
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
function DetailPanel({ activity, onClose, onToggleTarefa }: { activity: Activity; onClose: () => void; onToggleTarefa: (activityId: string, tarefaId: string) => void }) {
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

        {/* Lista de Tarefas no Modal */}
        {activity.tarefas.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Lista de Tarefas</h3>
              <span className="text-xs text-[#94a3b8]">
                {activity.tarefas.filter((t) => t.concluida).length}/{activity.tarefas.length} concluídas
              </span>
            </div>
            {/* Barra de Progresso */}
            <div className="mb-3 h-2 w-full rounded-full bg-[#2a3146]">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${activity.tarefas.length > 0 ? Math.round((activity.tarefas.filter((t) => t.concluida).length / activity.tarefas.length) * 100) : 0}%`,
                  backgroundColor: activity.tarefas.every((t) => t.concluida) ? '#22c55e' : '#3b82f6',
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              {activity.tarefas.map((tarefa) => (
                <label
                  key={tarefa.id}
                  className="flex items-center gap-3 rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3 cursor-pointer hover:border-blue-500/30 transition-colors group/tarefa"
                >
                  <input
                    type="checkbox"
                    checked={tarefa.concluida}
                    onChange={() => onToggleTarefa(activity.id, tarefa.id)}
                    className="h-4 w-4 shrink-0 rounded border-[#2a3146] bg-[#1a1f2e] accent-blue-500 cursor-pointer"
                  />
                  <span className={`text-sm transition-all ${tarefa.concluida ? 'text-[#94a3b8]/60 line-through' : 'text-white group-hover/tarefa:text-blue-300'}`}>
                    {tarefa.texto}
                  </span>
                </label>
              ))}
            </div>
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

/* ─── Activity Card ─── */
function ActivityCard({
  activity,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleTarefa,
  isDragOver,
}: {
  activity: Activity;
  onClick: () => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (id: string) => void;
  onToggleTarefa: (activityId: string, tarefaId: string) => void;
  isDragOver: boolean;
}) {
  const typeConf = typeConfig[activity.tipo];
  const TypeIcon = typeConf.icon;
  const tarefasConcluidas = activity.tarefas.filter((t) => t.concluida).length;
  const totalTarefas = activity.tarefas.length;
  const progresso = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
    onDragStart(activity.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => onDragOver(e, activity.id)}
      onDrop={() => onDrop(activity.id)}
      className={`group relative flex flex-col rounded-xl border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 cursor-grab active:cursor-grabbing ${isDragOver ? 'scale-[1.02] ring-2 ring-blue-500/30' : ''}`}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 z-10 rounded-lg bg-[#252d3f]/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3 w-3 text-[#94a3b8]" />
      </div>

      {/* Header: Icon + Type + Priority */}
      <div className="flex items-center justify-between mb-3" onClick={onClick}>
        <div className="flex items-center gap-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${typeConf.bg}`}>
            <TypeIcon className={`h-4.5 w-4.5 ${typeConf.color}`} />
          </div>
          <TypeBadge tipo={activity.tipo} />
        </div>
        <PriorityBadge prioridade={activity.prioridade} />
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2 leading-snug cursor-pointer" onClick={onClick}>{activity.titulo}</h4>

      {/* Info */}
      <div className="flex flex-col gap-1.5 text-xs text-[#94a3b8] mb-3">
        {activity.empresa && (
          <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3 shrink-0" /> {activity.empresa}</span>
        )}
        <span className="flex items-center gap-1.5"><User className="h-3 w-3 shrink-0" /> {activity.responsavel}</span>
      </div>

      {/* Lista de Tarefas */}
      {activity.tarefas.length > 0 && (
        <div className="mb-3 rounded-lg border border-[#2a3146]/50 bg-[#0f1420]/40 p-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#94a3b8]">Lista de Tarefas</span>
            <span className="text-xs text-[#94a3b8]">{tarefasConcluidas}/{totalTarefas}</span>
          </div>
          {/* Barra de Progresso */}
          <div className="mb-2.5 h-1.5 w-full rounded-full bg-[#2a3146]">
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${progresso}%`,
                backgroundColor: progresso === 100 ? '#22c55e' : progresso > 50 ? '#3b82f6' : '#f59e0b',
              }}
            />
          </div>
          {/* Itens */}
          <div className="flex flex-col gap-1.5">
            {activity.tarefas.map((tarefa) => (
              <label
                key={tarefa.id}
                className="flex items-start gap-2 cursor-pointer group/tarefa"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={tarefa.concluida}
                  onChange={() => onToggleTarefa(activity.id, tarefa.id)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[#2a3146] bg-[#1a1f2e] accent-blue-500 cursor-pointer"
                />
                <span className={`text-xs leading-relaxed transition-all ${tarefa.concluida ? 'text-[#94a3b8]/60 line-through' : 'text-[#94a3b8] group-hover/tarefa:text-white'}`}>
                  {tarefa.texto}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Date + Status */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2a3146]/50">
        <div className="flex flex-col text-xs text-[#94a3b8]">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateTime(activity.dataInicio)}</span>
          {activity.dataFim && (
            <span className="mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(activity.dataFim)}</span>
          )}
        </div>
        <StatusBadge status={activity.status} />
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function AtividadesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activities?limit=100')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setActivities(Array.isArray(data) ? data.map(mapFromApi) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | 'todos'>('todos');
  const [filterType, setFilterType] = useState<ActivityType | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleToggleTarefa = (activityId: string, tarefaId: string) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id !== activityId) return activity;
        return {
          ...activity,
          tarefas: activity.tarefas.map((tarefa) =>
            tarefa.id === tarefaId ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
          ),
        };
      })
    );
  };

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

    setActivities((prev) => {
      const draggedIndex = prev.findIndex((a) => a.id === draggedId);
      const targetIndex = prev.findIndex((a) => a.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const updated = [...prev];
      const [dragged] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, dragged);
      return updated;
    });

    setDraggedId(null);
    setDragOverId(null);
  };

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
          <Button variant="ghost" leftIcon={<Plus className="h-4 w-4" />}>
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

      {/* Activity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading && (
          <div className="col-span-full flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
        {!loading && filtered.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onClick={() => setSelectedActivity(activity)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onToggleTarefa={handleToggleTarefa}
            isDragOver={dragOverId === activity.id}
          />
        ))}

        {!loading && filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a3146] py-12">
            <CheckSquare className="mb-3 h-8 w-8 text-[#94a3b8]" />
            <p className="text-sm text-[#94a3b8]">Nenhuma atividade encontrada</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <DetailPanel
          activity={activities.find((a) => a.id === selectedActivity.id) || selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onToggleTarefa={handleToggleTarefa}
        />
      )}
    </div>
  );
}
