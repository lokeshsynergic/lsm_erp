import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

// 1. Use 'import type' to prevent runtime circular dependency locks
import type { EmployeeDoc } from './employee-doc.entity';

@Entity('md_hrms_employee')
export class Employee {
  @PrimaryGeneratedColumn({
    name: 'emp_id',
    type: 'bigint',
  })
  empId?: number;

  @Column({
    name: 'emp_code',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  empCode?: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
  })
  firstName?: string;

  @Column({
    name: 'middle_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  middleName?: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  lastName?: string;

  @Column({
    name: 'gender',
    type: 'char',
    length: 1,
  })
  gender?: string;

  @Column({
    name: 'date_of_joining',
    type: 'date',
  })
  dateOfJoining?: Date;

  @Column({
    name: 'date_of_birth',
    type: 'date',
  })
  dateOfBirth?: Date;

  @Column({
    name: 'marital_status',
    type: 'char',
    length: 1,
    nullable: true,
  })
  maritalStatus?: string;

  @Column({
    name: 'blood_group',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  bloodGroup?: string;

  @Column({
    name: 'dept_id',
    type: 'bigint',
    nullable: true,
  })
  deptId?: number;

  @Column({
    name: 'desig_id',
    type: 'bigint',
    nullable: true,
  })
  desigId?: number;

  @Column({
    name: 'cat_id',
    type: 'bigint',
    nullable: true,
  })
  catId?: number;

  @Column({
    name: 'job_applicant',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  jobApplicant?: string;

  @Column({
    name: 'confirmation_date',
    type: 'date',
    nullable: true,
  })
  confirmationDate?: Date;

  @Column({
    name: 'notice_period',
    type: 'int',
    nullable: true,
  })
  noticePeriod?: number;

  @Column({
    name: 'offer_date',
    type: 'date',
    nullable: true,
  })
  offerDate?: Date;

  @Column({
    name: 'contract_end_date',
    type: 'date',
    nullable: true,
  })
  contractEndDate?: Date;

  @Column({
    name: 'date_of_retirement',
    type: 'date',
    nullable: true,
  })
  dateOfRetirement?: Date;

  @Column({
    name: 'personal_email',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  personalEmail?: string;

  @Column({
    name: 'mobile_number',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  mobileNumber?: string;

  @Column({
    name: 'mobile_number2',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  mobileNumber2?: string;

  @Column({
    name: 'address_line1',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressLine1?: string;

  @Column({
    name: 'address_line2',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressLine2?: string;

  @Column({
    name: 'landmark_location',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  landmarkLocation?: string;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city?: string;

  @Column({
    name: 'pin',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  pin?: string;

  @Column({
    name: 'state_province',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  stateProvince?: string;

  @Column({
    name: 'bank_name',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  bankName?: string;

  @Column({
    name: 'bank_account_no',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bankAccountNo?: string;

  @Column({
    name: 'ifsc_code',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  ifscCode?: string;

  @Column({
    name: 'ctc',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  ctc?: number;

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: 'A',
  })
  status?: string;

  @Column({
    name: 'created_by',
    type: 'varchar',
    nullable: true,
  })
  createdBy?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    nullable: true,
  })
  updatedBy?: string;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;

  @Column({
    name: 'branch_id',
    type: 'integer',
    default: 1,
  })
  branchId?: number;

  // 2. Explicitly type doc as EmployeeDoc inside the callback
  @OneToMany('EmployeeDoc', (doc: EmployeeDoc) => doc.employee, {
    cascade: true,
  })
  documents?: EmployeeDoc[];
}