'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  Plus,
  Calendar,
  Clock,
  User,
  Building2,
  Search,
  Filter,
  Flag,
  Send,
  CheckCircle2,
  Archive,
  FileText,
  GripVertical,
  Paperclip,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';

/* ─── Types ─── */
type CommunicationType = 'email' | 'whatsapp' | 'chamada' | 'anotacao';
type CommunicationDirection = 'enviado' | 'recebido';
type CommunicationStatus = 'enviado' | 'recebido' | 'rascunho' | 'arquivado' | 'lido';

interface Communication {
  id: string;
  tipo: CommunicationType;
  direcao: CommunicationDirection;
  status: CommunicationStatus;
  contato: string;
  empresa: string;
  assunto: string;
  resumo: string;
  conteudo: string;
  data: string;
  duracao: string | null;
  responsavel: string;
  anexos: number;
  tags: string[];
}

/* ─── Mock Data ─── */
const mockCommunications: Communication[] = [
  {
    id: '1',
    tipo: 'email',
    direcao: 'enviado',
    status: 'enviado',
    contato: 'João Silva',
    empresa: 'Tech Solutions',
    assunto: 'Proposta Comercial - Implantação ERP',
    resumo: 'Segue em anexo a proposta comercial conforme alinhado na reunião de ontem.',
    conteudo: 'Prezado João,\n\nConforme conversamos na reunião de ontem, segue em anexo a proposta comercial para implantação do sistema ERP.\n\nO projeto contempla todas as fases discutidas, incluindo migração de dados e treinamento da equipe.\n\nFico no aguardo do seu retorno.\n\nAtenciosamente,\nFelipe Santos',
    data: '2025-02-10T14:30:00',
    duracao: null,
    responsavel: 'Felipe Santos',
    anexos: 2,
    tags: ['proposta', 'erp'],
  },
  {
    id: '2',
    tipo: 'whatsapp',
    direcao: 'recebido',
    status: 'recebido',
    contato: 'Carlos Lima',
    empresa: 'Global Imports',
    assunto: 'Dúvida sobre licenciamento',
    resumo: 'Boa tarde! Recebi a proposta mas tenho uma dúvida sobre o modelo de licenciamento...',
    conteudo: 'Boa tarde Felipe! Recebi a proposta mas tenho uma dúvida sobre o modelo de licenciamento. É por usuário ou por empresa? E qual o valor para adicionar novos usuários depois?',
    data: '2025-02-10T16:45:00',
    duracao: null,
    responsavel: 'Felipe Santos',
    anexos: 0,
    tags: ['licença', 'dúvida'],
  },
  {
    id: '3',
    tipo: 'chamada',
    direcao: 'enviado',
    status: 'enviado',
    contato: 'Maria Santos',
    empresa: 'ABC Corp',
    assunto: 'Follow-up pós demonstração',
    resumo: 'Ligação de 15 minutos discutindo próximos passos após a demo do sistema.',
    conteudo: 'Ligação realizada para follow-up da demonstração. Maria confirmou interesse e pediu para agendar uma reunião com o diretor de TI na próxima semana. Ficou de confirmar a data até sexta-feira.',
    data: '2025-02-10T11:00:00',
    duracao: '15min',
    responsavel: 'Felipe Santos',
    anexos: 0,
    tags: ['follow-up', 'demo'],
  },
  {
    id: '4',
    tipo: 'anotacao',
    direcao: 'enviado',
    status: 'lido',
    contato: 'Pedro Rocha',
    empresa: 'Omega Services',
    assunto: 'Observações da reunião técnica',
    resumo: 'Pontos importantes levantados durante a reunião técnica sobre automação industrial.',
    conteudo: '- Cliente precisa de integração com SAP\n- Prazo ideal: 3 meses\n- Orçamento aprovado: até R$ 150.000\n- Decisor final: Diretor de Operações\n- Próximo passo: enviar cronograma detalhado',
    data: '2025-02-09T17:00:00',
    duracao: null,
    responsavel: 'Felipe Santos',
    anexos: 0,
    tags: ['reunião', 'técnico'],
  },
  {
    id: '5',
    tipo: 'email',
    direcao: 'recebido',
    status: 'lido',
    contato: 'Rafael Souza',
    empresa: 'Nova Tech',
    assunto: 'Re: Proposta revisada - Desconto aprovado',
    resumo: 'Rafael confirmou aceite da proposta com o desconto de 8% aplicado.',
    conteudo: 'Olá Felipe,\n\nAgradeço pelo envio da proposta revisada. Após análise interna, confirmamos o aceite dos termos apresentados com o desconto de 8%.\n\nPodemos prosseguir com a assinatura do contrato.\n\nAbs,\nRafael Souza',
    data: '2025-02-09T10:15:00',
    duracao: null,
    responsavel: 'Ana Costa',
    anexos: 1,
    tags: ['proposta', 'aceite'],
  },
  {
    id: '6',
    tipo: 'whatsapp',
    direcao: 'enviado',
    status: 'lido',
    contato: 'Julia Mendes',
    empresa: 'Beta Systems',
    assunto: 'Confirmação de visita técnica',
    resumo: 'Confirmação da visita técnica agendada para quarta-feira às 9h.',
    conteudo: 'Olá Julia! Tudo bem? Confirmando nossa visita técnica agendada para quarta-feira (12/02) às 9h no escritório de vocês. Levarei o equipamento para os testes. Qualquer mudança, me avise! Abs',
    data: '2025-02-08T18:30:00',
    duracao: null,
    responsavel: 'Ana Costa',
    anexos: 0,
    tags: ['visita', 'confirmação'],
  },
  {
    id: '7',
    tipo: 'chamada',
    direcao: 'recebido',
    status: 'recebido',
    contato: 'Lucas Mendes',
    empresa: 'DataFlow',
    assunto: 'Primeiro contato - Interesse em migração cloud',
    resumo: 'Lead entrou em contato interessado em migração para cloud. Qualificação inicial realizada.',
    conteudo: 'Lucas ligou interessado na migração cloud após ver o webinar. Empresa tem 50 funcionários, usa servidores locais. Orçamento: em definição. Prazo: segundo semestre. Próximo passo: enviar material e agendar reunião técnica.',
    data: '2025-02-08T14:20:00',
    duracao: '22min',
    responsavel: 'Ana Costa',
    anexos: 0,
    tags: ['lead', 'cloud'],
  },
  {
    id: '8',
    tipo: 'email',
    direcao: 'enviado',
    status: 'rascunho',
    contato: 'Fernanda Alves',
    empresa: 'Inovatech',
    assunto: 'Apresentação do Sistema CRM',
    resumo: 'Rascunho do email de apresentação do CRM para novo prospect.',
    conteudo: 'Prezada Fernanda,\n\nMeu nome é Felipe Santos e represento a [Empresa]. Gostaria de apresentar nosso sistema CRM que pode ajudar a Inovatech a...\n\n[RASCUNHO - COMPLETAR]',
    data: '2025-02-10T09:00:00',
    duracao: null,
    responsavel: 'Felipe Santos',
    anexos: 0,
    tags: ['prospect', 'crm'],
  },
  {
    id: '9',
    tipo: 'anotacao',
    direcao: 'enviado',
    status: 'arquivado',
    contato: 'Ana Costa',
    empresa: 'Smart Digital',
    assunto: 'Feedback do cliente sobre suporte',
    resumo: 'Cliente elogiou o atendimento do suporte técnico. Satisfação alta.',
    conteudo: 'Feedback positivo recebido:\n- Tempo de resposta excelente\n- Técnico muito prestativo\n- Problema resolvido na primeira interação\n- NPS: 9/10',
    data: '2025-02-07T16:00:00',
    duracao: null,
    responsavel: 'Felipe Santos',
    anexos: 0,
    tags: ['feedback', 'suporte'],
  },
  {
    id: '10',
    tipo: 'chamada',
    direcao: 'enviado',
    status: 'arquivado',
    contato: 'Roberto Almeida',
    empresa: 'Construmax',
    assunto: 'Negociação de renovação de contrato',
    resumo: 'Negociação sobre renovação anual com possível upgrade de plano.',
    conteudo: 'Ligação de 30 minutos para discutir renovação.\n- Cliente quer manter o contrato\n- Pediu desconto de 10% na renovação\n- Interesse em upgrade para plano Enterprise\n- Decisão final: até final do mês',
    data: '2025-02-06T10:00:00',
    duracao: '30min',
    responsavel: 'Felipe Santos',
    anexos: 0,
    tags: ['renovação', 'negociação'],
  },
];

/* ─── Helpers ─── */
function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ─── Config Maps ─── */
const typeConfig: Record<CommunicationType, { label: string; color: string; bg: string; icon: typeof Mail }> = {
  email: { label: 'E-mail', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Mail },
  whatsapp: { label: 'WhatsApp', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: MessageSquare },
  chamada: { label: 'Chamada', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Phone },
  anotacao: { label: 'Anotação', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: StickyNote },
};

const statusConfig: Record<CommunicationStatus, { label: string; color: string; bg: string; icon: typeof Send }> = {
  enviado: { label: 'Enviado', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Send },
  recebido: { label: 'Recebido', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: ArrowDownLeft },
  rascunho: { label: 'Rascunho', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: FileText },
  lido: { label: 'Lido', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckCircle2 },
  arquivado: { label: 'Arquivado', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30', icon: Archive },
};

/* ─── Badges ─── */
function TypeBadge({ tipo }: { tipo: CommunicationType }) {
  const config = typeConfig[tipo];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function StatusBadge({ status }: { status: CommunicationStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function DirectionBadge({ direcao }: { direcao: CommunicationDirection }) {
  const isEnviado = direcao === 'enviado';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isEnviado ? 'text-orange-400' : 'text-cyan-400'}`}>
      {isEnviado ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
      {isEnviado ? 'Saída' : 'Entrada'}
    </span>
  );
}

/* ─── Summary Cards ─── */
function SummaryCards({ communications }: { communications: Communication[] }) {
  const total = communications.length;
  const emails = communications.filter((c) => c.tipo === 'email').length;
  const whatsapp = communications.filter((c) => c.tipo === 'whatsapp').length;
  const chamadas = communications.filter((c) => c.tipo === 'chamada').length;
  const anotacoes = communications.filter((c) => c.tipo === 'anotacao').length;

  const initialCards = [
    { id: 'total', label: 'Total Comunicações', value: total.toString(), icon: MessageSquare, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
    { id: 'emails', label: 'E-mails', value: emails.toString(), icon: Mail, color: 'text-cyan-400', colorBg: 'bg-cyan-500/10' },
    { id: 'whatsapp', label: 'WhatsApp', value: whatsapp.toString(), icon: MessageSquare, color: 'text-green-400', colorBg: 'bg-green-500/10' },
    { id: 'chamadas', label: 'Chamadas', value: chamadas.toString(), icon: Phone, color: 'text-yellow-400', colorBg: 'bg-yellow-500/10' },
    { id: 'anotacoes', label: 'Anotações', value: anotacoes.toString(), icon: StickyNote, color: 'text-purple-400', colorBg: 'bg-purple-500/10' },
  ];

  const [cards, setCards] = useState(initialCards);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    setCards([
      { id: 'total', label: 'Total Comunicações', value: total.toString(), icon: MessageSquare, color: 'text-blue-400', colorBg: 'bg-blue-500/10' },
      { id: 'emails', label: 'E-mails', value: emails.toString(), icon: Mail, color: 'text-cyan-400', colorBg: 'bg-cyan-500/10' },
      { id: 'whatsapp', label: 'WhatsApp', value: whatsapp.toString(), icon: MessageSquare, color: 'text-green-400', colorBg: 'bg-green-500/10' },
      { id: 'chamadas', label: 'Chamadas', value: chamadas.toString(), icon: Phone, color: 'text-yellow-400', colorBg: 'bg-yellow-500/10' },
      { id: 'anotacoes', label: 'Anotações', value: anotacoes.toString(), icon: StickyNote, color: 'text-purple-400', colorBg: 'bg-purple-500/10' },
    ]);
  }, [total, emails, whatsapp, chamadas, anotacoes]);

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
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
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
function DetailPanel({ communication, onClose }: { communication: Communication; onClose: () => void }) {
  const typeConf = typeConfig[communication.tipo];
  const TypeIcon = typeConf.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-[#2a3146] bg-[#0f1420] p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConf.bg}`}>
                <TypeIcon className={`h-5 w-5 ${typeConf.color}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{communication.assunto}</h2>
                <p className="text-xs text-[#94a3b8]">{communication.contato} • {communication.empresa}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <TypeBadge tipo={communication.tipo} />
              <StatusBadge status={communication.status} />
              <DirectionBadge direcao={communication.direcao} />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Data</span>
            <p className="mt-1 text-sm font-medium text-white">{formatDateTime(communication.data)}</p>
          </div>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
            <span className="text-xs text-[#94a3b8]">Responsável</span>
            <p className="mt-1 text-sm font-medium text-white">{communication.responsavel}</p>
          </div>
          {communication.duracao && (
            <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
              <span className="text-xs text-[#94a3b8]">Duração</span>
              <p className="mt-1 text-sm font-medium text-white">{communication.duracao}</p>
            </div>
          )}
          {communication.anexos > 0 && (
            <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-3">
              <span className="text-xs text-[#94a3b8]">Anexos</span>
              <p className="mt-1 text-sm font-medium text-white flex items-center gap-1">
                <Paperclip className="h-3.5 w-3.5" /> {communication.anexos} arquivo(s)
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Conteúdo</h3>
          <div className="rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 p-4">
            <p className="text-sm text-[#94a3b8] whitespace-pre-wrap leading-relaxed">{communication.conteudo}</p>
          </div>
        </div>

        {/* Tags */}
        {communication.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {communication.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#252d3f] px-3 py-1 text-xs text-[#94a3b8] border border-[#2a3146]">
                  #{tag}
                </span>
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

/* ─── Communication Card ─── */
function CommunicationCard({
  communication,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  communication: Communication;
  onClick: () => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (id: string) => void;
  isDragOver: boolean;
}) {
  const typeConf = typeConfig[communication.tipo];
  const TypeIcon = typeConf.icon;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
    onDragStart(communication.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => onDragOver(e, communication.id)}
      onDrop={() => onDrop(communication.id)}
      onClick={onClick}
      className={`group relative flex flex-col rounded-xl border border-[#2a3146] bg-[#1a1f2e]/40 backdrop-blur-sm p-4 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 cursor-grab active:cursor-grabbing ${isDragOver ? 'scale-[1.02] ring-2 ring-blue-500/30' : ''}`}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 z-10 rounded-lg bg-[#252d3f]/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3 w-3 text-[#94a3b8]" />
      </div>

      {/* Header: Icon + Type + Direction */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${typeConf.bg}`}>
            <TypeIcon className={`h-4.5 w-4.5 ${typeConf.color}`} />
          </div>
          <TypeBadge tipo={communication.tipo} />
        </div>
        <DirectionBadge direcao={communication.direcao} />
      </div>

      {/* Title */}
      <div className="flex items-center gap-1.5 mb-2">
        <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug">{communication.assunto}</h4>
        {communication.anexos > 0 && (
          <Paperclip className="h-3 w-3 shrink-0 text-[#94a3b8]" />
        )}
      </div>

      {/* Resumo */}
      <p className="text-xs text-[#94a3b8] line-clamp-2 mb-3">{communication.resumo}</p>

      {/* Info */}
      <div className="flex flex-col gap-1.5 text-xs text-[#94a3b8] mb-3">
        <span className="flex items-center gap-1.5"><User className="h-3 w-3 shrink-0" /> {communication.contato}</span>
        {communication.empresa && (
          <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3 shrink-0" /> {communication.empresa}</span>
        )}
      </div>

      {/* Footer: Date + Status */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2a3146]/50">
        <div className="flex flex-col text-xs text-[#94a3b8]">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateTime(communication.data)}</span>
          {communication.duracao && (
            <span className="mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3" /> {communication.duracao}</span>
          )}
        </div>
        <StatusBadge status={communication.status} />
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function ComunicacaoPage() {
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [filterType, setFilterType] = useState<CommunicationType | 'todos'>('todos');
  const [filterStatus, setFilterStatus] = useState<CommunicationStatus | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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
    setCommunications((prev) => {
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

  const filtered = communications.filter((c) => {
    const matchType = filterType === 'todos' || c.tipo === filterType;
    const matchStatus = filterStatus === 'todos' || c.status === filterStatus;
    const matchSearch =
      searchTerm === '' ||
      c.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.resumo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div>
      <PageHeader
        title="Comunicações"
        subtitle="Histórico de e-mails, WhatsApp, chamadas e anotações internas"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Comunicações' },
        ]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Nova Comunicação
          </Button>
        }
      />

      {/* Summary */}
      <SummaryCards communications={communications} />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3">
        {/* Search + Type filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Buscar comunicações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-[#2a3146] bg-[#1a1f2e]/40 py-2 pl-10 pr-4 text-sm text-white placeholder-[#94a3b8] outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 shrink-0 text-[#94a3b8]" />
            {(['todos', 'email', 'whatsapp', 'chamada', 'anotacao'] as const).map((tipo) => (
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
          {(['todos', 'enviado', 'recebido', 'lido', 'rascunho', 'arquivado'] as const).map((status) => (
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

      {/* Communication Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((communication) => (
          <CommunicationCard
            key={communication.id}
            communication={communication}
            onClick={() => setSelectedCommunication(communication)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragOver={dragOverId === communication.id}
          />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a3146] py-12">
            <MessageSquare className="mb-3 h-8 w-8 text-[#94a3b8]" />
            <p className="text-sm text-[#94a3b8]">Nenhuma comunicação encontrada</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCommunication && (
        <DetailPanel
          communication={selectedCommunication}
          onClose={() => setSelectedCommunication(null)}
        />
      )}
    </div>
  );
}
