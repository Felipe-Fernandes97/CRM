import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = 'admin@crm.com';

    const existingAdmin = await this.usersRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      this.logger.log('Admin já existe, seed ignorado.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = this.usersRepository.create({
      nome: 'Administrador',
      email: adminEmail,
      senha: hashedPassword,
      cargo: 'admin',
      ativo: true,
    });

    await this.usersRepository.save(admin);
    this.logger.log('Usuário admin criado com sucesso!');
  }
}
