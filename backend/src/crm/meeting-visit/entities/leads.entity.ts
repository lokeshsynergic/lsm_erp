import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { FieldVisit } from './field_visits.entity';

@Entity({ name: 'td_crm_leads', schema: 'public' })
export class CrmLead {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'lead_id' })
  leadId?: number;

  @Column({ type: 'varchar', length: 150, name: 'company_name' })
  companyName?: string;

  @Column({ type: 'varchar', length: 100, name: 'contact_person' })
  contactPerson?: string;

  @Column({ type: 'varchar', length: 20 })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'lead_source',
    default: 'Field Visit',
  })
  leadSource?: string;

  @Column({ type: 'varchar', length: 100, name: 'created_by', nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt?: Date;

  // Relation: One Lead can have many Field Visits
  @OneToMany(() => FieldVisit, (visit) => visit.lead)
  fieldVisits?: FieldVisit[];
}