import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('td_hrms_attendance')
export class EmployeeAttendance {
  @PrimaryGeneratedColumn('identity', {
    type: 'bigint',
    generatedIdentity: 'ALWAYS',
  })
  id: string; // Removed '?' because PK is generated

  @Column({ name: 'empcode', type: 'varchar', length: 50, nullable: false })
  empcode: string; // Removed '?' (Required field)

  @Column({ name: 'indatetime', type: 'timestamp', nullable: false })
  indatetime: Date; // Removed '?' (Required field)

  @Column({
    name: 'in_lat',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  inLat?: number | null; // Added | null

  @Column({
    name: 'in_long',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  inLong?: number | null; // Added | null

  @Column({ name: 'in_address', type: 'text', nullable: true })
  inAddress?: string | null; // Added | null

  @Column({
    name: 'in_picture_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  inPictureUrl?: string | null; // Added | null

  @Column({
    name: 'out_dttime',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  outDttime?: Date | null; // Added | null

  @Column({
    name: 'out_lat',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  outLat?: number | null; // Added | null

  @Column({
    name: 'out_long',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  outLong?: number | null; // Added | null

  @Column({ name: 'out_address', type: 'text', nullable: true })
  outAddress?: string | null; // Added | null

  @Column({
    name: 'out_picture_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  outPictureUrl?: string | null; // Added | null

  @Column({
    name: 'is_out_of_office',
    type: 'smallint',
    default: 0,
  })
  isOutOfOffice?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}