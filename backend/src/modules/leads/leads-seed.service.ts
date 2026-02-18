import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';

@Injectable()
export class LeadsSeedService implements OnModuleInit {
  private readonly logger = new Logger(LeadsSeedService.name);

  constructor(
    @InjectRepository(Lead)
    private repo: Repository<Lead>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const leads = [
      {
        nome: 'João Silva',
        email: 'joao.silva@techsolutions.com.br',
        telefone: '(11) 98765-4321',
        cargo: 'Diretor de TI',
        status: 'qualificado' as const,
        origem: 'Indicação',
        observacoes: 'Interessado em implantação de ERP. Proposta comercial enviada.',
        pontuacao: 85,
      },
      {
        nome: 'Carlos Lima',
        email: 'carlos.lima@globalimports.com.br',
        telefone: '(21) 97654-3210',
        cargo: 'Gerente de Operações',
        status: 'em_contato' as const,
        origem: 'Site',
        observacoes: 'Dúvidas sobre modelo de licenciamento. Aguardando retorno.',
        pontuacao: 60,
      },
      {
        nome: 'Maria Santos',
        email: 'maria.santos@abccorp.com.br',
        telefone: '(31) 96543-2109',
        cargo: 'Diretora de Operações',
        status: 'qualificado' as const,
        origem: 'Demo',
        observacoes: 'Demonstração realizada. Pediu reunião com diretor de TI.',
        pontuacao: 75,
      },
      {
        nome: 'Pedro Rocha',
        email: 'pedro.rocha@omegaservices.com.br',
        telefone: '(41) 95432-1098',
        cargo: 'CEO',
        status: 'qualificado' as const,
        origem: 'Evento',
        observacoes: 'Reunião técnica realizada. Orçamento aprovado até R$ 150.000.',
        pontuacao: 90,
      },
      {
        nome: 'Julia Mendes',
        email: 'julia.mendes@betasystems.com.br',
        telefone: '(51) 94321-0987',
        cargo: 'CTO',
        status: 'em_contato' as const,
        origem: 'LinkedIn',
        observacoes: 'Visita técnica agendada para levantamento de requisitos.',
        pontuacao: 70,
      },
      {
        nome: 'Lucas Mendes',
        email: 'lucas.mendes@dataflow.com.br',
        telefone: '(61) 93210-9876',
        cargo: 'Gerente de TI',
        status: 'novo' as const,
        origem: 'Webinar',
        observacoes: 'Primeiro contato via webinar. Interesse em migração cloud.',
        pontuacao: 50,
      },
      {
        nome: 'Fernanda Alves',
        email: 'fernanda.alves@inovatech.com.br',
        telefone: '(71) 92109-8765',
        cargo: 'Diretora Comercial',
        status: 'novo' as const,
        origem: 'Prospecção',
        observacoes: 'Novo prospect. E-mail de apresentação em elaboração.',
        pontuacao: 30,
      },
    ];

    let criados = 0;
    for (const data of leads) {
      const existe = await this.repo.findOne({ where: { email: data.email } });
      if (!existe) {
        await this.repo.save(this.repo.create(data));
        criados++;
      }
    }

    if (criados > 0) this.logger.log(`${criados} leads criados com sucesso!`);
    else this.logger.log('Leads do seed já existem.');
  }
}
