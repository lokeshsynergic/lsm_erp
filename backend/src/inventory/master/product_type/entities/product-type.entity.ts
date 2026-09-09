import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('md_invt_product_type')
export class ProductType {
  @PrimaryGeneratedColumn({ name: 'prod_type_id' })
  prodTypeId: number;

  @Column({ name: 'prod_type_name', type: 'varchar', length: 150 })
  prodTypeName: string;

  @Column({ type: 'char', length: 1, default: 'A' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
 
}