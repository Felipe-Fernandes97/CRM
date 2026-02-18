import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import type { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunitiesRepository: Repository<Opportunity>,
  ) {}

  async create(createDto: CreateOpportunityDto): Promise<Opportunity> {
    const opportunity = this.opportunitiesRepository.create(createDto as any);
    return this.opportunitiesRepository.save(opportunity as any);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Opportunity>> {
    const { page = 1, limit = 10, search, sortBy = 'criadoEm', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.opportunitiesRepository.createQueryBuilder('opportunity');

    if (search) {
      queryBuilder.where(
        'opportunity.nome ILIKE :search OR opportunity.empresa ILIKE :search OR opportunity.contato ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`opportunity.${sortBy}`, sortOrder)
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

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunitiesRepository.findOne({ where: { id } });
    if (!opportunity) {
      throw new NotFoundException('Oportunidade não encontrada');
    }
    return opportunity;
  }

  async update(id: string, updateDto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunity = await this.findOne(id);
    Object.assign(opportunity, updateDto);
    return this.opportunitiesRepository.save(opportunity);
  }

  async remove(id: string): Promise<void> {
    const opportunity = await this.findOne(id);
    await this.opportunitiesRepository.remove(opportunity);
  }
}
