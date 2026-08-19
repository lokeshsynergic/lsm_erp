import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerBankDetail } from './customer-bank-detail.entity';
import { CustomerDocument } from './customer-document.entity';

@Entity('md_invt_customers')
export class Customer {
  @PrimaryGeneratedColumn({ name: 'customer_id' })
  customer_id?: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  customer_code?: string;

  @Column({ type: 'varchar', length: 255 })
  customer_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  trade_name?: string;

  @Column({ type: 'varchar', length: 50 })
  customer_type?: string;

  @Column({ type: 'varchar', length: 50 })
  customer_category?: string;

  @Column({ type: 'varchar', length: 150 })
  primary_contact_name?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  primary_contact_designation?: string;

  @Column({ type: 'varchar', length: 20 })
  primary_mobile?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  alternate_phone?: string;

  @Column({ type: 'varchar', length: 150 })
  primary_email?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  alternate_email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  whatsapp_number?: string;

  @Column({ type: 'varchar', length: 255 })
  billing_address_line1?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  billing_address_line2?: string;

  @Column({ type: 'varchar', length: 100 })
  billing_city?: string;

  @Column({ type: 'varchar', length: 100 })
  billing_state?: string;

  @Column({ type: 'varchar', length: 15 })
  billing_pincode?: string;

  @Column({ type: 'varchar', length: 100, default: 'India' })
  billing_country?: string;

  @Column({ type: 'boolean', default: true })
  is_shipping_same_as_billing?: boolean;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  gstin?: string;

  @Column({ type: 'char', length: 10, unique: true, nullable: true })
  pan?: string;

  @Column({ type: 'char', length: 10, nullable: true })
  tan?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  license_no?: string;

  @Column({ type: 'varchar', length: 50 })
  account_owner_employee_id?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lead_source_id?: string;

  @Column({ type: 'date', nullable: true })
  customer_since?: Date;

  @Column({ type: 'varchar', length: 50, default: 'Standard' })
  account_tier?: string;

  @Column({ type: 'varchar', length: 50, default: 'Active' })
  relationship_status?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @OneToMany(() => CustomerBankDetail, (bankDetail) => bankDetail.customer, {
    cascade: true,
  })
  bank_details?: CustomerBankDetail[];

  @OneToMany(() => CustomerDocument, (document) => document.customer, {
    cascade: true,
  })
  documents?: CustomerDocument[];
}
