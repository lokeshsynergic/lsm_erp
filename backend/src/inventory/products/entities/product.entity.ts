import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductDocument } from './product-document.entity';

@Entity({ name: 'md_invt_products' })
export class Product {

  @PrimaryGeneratedColumn({
    name: 'product_id',
    type: 'bigint'
  })
  productId?: bigint;

  @Column({
    name: 'product_code',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  productCode?: string;

  @Column({
    name: 'product_name',
    type: 'varchar',
    length: 255,
  })
  productName?: string;

  @Column({
    name: 'short_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  shortName?: string;

  @Column({
    name: 'category_id',
    type: 'int',
  })
  categoryId?: number;

  @Column({
    name: 'sub_category_id',
    type: 'int',
    nullable: true,
  })
  subCategoryId?: number;

  @Column({
    name: 'manufacturer_id',
    type: 'int',
    nullable: true,
  })
  manufacturerId?: number;

  @Column({
    name: 'unit_id',
    type: 'int',
  })
  unitId?: number;

  @Column({
    name: 'model_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  modelNumber?: string;

  @Column({
    name: 'barcode_ean_upc',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  barcodeEanUpc?: string;

  @Column({
    name: 'qr_code_ref',
    type: 'text',
    nullable: true,
  })
  qrCodeRef?: string;

  @Column({
    name: 'product_type',
    type: 'varchar',
    length: 50,
    default: 'Finished Good',
  })
  productType?: string;

  @Column({
    name: 'is_asset_eligible',
    type: 'boolean',
    default: false,
  })
  isAssetEligible?: boolean;

  @Column({
    name: 'is_sellable',
    type: 'boolean',
    default: true,
  })
  isSellable?: boolean;

  @Column({
    name: 'is_purchasable',
    type: 'boolean',
    default: true,
  })
  isPurchasable?: boolean;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'hsn_code',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  hsnCode?: string;

  @Column({
    name: 'gst_category',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  gstCategory?: string;

  @Column({
    name: 'gst_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0.00,
  })
  gstRate?: number;

  @Column({
    name: 'standard_cost_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0.00,
  })
  standardCostPrice?: number;

  @Column({
    name: 'mrp',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  mrp?: number;

  @Column({
    name: 'standard_selling_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  standardSellingPrice?: number;

  @Column({
    name: 'currency_code',
    type: 'char',
    length: 3,
    default: 'INR',
  })
  currencyCode?: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    default: 'Draft',
  })
  status?: string;

  @Column({
    name: 'launch_date',
    type: 'date',
    nullable: true,
  })
  launchDate?: Date;

  @Column({
    name: 'discontinue_date',
    type: 'date',
    nullable: true,
  })
  discontinueDate?: Date;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images?: ProductImage[];

  @OneToMany(() => ProductDocument, (document) => document.product, { cascade: true })
  documents?: ProductDocument[];
}