'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  DollarSign,
  Building2,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Paperclip,
  AlertCircle,
  X,
  GripVertical,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import api from '@/lib/api';

/* ─── Types ─── */
type NegotiationStatus = 'rascunho' | 'enviada' | 'aceita' | 'recusada' | 'expirada';

interface Negotiation {
  id: string;
  titulo: string;
  valor: number;
  empresa: string;
  cliente: string;
  status: NegotiationStatus;
  descricao: string;
  condicoes: string;
  validade: string;
  dataEnvio: string | null;
  dataResposta: string | null;
  anexos: string[];
  criadoEm: string;
}

/* ─── API Mapping ─── */
function mapFromApi(raw: any): Negotiation {
  return {
    id: raw.id,
    titulo: raw.titulo || '',
    valor: parseFloat(raw.valor) || 0,
    empresa: raw.empresa || '',
    cliente: raw.cliente || '',
    status: raw.status || 'rascunho',
    descricao: raw.descricao || '',
    condicoes: raw.condicoes || '',
    validade: raw.validade || '',
    dataEnvio: raw.dataEnvio || null,
    dataResposta: raw.dataResposta || null,
    anexos: Array.isArray(raw.anexos) ? raw.anexos : [],
    criadoEm: raw.criadoEm || new Date().toISOString(),
  };
}

/* ─── Helpers ─── */
function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const statusConfig: Record<NegotiationStatus, { label: string; color: string; bg: string; icon: typeof FileText }> = {
  rascunho: { label: 'Rascunho', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30', icon: FileText },
  enviada: { label: 'Enviada', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Send },
  aceita: { label: 'Aceita', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckCircle2 },
  recusada: { label: 'Recusada', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: XCircle },
  expirada: { label: 'Expirada', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: AlertCircle },
};

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: NegotiationStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

/* ─── Summary Cards ─── */
function SummaryCards({ negotiations }: { negotiations: Negotiation[] }) {
  const total = negotiations.length;
  const valorTotal = negotiations.reduce((s, n) => s + n.valor, 0);
  const aceitas = negotiations.filter((n) => n.status === 'aceita');
  const valorAceito = aceitas.reduce((s, n) => s + n.valor, 0);
  const taxaConversao = total > 0 ? Math.round((aceitas.length / total) * 100) : 0;

  const initialCards = [
    { id: 'total', label: 'Total Negociações', value: total.toString(), icon: FileText, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
    { id: 'valor-total', label: 'Valor Total', value: formatCurrency(valorTotal), icon: DollarSign, color: 'text-green-400', colorBg: 'bg-green-500/10' },
    { id: 'valor-aceito', label: 'Valor Aceito', value: formatCurrency(valorAceito), icon: CheckCircle2, color: 'text-emerald-400', colorBg: 'bg-emerald-500/10' },
    { id: 'taxa-conversao', label: 'Taxa de Conversão', value: `${taxaConversao}%`, icon: Send, color: 'text-purple-400', colorBg: 'bg-purple-500/10' },
  ];

  const [cards, setCards] = useState(initialCards);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    setCards([
      { id: 'total', label: 'Total Negociações', value: total.toString(), icon: FileText, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
      { id: 'valor-total', label: 'Valor Total', value: formatCurrency(valorTotal), icon: DollarSign, color: 'text-green-400', colorBg: 'bg-green-500/10' },
      { id: 'valor-aceito', label: 'Valor Aceito', value: formatCurrency(valorAceito), icon: CheckCircle2, color: 'text-emerald-400', colorBg: 'bg-emerald-500/10' },
      { id: 'taxa-conversao', label: 'Taxa de Conversão', value: `${taxaConversao}%`, icon: Send, color: 'text-purple-400', colorBg: 'bg-purple-500/10' },
    ]);
  }, [total, valorTotal, valorAceito, taxaConversao]);

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

/* ─── Create/Edit Modal ─── */
function CreateNegotiationModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (negotiation: Negotiation) => void;
}) {
  const [form, setForm] = useState({
    titulo: '',
    valor: '',
    empresa: '',
    cliente: '',
    descricao: '',
    condicoes: '',
    status: 'rascunho' as NegotiationStatus,
    validade: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.valor) return;

    const newNegotiation: Negotiation = {
      id: Date.now().toString(),
      titulo: form.titulo,
      valor: parseFloat(form.valor),
      empresa: form.empresa,
      cliente: form.cliente,
      descricao: form.descricao,
      condicoes: form.condicoes,
      status: form.status,
      validade: form.validade,
      dataEnvio: form.status === 'enviada' ? new Date().toISOString().split('T')[0] : null,
      dataResposta: null,
      anexos: [],
      criadoEm: new Date().toISOString().split('T')[0],
    };

    onSave(newNegotiation);
    setForm({ titulo: '', valor: '', empresa: '', cliente: '', descricao: '', condicoes: '', status: 'rascunho', validade: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-[#2a3146] bg-[#0f1420] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Nova Negociação</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#252d3f] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Título *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50"
                placeholder="Nome da negociação"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Valor (R$) *</label>
              <input
                type="number"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Empresa</label>
              <input
                type="text"
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50"
                placeholder="Nome da empresa"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Cliente</label>
              <input
                type="text"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50"
                placeholder="Nome do cliente"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as NegotiationStatus })}
                className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
              >
                <option value="rascunho">Rascunho</option>
                <option value="enviada">Enviada</option>
                <option value="aceita">Aceita</option>
                <option value="recusada">Recusada</option>
                <option value="expirada">Expirada</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Validade</label>
              <input
                type="date"
                value={form.validade}
                onChange={(e) => setForm({ ...form, validade: e.target.value })}
                className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50"
              placeholder="Descreva a negociação..."
            />
          </div>

          {/* Conditions */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Condições</label>
            <textarea
              value={form.condicoes}
              onChange={(e) => setForm({ ...form, condicoes: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50"
              placeholder="Condições de pagamento, prazos..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[#252d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f3a50] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Criar Negociação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Detail Panel ─── */
function DetailPanel({ negotiation, onClose }: { negotiation: Negotiation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-[#2a3146] bg-[#0f1420] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{negotiation.titulo}</h2>
            <div className="mt-1 flex items-center gap-3 text-sm text-[#94a3b8]">
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {negotiation.empresa}</span>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {negotiation.cliente}</span>
            </div>
          </div>
          <StatusBadge status={negotiation.status} />
        </div>

        <div className="mb-6 rounded-xl border border-[#2a3146] bg-[#1a1f2e]/40 p-4">
          <span className="text-xs text-[#94a3b8]">Valor da Proposta</span>
          <p className="mt-1 text-2xl font-bold text-green-400">{formatCurrency(negotiation.valor)}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Validade</span>
            <p className="mt-1 text-sm font-medium text-white">{formatDate(negotiation.validade)}</p>
          </div>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Enviada em</span>
            <p className="mt-1 text-sm font-medium text-white">{formatDate(negotiation.dataEnvio)}</p>
          </div>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Resposta em</span>
            <p className="mt-1 text-sm font-medium text-white">{formatDate(negotiation.dataResposta)}</p>
          </div>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Criada em</span>
            <p className="mt-1 text-sm font-medium text-white">{formatDate(negotiation.criadoEm)}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Descrição</h3>
          <p className="text-sm text-[#94a3b8]">{negotiation.descricao}</p>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Condições</h3>
          <p className="text-sm text-[#94a3b8]">{negotiation.condicoes}</p>
        </div>

        {negotiation.anexos.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Anexos</h3>
            <div className="flex flex-wrap gap-2">
              {negotiation.anexos.map((anexo) => (
                <span key={anexo} className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                  <Paperclip className="h-3 w-3" />
                  {anexo}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-[#252d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f3a50] transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Negotiation Row ─── */
function NegotiationRow({
  negotiation,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  negotiation: Negotiation;
  onClick: () => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (id: string) => void;
  isDragOver: boolean;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
    onDragStart(negotiation.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => onDragOver(e, negotiation.id)}
      onDrop={() => onDrop(negotiation.id)}
      onClick={onClick}
      className={`group relative flex items-center gap-4 rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4 transition-all hover:border-blue-500/30 cursor-grab active:cursor-grabbing ${isDragOver ? 'scale-[1.01] ring-2 ring-blue-500/30' : ''}`}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-[#94a3b8]" />
      </div>
      <div className="flex-1 min-w-0 ml-6">
        <h4 className="text-sm font-medium text-white truncate">{negotiation.titulo}</h4>
        <div className="mt-1 flex items-center gap-3 text-xs text-[#94a3b8]">
          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {negotiation.empresa}</span>
          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {negotiation.cliente}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold text-green-400">{formatCurrency(negotiation.valor)}</span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-xs text-[#94a3b8]">
        <Calendar className="h-3 w-3" />
        {formatDate(negotiation.validade)}
      </div>
      {negotiation.anexos.length > 0 && (
        <div className="hidden sm:flex items-center gap-1 text-xs text-[#94a3b8]">
          <Paperclip className="h-3 w-3" />
          {negotiation.anexos.length}
        </div>
      )}
      <StatusBadge status={negotiation.status} />
      <button
        onClick={(e) => e.stopPropagation()}
        className="rounded p-1.5 text-[#94a3b8] opacity-0 transition-opacity hover:bg-[#252d3f] hover:text-white group-hover:opacity-100"
      >
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Page ─── */
export default function NegociacoesPage() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<NegotiationStatus | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/negotiations?limit=100')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setNegotiations(Array.isArray(data) ? data.map(mapFromApi) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreateNegotiation = (newNegotiation: Negotiation) => {
    setNegotiations((prev) => [newNegotiation, ...prev]);
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

    setNegotiations((prev) => {
      const draggedIndex = prev.findIndex((n) => n.id === draggedId);
      const targetIndex = prev.findIndex((n) => n.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const updated = [...prev];
      const [dragged] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, dragged);
      return updated;
    });

    setDraggedId(null);
    setDragOverId(null);
  };

  const filtered = negotiations.filter((n) => {
    const matchStatus = filterStatus === 'todos' || n.status === filterStatus;
    const matchSearch =
      searchTerm === '' ||
      n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <PageHeader
        title="Negociações"
        subtitle="Gerencie suas propostas e negociações"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Negociações' },
        ]}
        actions={
          <Button variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsCreateModalOpen(true)}>
            Nova Negociação
          </Button>
        }
      />

      <SummaryCards negotiations={negotiations} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Buscar negociações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 py-2 pl-10 pr-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#94a3b8]" />
          <div className="flex gap-1">
            {(['todos', 'rascunho', 'enviada', 'aceita', 'recusada', 'expirada'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
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
      </div>

      <div className="space-y-2">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
        {!loading && filtered.map((negotiation) => (
          <NegotiationRow
            key={negotiation.id}
            negotiation={negotiation}
            onClick={() => setSelectedNegotiation(negotiation)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragOver={dragOverId === negotiation.id}
          />
        ))}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a3146] py-12">
            <FileText className="mb-3 h-8 w-8 text-[#94a3b8]" />
            <p className="text-sm text-[#94a3b8]">Nenhuma negociação encontrada</p>
          </div>
        )}
      </div>

      {selectedNegotiation && (
        <DetailPanel negotiation={selectedNegotiation} onClose={() => setSelectedNegotiation(null)} />
      )}

      <CreateNegotiationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateNegotiation}
      />
    </div>
  );
}
