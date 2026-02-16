import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Communication } from './entities/communication.entity';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import type { UpdateCommunicationDto } from './dto/update-communication.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectRepository(Communication)
    private communicationsRepository: Repository<Communication>,
  ) {}

  async create(createDto: CreateCommunicationDto): Promise<Communication> {
    const communication = this.communicationsRepository.create(createDto as any);
    return this.communicationsRepository.save(communication as any);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Communication>> {
    const { page = 1, limit = 10, search, sortBy = 'criadoEm', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.communicationsRepository.createQueryBuilder('communication');

    if (search) {
      queryBuilder.where(
        'communication.assunto ILIKE :search OR communication.conteudo ILIKE :search OR communication.cliente ILIKE :search OR communication.empresa ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`communication.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Communication> {
    const communication = await this.communicationsRepository.findOne({
      where: { id },
    });

    if (!communication) {
      throw new NotFoundException('Comunicação não encontrada');
    }

    return communication;
  }

  async update(id: string, updateDto: UpdateCommunicationDto): Promise<Communication> {
    const communication = await this.findOne(id);
    Object.assign(communication, updateDto);
    return this.communicationsRepository.save(communication);
  }

  async remove(id: string): Promise<void> {
    const communication = await this.findOne(id);
    await this.communicationsRepository.remove(communication);
  }
}
