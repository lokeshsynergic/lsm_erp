import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('md_company_branches')
export class Branch {

  @PrimaryGeneratedColumn()
  branch_id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  branch_name?: string;

  @Column({ type: 'text', nullable: true })
  complete_address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  latitude?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  longitude?: string;

  @Column({ type: 'varchar', length: 100, default: 'B', nullable: false })
  branch_flag?: string;

  @Column({ type: 'integer', nullable: true })
  login_range?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  created_by?: string;

  @Column({ type: 'timestamp with time zone', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
