import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('td_crm_service_call')
export class ServiceCall {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  call_no?: string;

  @Column({ type: 'date', nullable: false })
  call_date?: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customer?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  department?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contact_person?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobile?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  engineer?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  equipment_name?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  make?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  model?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  serial_no?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  asset_id?: string;

  @Column({ type: 'text', nullable: true })
  complaint_reported?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  service_type?: string;

  @Column({ type: 'text', nullable: true })
  action_taken?: string;

  @Column({ type: 'text', nullable: true })
  spare_parts?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  equipment_status?: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @Column({ type: 'varchar', length: 30, nullable: true })
  coverage_mode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  priority?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  vendor_name?: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  service_provider_type?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  service_close_dttime?: Date;
}
