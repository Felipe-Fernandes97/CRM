import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from './entities/opportunity.entity';

@Injectable()
export class OpportunitiesSeedService implements OnModuleInit {
  private readonly logger = new Logger(OpportunitiesSeedService.name);

  constructor(
    @InjectRepository(Opportunity)
    private repo: Repository<Opportunity>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const oportunidades = [
      { nome: 'Implantação ERP', empresa: 'Tech Solutions', contato: 'João Silva', valor: 45000, probabilidade: 20, dataFechamento: '2025-03-15', etapa: 'contato' as const },
      { nome: 'Consultoria TI', empresa: 'ABC Corp', contato: 'Maria Santos', valor: 18500, probabilidade: 30, dataFechamento: '2025-02-28', etapa: 'contato' as const },
      { nome: 'Migração Cloud', empresa: 'DataFlow', contato: 'Lucas Mendes', valor: 32000, probabilidade: 15, dataFechamento: '2025-04-10', etapa: 'contato' as const },
      { nome: 'Licenças SaaS', empresa: 'Global Imports', contato: 'Carlos Lima', valor: 67000, probabilidade: 45, dataFechamento: '2025-02-20', etapa: 'qualificacao' as const },
      { nome: 'Suporte Premium', empresa: 'Smart Digital', contato: 'Ana Costa', valor: 24000, probabilidade: 50, dataFechamento: '2025-03-05', etapa: 'qualificacao' as const },
      { nome: 'Automação Industrial', empresa: 'Omega Services', contato: 'Pedro Rocha', valor: 120000, probabilidade: 65, dataFechamento: '2025-02-10', etapa: 'proposta' as const },
      { nome: 'Infraestrutura Rede', empresa: 'Beta Systems', contato: 'Julia Mendes', valor: 53000, probabilidade: 70, dataFechamento: '2025-02-18', etapa: 'proposta' as const },
      { nome: 'Plataforma E-commerce', empresa: 'Nova Tech', contato: 'Rafael Souza', valor: 89000, probabilidade: 80, dataFechamento: '2025-02-05', etapa: 'negociacao' as const },
      { nome: 'Sistema CRM', empresa: 'Inovatech', contato: 'Fernanda Alves', valor: 75000, probabilidade: 95, dataFechamento: '2025-01-30', etapa: 'fechamento' as const },
    ];

    let criadas = 0;
    for (const data of oportunidades) {
      const existe = await this.repo.findOne({ where: { nome: data.nome, empresa: data.empresa } });
      if (!existe) {
        await this.repo.save(this.repo.create(data as any));
        criadas++;
      }
    }

    if (criadas > 0) this.logger.log(`${criadas} oportunidades criadas com sucesso!`);
    else this.logger.log('Oportunidades do seed já existem.');
  }
}
