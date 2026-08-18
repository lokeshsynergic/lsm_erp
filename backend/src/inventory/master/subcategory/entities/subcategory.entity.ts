import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('md_invt_subcategory')
export class Subcategory {
  @PrimaryGeneratedColumn()
  subcategory_id?: number;

  @Column({ type: 'int', nullable: false })
  category_id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  subcategory_name?: string;

  @Column({ type: 'char', length: 1, default: 'A' })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
