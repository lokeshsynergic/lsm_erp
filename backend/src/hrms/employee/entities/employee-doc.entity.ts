import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('md_hrms_employee_doc')
export class EmployeeDoc {
  @PrimaryGeneratedColumn({
    name: 'empdoc_id',
    type: 'bigint',
  })
  empDocId?: number;

  @Column({
    name: 'emp_code',
    type: 'varchar',
    length: 20,
  })
  empCode?: string;

  @Column({
    name: 'doc_id',
    type: 'bigint',
  })
  docId?: number;

  @Column({
    name: 'document_no',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  documentNo?: string;

  @Column({
    name: 'document_path',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  documentPath?: string;


  @ManyToOne(() => Employee, (employee) => employee.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'emp_code',
    referencedColumnName: 'empCode',
  })
  employee?: Employee;
}