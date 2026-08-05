import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('md_hrms_designation')
export class Designation {
  @PrimaryGeneratedColumn()
  desig_id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  designation_name?: string;
}
