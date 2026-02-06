import { IsString, IsOptional, IsIn, MaxLength, IsDateString } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @MaxLength(200)
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsIn(['ligacao', 'reuniao', 'follow_up', 'email', 'tarefa', 'visita'])
  tipo?: 'ligacao' | 'reuniao' | 'follow_up' | 'email' | 'tarefa' | 'visita';

  @IsOptional()
  @IsIn(['pendente', 'em_andamento', 'concluida', 'cancelada', 'atrasada'])
  status?: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada' | 'atrasada';

  @IsOptional()
  @IsIn(['baixa', 'media', 'alta', 'urgente'])
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente';

  @IsDateString()
  dataInicio: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  responsavel?: string;

  @IsOptional()
  @IsString()
  responsavelId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cliente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  empresa?: string;

  @IsOptional()
  @IsString()
  oportunidadeId?: string;

  @IsOptional()
  @IsString()
  negociacaoId?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
