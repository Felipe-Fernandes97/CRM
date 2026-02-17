'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Zap,
  Bell,
  RefreshCw,
  Mail,
  MoreVertical,
  Power,
  Trash2,
  Edit,
  X,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';

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

const tipoConfig: Record<TipoAutomacao, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  gatilho: { label: 'Gatilho', icon: <Zap size={16} />, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  lembrete: { label: 'Lembrete', icon: <Bell size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  status: { label: 'Mudança de Status', icon: <RefreshCw size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  email: { label: 'E-mail', icon: <Mail size={16} />, color: 'text-green-400', bg: 'bg-green-500/20' },
};

const statusConfig: Record<StatusAutomacao, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  ativa: { label: 'Ativa', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle size={14} /> },
  inativa: { label: 'Inativa', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: <Power size={14} /> },
  erro: { label: 'Erro', color: 'text-red-400', bg: 'bg-red-500/20', icon: <AlertCircle size={14} /> },
};

export default function AutomacoesPage() {
  const [automacoes, setAutomacoes] = useState<Automacao[]>(automacoesMock);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoAutomacao | 'todos'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<StatusAutomacao | 'todos'>('todos');
  const [modalCriar, setModalCriar] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState<Automacao | null>(null);
  const [menuAberto, setMenuAberto] = useState<string | null>(null);

  // Form state
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Automações</h1>
          <p className="text-gray-400 mt-1">Gerencie gatilhos, lembretes e ações automáticas</p>
        </div>
        <button
          onClick={() => setModalCriar(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nova Automação
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', valor: stats.total, icon: <Zap size={20} />, cor: 'text-blue-400' },
          { label: 'Ativas', valor: stats.ativas, icon: <CheckCircle size={20} />, cor: 'text-green-400' },
          { label: 'Execuções', valor: stats.execucoes, icon: <RefreshCw size={20} />, cor: 'text-purple-400' },
          { label: 'Com Erro', valor: stats.erros, icon: <AlertCircle size={20} />, cor: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1e2a3a] rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <span className={stat.cor}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stat.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar automações..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-[#1e2a3a] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as TipoAutomacao | 'todos')}
            className="bg-[#1e2a3a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="todos">Todos os tipos</option>
            <option value="gatilho">Gatilhos</option>
            <option value="lembrete">Lembretes</option>
            <option value="status">Mudança de Status</option>
            <option value="email">E-mails</option>
          </select>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as StatusAutomacao | 'todos')}
            className="bg-[#1e2a3a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="todos">Todos os status</option>
            <option value="ativa">Ativas</option>
            <option value="inativa">Inativas</option>
            <option value="erro">Com Erro</option>
          </select>
        </div>
      </div>

      {/* Lista de Automações */}
      <div className="space-y-3">
        {automacoesFiltradas.map((automacao) => {
          const tipo = tipoConfig[automacao.tipo];
          const status = statusConfig[automacao.status];

          return (
            <div
              key={automacao.id}
              className="bg-[#1e2a3a] rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => setModalDetalhes(automacao)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2.5 rounded-lg ${tipo.bg}`}>
                    <span className={tipo.color}>{tipo.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-medium truncate">{automacao.nome}</h3>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{automacao.descricao}</p>
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <ArrowRight size={12} />
                        {automacao.gatilho} → {automacao.acao}
                      </span>
                      <span className="flex items-center gap-1">
                        <RefreshCw size={12} />
                        {automacao.execucoes} execuções
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
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
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-400" />
                  </button>
                  {menuAberto === automacao.id && (
                    <div className="absolute right-0 top-8 bg-[#2a3a4a] border border-gray-600 rounded-lg shadow-xl z-10 min-w-[160px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(automacao.id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <Power size={14} />
                        {automacao.status === 'ativa' ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          excluir(automacao.id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 size={14} />
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
          <div className="text-center py-12 text-gray-500">
            <Zap size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhuma automação encontrada</p>
          </div>
        )}
      </div>

      {/* Modal Criar */}
      {modalCriar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a2332] rounded-xl p-6 w-full max-w-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Nova Automação</h2>
              <button onClick={() => setModalCriar(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Nome da automação"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <textarea
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Descreva o que esta automação faz"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                <select
                  value={formTipo}
                  onChange={(e) => setFormTipo(e.target.value as TipoAutomacao)}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="gatilho">Gatilho</option>
                  <option value="lembrete">Lembrete</option>
                  <option value="status">Mudança de Status</option>
                  <option value="email">E-mail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Gatilho (Quando)</label>
                <input
                  type="text"
                  value={formGatilho}
                  onChange={(e) => setFormGatilho(e.target.value)}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Lead criado, 3 dias sem atividade..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ação (Então)</label>
                <input
                  type="text"
                  value={formAcao}
                  onChange={(e) => setFormAcao(e.target.value)}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Enviar e-mail, Notificar vendedor..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setModalCriar(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCriar}
                  disabled={!formNome || !formGatilho || !formAcao}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Automação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      {modalDetalhes && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a2332] rounded-xl p-6 w-full max-w-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Detalhes da Automação</h2>
              <button onClick={() => setModalDetalhes(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${tipoConfig[modalDetalhes.tipo].bg}`}>
                  <span className={tipoConfig[modalDetalhes.tipo].color}>
                    {tipoConfig[modalDetalhes.tipo].icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{modalDetalhes.nome}</h3>
                  <span className={`flex items-center gap-1 text-xs ${statusConfig[modalDetalhes.status].color}`}>
                    {statusConfig[modalDetalhes.status].icon}
                    {statusConfig[modalDetalhes.status].label}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{modalDetalhes.descricao}</p>
              <div className="bg-[#0f1823] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24">Tipo:</span>
                  <span className={tipoConfig[modalDetalhes.tipo].color}>
                    {tipoConfig[modalDetalhes.tipo].label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24">Gatilho:</span>
                  <span className="text-white">{modalDetalhes.gatilho}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24">Ação:</span>
                  <span className="text-white">{modalDetalhes.acao}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24">Execuções:</span>
                  <span className="text-white">{modalDetalhes.execucoes}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24">Última exec.:</span>
                  <span className="text-white">{formatarData(modalDetalhes.ultimaExecucao)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24">Criada em:</span>
                  <span className="text-white">{new Date(modalDetalhes.criadoEm).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    toggleStatus(modalDetalhes.id);
                    setModalDetalhes(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Power size={16} />
                  {modalDetalhes.status === 'ativa' ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => {
                    excluir(modalDetalhes.id);
                    setModalDetalhes(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
