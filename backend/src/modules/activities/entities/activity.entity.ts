import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ActivityType = 'ligacao' | 'reuniao' | 'follow_up' | 'email' | 'tarefa' | 'visita';
export type ActivityStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada' | 'atrasada';
export type ActivityPriority = 'baixa' | 'media' | 'alta' | 'urgente';

@Entity('atividades')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: ['ligacao', 'reuniao', 'follow_up', 'email', 'tarefa', 'visita'],
    default: 'tarefa',
  })
  tipo: ActivityType;

  @Column({
    type: 'enum',
    enum: ['pendente', 'em_andamento', 'concluida', 'cancelada', 'atrasada'],
    default: 'pendente',
  })
  status: ActivityStatus;

  @Column({
    type: 'enum',
    enum: ['baixa', 'media', 'alta', 'urgente'],
    default: 'media',
  })
  prioridade: ActivityPriority;

  @Column({ name: 'data_inicio', type: 'timestamp' })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'timestamp', nullable: true })
  dataFim: Date;

  @Column({ name: 'data_conclusao', type: 'timestamp', nullable: true })
  dataConclusao: Date;

  @Column({ length: 200, nullable: true })
  responsavel: string;

  @Column({ name: 'responsavel_id', type: 'uuid', nullable: true })
  responsavelId: string;

  @Column({ length: 200, nullable: true })
  cliente: string;

  @Column({ length: 200, nullable: true })
  empresa: string;

  @Column({ name: 'oportunidade_id', type: 'uuid', nullable: true })
  oportunidadeId: string;

  @Column({ name: 'negociacao_id', type: 'uuid', nullable: true })
  negociacaoId: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
