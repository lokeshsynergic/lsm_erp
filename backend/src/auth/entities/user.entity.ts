import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('td_user')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  user_id?: string;

  @Column({ type: 'varchar', length: 255 })
  password?: string;

  @Column({ type: 'char', length: 1 })
  usertype?: string;

  @Column({ type: 'char', length: 1, default: 'A' })
  user_status?: string;

  @Column({ type: 'varchar', length: 55, default: 'NULL', nullable: true })
  device_id?: string;

  @Column({ type: 'char', length: 1, default: 'W' })
  usermode?: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @Column({ type: 'boolean', default: false })
  is_approved?: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  approved_by?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  approved_at?: Date;

  @Column({ type: 'text', nullable: true })
  rejection_reason?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at?: Date;
}
