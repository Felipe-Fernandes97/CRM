import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import type { UpdateActivityDto } from './dto/update-activity.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
  ) {}

  async create(createDto: CreateActivityDto): Promise<Activity> {
    const activity = this.activitiesRepository.create(createDto as any);
    return this.activitiesRepository.save(activity as any);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Activity>> {
    const { page = 1, limit = 10, search, sortBy = 'dataInicio', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.activitiesRepository.createQueryBuilder('activity');

    if (search) {
      queryBuilder.where(
        'activity.titulo ILIKE :search OR activity.responsavel ILIKE :search OR activity.cliente ILIKE :search OR activity.empresa ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`activity.${sortBy}`, sortOrder)
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

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada');
    }

    return activity;
  }

  async update(id: string, updateDto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.findOne(id);
    Object.assign(activity, updateDto);
    return this.activitiesRepository.save(activity);
  }

  async remove(id: string): Promise<void> {
    const activity = await this.findOne(id);
    await this.activitiesRepository.remove(activity);
  }
}
