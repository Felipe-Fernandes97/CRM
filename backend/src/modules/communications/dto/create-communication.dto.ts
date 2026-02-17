import { IsString, IsOptional, IsIn, MaxLength, IsBoolean, IsNumber } from 'class-validator';

export class CreateCommunicationDto {
  @IsIn(['email', 'whatsapp', 'ligacao', 'anotacao', 'reuniao', 'sms'])
  tipo: 'email' | 'whatsapp' | 'ligacao' | 'anotacao' | 'reuniao' | 'sms';

  @IsOptional()
  @IsIn(['entrada', 'saida'])
  direcao?: 'entrada' | 'saida';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  assunto?: string;

  @IsString()
  conteudo: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  remetente?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  destinatario?: string;

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
  clienteId?: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsString()
  oportunidadeId?: string;

  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  usuario?: string;

  @IsOptional()
  @IsNumber()
  duracao?: number;

  @IsOptional()
  @IsBoolean()
  lido?: boolean;

  @IsOptional()
  @IsIn(['enviado', 'recebido', 'rascunho', 'arquivado', 'lido'])
  status?: 'enviado' | 'recebido' | 'rascunho' | 'arquivado' | 'lido';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  responsavel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contato?: string;

  @IsOptional()
  @IsString()
  resumo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  tags?: string;

  @IsOptional()
  @IsString()
  data?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  duracaoStr?: string;
}
