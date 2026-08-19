import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

export enum CustomerDocumentType {
  GST = 'GST',
  PAN = 'PAN',
  TAN = 'TAN',
  License = 'License',
  Other = 'Other',
}

@Entity('md_invt_customer_documents')
export class CustomerDocument {
  @PrimaryGeneratedColumn({ name: 'document_id' })
  document_id?: number;

  @Column({ type: 'int' })
  customer_id?: number;

  @Column({
    type: 'enum',
    enum: CustomerDocumentType,
    enumName: 'document_type_enum',
  })
  document_type?: CustomerDocumentType;

  @Column({ type: 'varchar', length: 255 })
  document_name?: string;

  @Column({ type: 'text' })
  document_url?: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at?: Date;

  @ManyToOne(() => Customer, (customer) => customer.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;
}
