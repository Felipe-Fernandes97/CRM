import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesSeedService implements OnModuleInit {
  private readonly logger = new Logger(CompaniesSeedService.name);

  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const empresas = [
      { razaoSocial: 'Tech Solutions Ltda', nomeFantasia: 'Tech Solutions', segmento: 'Tecnologia', funcionarios: 80 },
      { razaoSocial: 'Global Imports Comércio Ltda', nomeFantasia: 'Global Imports', segmento: 'Importação', funcionarios: 45 },
      { razaoSocial: 'ABC Corp S.A.', nomeFantasia: 'ABC Corp', segmento: 'Indústria', funcionarios: 320 },
      { razaoSocial: 'Omega Services Ltda', nomeFantasia: 'Omega Services', segmento: 'Serviços', funcionarios: 60 },
      { razaoSocial: 'Nova Tech Sistemas Ltda', nomeFantasia: 'Nova Tech', segmento: 'Tecnologia', funcionarios: 35 },
      { razaoSocial: 'Beta Systems S.A.', nomeFantasia: 'Beta Systems', segmento: 'Tecnologia', funcionarios: 150 },
      { razaoSocial: 'DataFlow Soluções Ltda', nomeFantasia: 'DataFlow', segmento: 'Tecnologia', funcionarios: 50 },
      { razaoSocial: 'Inovatech Desenvolvimento Ltda', nomeFantasia: 'Inovatech', segmento: 'Tecnologia', funcionarios: 25 },
      { razaoSocial: 'Smart Digital Ltda', nomeFantasia: 'Smart Digital', segmento: 'Marketing Digital', funcionarios: 40 },
      { razaoSocial: 'Construmax Engenharia S.A.', nomeFantasia: 'Construmax', segmento: 'Construção Civil', funcionarios: 500 },
    ];

    let criadas = 0;
    for (const data of empresas) {
      const existe = await this.repo.findOne({ where: { nomeFantasia: data.nomeFantasia } });
      if (!existe) {
        await this.repo.save(this.repo.create({ ...data, ativo: true }));
        criadas++;
      }
    }

    if (criadas > 0) this.logger.log(`${criadas} empresas criadas com sucesso!`);
    else this.logger.log('Empresas do seed já existem.');
  }
}
