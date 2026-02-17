'use client';

import { useState } from 'react';
import {
  Settings,
  GitBranch,
  List,
  Shield,
  Plug,
  Plus,
  X,
  Trash2,
  Edit,
  Save,
  ChevronRight,
  Check,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Link,
  Users,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

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
  icone: string;
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
  { id: '1', nome: 'Google Calendar', descricao: 'Sincronize eventos e reuniões com o Google Calendar', icone: '📅', conectada: true, ultimaSync: '2026-02-17T10:00:00' },
  { id: '2', nome: 'Slack', descricao: 'Receba notificações de atividades no Slack', icone: '💬', conectada: true, ultimaSync: '2026-02-17T11:30:00' },
  { id: '3', nome: 'WhatsApp Business', descricao: 'Integre conversas do WhatsApp com seus leads', icone: '📱', conectada: false, ultimaSync: null },
  { id: '4', nome: 'Mailchimp', descricao: 'Sincronize contatos para campanhas de e-mail marketing', icone: '📧', conectada: false, ultimaSync: null },
  { id: '5', nome: 'Zapier', descricao: 'Conecte com mais de 5000 apps através do Zapier', icone: '⚡', conectada: true, ultimaSync: '2026-02-16T18:00:00' },
  { id: '6', nome: 'Google Sheets', descricao: 'Exporte dados automaticamente para planilhas', icone: '📊', conectada: false, ultimaSync: null },
];

const coresFunil = ['#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export default function ConfiguracoesPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaConfig>('funil');
  const [etapas, setEtapas] = useState<EtapaFunil[]>(etapasMock);
  const [campos, setCampos] = useState<CampoPersonalizado[]>(camposMock);
  const [permissoes, setPermissoes] = useState<Permissao[]>(permissoesMock);
  const [integracoes, setIntegracoes] = useState<Integracao[]>(integracoesMock);

  // Funil
  const [editandoEtapa, setEditandoEtapa] = useState<string | null>(null);
  const [novaEtapaNome, setNovaEtapaNome] = useState('');
  const [novaEtapaCor, setNovaEtapaCor] = useState('#3b82f6');
  const [mostrarAdicionarEtapa, setMostrarAdicionarEtapa] = useState(false);

  // Campos
  const [modalCampo, setModalCampo] = useState(false);
  const [campNome, setCampNome] = useState('');
  const [campTipo, setCampTipo] = useState<CampoPersonalizado['tipo']>('texto');
  const [campEntidade, setCampEntidade] = useState<CampoPersonalizado['entidade']>('lead');
  const [campObrigatorio, setCampObrigatorio] = useState(false);

  const abas: { key: AbaConfig; label: string; icon: React.ReactNode }[] = [
    { key: 'funil', label: 'Funil de Vendas', icon: <GitBranch size={18} /> },
    { key: 'campos', label: 'Campos Personalizados', icon: <List size={18} /> },
    { key: 'permissoes', label: 'Permissões', icon: <Shield size={18} /> },
    { key: 'integracoes', label: 'Integrações', icon: <Plug size={18} /> },
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

  const perfisUnicos = [...new Set(permissoes.map((p) => p.perfil))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-gray-400 mt-1">Personalize o CRM de acordo com suas necessidades</p>
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-[#0f1823] rounded-xl p-1">
        {abas.map((aba) => (
          <button
            key={aba.key}
            onClick={() => setAbaAtiva(aba.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              abaAtiva === aba.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1e2a3a]'
            }`}
          >
            {aba.icon}
            {aba.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="bg-[#1e2a3a] rounded-xl border border-gray-700/50">
        {/* FUNIL */}
        {abaAtiva === 'funil' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Etapas do Funil</h2>
                <p className="text-gray-400 text-sm mt-1">Defina as etapas do funil de vendas</p>
              </div>
              <button
                onClick={() => setMostrarAdicionarEtapa(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                Nova Etapa
              </button>
            </div>

            {/* Preview do Funil */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              {etapas.map((etapa, index) => (
                <div key={etapa.id} className="flex items-center gap-2">
                  <div
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium whitespace-nowrap"
                    style={{ backgroundColor: etapa.cor }}
                  >
                    {etapa.nome}
                  </div>
                  {index < etapas.length - 1 && (
                    <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Lista de Etapas */}
            <div className="space-y-2">
              {etapas.map((etapa) => (
                <div
                  key={etapa.id}
                  className="flex items-center gap-3 bg-[#0f1823] rounded-lg p-3"
                >
                  <GripVertical size={16} className="text-gray-600 cursor-grab" />
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
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
                    <span className="text-white text-sm flex-1">{etapa.nome}</span>
                  )}
                  <span className="text-gray-500 text-xs">Etapa {etapa.ordem}</span>
                  <button
                    onClick={() => setEditandoEtapa(etapa.id)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit size={14} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => removerEtapa(etapa.id)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>

            {/* Adicionar Etapa */}
            {mostrarAdicionarEtapa && (
              <div className="mt-4 bg-[#0f1823] rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={novaEtapaNome}
                    onChange={(e) => setNovaEtapaNome(e.target.value)}
                    placeholder="Nome da etapa"
                    autoFocus
                    className="flex-1 bg-transparent border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-1">
                    {coresFunil.map((cor) => (
                      <button
                        key={cor}
                        onClick={() => setNovaEtapaCor(cor)}
                        className={`w-6 h-6 rounded-full border-2 transition-colors ${
                          novaEtapaCor === cor ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: cor }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={adicionarEtapa}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Check size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => setMostrarAdicionarEtapa(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CAMPOS PERSONALIZADOS */}
        {abaAtiva === 'campos' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Campos Personalizados</h2>
                <p className="text-gray-400 text-sm mt-1">Adicione campos extras às suas entidades</p>
              </div>
              <button
                onClick={() => setModalCampo(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                Novo Campo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 text-sm font-medium pb-3 pr-4">Nome</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3 pr-4">Tipo</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3 pr-4">Entidade</th>
                    <th className="text-left text-gray-400 text-sm font-medium pb-3 pr-4">Obrigatório</th>
                    <th className="text-right text-gray-400 text-sm font-medium pb-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {campos.map((campo) => (
                    <tr key={campo.id} className="border-b border-gray-700/50">
                      <td className="py-3 pr-4">
                        <span className="text-white text-sm">{campo.nome}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-gray-300 text-sm bg-[#0f1823] px-2 py-1 rounded">
                          {tipoLabel[campo.tipo]}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-gray-300 text-sm">{entidadeLabel[campo.entidade]}</span>
                      </td>
                      <td className="py-3 pr-4">
                        {campo.obrigatorio ? (
                          <span className="text-green-400 text-sm flex items-center gap-1">
                            <Check size={14} /> Sim
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Não</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setCampos(campos.filter((c) => c.id !== campo.id))}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {campos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <List size={40} className="mx-auto mb-3 opacity-50" />
                <p>Nenhum campo personalizado criado</p>
              </div>
            )}
          </div>
        )}

        {/* PERMISSÕES */}
        {abaAtiva === 'permissoes' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Permissões por Perfil</h2>
              <p className="text-gray-400 text-sm mt-1">Configure o que cada perfil pode fazer em cada módulo</p>
            </div>

            {perfisUnicos.map((perfil) => (
              <div key={perfil} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-blue-400" />
                  <h3 className="text-white font-medium">{perfil}</h3>
                </div>
                <div className="bg-[#0f1823] rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left text-gray-400 text-xs font-medium p-3">Módulo</th>
                        <th className="text-center text-gray-400 text-xs font-medium p-3">Criar</th>
                        <th className="text-center text-gray-400 text-xs font-medium p-3">Ler</th>
                        <th className="text-center text-gray-400 text-xs font-medium p-3">Editar</th>
                        <th className="text-center text-gray-400 text-xs font-medium p-3">Excluir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissoes
                        .filter((p) => p.perfil === perfil)
                        .map((perm) => (
                          <tr key={perm.id} className="border-b border-gray-700/30">
                            <td className="p-3 text-white text-sm">{perm.modulo}</td>
                            {(['criar', 'ler', 'editar', 'excluir'] as const).map((campo) => (
                              <td key={campo} className="p-3 text-center">
                                <button
                                  onClick={() => togglePermissao(perm.id, campo)}
                                  className="mx-auto"
                                >
                                  {perm[campo] ? (
                                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                                      <Check size={12} className="text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 bg-gray-700 rounded border border-gray-600" />
                                  )}
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INTEGRAÇÕES */}
        {abaAtiva === 'integracoes' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Integrações</h2>
              <p className="text-gray-400 text-sm mt-1">Conecte o CRM com outras ferramentas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integracoes.map((integracao) => (
                <div
                  key={integracao.id}
                  className="bg-[#0f1823] rounded-lg p-5 border border-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integracao.icone}</span>
                      <div>
                        <h3 className="text-white font-medium">{integracao.nome}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{integracao.descricao}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      {integracao.conectada ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs">
                          <Check size={12} />
                          Conectada
                          {integracao.ultimaSync && (
                            <span className="text-gray-500 ml-1">
                              · Sync: {new Date(integracao.ultimaSync).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Não conectada</span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleIntegracao(integracao.id)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        integracao.conectada
                          ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {integracao.conectada ? 'Desconectar' : 'Conectar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo Campo */}
      {modalCampo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a2332] rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Novo Campo Personalizado</h2>
              <button onClick={() => setModalCampo(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome do Campo</label>
                <input
                  type="text"
                  value={campNome}
                  onChange={(e) => setCampNome(e.target.value)}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Setor, Receita Anual..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                <select
                  value={campTipo}
                  onChange={(e) => setCampTipo(e.target.value as CampoPersonalizado['tipo'])}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="texto">Texto</option>
                  <option value="numero">Número</option>
                  <option value="data">Data</option>
                  <option value="selecao">Seleção</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Entidade</label>
                <select
                  value={campEntidade}
                  onChange={(e) => setCampEntidade(e.target.value as CampoPersonalizado['entidade'])}
                  className="w-full bg-[#0f1823] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="lead">Lead</option>
                  <option value="cliente">Cliente</option>
                  <option value="negociacao">Negociação</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCampObrigatorio(!campObrigatorio)}
                  className="flex items-center gap-2 text-sm"
                >
                  {campObrigatorio ? (
                    <ToggleRight size={24} className="text-blue-500" />
                  ) : (
                    <ToggleLeft size={24} className="text-gray-500" />
                  )}
                  <span className={campObrigatorio ? 'text-white' : 'text-gray-400'}>
                    Campo obrigatório
                  </span>
                </button>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setModalCampo(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={adicionarCampo}
                  disabled={!campNome}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Campo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
