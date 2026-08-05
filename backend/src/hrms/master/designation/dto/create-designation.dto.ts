import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDesignationDto {
  @IsString()
  @IsNotEmpty()
  designation_name?: string;
}
