import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CrmLead } from './leads.entity';

@Entity({ name: 'td_crm_field_visits', schema: 'public' })
export class FieldVisit {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'visit_id' })
  visitId?: number;

  @Column({ type: 'varchar', length: 100, name: 'sales_rep_id' })
  salesRepId?: string;

  @Column({ type: 'integer', name: 'customer_id', nullable: true })
  customerId?: number;

  @Column({ type: 'integer', name: 'lead_id', nullable: true })
  leadId?: number;

  @Column({
    type: 'timestamp with time zone',
    name: 'check_in_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  checkInTime?: Date;

  @Column({ type: 'numeric', precision: 10, scale: 8, name: 'check_in_lat' })
  checkInLat?: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, name: 'check_in_long' })
  checkInLong?: number;

  @Column({ type: 'varchar', length: 50, name: 'visit_purpose' })
  visitPurpose?: string;

  @Column({ type: 'boolean', name: 'is_scheduled', default: false })
  isScheduled?: boolean;

  @Column({ type: 'text', name: 'discussion_notes', nullable: true })
  discussionNotes?: string;

  @Column({ type: 'varchar', length: 50, name: 'visit_outcome' })
  visitOutcome?: string;

  @Column({ type: 'date', name: 'next_followup_date', nullable: true })
  nextFollowupDate?: Date;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'expected_value',
    nullable: true,
  })
  expectedValue?: number;

  @Column({
    type: 'timestamp with time zone',
    name: 'check_out_time',
    nullable: true,
  })
  checkOutTime?: Date;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 8,
    name: 'check_out_lat',
    nullable: true,
  })
  checkOutLat?: number;

  @Column({
    type: 'numeric',
    precision: 11,
    scale: 8,
    name: 'check_out_long',
    nullable: true,
  })
  checkOutLong?: number;

  @Column({ type: 'integer', name: 'duration_minutes', nullable: true })
  durationMinutes?: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt?: Date;

   @Column({ type: 'varchar', length: 255, name: 'visitingCardUrl', nullable: true })
  visitingCardUrl?: string;

  @Column({ type: 'varchar', length: 255, name: 'selfieUrl', nullable: true })
  selfieUrl?: string;

  // Relation: Many Visits belong to one Lead
  @ManyToOne(() => CrmLead, (lead) => lead.fieldVisits, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lead_id' })
  lead?: CrmLead;

  @Column({ type: 'varchar', length: 255, name: 'meet_person_desig', nullable: true })
  meet_person_desig?: string;

  @Column({ type: 'varchar', length: 50, name: 'visit_review_status', nullable: true })
  visitReviewStatus?: string;

  @Column({ type: 'text', name: 'remarks', nullable: true })
  remarks?: string;
}