import { IsString, IsOptional, IsBoolean, IsUUID, IsArray, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsUUID()
  liderId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  membrosIds?: string[];

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
