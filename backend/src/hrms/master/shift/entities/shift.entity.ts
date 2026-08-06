import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('md_hrms_shift')
export class Shift {
  @PrimaryGeneratedColumn({
    name: 'shift_code',
    type: 'bigint',
  })
  shiftCode?: number;

  @Column({
    name: 'shift_name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  shiftName?: string;

  @Column({
    name: 'start_time',
    type: 'time',
  })
  startTime?: string;

  @Column({
    name: 'end_time',
    type: 'time',
  })
  endTime?: string;

  @Column({
    name: 'grace_in_time',
    type: 'int',
    default: 0,
  })
  graceInTime?: number;

  @Column({
    name: 'grace_out_time',
    type: 'int',
    default: 0,
  })
  graceOutTime?: number;

  @Column({
    name: 'minimum_working_hours',
    type: 'numeric',
    precision: 4,
    scale: 2,
    default: 8.0,
  })
  minimumWorkingHours?: number;

  @Column({
    name: 'maximum_shift_hours',
    type: 'numeric',
    precision: 5,
    scale: 2,
  })
  maximumShiftHours?: number;

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: 'A',
  })
  status?: string;

  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true,
  })
  createdBy?: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt?: Date;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
  })
  updatedBy?: number;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Date;
}