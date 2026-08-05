import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('md_hrms_category')
export class Category {
  @PrimaryGeneratedColumn()
  cat_id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  category_name?: string;
}
