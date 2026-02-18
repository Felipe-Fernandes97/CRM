import { IsString, IsOptional, IsNumber, MaxLength, IsDateString, IsIn, Min, Max } from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  @MaxLength(200)
  nome: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  empresa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contato?: string;

  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probabilidade?: number;

  @IsOptional()
  @IsDateString()
  dataFechamento?: string;

  @IsOptional()
  @IsIn(['contato', 'qualificacao', 'proposta', 'negociacao', 'fechamento'])
  etapa?: string;
}
