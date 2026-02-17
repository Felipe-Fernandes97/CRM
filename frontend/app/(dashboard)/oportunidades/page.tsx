'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Target,
  Plus,
  DollarSign,
  User,
  Building2,
  Calendar,
  MoreHorizontal,
  GripVertical,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';

/* ─── Types ─── */
interface Opportunity {
  id: string;
  nome: string;
  empresa: string;
  contato: string;
  valor: number;
  probabilidade: number;
  dataFechamento: string;
  etapa: string;
}

interface PipelineColumn {
  id: string;
  titulo: string;
  cor: string;
  corBg: string;
  icone: typeof Target;
  oportunidades: Opportunity[];
}

/* ─── Mock Data ─── */
const initialColumns: PipelineColumn[] = [
  {
    id: 'contato',
    titulo: 'Primeiro Contato',
    cor: 'text-blue-400',
    corBg: 'bg-blue-500',
    icone: User,
    oportunidades: [
      { id: '1', nome: 'Implantação ERP', empresa: 'Tech Solutions', contato: 'João Silva', valor: 45000, probabilidade: 20, dataFechamento: '2025-03-15', etapa: 'contato' },
      { id: '2', nome: 'Consultoria TI', empresa: 'ABC Corp', contato: 'Maria Santos', valor: 18500, probabilidade: 30, dataFechamento: '2025-02-28', etapa: 'contato' },
      { id: '3', nome: 'Migração Cloud', empresa: 'DataFlow', contato: 'Lucas Mendes', valor: 32000, probabilidade: 15, dataFechamento: '2025-04-10', etapa: 'contato' },
    ],
  },
  {
    id: 'qualificacao',
    titulo: 'Qualificação',
    cor: 'text-yellow-400',
    corBg: 'bg-yellow-500',
    icone: TrendingUp,
    oportunidades: [
      { id: '4', nome: 'Licenças SaaS', empresa: 'Global Imports', contato: 'Carlos Lima', valor: 67000, probabilidade: 45, dataFechamento: '2025-02-20', etapa: 'qualificacao' },
      { id: '5', nome: 'Suporte Premium', empresa: 'Smart Digital', contato: 'Ana Costa', valor: 24000, probabilidade: 50, dataFechamento: '2025-03-05', etapa: 'qualificacao' },
    ],
  },
  {
    id: 'proposta',
    titulo: 'Proposta',
    cor: 'text-purple-400',
    corBg: 'bg-purple-500',
    icone: DollarSign,
    oportunidades: [
      { id: '6', nome: 'Automação Industrial', empresa: 'Omega Services', contato: 'Pedro Rocha', valor: 120000, probabilidade: 65, dataFechamento: '2025-02-10', etapa: 'proposta' },
      { id: '7', nome: 'Infraestrutura Rede', empresa: 'Beta Systems', contato: 'Julia Mendes', valor: 53000, probabilidade: 70, dataFechamento: '2025-02-18', etapa: 'proposta' },
    ],
  },
  {
    id: 'negociacao',
    titulo: 'Negociação',
    cor: 'text-orange-400',
    corBg: 'bg-orange-500',
    icone: Clock,
    oportunidades: [
      { id: '8', nome: 'Plataforma E-commerce', empresa: 'Nova Tech', contato: 'Rafael Souza', valor: 89000, probabilidade: 80, dataFechamento: '2025-02-05', etapa: 'negociacao' },
    ],
  },
  {
    id: 'fechamento',
    titulo: 'Fechamento',
    cor: 'text-green-400',
    corBg: 'bg-green-500',
    icone: CheckCircle2,
    oportunidades: [
      { id: '9', nome: 'Sistema CRM', empresa: 'Inovatech', contato: 'Fernanda Alves', valor: 75000, probabilidade: 95, dataFechamento: '2025-01-30', etapa: 'fechamento' },
    ],
  },
];

/* ─── Helpers ─── */
function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/* ─── Opportunity Card (Draggable) ─── */
function OpportunityCard({ oportunidade }: { oportunidade: Opportunity }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('opportunityId', oportunidade.id);
    e.dataTransfer.setData('fromColumn', oportunidade.etapa);
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group cursor-grab active:cursor-grabbing rounded-lg border border-[#2a3146] bg-transparent backdrop-blur-sm p-4 transition-all hover:border-blue-500/30"
    >
      {/* Drag Handle + Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-2">
          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8]/50 group-hover:text-[#94a3b8]" />
          <h4 className="text-sm font-medium text-white">{oportunidade.nome}</h4>
        </div>
        <button className="rounded p-1 text-[#94a3b8] opacity-0 transition-opacity hover:bg-[#252d3f] hover:text-white group-hover:opacity-100">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Company & Contact */}
      <div className="mb-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <Building2 className="h-3 w-3" />
          <span>{oportunidade.empresa}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <User className="h-3 w-3" />
          <span>{oportunidade.contato}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-sm font-semibold text-white">
          {formatCurrency(oportunidade.valor)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(oportunidade.dataFechamento)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[#252d3f]">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${oportunidade.probabilidade}%` }}
            />
          </div>
          <span className="text-xs font-medium text-[#94a3b8]">
            {oportunidade.probabilidade}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Pipeline Column (Drop Target) ─── */
function PipelineColumnComponent({
  column,
  onDrop,
}: {
  column: PipelineColumn;
  onDrop: (opportunityId: string, fromColumn: string, toColumn: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const totalValue = column.oportunidades.reduce((sum, o) => sum + o.valor, 0);
  const Icon = column.icone;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const opportunityId = e.dataTransfer.getData('opportunityId');
    const fromColumn = e.dataTransfer.getData('fromColumn');
    if (opportunityId && fromColumn && fromColumn !== column.id) {
      onDrop(opportunityId, fromColumn, column.id);
    }
  };

  return (
    <div
      className={`flex min-w-56 flex-1 flex-col transition-all ${isDragOver ? 'scale-[1.01]' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="mb-3 rounded-lg border border-[#2a3146] bg-transparent backdrop-blur-sm p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded ${column.corBg}/20`}>
              <Icon className={`h-3.5 w-3.5 ${column.cor}`} />
            </div>
            <span className="text-sm font-semibold text-white">{column.titulo}</span>
          </div>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#252d3f] px-1.5 text-xs font-medium text-[#94a3b8]">
            {column.oportunidades.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <DollarSign className="h-3 w-3" />
          <span>{formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Cards */}
      <div className={`flex flex-1 flex-col gap-2 rounded-lg p-1 transition-colors ${isDragOver ? 'bg-blue-500/5 border-2 border-dashed border-blue-500/30' : 'border-2 border-transparent'}`}>
        {column.oportunidades.map((oportunidade) => (
          <OpportunityCard key={oportunidade.id} oportunidade={oportunidade} />
        ))}

        {/* Empty state */}
        {column.oportunidades.length === 0 && (
          <div className={`flex flex-1 items-center justify-center rounded-lg border border-dashed p-6 ${isDragOver ? 'border-blue-500/50 bg-blue-500/5' : 'border-[#2a3146]'}`}>
            <p className="text-xs text-[#94a3b8]">
              {isDragOver ? 'Solte aqui' : 'Nenhuma oportunidade'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Summary Cards ─── */
function SummaryCards({ columns }: { columns: PipelineColumn[] }) {
  const totalOportunidades = columns.reduce((sum, c) => sum + c.oportunidades.length, 0);
  const valorTotal = columns.reduce(
    (sum, c) => sum + c.oportunidades.reduce((s, o) => s + o.valor, 0),
    0
  );
  const valorPonderado = columns.reduce(
    (sum, c) =>
      sum + c.oportunidades.reduce((s, o) => s + (o.valor * o.probabilidade) / 100, 0),
    0
  );
  const taxaMedia =
    totalOportunidades > 0
      ? Math.round(
          columns.reduce(
            (sum, c) => sum + c.oportunidades.reduce((s, o) => s + o.probabilidade, 0),
            0
          ) / totalOportunidades
        )
      : 0;

  const initialCards = [
    { id: 'total', label: 'Total Oportunidades', value: totalOportunidades.toString(), icon: Target, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
    { id: 'valor-total', label: 'Valor Total Pipeline', value: formatCurrency(valorTotal), icon: DollarSign, color: 'text-green-400', colorBg: 'bg-green-500/10' },
    { id: 'valor-ponderado', label: 'Valor Ponderado', value: formatCurrency(valorPonderado), icon: TrendingUp, color: 'text-purple-400', colorBg: 'bg-purple-500/10' },
    { id: 'taxa-media', label: 'Taxa Média', value: `${taxaMedia}%`, icon: CheckCircle2, color: 'text-yellow-400', colorBg: 'bg-yellow-500/10' },
  ];

  const [cards, setCards] = useState(initialCards);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    setCards([
      { id: 'total', label: 'Total Oportunidades', value: totalOportunidades.toString(), icon: Target, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
      { id: 'valor-total', label: 'Valor Total Pipeline', value: formatCurrency(valorTotal), icon: DollarSign, color: 'text-green-400', colorBg: 'bg-green-500/10' },
      { id: 'valor-ponderado', label: 'Valor Ponderado', value: formatCurrency(valorPonderado), icon: TrendingUp, color: 'text-purple-400', colorBg: 'bg-purple-500/10' },
      { id: 'taxa-media', label: 'Taxa Média', value: `${taxaMedia}%`, icon: CheckCircle2, color: 'text-yellow-400', colorBg: 'bg-yellow-500/10' },
    ]);
  }, [totalOportunidades, valorTotal, valorPonderado, taxaMedia]);

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
          className={`group relative rounded-xl border border-[#2a3146] bg-transparent backdrop-blur-sm p-4 transition-all cursor-grab active:cursor-grabbing ${dragOverId === card.id ? 'scale-[1.02] ring-2 ring-blue-500/30' : ''}`}
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

/* ─── Create Modal ─── */
function CreateOpportunityModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (opp: Opportunity, etapa: string) => void;
}) {
  const [form, setForm] = useState({
    nome: '',
    empresa: '',
    contato: '',
    valor: '',
    probabilidade: '20',
    dataFechamento: '',
    etapa: 'contato',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.valor) return;

    const newOpp: Opportunity = {
      id: Date.now().toString(),
      nome: form.nome,
      empresa: form.empresa,
      contato: form.contato,
      valor: parseFloat(form.valor),
      probabilidade: parseInt(form.probabilidade),
      dataFechamento: form.dataFechamento,
      etapa: form.etapa,
    };

    onSave(newOpp, form.etapa);
    setForm({ nome: '', empresa: '', contato: '', valor: '', probabilidade: '20', dataFechamento: '', etapa: 'contato' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-lg rounded-2xl border border-[#2a3146] bg-[#0f1420] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Nova Oportunidade</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#252d3f] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Nome *</label>
            <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50" placeholder="Nome da oportunidade" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Empresa</label>
              <input type="text" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50" placeholder="Empresa" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Contato</label>
              <input type="text" value={form.contato} onChange={(e) => setForm({ ...form, contato: e.target.value })} className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50" placeholder="Nome do contato" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Valor (R$) *</label>
              <input type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50" placeholder="0.00" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Probabilidade %</label>
              <input type="number" min="0" max="100" value={form.probabilidade} onChange={(e) => setForm({ ...form, probabilidade: e.target.value })} className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Fechamento</label>
              <input type="date" value={form.dataFechamento} onChange={(e) => setForm({ ...form, dataFechamento: e.target.value })} className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#94a3b8]">Etapa</label>
            <select value={form.etapa} onChange={(e) => setForm({ ...form, etapa: e.target.value })} className="w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50">
              <option value="contato">Primeiro Contato</option>
              <option value="qualificacao">Qualificação</option>
              <option value="proposta">Proposta</option>
              <option value="negociacao">Negociação</option>
              <option value="fechamento">Fechamento</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg bg-[#252d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f3a50] transition-colors">Cancelar</button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Criar Oportunidade</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function OportunidadesPage() {
  const [columns, setColumns] = useState<PipelineColumn[]>(initialColumns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleDrop = (opportunityId: string, fromColumnId: string, toColumnId: string) => {
    setColumns((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === fromColumnId);
      const toIndex = prev.findIndex((c) => c.id === toColumnId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const opportunity = prev[fromIndex].oportunidades.find((o) => o.id === opportunityId);
      if (!opportunity) return prev;

      const updated = [...prev];

      // Remove from source
      updated[fromIndex] = {
        ...updated[fromIndex],
        oportunidades: updated[fromIndex].oportunidades.filter((o) => o.id !== opportunityId),
      };

      // Calculate new probability based on direction
      let newProb = opportunity.probabilidade;
      if (toIndex > fromIndex) {
        newProb = Math.min(opportunity.probabilidade + (toIndex - fromIndex) * 15, toIndex === prev.length - 1 ? 95 : 85);
      } else {
        newProb = Math.max(opportunity.probabilidade - (fromIndex - toIndex) * 15, 10);
      }

      // Add to target
      updated[toIndex] = {
        ...updated[toIndex],
        oportunidades: [
          ...updated[toIndex].oportunidades,
          { ...opportunity, etapa: updated[toIndex].id, probabilidade: newProb },
        ],
      };

      return updated;
    });
  };

  const handleCreateOpportunity = (opp: Opportunity, etapa: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === etapa ? { ...col, oportunidades: [...col.oportunidades, opp] } : col
      )
    );
  };

  return (
    <div>
      <PageHeader
        title="Oportunidades"
        subtitle="Gerencie seu pipeline de vendas"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Oportunidades' },
        ]}
        actions={
          <Button variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsCreateModalOpen(true)}>
            Nova Oportunidade
          </Button>
        }
      />

      <SummaryCards columns={columns} />

      {/* Pipeline Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 justify-center" style={{ minWidth: `${columns.length * 260}px` }}>
          {columns.map((column) => (
            <PipelineColumnComponent
              key={column.id}
              column={column}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      <CreateOpportunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateOpportunity}
      />
    </div>
  );
}
