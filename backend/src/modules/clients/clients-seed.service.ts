import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsSeedService implements OnModuleInit {
  private readonly logger = new Logger(ClientsSeedService.name);

  constructor(
    @InjectRepository(Client)
    private repo: Repository<Client>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const clientes = [
      {
        nome: 'Rafael Souza',
        email: 'rafael.souza@novatech.com.br',
        telefone: '(11) 91234-5678',
        cargo: 'Diretor de Compras',
        departamento: 'Compras',
        ativo: true,
        observacoes: 'Proposta aceita com desconto de 8%. Contrato em assinatura.',
      },
      {
        nome: 'Ana Costa',
        email: 'ana.costa@smartdigital.com.br',
        telefone: '(21) 92345-6789',
        cargo: 'Gerente de Marketing',
        departamento: 'Marketing',
        ativo: true,
        observacoes: 'Cliente ativo. NPS 9/10. Elogiou atendimento do suporte.',
      },
      {
        nome: 'Roberto Almeida',
        email: 'roberto.almeida@construmax.com.br',
        telefone: '(31) 93456-7890',
        cargo: 'Diretor de Operações',
        departamento: 'Operações',
        ativo: true,
        observacoes: 'Renovação de contrato em negociação. Interesse em upgrade Enterprise.',
      },
    ];

    let criados = 0;
    for (const data of clientes) {
      const existe = await this.repo.findOne({ where: { email: data.email } });
      if (!existe) {
        await this.repo.save(this.repo.create(data));
        criados++;
      }
    }

    if (criados > 0) this.logger.log(`${criados} clientes criados com sucesso!`);
    else this.logger.log('Clientes do seed já existem.');
  }
}
