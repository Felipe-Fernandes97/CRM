import { IsString, IsOptional, IsNumber, IsIn, MaxLength, IsArray } from 'class-validator';

export class CreateNegotiationDto {
  @IsString()
  @MaxLength(200)
  titulo: string;

  @IsNumber()
  valor: number;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  condicoes?: string;

  @IsOptional()
  @IsIn(['rascunho', 'enviada', 'aceita', 'recusada', 'expirada'])
  status?: 'rascunho' | 'enviada' | 'aceita' | 'recusada' | 'expirada';

  @IsOptional()
  @IsString()
  validade?: string;

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
  responsavelId?: string;

  @IsOptional()
  @IsString()
  oportunidadeId?: string;

  @IsOptional()
  @IsArray()
  anexos?: string[];
}
