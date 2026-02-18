import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesSeedService implements OnModuleInit {
  private readonly logger = new Logger(ActivitiesSeedService.name);

  constructor(
    @InjectRepository(Activity)
    private repo: Repository<Activity>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const activities = [
      {
        titulo: 'Ligar para João Silva - Follow up proposta ERP',
        descricao: 'Retornar ligação sobre a proposta enviada na semana passada.',
        tipo: 'ligacao' as const,
        status: 'pendente' as const,
        prioridade: 'alta' as const,
        dataInicio: new Date('2025-02-10T09:00:00'),
        dataFim: new Date('2025-02-10T09:30:00'),
        responsavel: 'Felipe Santos',
        cliente: 'João Silva',
        empresa: 'Tech Solutions',
        observacoes: 'Cliente demonstrou interesse na demo.',
        tarefas: [
          { id: 't1-1', texto: 'Revisar proposta enviada', concluida: true },
          { id: 't1-2', texto: 'Preparar argumentos de venda', concluida: true },
          { id: 't1-3', texto: 'Ligar para o cliente', concluida: false },
          { id: 't1-4', texto: 'Registrar resultado da ligação', concluida: false },
        ],
      },
      {
        titulo: 'Reunião de apresentação - Global Imports',
        descricao: 'Apresentar solução de migração cloud para o time de TI.',
        tipo: 'reuniao' as const,
        status: 'em_andamento' as const,
        prioridade: 'urgente' as const,
        dataInicio: new Date('2025-02-10T14:00:00'),
        dataFim: new Date('2025-02-10T15:30:00'),
        responsavel: 'Felipe Santos',
        cliente: 'Carlos Lima',
        empresa: 'Global Imports',
        observacoes: 'Preparar slides e ambiente de demo.',
        tarefas: [
          { id: 't2-1', texto: 'Preparar slides da apresentação', concluida: true },
          { id: 't2-2', texto: 'Configurar ambiente de demo', concluida: false },
          { id: 't2-3', texto: 'Enviar convite para participantes', concluida: true },
          { id: 't2-4', texto: 'Testar conexão da sala', concluida: false },
          { id: 't2-5', texto: 'Imprimir material de apoio', concluida: false },
        ],
      },
      {
        titulo: 'Enviar proposta revisada - Nova Tech',
        descricao: 'Ajustar valores conforme negociação e reenviar.',
        tipo: 'email' as const,
        status: 'pendente' as const,
        prioridade: 'media' as const,
        dataInicio: new Date('2025-02-11T10:00:00'),
        dataFim: null,
        responsavel: 'Ana Costa',
        cliente: 'Rafael Souza',
        empresa: 'Nova Tech',
        observacoes: 'Desconto de 8% aprovado pela gerência.',
        tarefas: [
          { id: 't3-1', texto: 'Atualizar valores na proposta', concluida: false },
          { id: 't3-2', texto: 'Revisar termos contratuais', concluida: false },
          { id: 't3-3', texto: 'Enviar para aprovação do gerente', concluida: false },
        ],
      },
      {
        titulo: 'Follow-up pós reunião - Omega Services',
        descricao: 'Enviar ata da reunião e próximos passos.',
        tipo: 'follow_up' as const,
        status: 'concluida' as const,
        prioridade: 'media' as const,
        dataInicio: new Date('2025-02-08T11:00:00'),
        dataFim: new Date('2025-02-08T11:30:00'),
        responsavel: 'Felipe Santos',
        cliente: 'Pedro Rocha',
        empresa: 'Omega Services',
        observacoes: 'Ata enviada por email. Aguardando retorno.',
        tarefas: [
          { id: 't4-1', texto: 'Elaborar ata da reunião', concluida: true },
          { id: 't4-2', texto: 'Enviar ata por e-mail', concluida: true },
          { id: 't4-3', texto: 'Definir próximos passos', concluida: true },
        ],
      },
      {
        titulo: 'Visita técnica - Beta Systems',
        descricao: 'Visitar cliente para levantamento de requisitos do app.',
        tipo: 'visita' as const,
        status: 'pendente' as const,
        prioridade: 'alta' as const,
        dataInicio: new Date('2025-02-12T09:00:00'),
        dataFim: new Date('2025-02-12T12:00:00'),
        responsavel: 'Ana Costa',
        cliente: 'Julia Mendes',
        empresa: 'Beta Systems',
        observacoes: 'Levar equipamento para testes.',
        tarefas: [
          { id: 't5-1', texto: 'Separar equipamento de teste', concluida: false },
          { id: 't5-2', texto: 'Confirmar horário com o cliente', concluida: true },
          { id: 't5-3', texto: 'Preparar checklist de requisitos', concluida: false },
          { id: 't5-4', texto: 'Verificar rota e estacionamento', concluida: false },
        ],
      },
      {
        titulo: 'Preparar contrato - Smart Digital',
        descricao: 'Elaborar contrato de suporte premium conforme proposta aceita.',
        tipo: 'tarefa' as const,
        status: 'atrasada' as const,
        prioridade: 'urgente' as const,
        dataInicio: new Date('2025-02-07T08:00:00'),
        dataFim: new Date('2025-02-07T18:00:00'),
        responsavel: 'Felipe Santos',
        cliente: 'Ana Costa',
        empresa: 'Smart Digital',
        observacoes: 'Prazo expirado. Priorizar imediatamente.',
        tarefas: [
          { id: 't6-1', texto: 'Redigir cláusulas do contrato', concluida: true },
          { id: 't6-2', texto: 'Validar com o jurídico', concluida: false },
          { id: 't6-3', texto: 'Coletar assinaturas', concluida: false },
        ],
      },
      {
        titulo: 'Ligação de qualificação - DataFlow',
        descricao: 'Primeiro contato para entender necessidades de migração.',
        tipo: 'ligacao' as const,
        status: 'concluida' as const,
        prioridade: 'baixa' as const,
        dataInicio: new Date('2025-02-06T16:00:00'),
        dataFim: new Date('2025-02-06T16:20:00'),
        responsavel: 'Ana Costa',
        cliente: 'Lucas Mendes',
        empresa: 'DataFlow',
        observacoes: 'Lead qualificado. Agendar reunião técnica.',
        tarefas: [
          { id: 't7-1', texto: 'Pesquisar sobre a empresa', concluida: true },
          { id: 't7-2', texto: 'Realizar ligação de qualificação', concluida: true },
          { id: 't7-3', texto: 'Registrar informações no CRM', concluida: true },
        ],
      },
      {
        titulo: 'Reunião interna - Pipeline review',
        descricao: 'Revisão semanal do pipeline de vendas com a equipe.',
        tipo: 'reuniao' as const,
        status: 'pendente' as const,
        prioridade: 'media' as const,
        dataInicio: new Date('2025-02-13T10:00:00'),
        dataFim: new Date('2025-02-13T11:00:00'),
        responsavel: 'Felipe Santos',
        cliente: '',
        empresa: '',
        observacoes: 'Preparar relatório de métricas.',
        tarefas: [
          { id: 't8-1', texto: 'Atualizar relatório de métricas', concluida: false },
          { id: 't8-2', texto: 'Levantar dados do pipeline', concluida: false },
          { id: 't8-3', texto: 'Preparar pauta da reunião', concluida: false },
          { id: 't8-4', texto: 'Reservar sala de reunião', concluida: true },
        ],
      },
    ];

    let criados = 0;
    for (const data of activities) {
      const existe = await this.repo.findOne({ where: { titulo: data.titulo } });
      if (!existe) {
        await this.repo.save(this.repo.create(data as any));
        criados++;
      }
    }

    if (criados > 0) this.logger.log(`${criados} atividades criadas com sucesso!`);
    else this.logger.log('Atividades do seed já existem.');
  }
}
