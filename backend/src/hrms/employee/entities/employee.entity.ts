import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('md_hrms_employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  emp_code: string;

  @Column({ type: 'varchar', length: 100 })
  emp_name: string;

  @Column({ type: 'int', nullable: true })
  catg_id: number;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'date', nullable: true })
  join_dt: Date;

  @Column({ type: 'date', nullable: true })
  ret_dt: Date;

  @Column({ type: 'int', nullable: true })
  desig_id: number;

  @Column({ type: 'int', nullable: true })
  dept_id: number;

  @Column({ type: 'char', length: 1, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  phone_no: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pan_no: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  aadhar_no: string;

  @Column({ type: 'text', nullable: true })
  emp_addr: string;

  @Column({ type: 'int', nullable: true })
  pin_no: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bank_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bank_ac_no: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ifsc: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pf_ac_no: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  UAN: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.0 })
  basic_pay: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0 })
  target: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0 })
  half_yearly: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.0 })
  yearly: number;

  @Column({ type: 'char', length: 1, default: 'A' })
  emp_status: string;

  @Column({ type: 'smallint', default: 1 })
  salary_status: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remarks: string;

  @Column({ type: 'int', nullable: true })
  amount: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  created_dt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  modified_by: string;

  @Column({ type: 'timestamp', nullable: true })
  modified_dt: Date;
}
