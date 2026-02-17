import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CommunicationType = 'email' | 'whatsapp' | 'ligacao' | 'anotacao' | 'reuniao' | 'sms';
export type CommunicationDirection = 'entrada' | 'saida';
export type CommunicationStatus = 'enviado' | 'recebido' | 'rascunho' | 'arquivado' | 'lido';

@Entity('comunicacoes')
export class Communication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['email', 'whatsapp', 'ligacao', 'anotacao', 'reuniao', 'sms'],
    default: 'anotacao',
  })
  tipo: CommunicationType;

  @Column({
    type: 'enum',
    enum: ['entrada', 'saida'],
    default: 'saida',
  })
  direcao: CommunicationDirection;

  @Column({ length: 200, nullable: true })
  assunto: string;

  @Column({ type: 'text' })
  conteudo: string;

  @Column({ length: 200, nullable: true })
  remetente: string;

  @Column({ length: 200, nullable: true })
  destinatario: string;

  @Column({ length: 200, nullable: true })
  cliente: string;

  @Column({ length: 200, nullable: true })
  empresa: string;

  @Column({ name: 'cliente_id', type: 'uuid', nullable: true })
  clienteId: string;

  @Column({ name: 'lead_id', type: 'uuid', nullable: true })
  leadId: string;

  @Column({ name: 'oportunidade_id', type: 'uuid', nullable: true })
  oportunidadeId: string;

  @Column({ name: 'usuario_id', type: 'uuid', nullable: true })
  usuarioId: string;

  @Column({ length: 200, nullable: true })
  usuario: string;

  @Column({ length: 200, nullable: true })
  responsavel: string;

  @Column({ length: 200, nullable: true })
  contato: string;

  @Column({ type: 'text', nullable: true })
  resumo: string;

  @Column({ type: 'int', nullable: true })
  duracao: number;

  @Column({ length: 20, nullable: true, name: 'duracao_str' })
  duracaoStr: string;

  @Column({ type: 'simple-array', nullable: true })
  anexos: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  numAnexos: number;

  @Column({ default: false })
  lido: boolean;

  @Column({
    type: 'enum',
    enum: ['enviado', 'recebido', 'rascunho', 'arquivado', 'lido'],
    nullable: true,
    default: null,
  })
  status: CommunicationStatus | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
