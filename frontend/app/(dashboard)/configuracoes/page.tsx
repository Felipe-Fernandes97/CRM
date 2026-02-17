'use client';

import { useState } from 'react';
import {
  GitBranch,
  List,
  Shield,
  Plug,
  Plus,
  X,
  Trash2,
  Pencil,
  ChevronRight,
  Check,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Calendar,
  MessageSquare,
  Smartphone,
  Mail,
  Zap,
  FileSpreadsheet,
  Hash,
  CalendarDays,
  ListChecks,
  CheckSquare,
  Type,
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

type AbaConfig = 'funil' | 'campos' | 'permissoes' | 'integracoes';

interface EtapaFunil {
  id: string;
  nome: string;
  cor: string;
  ordem: number;
}

interface CampoPersonalizado {
  id: string;
  nome: string;
  tipo: 'texto' | 'numero' | 'data' | 'selecao' | 'checkbox';
  entidade: 'lead' | 'cliente' | 'negociacao';
  obrigatorio: boolean;
  opcoes?: string[];
}

interface Permissao {
  id: string;
  perfil: string;
  modulo: string;
  criar: boolean;
  ler: boolean;
  editar: boolean;
  excluir: boolean;
}

interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  icon: React.ElementType;
  iconColor: string;
  conectada: boolean;
  ultimaSync: string | null;
}

const etapasMock: EtapaFunil[] = [
  { id: '1', nome: 'Prospecção', cor: '#3b82f6', ordem: 1 },
  { id: '2', nome: 'Qualificação', cor: '#8b5cf6', ordem: 2 },
  { id: '3', nome: 'Proposta', cor: '#f59e0b', ordem: 3 },
  { id: '4', nome: 'Negociação', cor: '#f97316', ordem: 4 },
  { id: '5', nome: 'Fechamento', cor: '#10b981', ordem: 5 },
];

const camposMock: CampoPersonalizado[] = [
  { id: '1', nome: 'Setor', tipo: 'selecao', entidade: 'lead', obrigatorio: false, opcoes: ['Tecnologia', 'Saúde', 'Educação', 'Varejo', 'Indústria'] },
  { id: '2', nome: 'Receita Anual', tipo: 'numero', entidade: 'cliente', obrigatorio: false },
  { id: '3', nome: 'Data de Renovação', tipo: 'data', entidade: 'negociacao', obrigatorio: true },
  { id: '4', nome: 'Observações Internas', tipo: 'texto', entidade: 'lead', obrigatorio: false },
  { id: '5', nome: 'Cliente Prioritário', tipo: 'checkbox', entidade: 'cliente', obrigatorio: false },
];

const permissoesMock: Permissao[] = [
  { id: '1', perfil: 'Administrador', modulo: 'Leads', criar: true, ler: true, editar: true, excluir: true },
  { id: '2', perfil: 'Administrador', modulo: 'Clientes', criar: true, ler: true, editar: true, excluir: true },
  { id: '3', perfil: 'Administrador', modulo: 'Negociações', criar: true, ler: true, editar: true, excluir: true },
  { id: '4', perfil: 'Gerente', modulo: 'Leads', criar: true, ler: true, editar: true, excluir: false },
  { id: '5', perfil: 'Gerente', modulo: 'Clientes', criar: true, ler: true, editar: true, excluir: false },
  { id: '6', perfil: 'Gerente', modulo: 'Negociações', criar: true, ler: true, editar: true, excluir: false },
  { id: '7', perfil: 'Vendedor', modulo: 'Leads', criar: true, ler: true, editar: true, excluir: false },
  { id: '8', perfil: 'Vendedor', modulo: 'Clientes', criar: false, ler: true, editar: false, excluir: false },
  { id: '9', perfil: 'Vendedor', modulo: 'Negociações', criar: true, ler: true, editar: true, excluir: false },
];

const integracoesMock: Integracao[] = [
  { id: '1', nome: 'Google Calendar', descricao: 'Sincronize eventos e reuniões com o Google Calendar', icon: Calendar, iconColor: '#60a5fa', conectada: true, ultimaSync: '2026-02-17T10:00:00' },
  { id: '2', nome: 'Slack', descricao: 'Receba notificações de atividades no Slack', icon: MessageSquare, iconColor: '#a78bfa', conectada: true, ultimaSync: '2026-02-17T11:30:00' },
  { id: '3', nome: 'WhatsApp Business', descricao: 'Integre conversas do WhatsApp com seus leads', icon: Smartphone, iconColor: '#34d399', conectada: false, ultimaSync: null },
  { id: '4', nome: 'Mailchimp', descricao: 'Sincronize contatos para campanhas de e-mail marketing', icon: Mail, iconColor: '#fbbf24', conectada: false, ultimaSync: null },
  { id: '5', nome: 'Zapier', descricao: 'Conecte com mais de 5000 apps através do Zapier', icon: Zap, iconColor: '#f97316', conectada: true, ultimaSync: '2026-02-16T18:00:00' },
  { id: '6', nome: 'Google Sheets', descricao: 'Exporte dados automaticamente para planilhas', icon: FileSpreadsheet, iconColor: '#34d399', conectada: false, ultimaSync: null },
];

const coresFunil = ['#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const tipoOptions = [
  { value: 'texto', label: 'Texto' },
  { value: 'numero', label: 'Número' },
  { value: 'data', label: 'Data' },
  { value: 'selecao', label: 'Seleção' },
  { value: 'checkbox', label: 'Checkbox' },
];

const entidadeOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'negociacao', label: 'Negociação' },
];

const tipoIconMap: Record<string, React.ElementType> = {
  texto: Type,
  numero: Hash,
  data: CalendarDays,
  selecao: ListChecks,
  checkbox: CheckSquare,
};

const tipoLabel: Record<string, string> = {
  texto: 'Texto',
  numero: 'Número',
  data: 'Data',
  selecao: 'Seleção',
  checkbox: 'Checkbox',
};

const entidadeLabel: Record<string, string> = {
  lead: 'Lead',
  cliente: 'Cliente',
  negociacao: 'Negociação',
};

const entidadeColor: Record<string, string> = {
  lead: '#60a5fa',
  cliente: '#34d399',
  negociacao: '#f59e0b',
};

export default function ConfiguracoesPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaConfig>('funil');
  const [etapas, setEtapas] = useState<EtapaFunil[]>(etapasMock);
  const [campos, setCampos] = useState<CampoPersonalizado[]>(camposMock);
  const [permissoes, setPermissoes] = useState<Permissao[]>(permissoesMock);
  const [integracoes, setIntegracoes] = useState<Integracao[]>(integracoesMock);

  const [editandoEtapa, setEditandoEtapa] = useState<string | null>(null);
  const [novaEtapaNome, setNovaEtapaNome] = useState('');
  const [novaEtapaCor, setNovaEtapaCor] = useState('#3b82f6');
  const [mostrarAdicionarEtapa, setMostrarAdicionarEtapa] = useState(false);

  const [modalCampo, setModalCampo] = useState(false);
  const [campNome, setCampNome] = useState('');
  const [campTipo, setCampTipo] = useState<CampoPersonalizado['tipo']>('texto');
  const [campEntidade, setCampEntidade] = useState<CampoPersonalizado['entidade']>('lead');
  const [campObrigatorio, setCampObrigatorio] = useState(false);

  const abas: { key: AbaConfig; label: string; icon: React.ElementType; desc: string; count: number }[] = [
    { key: 'funil', label: 'Funil de Vendas', icon: GitBranch, desc: 'Etapas do pipeline', count: etapas.length },
    { key: 'campos', label: 'Campos Personalizados', icon: List, desc: 'Campos extras', count: campos.length },
    { key: 'permissoes', label: 'Permissões', icon: Shield, desc: 'Controle de acesso', count: [...new Set(permissoes.map((p) => p.perfil))].length },
    { key: 'integracoes', label: 'Integrações', icon: Plug, desc: 'Apps conectados', count: integracoes.filter((i) => i.conectada).length },
  ];

  const adicionarEtapa = () => {
    if (!novaEtapaNome.trim()) return;
    const nova: EtapaFunil = {
      id: Date.now().toString(),
      nome: novaEtapaNome,
      cor: novaEtapaCor,
      ordem: etapas.length + 1,
    };
    setEtapas([...etapas, nova]);
    setNovaEtapaNome('');
    setMostrarAdicionarEtapa(false);
  };

  const removerEtapa = (id: string) => {
    setEtapas(etapas.filter((e) => e.id !== id).map((e, i) => ({ ...e, ordem: i + 1 })));
  };

  const adicionarCampo = () => {
    const novo: CampoPersonalizado = {
      id: Date.now().toString(),
      nome: campNome,
      tipo: campTipo,
      entidade: campEntidade,
      obrigatorio: campObrigatorio,
    };
    setCampos([...campos, novo]);
    setModalCampo(false);
    setCampNome('');
    setCampTipo('texto');
    setCampEntidade('lead');
    setCampObrigatorio(false);
  };

  const togglePermissao = (id: string, campo: 'criar' | 'ler' | 'editar' | 'excluir') => {
    setPermissoes(
      permissoes.map((p) => (p.id === id ? { ...p, [campo]: !p[campo] } : p))
    );
  };

  const toggleIntegracao = (id: string) => {
    setIntegracoes(
      integracoes.map((i) =>
        i.id === id
          ? { ...i, conectada: !i.conectada, ultimaSync: !i.conectada ? new Date().toISOString() : i.ultimaSync }
          : i
      )
    );
  };

  const perfisUnicos = [...new Set(permissoes.map((p) => p.perfil))];

  const perfilColor: Record<string, string> = {
    Administrador: '#f87171',
    Gerente: '#fbbf24',
    Vendedor: '#60a5fa',
  };

  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Personalize o CRM de acordo com suas necessidades"
      />

      {/* Abas como Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {abas.map((aba) => {
          const AbaIcon = aba.icon;
          const isActive = abaAtiva === aba.key;
          return (
            <Card
              key={aba.key}
              padding="none"
              className={`cursor-pointer transition-all ${
                isActive ? 'border-blue-500/50' : ''
              }`}
              onClick={() => setAbaAtiva(aba.key)}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-[#252d3f] text-[#94a3b8]'
                    }`}
                  >
                    <AbaIcon className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-white">{aba.count}</span>
                </div>
                <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-[#94a3b8]'}`}>
                  {aba.label}
                </p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{aba.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ═══════════════ FUNIL ═══════════════ */}
      {abaAtiva === 'funil' && (
        <div className="space-y-4">
          {/* Preview visual */}
          <Card padding="none">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Pipeline Visual</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setMostrarAdicionarEtapa(true)}
                >
                  Nova Etapa
                </Button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {etapas.map((etapa, index) => {
                  return (
                    <div key={etapa.id} className="flex items-center gap-2 shrink-0">
                      <div
                        className="px-5 py-3 rounded-lg text-white text-sm font-medium whitespace-nowrap relative overflow-hidden"
                        style={{ backgroundColor: `${etapa.cor}30`, borderLeft: `3px solid ${etapa.cor}` }}
                      >
                        <span className="relative z-10">{etapa.nome}</span>
                      </div>
                      {index < etapas.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-[#94a3b8] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Lista editável */}
          <Card padding="none">
            <div className="p-5">
              <CardTitle className="mb-4">Gerenciar Etapas</CardTitle>
              <div className="space-y-2">
                {etapas.map((etapa) => (
                  <div
                    key={etapa.id}
                    className="flex items-center gap-3 rounded-lg border border-[#2a3146]/60 bg-[#1a1f2e]/40 p-3 hover:border-[#3a4460] transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-[#94a3b8] cursor-grab" />
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: etapa.cor }}
                    />
                    {editandoEtapa === etapa.id ? (
                      <input
                        type="text"
                        defaultValue={etapa.nome}
                        autoFocus
                        onBlur={(e) => {
                          setEtapas(etapas.map((et) => et.id === etapa.id ? { ...et, nome: e.target.value } : et));
                          setEditandoEtapa(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                        }}
                        className="bg-transparent border border-blue-500 rounded px-2 py-1 text-white text-sm focus:outline-none flex-1"
                      />
                    ) : (
                      <span className="text-white text-sm flex-1 font-medium">{etapa.nome}</span>
                    )}
                    <Badge variant="default" size="sm">Etapa {etapa.ordem}</Badge>
                    <button
                      onClick={() => setEditandoEtapa(etapa.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removerEtapa(etapa.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {mostrarAdicionarEtapa && (
                <div className="mt-4 rounded-lg border border-blue-500/30 bg-[#1a1f2e] p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={novaEtapaNome}
                      onChange={(e) => setNovaEtapaNome(e.target.value)}
                      placeholder="Nome da etapa"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') adicionarEtapa(); }}
                      className="flex-1 rounded-lg border border-[#2a3146] bg-[#252d3f] px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-1">
                      {coresFunil.map((cor) => (
                        <button
                          key={cor}
                          onClick={() => setNovaEtapaCor(cor)}
                          className={`w-6 h-6 rounded-full border-2 transition-colors ${
                            novaEtapaCor === cor ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: cor }}
                        />
                      ))}
                    </div>
                    <Button size="sm" onClick={adicionarEtapa}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setMostrarAdicionarEtapa(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════ CAMPOS ═══════════════ */}
      {abaAtiva === 'campos' && (
        <div className="space-y-4">
          <Card padding="none">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Campos Personalizados</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setModalCampo(true)}
                >
                  Novo Campo
                </Button>
              </div>

              <div className="space-y-2">
                {campos.map((campo) => {
                  const TipoIcon = tipoIconMap[campo.tipo] || Type;
                  const eColor = entidadeColor[campo.entidade] || '#94a3b8';
                  return (
                    <div
                      key={campo.id}
                      className="flex items-center gap-4 rounded-lg border border-[#2a3146]/60 bg-[#1a1f2e]/40 p-4 hover:border-[#3a4460] transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#252d3f] text-[#94a3b8] shrink-0">
                        <TipoIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{campo.nome}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#94a3b8]">{tipoLabel[campo.tipo]}</span>
                          <span className="text-[#94a3b8]">·</span>
                          <span className="text-xs" style={{ color: eColor }}>{entidadeLabel[campo.entidade]}</span>
                        </div>
                      </div>
                      {campo.obrigatorio && (
                        <Badge variant="warning" size="sm">Obrigatório</Badge>
                      )}
                      <button
                        onClick={() => setCampos(campos.filter((c) => c.id !== campo.id))}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {campos.length === 0 && (
                <div className="text-center py-8">
                  <List className="h-10 w-10 mx-auto mb-3 text-[#94a3b8] opacity-50" />
                  <p className="text-muted-foreground">Nenhum campo personalizado criado</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════ PERMISSÕES ═══════════════ */}
      {abaAtiva === 'permissoes' && (
        <div className="space-y-4">
          {perfisUnicos.map((perfil) => {
            const color = perfilColor[perfil] || '#94a3b8';
            return (
              <Card key={perfil} padding="none">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{perfil}</CardTitle>
                      <p className="text-xs text-[#94a3b8]">
                        {permissoes.filter((p) => p.perfil === perfil).length} módulos configurados
                      </p>
                    </div>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1a1f2e]/60">
                        <th className="text-left text-[#94a3b8] text-xs font-medium p-3 uppercase tracking-wider">Módulo</th>
                        <th className="text-center text-[#94a3b8] text-xs font-medium p-3 uppercase tracking-wider">Criar</th>
                        <th className="text-center text-[#94a3b8] text-xs font-medium p-3 uppercase tracking-wider">Ler</th>
                        <th className="text-center text-[#94a3b8] text-xs font-medium p-3 uppercase tracking-wider">Editar</th>
                        <th className="text-center text-[#94a3b8] text-xs font-medium p-3 uppercase tracking-wider">Excluir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissoes
                        .filter((p) => p.perfil === perfil)
                        .map((perm) => (
                          <tr key={perm.id} className="hover:bg-[#1a1f2e]/30 transition-colors">
                            <td className="p-3 text-sm text-foreground font-medium">{perm.modulo}</td>
                            {(['criar', 'ler', 'editar', 'excluir'] as const).map((campo) => (
                              <td key={campo} className="p-3 text-center">
                                <button
                                  onClick={() => togglePermissao(perm.id, campo)}
                                  className="mx-auto block transition-transform hover:scale-110"
                                >
                                  {perm[campo] ? (
                                    <div className="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center">
                                      <Check className="h-3.5 w-3.5 text-green-400" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-md bg-[#252d3f] transition-colors" />
                                  )}
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ═══════════════ INTEGRAÇÕES ═══════════════ */}
      {abaAtiva === 'integracoes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integracoes.map((integracao) => {
            const IntIcon = integracao.icon;
            return (
              <Card key={integracao.id} padding="none">
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
                      style={{ backgroundColor: `${integracao.iconColor}15`, color: integracao.iconColor }}
                    >
                      <IntIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-foreground font-medium">{integracao.nome}</h3>
                        {integracao.conectada && (
                          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{integracao.descricao}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#2a3146]/60">
                    <div>
                      {integracao.conectada ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="success" size="sm">Conectada</Badge>
                          {integracao.ultimaSync && (
                            <span className="text-xs text-[#94a3b8]">
                              Sync: {new Date(integracao.ultimaSync).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="default" size="sm">Desconectada</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={integracao.conectada ? 'outline' : 'primary'}
                      onClick={() => toggleIntegracao(integracao.id)}
                    >
                      {integracao.conectada ? 'Desconectar' : 'Conectar'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Novo Campo */}
      <Modal
        isOpen={modalCampo}
        onClose={() => setModalCampo(false)}
        title="Novo Campo Personalizado"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nome do Campo"
            value={campNome}
            onChange={(e) => setCampNome(e.target.value)}
            placeholder="Ex: Setor, Receita Anual..."
          />
          <Select
            label="Tipo"
            options={tipoOptions}
            value={campTipo}
            onChange={(e) => setCampTipo(e.target.value as CampoPersonalizado['tipo'])}
          />
          <Select
            label="Entidade"
            options={entidadeOptions}
            value={campEntidade}
            onChange={(e) => setCampEntidade(e.target.value as CampoPersonalizado['entidade'])}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCampObrigatorio(!campObrigatorio)}
              className="flex items-center gap-2 text-sm"
            >
              {campObrigatorio ? (
                <ToggleRight className="h-6 w-6 text-blue-500" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-[#94a3b8]" />
              )}
              <span className={campObrigatorio ? 'text-white' : 'text-muted-foreground'}>
                Campo obrigatório
              </span>
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalCampo(false)}>
              Cancelar
            </Button>
            <Button onClick={adicionarCampo} disabled={!campNome}>
              Criar Campo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
