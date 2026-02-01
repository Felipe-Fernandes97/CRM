'use client';

import { useState } from 'react';
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
  ArrowRight,
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
      {
        id: '1',
        nome: 'Implantação ERP',
        empresa: 'Tech Solutions',
        contato: 'João Silva',
        valor: 45000,
        probabilidade: 20,
        dataFechamento: '2025-03-15',
        etapa: 'contato',
      },
      {
        id: '2',
        nome: 'Consultoria TI',
        empresa: 'ABC Corp',
        contato: 'Maria Santos',
        valor: 18500,
        probabilidade: 30,
        dataFechamento: '2025-02-28',
        etapa: 'contato',
      },
      {
        id: '3',
        nome: 'Migração Cloud',
        empresa: 'DataFlow',
        contato: 'Lucas Mendes',
        valor: 32000,
        probabilidade: 15,
        dataFechamento: '2025-04-10',
        etapa: 'contato',
      },
    ],
  },
  {
    id: 'qualificacao',
    titulo: 'Qualificação',
    cor: 'text-yellow-400',
    corBg: 'bg-yellow-500',
    icone: TrendingUp,
    oportunidades: [
      {
        id: '4',
        nome: 'Licenças SaaS',
        empresa: 'Global Imports',
        contato: 'Carlos Lima',
        valor: 67000,
        probabilidade: 45,
        dataFechamento: '2025-02-20',
        etapa: 'qualificacao',
      },
      {
        id: '5',
        nome: 'Suporte Premium',
        empresa: 'Smart Digital',
        contato: 'Ana Costa',
        valor: 24000,
        probabilidade: 50,
        dataFechamento: '2025-03-05',
        etapa: 'qualificacao',
      },
    ],
  },
  {
    id: 'proposta',
    titulo: 'Proposta',
    cor: 'text-purple-400',
    corBg: 'bg-purple-500',
    icone: DollarSign,
    oportunidades: [
      {
        id: '6',
        nome: 'Automação Industrial',
        empresa: 'Omega Services',
        contato: 'Pedro Rocha',
        valor: 120000,
        probabilidade: 65,
        dataFechamento: '2025-02-10',
        etapa: 'proposta',
      },
      {
        id: '7',
        nome: 'Infraestrutura Rede',
        empresa: 'Beta Systems',
        contato: 'Julia Mendes',
        valor: 53000,
        probabilidade: 70,
        dataFechamento: '2025-02-18',
        etapa: 'proposta',
      },
    ],
  },
  {
    id: 'negociacao',
    titulo: 'Negociação',
    cor: 'text-orange-400',
    corBg: 'bg-orange-500',
    icone: Clock,
    oportunidades: [
      {
        id: '8',
        nome: 'Plataforma E-commerce',
        empresa: 'Nova Tech',
        contato: 'Rafael Souza',
        valor: 89000,
        probabilidade: 80,
        dataFechamento: '2025-02-05',
        etapa: 'negociacao',
      },
    ],
  },
  {
    id: 'fechamento',
    titulo: 'Fechamento',
    cor: 'text-green-400',
    corBg: 'bg-green-500',
    icone: CheckCircle2,
    oportunidades: [
      {
        id: '9',
        nome: 'Sistema CRM',
        empresa: 'Inovatech',
        contato: 'Fernanda Alves',
        valor: 75000,
        probabilidade: 95,
        dataFechamento: '2025-01-30',
        etapa: 'fechamento',
      },
    ],
  },
];

/* ─── Helpers ─── */
function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

/* ─── Opportunity Card ─── */
function OpportunityCard({
  oportunidade,
  onMoveRight,
  onMoveLeft,
  isLast,
  isFirst,
}: {
  oportunidade: Opportunity;
  onMoveRight?: () => void;
  onMoveLeft?: () => void;
  isLast: boolean;
  isFirst: boolean;
}) {
  return (
    <div className="group rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4 transition-all hover:border-blue-500/30">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h4 className="text-sm font-medium text-white">{oportunidade.nome}</h4>
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
        <span className="text-sm font-semibold text-blue-400">
          {formatCurrency(oportunidade.valor)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(oportunidade.dataFechamento)}</span>
        </div>

        {/* Probability */}
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

   {/* Move buttons */}
      {(!isFirst || !isLast) && (
        <div className="mt-3 flex items-center gap-2 border-t border-[#2a3146] pt-3">
          {!isFirst && onMoveLeft && (
            <button
              onClick={onMoveLeft}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#252d3f] py-2 text-xs font-medium text-[#94a3b8] transition-colors hover:bg-orange-500/20 hover:text-orange-400"
            >
              ← Voltar
            </button>
          )}
          {!isLast && onMoveRight && (
            <button
              onClick={onMoveRight}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#252d3f] py-2 text-xs font-medium text-[#94a3b8] transition-colors hover:bg-blue-500/20 hover:text-blue-400"
            >
              Avançar →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Pipeline Column ─── */
function PipelineColumnComponent({
  column,
  onMoveCard,
  onMoveCardBack,
  isLast,
  isFirst,
}: {
  column: PipelineColumn;
  onMoveCard: (opportunityId: string, fromColumn: string) => void;
  onMoveCardBack: (opportunityId: string, fromColumn: string) => void;
  isLast: boolean;
  isFirst: boolean;
}) {
  const totalValue = column.oportunidades.reduce((sum, o) => sum + o.valor, 0);
  const Icon = column.icone;

  return (
    <div className="flex min-w-[280px] flex-col">
      {/* Column Header */}
      <div className="mb-3 rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded ${column.corBg}/20`}>
              <Icon className={`h-3.5 w-3.5 ${column.cor}`} />
            </div>
            <span className="text-sm font-semibold text-white">{column.titulo}</span>
          </div>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#252d3f] px-1.5 text-xs font-medium text-[#94a3b8]">
            {column.oportunidades.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
          <DollarSign className="h-3 w-3" />
          <span>{formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2">
        {column.oportunidades.map((oportunidade) => (
          <OpportunityCard
            key={oportunidade.id}
            oportunidade={oportunidade}
            isLast={isLast}
            isFirst={isFirst}
            onMoveRight={() => onMoveCard(oportunidade.id, column.id)}
            onMoveLeft={() => onMoveCardBack(oportunidade.id, column.id)}
          />
        ))}

        {/* Empty state */}
        {column.oportunidades.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-[#2a3146] p-6">
            <p className="text-xs text-[#94a3b8]">Nenhuma oportunidade</p>
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
      sum +
      c.oportunidades.reduce((s, o) => s + (o.valor * o.probabilidade) / 100, 0),
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

  const cards = [
    {
      label: 'Total Oportunidades',
      value: totalOportunidades.toString(),
      icon: Target,
      color: 'text-blue-400',
      colorBg: 'bg-blue-500/10',
    },
    {
      label: 'Valor Total Pipeline',
      value: formatCurrency(valorTotal),
      icon: DollarSign,
      color: 'text-green-400',
      colorBg: 'bg-green-500/10',
    },
    {
      label: 'Valor Ponderado',
      value: formatCurrency(valorPonderado),
      icon: TrendingUp,
      color: 'text-purple-400',
      colorBg: 'bg-purple-500/10',
    },
    {
      label: 'Taxa Média',
      value: `${taxaMedia}%`,
      icon: CheckCircle2,
      color: 'text-yellow-400',
      colorBg: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4"
        >
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

/* ─── Page ─── */
export default function OportunidadesPage() {
  const [columns, setColumns] = useState<PipelineColumn[]>(initialColumns);

  const handleMoveCard = (opportunityId: string, fromColumnId: string) => {
    setColumns((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === fromColumnId);
      if (fromIndex === -1 || fromIndex >= prev.length - 1) return prev;

      const toIndex = fromIndex + 1;
      const opportunity = prev[fromIndex].oportunidades.find(
        (o) => o.id === opportunityId
      );
      if (!opportunity) return prev;

      const updated = [...prev];

      // Remove from source
      updated[fromIndex] = {
        ...updated[fromIndex],
        oportunidades: updated[fromIndex].oportunidades.filter(
          (o) => o.id !== opportunityId
        ),
      };

      // Add to target with updated probability
      const newProb = Math.min(
        opportunity.probabilidade + 15,
        toIndex === prev.length - 1 ? 95 : 85
      );
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

  const handleMoveCardBack = (opportunityId: string, fromColumnId: string) => {
  setColumns((prev) => {
    const fromIndex = prev.findIndex((c) => c.id === fromColumnId);
    if (fromIndex <= 0) return prev;

    const toIndex = fromIndex - 1;
    const opportunity = prev[fromIndex].oportunidades.find(
      (o) => o.id === opportunityId
    );
    if (!opportunity) return prev;

    const updated = [...prev];

    // Remove da coluna atual
    updated[fromIndex] = {
      ...updated[fromIndex],
      oportunidades: updated[fromIndex].oportunidades.filter(
        (o) => o.id !== opportunityId
      ),
    };

    // Diminui probabilidade ao voltar
    const newProb = Math.max(opportunity.probabilidade - 15, 10);

    updated[toIndex] = {
      ...updated[toIndex],
      oportunidades: [
        ...updated[toIndex].oportunidades,
        {
          ...opportunity,
          etapa: updated[toIndex].id,
          probabilidade: newProb,
        },
      ],
    };

    return updated;
  });
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
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Nova Oportunidade
          </Button>
        }
      />

      {/* Summary */}
      <SummaryCards columns={columns} />

      {/* Pipeline Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: `${columns.length * 296}px` }}>
          {columns.map((column, index) => (
            <PipelineColumnComponent
              key={column.id}
              column={column}
              onMoveCard={handleMoveCard}
              onMoveCardBack={handleMoveCardBack}
              isLast={index === columns.length - 1}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
