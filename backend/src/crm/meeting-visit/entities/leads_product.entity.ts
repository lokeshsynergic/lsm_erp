import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'td_crm_lead_products', schema: 'public' })
export class CrmProductLead {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id?: number;
  @Column({ type: 'integer', name: 'lead_id' })
  leadId?: number;

  @Column({ type: 'integer', name: 'product_id' })
  productId?: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt?: Date;
}