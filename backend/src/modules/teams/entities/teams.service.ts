import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './team.entity';
import { CreateTeamDto } from '../dto/create-teams.dto';
import { UpdateTeamDto } from '../dto/update-teams.dto';
import { User } from '../../users/entities/user.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { membrosIds, ...teamData } = createTeamDto;

    const team = this.teamsRepository.create(teamData);

    if (membrosIds && membrosIds.length > 0) {
      team.membros = await this.usersRepository.findBy({ id: In(membrosIds) });
    }

    return this.teamsRepository.save(team);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Team>> {
    const { page = 1, limit = 10, search, sortBy = 'criadoEm', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.teamsRepository.createQueryBuilder('team')
      .leftJoinAndSelect('team.lider', 'lider')
      .leftJoinAndSelect('team.membros', 'membros');

    if (search) {
      queryBuilder.where(
        'team.nome ILIKE :search OR team.descricao ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`team.${sortBy}`, sortOrder)
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

  async findOne(id: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['lider', 'membros'],
    });

    if (!team) {
      throw new NotFoundException('Equipe não encontrada');
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    const { membrosIds, ...teamData } = updateTeamDto;

    Object.assign(team, teamData);

    if (membrosIds !== undefined) {
      team.membros = membrosIds.length > 0
        ? await this.usersRepository.findBy({ id: In(membrosIds) })
        : [];
    }

    return this.teamsRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamsRepository.remove(team);
  }

  async addMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.findOne(teamId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!team.membros.find((m) => m.id === userId)) {
      team.membros.push(user);
      await this.teamsRepository.save(team);
    }

    return team;
  }

  async removeMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.findOne(teamId);
    team.membros = team.membros.filter((m) => m.id !== userId);
    return this.teamsRepository.save(team);
  }
}
