'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';

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

/* ─── Mock Data ─── */
const mockNegotiations: Negotiation[] = [
  {
    id: '1',
    titulo: 'Proposta ERP Completo',
    valor: 120000,
    empresa: 'Tech Solutions',
    cliente: 'João Silva',
    status: 'enviada',
    descricao: 'Implantação completa do sistema ERP com módulos financeiro, estoque e RH.',
    condicoes: 'Pagamento em 12x. Suporte incluso por 6 meses.',
    validade: '2025-03-15',
    dataEnvio: '2025-02-01',
    dataResposta: null,
    anexos: ['proposta_erp_v2.pdf', 'cronograma.xlsx'],
    criadoEm: '2025-01-28',
  },
  {
    id: '2',
    titulo: 'Consultoria Cloud Migration',
    valor: 67000,
    empresa: 'Global Imports',
    cliente: 'Carlos Lima',
    status: 'aceita',
    descricao: 'Migração de infraestrutura on-premise para AWS.',
    condicoes: 'Pagamento 50% início, 50% entrega. Prazo de 3 meses.',
    validade: '2025-02-20',
    dataEnvio: '2025-01-15',
    dataResposta: '2025-01-22',
    anexos: ['proposta_cloud.pdf'],
    criadoEm: '2025-01-10',
  },
  {
    id: '3',
    titulo: 'Licenciamento SaaS Anual',
    valor: 89000,
    empresa: 'Nova Tech',
    cliente: 'Rafael Souza',
    status: 'rascunho',
    descricao: 'Licenças anuais da plataforma SaaS para 150 usuários.',
    condicoes: 'Pagamento anual antecipado com 10% de desconto.',
    validade: '2025-04-01',
    dataEnvio: null,
    dataResposta: null,
    anexos: [],
    criadoEm: '2025-02-05',
  },
  {
    id: '4',
    titulo: 'Automação Industrial',
    valor: 245000,
    empresa: 'Omega Services',
    cliente: 'Pedro Rocha',
    status: 'recusada',
    descricao: 'Projeto de automação de linha de produção com IoT.',
    condicoes: 'Pagamento em 6x. Garantia de 12 meses.',
    validade: '2025-02-10',
    dataEnvio: '2025-01-20',
    dataResposta: '2025-02-08',
    anexos: ['proposta_automacao.pdf', 'especificacoes.pdf', 'orcamento.xlsx'],
    criadoEm: '2025-01-18',
  },
  {
    id: '5',
    titulo: 'Suporte Premium 24/7',
    valor: 36000,
    empresa: 'Smart Digital',
    cliente: 'Ana Costa',
    status: 'expirada',
    descricao: 'Contrato de suporte premium com SLA de 2 horas.',
    condicoes: 'Pagamento mensal. Mínimo 12 meses.',
    validade: '2025-01-15',
    dataEnvio: '2025-01-02',
    dataResposta: null,
    anexos: ['contrato_suporte.pdf'],
    criadoEm: '2024-12-28',
  },
  {
    id: '6',
    titulo: 'Desenvolvimento App Mobile',
    valor: 175000,
    empresa: 'Beta Systems',
    cliente: 'Julia Mendes',
    status: 'enviada',
    descricao: 'Desenvolvimento de app iOS e Android com backend.',
    condicoes: 'Pagamento por milestones. 4 entregas parciais.',
    validade: '2025-03-30',
    dataEnvio: '2025-02-10',
    dataResposta: null,
    anexos: ['proposta_app.pdf', 'wireframes.pdf'],
    criadoEm: '2025-02-08',
  },
];

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

  const cards = [
    { label: 'Total Negociações', value: total.toString(), icon: FileText, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
    { label: 'Valor Total', value: formatCurrency(valorTotal), icon: DollarSign, color: 'text-green-400', colorBg: 'bg-green-500/10' },
    { label: 'Valor Aceito', value: formatCurrency(valorAceito), icon: CheckCircle2, color: 'text-emerald-400', colorBg: 'bg-emerald-500/10' },
    { label: 'Taxa de Conversão', value: `${taxaConversao}%`, icon: Send, color: 'text-purple-400', colorBg: 'bg-purple-500/10' },
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

/* ─── Negotiation Detail Panel ─── */
function DetailPanel({ negotiation, onClose }: { negotiation: Negotiation; onClose: () => void }) {
  const config = statusConfig[negotiation.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-2xl rounded-2xl border border-[#2a3146] bg-[#0f1420] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Value */}
        <div className="mb-6 rounded-xl border border-[#2a3146] bg-[#1a1f2e]/40 p-4">
          <span className="text-xs text-[#94a3b8]">Valor da Proposta</span>
          <p className="mt-1 text-2xl font-bold text-green-400">{formatCurrency(negotiation.valor)}</p>
        </div>

        {/* Info Grid */}
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

        {/* Description */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Descrição</h3>
          <p className="text-sm text-[#94a3b8]">{negotiation.descricao}</p>
        </div>

        {/* Conditions */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Condições</h3>
          <p className="text-sm text-[#94a3b8]">{negotiation.condicoes}</p>
        </div>

        {/* Attachments */}
        {negotiation.anexos.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Anexos</h3>
            <div className="flex flex-wrap gap-2">
              {negotiation.anexos.map((anexo) => (
                <span
                  key={anexo}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                >
                  <Paperclip className="h-3 w-3" />
                  {anexo}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#252d3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f3a50] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Negotiation Row ─── */
function NegotiationRow({ negotiation, onClick }: { negotiation: Negotiation; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4 transition-all hover:border-blue-500/30 cursor-pointer"
    >
      {/* Title & Company */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{negotiation.titulo}</h4>
        <div className="mt-1 flex items-center gap-3 text-xs text-[#94a3b8]">
          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {negotiation.empresa}</span>
          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {negotiation.cliente}</span>
        </div>
      </div>

      {/* Value */}
      <div className="text-right">
        <span className="text-sm font-semibold text-green-400">{formatCurrency(negotiation.valor)}</span>
      </div>

      {/* Validity */}
      <div className="hidden md:flex items-center gap-1 text-xs text-[#94a3b8]">
        <Calendar className="h-3 w-3" />
        {formatDate(negotiation.validade)}
      </div>

      {/* Attachments count */}
      {negotiation.anexos.length > 0 && (
        <div className="hidden sm:flex items-center gap-1 text-xs text-[#94a3b8]">
          <Paperclip className="h-3 w-3" />
          {negotiation.anexos.length}
        </div>
      )}

      {/* Status */}
      <StatusBadge status={negotiation.status} />

      {/* View */}
      <button className="rounded p-1.5 text-[#94a3b8] opacity-0 transition-opacity hover:bg-[#252d3f] hover:text-white group-hover:opacity-100">
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Page ─── */
export default function NegociacoesPage() {
  const [negotiations] = useState<Negotiation[]>(mockNegotiations);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [filterStatus, setFilterStatus] = useState<NegotiationStatus | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

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
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Nova Negociação
          </Button>
        }
      />

      {/* Summary */}
      <SummaryCards negotiations={negotiations} />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
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

        {/* Status Filter */}
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

      {/* Negotiation List */}
      <div className="space-y-2">
        {filtered.map((negotiation) => (
          <NegotiationRow
            key={negotiation.id}
            negotiation={negotiation}
            onClick={() => setSelectedNegotiation(negotiation)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a3146] py-12">
            <FileText className="mb-3 h-8 w-8 text-[#94a3b8]" />
            <p className="text-sm text-[#94a3b8]">Nenhuma negociação encontrada</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNegotiation && (
        <DetailPanel
          negotiation={selectedNegotiation}
          onClose={() => setSelectedNegotiation(null)}
        />
      )}
    </div>
  );
}
