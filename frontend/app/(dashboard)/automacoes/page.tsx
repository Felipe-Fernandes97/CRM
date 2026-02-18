'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Zap,
  Bell,
  RefreshCw,
  Mail,
  MoreVertical,
  Power,
  Trash2,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Modal,
  Badge,
  Card,
  CardTitle,
} from '@/components/ui';
import { PageHeader } from '@/components/layout';

type TipoAutomacao = 'gatilho' | 'lembrete' | 'status' | 'email';
type StatusAutomacao = 'ativa' | 'inativa' | 'erro';

interface Automacao {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoAutomacao;
  status: StatusAutomacao;
  gatilho: string;
  acao: string;
  execucoes: number;
  ultimaExecucao: string | null;
  criadoEm: string;
}

const automacoesMock: Automacao[] = [
  {
    id: '1',
    nome: 'Novo lead → E-mail de boas-vindas',
    descricao: 'Envia e-mail automático quando um novo lead é cadastrado',
    tipo: 'email',
    status: 'ativa',
    gatilho: 'Lead criado',
    acao: 'Enviar e-mail de boas-vindas',
    execucoes: 234,
    ultimaExecucao: '2026-02-17T10:30:00',
    criadoEm: '2026-01-15',
  },
  {
    id: '2',
    nome: 'Lembrete de follow-up',
    descricao: 'Lembra o vendedor de fazer follow-up após 3 dias sem contato',
    tipo: 'lembrete',
    status: 'ativa',
    gatilho: '3 dias sem atividade',
    acao: 'Notificar vendedor',
    execucoes: 89,
    ultimaExecucao: '2026-02-17T08:00:00',
    criadoEm: '2026-01-20',
  },
  {
    id: '3',
    nome: 'Mudança automática para "Perdido"',
    descricao: 'Move negociação para "Perdido" após 30 dias sem interação',
    tipo: 'status',
    status: 'ativa',
    gatilho: '30 dias sem atividade',
    acao: 'Alterar status para Perdido',
    execucoes: 12,
    ultimaExecucao: '2026-02-16T00:00:00',
    criadoEm: '2026-01-10',
  },
  {
    id: '4',
    nome: 'Proposta enviada → Lembrete 5 dias',
    descricao: 'Cria lembrete automático 5 dias após envio de proposta',
    tipo: 'lembrete',
    status: 'ativa',
    gatilho: 'Proposta enviada',
    acao: 'Criar lembrete em 5 dias',
    execucoes: 56,
    ultimaExecucao: '2026-02-15T14:00:00',
    criadoEm: '2026-01-25',
  },
  {
    id: '5',
    nome: 'Lead qualificado → Notificar gerente',
    descricao: 'Notifica o gerente quando um lead é marcado como qualificado',
    tipo: 'gatilho',
    status: 'inativa',
    gatilho: 'Lead qualificado',
    acao: 'Notificar gerente por e-mail',
    execucoes: 0,
    ultimaExecucao: null,
    criadoEm: '2026-02-01',
  },
  {
    id: '6',
    nome: 'E-mail de aniversário do cliente',
    descricao: 'Envia e-mail de felicitações no aniversário do cliente',
    tipo: 'email',
    status: 'erro',
    gatilho: 'Data de aniversário',
    acao: 'Enviar e-mail personalizado',
    execucoes: 3,
    ultimaExecucao: '2026-02-10T09:00:00',
    criadoEm: '2026-02-05',
  },
  {
    id: '7',
    nome: 'Negociação ganha → Criar cliente',
    descricao: 'Converte lead em cliente automaticamente ao ganhar negociação',
    tipo: 'gatilho',
    status: 'ativa',
    gatilho: 'Negociação ganha',
    acao: 'Converter lead em cliente',
    execucoes: 45,
    ultimaExecucao: '2026-02-16T16:45:00',
    criadoEm: '2026-01-05',
  },
  {
    id: '8',
    nome: 'Mudança para "Em negociação"',
    descricao: 'Move automaticamente para "Em negociação" quando proposta é criada',
    tipo: 'status',
    status: 'ativa',
    gatilho: 'Proposta criada',
    acao: 'Alterar status para Em negociação',
    execucoes: 78,
    ultimaExecucao: '2026-02-17T11:20:00',
    criadoEm: '2026-01-12',
  },
];

const tipoConfig: Record<TipoAutomacao, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  gatilho: { label: 'Gatilho', icon: Zap, color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  lembrete: { label: 'Lembrete', icon: Bell, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  status: { label: 'Mudança de Status', icon: RefreshCw, color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  email: { label: 'E-mail', icon: Mail, color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
};

const statusVariants: Record<StatusAutomacao, 'success' | 'default' | 'error'> = {
  ativa: 'success',
  inativa: 'default',
  erro: 'error',
};

const statusLabels: Record<StatusAutomacao, string> = {
  ativa: 'Ativa',
  inativa: 'Inativa',
  erro: 'Erro',
};

const tipoOptions = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'gatilho', label: 'Gatilhos' },
  { value: 'lembrete', label: 'Lembretes' },
  { value: 'status', label: 'Mudança de Status' },
  { value: 'email', label: 'E-mails' },
];

const statusOptions = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'ativa', label: 'Ativas' },
  { value: 'inativa', label: 'Inativas' },
  { value: 'erro', label: 'Com Erro' },
];

const tipoFormOptions = [
  { value: 'gatilho', label: 'Gatilho' },
  { value: 'lembrete', label: 'Lembrete' },
  { value: 'status', label: 'Mudança de Status' },
  { value: 'email', label: 'E-mail' },
];

export default function AutomacoesPage() {
  const [automacoes, setAutomacoes] = useState<Automacao[]>(automacoesMock);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState<Automacao | null>(null);
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  // Drag state (automação cards)
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Drag state (KPI cards)
  const [draggedKpi, setDraggedKpi] = useState<number | null>(null);
  const [dragOverKpi, setDragOverKpi] = useState<number | null>(null);

  const [formNome, setFormNome] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formTipo, setFormTipo] = useState<TipoAutomacao>('gatilho');
  const [formGatilho, setFormGatilho] = useState('');
  const [formAcao, setFormAcao] = useState('');

  const automacoesFiltradas = automacoes.filter((a) => {
    const matchBusca =
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || a.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus;
    return matchBusca && matchTipo && matchStatus;
  });

  const stats = {
    total: automacoes.length,
    ativas: automacoes.filter((a) => a.status === 'ativa').length,
    execucoes: automacoes.reduce((sum, a) => sum + a.execucoes, 0),
    erros: automacoes.filter((a) => a.status === 'erro').length,
  };

  const handleCriar = () => {
    const nova: Automacao = {
      id: Date.now().toString(),
      nome: formNome,
      descricao: formDescricao,
      tipo: formTipo,
      status: 'inativa',
      gatilho: formGatilho,
      acao: formAcao,
      execucoes: 0,
      ultimaExecucao: null,
      criadoEm: new Date().toISOString().split('T')[0],
    };
    setAutomacoes([nova, ...automacoes]);
    setModalCriar(false);
    setFormNome('');
    setFormDescricao('');
    setFormTipo('gatilho');
    setFormGatilho('');
    setFormAcao('');
  };

  const toggleStatus = (id: string) => {
    setAutomacoes(
      automacoes.map((a) =>
        a.id === id ? { ...a, status: a.status === 'ativa' ? 'inativa' : 'ativa' } : a
      )
    );
    setMenuAberto(null);
  };

  const excluir = (id: string) => {
    setAutomacoes(automacoes.filter((a) => a.id !== id));
    setMenuAberto(null);
  };

  const formatarData = (data: string | null) => {
    if (!data) return 'Nunca';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Drag handlers
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
    setAutomacoes((prev) => {
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

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const [kpiOrder, setKpiOrder] = useState([0, 1, 2, 3]);

  const kpiData = [
    { label: 'Total', valor: stats.total, icon: Zap, color: '#60a5fa' },
    { label: 'Ativas', valor: stats.ativas, icon: CheckCircle, color: '#34d399' },
    { label: 'Execuções', valor: stats.execucoes, icon: RefreshCw, color: '#a78bfa' },
    { label: 'Com Erro', valor: stats.erros, icon: AlertCircle, color: '#f87171' },
  ];

  const kpis = kpiOrder.map((i) => ({ ...kpiData[i], originalIndex: i }));

  const handleKpiDragStart = (index: number) => setDraggedKpi(index);

  const handleKpiDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverKpi(index);
  };

  const handleKpiDrop = (targetIndex: number) => {
    if (draggedKpi === null || draggedKpi === targetIndex) {
      setDraggedKpi(null);
      setDragOverKpi(null);
      return;
    }
    setKpiOrder((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(draggedKpi, 1);
      updated.splice(targetIndex, 0, dragged);
      return updated;
    });
    setDraggedKpi(null);
    setDragOverKpi(null);
  };

  const handleKpiDragEnd = () => {
    setDraggedKpi(null);
    setDragOverKpi(null);
  };

  return (
    <div>
      <PageHeader
        title="Automações"
        subtitle="Gerencie gatilhos, lembretes e ações automáticas"
        actions={
          <Button variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalCriar(true)}>
            Nova Automação
          </Button>
        }
      />

      {/* KPIs - Draggable */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div
            key={kpi.label}
            draggable
            onDragStart={() => handleKpiDragStart(index)}
            onDragOver={(e) => handleKpiDragOver(e, index)}
            onDrop={() => handleKpiDrop(index)}
            onDragEnd={handleKpiDragEnd}
            className={`group relative rounded-xl border border-[#2a3146] bg-transparent backdrop-blur-sm p-4 transition-all cursor-grab active:cursor-grabbing ${
              dragOverKpi === index ? 'scale-[1.02] ring-2 ring-blue-500/30' : ''
            } ${draggedKpi === index ? 'opacity-50' : ''}`}
          >
            <div className="absolute top-2 right-2 z-10 rounded-lg bg-[#252d3f]/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-3 w-3 text-[#94a3b8]" />
            </div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-[#94a3b8]">{kpi.label}</span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}
              >
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{kpi.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Buscar automações..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="w-48">
          <Select
            options={tipoOptions}
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          />
        </div>
        <div className="w-44">
          <Select
            options={statusOptions}
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Automações - Draggable */}
      <div className="space-y-3">
        {automacoesFiltradas.map((automacao) => {
          const tipo = tipoConfig[automacao.tipo];
          const TipoIcon = tipo.icon;

          return (
            <div
              key={automacao.id}
              draggable
              onDragStart={() => handleDragStart(automacao.id)}
              onDragOver={(e) => handleDragOver(e, automacao.id)}
              onDrop={() => handleDrop(automacao.id)}
              onDragEnd={handleDragEnd}
              onClick={() => setModalDetalhes(automacao)}
              className={`group relative rounded-lg border border-[#2a3146] bg-transparent backdrop-blur-sm p-4 transition-all hover:border-blue-500/30 cursor-pointer ${
                dragOverId === automacao.id ? 'scale-[1.01] ring-2 ring-blue-500/30' : ''
              } ${draggedId === automacao.id ? 'opacity-50' : ''}`}
            >
              {/* Grip handle */}
              <div className="absolute top-3 right-3 z-10 rounded-lg bg-[#252d3f]/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-[#94a3b8]" />
              </div>

              <div className="flex items-start justify-between pr-10">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                    style={{ backgroundColor: tipo.bg, color: tipo.color }}
                  >
                    <TipoIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-white truncate">{automacao.nome}</h3>
                      <Badge variant={statusVariants[automacao.status]} size="sm">
                        {statusLabels[automacao.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#94a3b8] mb-3">{automacao.descricao}</p>
                    <div className="flex items-center gap-6 text-xs text-[#94a3b8]">
                      <span className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        {automacao.gatilho} → {automacao.acao}
                      </span>
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        {automacao.execucoes} execuções
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Última: {formatarData(automacao.ultimaExecucao)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuAberto(menuAberto === automacao.id ? null : automacao.id);
                    }}
                    className="rounded-md p-1.5 text-[#94a3b8] hover:bg-[#252d3f] hover:text-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {menuAberto === automacao.id && (
                    <div className="absolute right-0 top-8 rounded-lg border border-[#2a3146] bg-[#0f1420] shadow-xl z-10 min-w-[160px] overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(automacao.id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#94a3b8] hover:bg-[#252d3f] hover:text-white transition-colors"
                      >
                        <Power className="h-4 w-4" />
                        {automacao.status === 'ativa' ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          excluir(automacao.id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {automacoesFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a3146] py-12">
            <Zap className="mb-3 h-8 w-8 text-[#94a3b8]" />
            <p className="text-sm text-[#94a3b8]">Nenhuma automação encontrada</p>
          </div>
        )}
      </div>

      {/* Modal Criar */}
      <Modal
        isOpen={modalCriar}
        onClose={() => setModalCriar(false)}
        title="Nova Automação"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nome"
            value={formNome}
            onChange={(e) => setFormNome(e.target.value)}
            placeholder="Nome da automação"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">
              Descrição
            </label>
            <textarea
              value={formDescricao}
              onChange={(e) => setFormDescricao(e.target.value)}
              className="flex min-h-[80px] w-full rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-sm text-white placeholder:text-[#94a3b8] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Descreva o que esta automação faz"
            />
          </div>
          <Select
            label="Tipo"
            options={tipoFormOptions}
            value={formTipo}
            onChange={(e) => setFormTipo(e.target.value as TipoAutomacao)}
          />
          <Input
            label="Gatilho (Quando)"
            value={formGatilho}
            onChange={(e) => setFormGatilho(e.target.value)}
            placeholder="Ex: Lead criado, 3 dias sem atividade..."
          />
          <Input
            label="Ação (Então)"
            value={formAcao}
            onChange={(e) => setFormAcao(e.target.value)}
            placeholder="Ex: Enviar e-mail, Notificar vendedor..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalCriar(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCriar}
              disabled={!formNome || !formGatilho || !formAcao}
            >
              Criar Automação
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Detalhes */}
      <Modal
        isOpen={!!modalDetalhes}
        onClose={() => setModalDetalhes(null)}
        title="Detalhes da Automação"
        size="lg"
      >
        {modalDetalhes && (() => {
          const tipo = tipoConfig[modalDetalhes.tipo];
          const TipoIcon = tipo.icon;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: tipo.bg, color: tipo.color }}
                >
                  <TipoIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{modalDetalhes.nome}</h3>
                  <Badge variant={statusVariants[modalDetalhes.status]} size="sm">
                    {statusLabels[modalDetalhes.status]}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{modalDetalhes.descricao}</p>
              <div className="rounded-lg border border-[#2a3146] bg-[#252d3f] p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#94a3b8] w-24">Tipo:</span>
                  <span style={{ color: tipo.color }}>{tipo.label}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#94a3b8] w-24">Gatilho:</span>
                  <span className="text-white">{modalDetalhes.gatilho}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#94a3b8] w-24">Ação:</span>
                  <span className="text-white">{modalDetalhes.acao}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#94a3b8] w-24">Execuções:</span>
                  <span className="text-white">{modalDetalhes.execucoes}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#94a3b8] w-24">Última exec.:</span>
                  <span className="text-white">{formatarData(modalDetalhes.ultimaExecucao)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-[#94a3b8] w-24">Criada em:</span>
                  <span className="text-white">{new Date(modalDetalhes.criadoEm).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  leftIcon={<Power className="h-4 w-4" />}
                  onClick={() => {
                    toggleStatus(modalDetalhes.id);
                    setModalDetalhes(null);
                  }}
                >
                  {modalDetalhes.status === 'ativa' ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  variant="destructive"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => {
                    excluir(modalDetalhes.id);
                    setModalDetalhes(null);
                  }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
