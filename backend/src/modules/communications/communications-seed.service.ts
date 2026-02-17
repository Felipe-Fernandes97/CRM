import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Communication } from './entities/communication.entity';

@Injectable()
export class CommunicationsSeedService implements OnModuleInit {
  private readonly logger = new Logger(CommunicationsSeedService.name);

  constructor(
    @InjectRepository(Communication)
    private repo: Repository<Communication>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const count = await this.repo.count();
    if (count > 0) {
      this.logger.log('Comunicações já existem, seed ignorado.');
      return;
    }

    const comunicacoes = [
      {
        tipo: 'email' as const,
        direcao: 'saida' as const,
        status: 'enviado' as const,
        assunto: 'Proposta Comercial - Implantação ERP',
        resumo: 'Segue em anexo a proposta comercial conforme alinhado na reunião de ontem.',
        conteudo: 'Prezado João,\n\nConforme conversamos na reunião de ontem, segue em anexo a proposta comercial para implantação do sistema ERP.\n\nO projeto contempla todas as fases discutidas, incluindo migração de dados e treinamento da equipe.\n\nFico no aguardo do seu retorno.\n\nAtenciosamente,\nFelipe Santos',
        contato: 'João Silva',
        empresa: 'Tech Solutions',
        responsavel: 'Felipe Santos',
        duracaoStr: null,
        numAnexos: 2,
        tags: ['proposta', 'erp'],
      },
      {
        tipo: 'whatsapp' as const,
        direcao: 'entrada' as const,
        status: 'recebido' as const,
        assunto: 'Dúvida sobre licenciamento',
        resumo: 'Boa tarde! Recebi a proposta mas tenho uma dúvida sobre o modelo de licenciamento...',
        conteudo: 'Boa tarde Felipe! Recebi a proposta mas tenho uma dúvida sobre o modelo de licenciamento. É por usuário ou por empresa? E qual o valor para adicionar novos usuários depois?',
        contato: 'Carlos Lima',
        empresa: 'Global Imports',
        responsavel: 'Felipe Santos',
        duracaoStr: null,
        numAnexos: 0,
        tags: ['licença', 'dúvida'],
      },
      {
        tipo: 'ligacao' as const,
        direcao: 'saida' as const,
        status: 'enviado' as const,
        assunto: 'Follow-up pós demonstração',
        resumo: 'Ligação de 15 minutos discutindo próximos passos após a demo do sistema.',
        conteudo: 'Ligação realizada para follow-up da demonstração. Maria confirmou interesse e pediu para agendar uma reunião com o diretor de TI na próxima semana.',
        contato: 'Maria Santos',
        empresa: 'ABC Corp',
        responsavel: 'Felipe Santos',
        duracaoStr: '15min',
        numAnexos: 0,
        tags: ['follow-up', 'demo'],
      },
      {
        tipo: 'anotacao' as const,
        direcao: 'saida' as const,
        status: 'lido' as const,
        assunto: 'Observações da reunião técnica',
        resumo: 'Pontos importantes levantados durante a reunião técnica sobre automação industrial.',
        conteudo: '- Cliente precisa de integração com SAP\n- Prazo ideal: 3 meses\n- Orçamento aprovado: até R$ 150.000\n- Decisor final: Diretor de Operações\n- Próximo passo: enviar cronograma detalhado',
        contato: 'Pedro Rocha',
        empresa: 'Omega Services',
        responsavel: 'Felipe Santos',
        duracaoStr: null,
        numAnexos: 0,
        tags: ['reunião', 'técnico'],
      },
      {
        tipo: 'email' as const,
        direcao: 'entrada' as const,
        status: 'lido' as const,
        assunto: 'Re: Proposta revisada - Desconto aprovado',
        resumo: 'Rafael confirmou aceite da proposta com o desconto de 8% aplicado.',
        conteudo: 'Olá Felipe,\n\nAgradeço pelo envio da proposta revisada. Após análise interna, confirmamos o aceite dos termos apresentados com o desconto de 8%.\n\nPodemos prosseguir com a assinatura do contrato.\n\nAbs,\nRafael Souza',
        contato: 'Rafael Souza',
        empresa: 'Nova Tech',
        responsavel: 'Ana Costa',
        duracaoStr: null,
        numAnexos: 1,
        tags: ['proposta', 'aceite'],
      },
      {
        tipo: 'whatsapp' as const,
        direcao: 'saida' as const,
        status: 'lido' as const,
        assunto: 'Confirmação de visita técnica',
        resumo: 'Confirmação da visita técnica agendada para quarta-feira às 9h.',
        conteudo: 'Olá Julia! Tudo bem? Confirmando nossa visita técnica agendada para quarta-feira (12/02) às 9h no escritório de vocês.',
        contato: 'Julia Mendes',
        empresa: 'Beta Systems',
        responsavel: 'Ana Costa',
        duracaoStr: null,
        numAnexos: 0,
        tags: ['visita', 'confirmação'],
      },
      {
        tipo: 'ligacao' as const,
        direcao: 'entrada' as const,
        status: 'recebido' as const,
        assunto: 'Primeiro contato - Interesse em migração cloud',
        resumo: 'Lead entrou em contato interessado em migração para cloud. Qualificação inicial realizada.',
        conteudo: 'Lucas ligou interessado na migração cloud após ver o webinar. Empresa tem 50 funcionários, usa servidores locais. Orçamento: em definição.',
        contato: 'Lucas Mendes',
        empresa: 'DataFlow',
        responsavel: 'Ana Costa',
        duracaoStr: '22min',
        numAnexos: 0,
        tags: ['lead', 'cloud'],
      },
      {
        tipo: 'email' as const,
        direcao: 'saida' as const,
        status: 'rascunho' as const,
        assunto: 'Apresentação do Sistema CRM',
        resumo: 'Rascunho do email de apresentação do CRM para novo prospect.',
        conteudo: 'Prezada Fernanda,\n\nMeu nome é Felipe Santos e represento a [Empresa]. Gostaria de apresentar nosso sistema CRM...\n\n[RASCUNHO - COMPLETAR]',
        contato: 'Fernanda Alves',
        empresa: 'Inovatech',
        responsavel: 'Felipe Santos',
        duracaoStr: null,
        numAnexos: 0,
        tags: ['prospect', 'crm'],
      },
      {
        tipo: 'anotacao' as const,
        direcao: 'saida' as const,
        status: 'arquivado' as const,
        assunto: 'Feedback do cliente sobre suporte',
        resumo: 'Cliente elogiou o atendimento do suporte técnico. Satisfação alta.',
        conteudo: 'Feedback positivo recebido:\n- Tempo de resposta excelente\n- Técnico muito prestativo\n- Problema resolvido na primeira interação\n- NPS: 9/10',
        contato: 'Ana Costa',
        empresa: 'Smart Digital',
        responsavel: 'Felipe Santos',
        duracaoStr: null,
        numAnexos: 0,
        tags: ['feedback', 'suporte'],
      },
      {
        tipo: 'ligacao' as const,
        direcao: 'saida' as const,
        status: 'arquivado' as const,
        assunto: 'Negociação de renovação de contrato',
        resumo: 'Negociação sobre renovação anual com possível upgrade de plano.',
        conteudo: 'Ligação de 30 minutos para discutir renovação.\n- Cliente quer manter o contrato\n- Pediu desconto de 10%\n- Interesse em upgrade para plano Enterprise',
        contato: 'Roberto Almeida',
        empresa: 'Construmax',
        responsavel: 'Felipe Santos',
        duracaoStr: '30min',
        numAnexos: 0,
        tags: ['renovação', 'negociação'],
      },
    ];

    for (const data of comunicacoes) {
      const comm = this.repo.create(data as any);
      await this.repo.save(comm as any);
    }

    this.logger.log(`${comunicacoes.length} comunicações criadas com sucesso!`);
  }
}
