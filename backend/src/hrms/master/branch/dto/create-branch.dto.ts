import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  branch_name?: string;

  @IsString()
  @IsNotEmpty()
  complete_address?: string;

  @IsString()
  @IsNotEmpty()
  latitude?: string;

  @IsString()
  @IsNotEmpty()
  longitude?: string;

  @IsString()
  @IsNotEmpty()
  branch_flag?: string; 

  @IsString()
  @IsNotEmpty()
  login_range?: number;

  @IsString()
  @IsNotEmpty()
  created_by?: string;  
  
}
