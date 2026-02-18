import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type OpportunityStage = 'contato' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento';

@Entity('oportunidades')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  nome: string;

  @Column({ length: 200, nullable: true })
  empresa: string;

  @Column({ length: 200, nullable: true })
  contato: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  valor: number;

  @Column({ type: 'int', default: 0 })
  probabilidade: number;

  @Column({ name: 'data_fechamento', type: 'date', nullable: true })
  dataFechamento: string;

  @Column({ length: 50, default: 'contato' })
  etapa: OpportunityStage;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
