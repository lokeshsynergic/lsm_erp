import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadServiceCallImageDto {
  @IsString()
  @IsNotEmpty({ message: 'Service call number is required' })
  serviceCallNo!: string;

  @IsString()
  @IsNotEmpty({ message: 'Image/PDF path is required' })
  imagePath!: string;

  @IsString()
  @IsOptional()
  fileType?: string; // File type to manage based on extension (image, pdf, etc.)

  @IsString()
  @IsOptional()
  description?: string; // Optional description of the document

  @IsString()
  @IsOptional()
  createdBy?: string; // Engineer or user who uploaded the document
}
