import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('md_hrms_document')
export class Document {
  @PrimaryGeneratedColumn()
  doc_id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  document_name?: string;
}
