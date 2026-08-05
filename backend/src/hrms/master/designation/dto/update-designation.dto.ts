import { IsString, IsOptional } from 'class-validator';

export class UpdateDesignationDto {
  @IsString()
  @IsOptional()
  designation_name?: string;
}
