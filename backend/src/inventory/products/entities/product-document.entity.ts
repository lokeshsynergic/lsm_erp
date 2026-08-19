import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('md_invt_product_documents')
export class ProductDocument {
  @PrimaryGeneratedColumn()
  document_id?: number;

  @Column({ type: 'bigint', nullable: false })
  product_id?: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  document_name?: string;

  @Column({ type: 'text', nullable: false })
  document_url?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at?: Date;

  @ManyToOne(() => Product, 'documents', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product?: Product;
}
