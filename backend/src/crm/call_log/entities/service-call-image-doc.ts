import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column,
  CreateDateColumn 
} from 'typeorm';

@Entity('td_crm_service_call_doc')
export class ServiceCallDocument {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id?: number;

  @Column({ name: 'service_call_no', type: 'varchar', length: 100, nullable: false })
  serviceCallNo?: string;

  @Column({ name: 'image_path', type: 'text', nullable: false })
  imagePath?: string;

  @Column({ name: 'file_type', type: 'varchar', length: 55, nullable: true })
  fileType?: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'created_by', type: 'varchar', length: 55, nullable: true })
  createdBy?: string;

  @CreateDateColumn({ 
    name: 'created_at', 
    type: 'timestamp with time zone', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  createdAt?: Date;
}
