import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Negotiation } from "./entities/negotiations.entity";
import { CreateNegotiationDto } from "./dto/create-negotiation.dto";
import type { UpdateNegotiationDto } from "./dto/update-negotiation.dto";
import {
  PaginationDto,
  PaginatedResult,
} from "../../common/dto/pagination.dto";

@Injectable()
export class NegotiationsService {
  constructor(
    @InjectRepository(Negotiation)
    private negotiationsRepository: Repository<Negotiation>,
  ) {}

  async create(createDto: CreateNegotiationDto): Promise<Negotiation> {
    const negotiation = this.negotiationsRepository.create(createDto as any);
    return this.negotiationsRepository.save(negotiation as any);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Negotiation>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "criadoEm",
      sortOrder = "DESC",
    } = paginationDto;

    const queryBuilder =
      this.negotiationsRepository.createQueryBuilder("negotiation");

    if (search) {
      queryBuilder.where(
        "negotiation.titulo ILIKE :search OR negotiation.cliente ILIKE :search OR negotiation.empresa ILIKE :search",
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`negotiation.${sortBy}`, sortOrder)
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

  async findOne(id: string): Promise<Negotiation> {
    const negotiation = await this.negotiationsRepository.findOne({
      where: { id },
    });

    if (!negotiation) {
      throw new NotFoundException("Negociação não encontrada");
    }

    return negotiation;
  }

  async update(
    id: string,
    updateDto: UpdateNegotiationDto,
  ): Promise<Negotiation> {
    const negotiation = await this.findOne(id);
    Object.assign(negotiation, updateDto);
    return this.negotiationsRepository.save(negotiation);
  }

  async remove(id: string): Promise<void> {
    const negotiation = await this.findOne(id);
    await this.negotiationsRepository.remove(negotiation);
  }
}
