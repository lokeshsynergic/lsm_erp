import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('md_hrms_department')
export class Department {
  @PrimaryGeneratedColumn()
  dept_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  department_name?: string;
}
