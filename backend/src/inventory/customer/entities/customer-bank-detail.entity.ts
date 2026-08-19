import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('md_invt_customer_bank_details')
export class CustomerBankDetail {
  @PrimaryGeneratedColumn({ name: 'bank_account_id' })
  bank_account_id?: number;

  @Column({ type: 'int' })
  customer_id?: number;

  @Column({ type: 'varchar', length: 150 })
  bank_name?: string;

  @Column({ type: 'varchar', length: 50 })
  account_number?: string;

  @Column({ type: 'varchar', length: 11 })
  ifsc_code?: string;

  @Column({ type: 'varchar', length: 150 })
  account_holder_name?: string;

  @Column({ type: 'boolean', default: false })
  is_primary?: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @ManyToOne(() => Customer, (customer) => customer.bank_details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;
}
