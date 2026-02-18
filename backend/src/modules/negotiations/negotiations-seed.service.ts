import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Negotiation } from './entities/negotiations.entity';

@Injectable()
export class NegotiationsSeedService implements OnModuleInit {
  private readonly logger = new Logger(NegotiationsSeedService.name);

  constructor(
    @InjectRepository(Negotiation)
    private repo: Repository<Negotiation>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const negotiations = [
      {
        titulo: 'Proposta ERP Completo',
        valor: 120000,
        empresa: 'Tech Solutions',
        cliente: 'João Silva',
        status: 'enviada' as const,
        descricao: 'Implantação completa do sistema ERP com módulos financeiro, estoque e RH.',
        condicoes: 'Pagamento em 12x. Suporte incluso por 6 meses.',
        validade: '2025-03-15',
        dataEnvio: new Date('2025-02-01'),
        dataResposta: null,
        anexos: ['proposta_erp_v2.pdf', 'cronograma.xlsx'],
      },
      {
        titulo: 'Consultoria Cloud Migration',
        valor: 67000,
        empresa: 'Global Imports',
        cliente: 'Carlos Lima',
        status: 'aceita' as const,
        descricao: 'Migração de infraestrutura on-premise para AWS.',
        condicoes: 'Pagamento 50% início, 50% entrega. Prazo de 3 meses.',
        validade: '2025-02-20',
        dataEnvio: new Date('2025-01-15'),
        dataResposta: new Date('2025-01-22'),
        anexos: ['proposta_cloud.pdf'],
      },
      {
        titulo: 'Licenciamento SaaS Anual',
        valor: 89000,
        empresa: 'Nova Tech',
        cliente: 'Rafael Souza',
        status: 'rascunho' as const,
        descricao: 'Licenças anuais da plataforma SaaS para 150 usuários.',
        condicoes: 'Pagamento anual antecipado com 10% de desconto.',
        validade: '2025-04-01',
        dataEnvio: null,
        dataResposta: null,
        anexos: [],
      },
      {
        titulo: 'Automação Industrial',
        valor: 245000,
        empresa: 'Omega Services',
        cliente: 'Pedro Rocha',
        status: 'recusada' as const,
        descricao: 'Projeto de automação de linha de produção com IoT.',
        condicoes: 'Pagamento em 6x. Garantia de 12 meses.',
        validade: '2025-02-10',
        dataEnvio: new Date('2025-01-20'),
        dataResposta: new Date('2025-02-08'),
        anexos: ['proposta_automacao.pdf', 'especificacoes.pdf', 'orcamento.xlsx'],
      },
      {
        titulo: 'Suporte Premium 24/7',
        valor: 36000,
        empresa: 'Smart Digital',
        cliente: 'Ana Costa',
        status: 'expirada' as const,
        descricao: 'Contrato de suporte premium com SLA de 2 horas.',
        condicoes: 'Pagamento mensal. Mínimo 12 meses.',
        validade: '2025-01-15',
        dataEnvio: new Date('2025-01-02'),
        dataResposta: null,
        anexos: ['contrato_suporte.pdf'],
      },
      {
        titulo: 'Desenvolvimento App Mobile',
        valor: 175000,
        empresa: 'Beta Systems',
        cliente: 'Julia Mendes',
        status: 'enviada' as const,
        descricao: 'Desenvolvimento de app iOS e Android com backend.',
        condicoes: 'Pagamento por milestones. 4 entregas parciais.',
        validade: '2025-03-30',
        dataEnvio: new Date('2025-02-10'),
        dataResposta: null,
        anexos: ['proposta_app.pdf', 'wireframes.pdf'],
      },
    ];

    let criados = 0;
    for (const data of negotiations) {
      const existe = await this.repo.findOne({ where: { titulo: data.titulo, empresa: data.empresa } });
      if (!existe) {
        await this.repo.save(this.repo.create(data as any));
        criados++;
      }
    }

    if (criados > 0) this.logger.log(`${criados} negociações criadas com sucesso!`);
    else this.logger.log('Negociações do seed já existem.');
  }
}
