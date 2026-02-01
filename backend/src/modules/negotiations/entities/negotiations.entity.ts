import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type NegotiationStatus = 'rascunho' | 'enviada' | 'aceita' | 'recusada' | 'expirada';

@Entity('negociacoes')
export class Negotiation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  valor: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  condicoes: string;

  @Column({
    type: 'enum',
    enum: ['rascunho', 'enviada', 'aceita', 'recusada', 'expirada'],
    default: 'rascunho',
  })
  status: NegotiationStatus;

  @Column({ type: 'date', nullable: true })
  validade: string;

  @Column({ name: 'data_envio', type: 'timestamp', nullable: true })
  dataEnvio: Date;

  @Column({ name: 'data_resposta', type: 'timestamp', nullable: true })
  dataResposta: Date;

  @Column({ length: 200, nullable: true })
  cliente: string;

  @Column({ length: 200, nullable: true })
  empresa: string;

  @Column({ name: 'responsavel_id', type: 'uuid', nullable: true })
  responsavelId: string;

  @Column({ name: 'oportunidade_id', type: 'uuid', nullable: true })
  oportunidadeId: string;

  @Column({ type: 'simple-array', nullable: true })
  anexos: string[];

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
