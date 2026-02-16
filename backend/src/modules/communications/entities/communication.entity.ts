import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CommunicationType = 'email' | 'whatsapp' | 'ligacao' | 'anotacao' | 'reuniao' | 'sms';
export type CommunicationDirection = 'entrada' | 'saida';

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

  @Column({ type: 'int', nullable: true })
  duracao: number;

  @Column({ type: 'simple-array', nullable: true })
  anexos: string[];

  @Column({ default: false })
  lido: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
