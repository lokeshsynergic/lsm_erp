import { IsString, IsOptional, IsEmail, IsDateString, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  emp_code: string;

  @IsString()
  emp_name: string;

  @IsOptional()
  @IsNumber()
  catg_id?: number;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsDateString()
  join_dt?: string;

  @IsOptional()
  @IsDateString()
  ret_dt?: string;

  @IsOptional()
  @IsNumber()
  desig_id?: number;

  @IsOptional()
  @IsNumber()
  dept_id?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  phone_no?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  pan_no?: string;

  @IsOptional()
  @IsString()
  aadhar_no?: string;

  @IsOptional()
  @IsString()
  emp_addr?: string;

  @IsOptional()
  @IsNumber()
  pin_no?: number;

  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  bank_ac_no?: string;

  @IsOptional()
  @IsString()
  ifsc?: string;

  @IsOptional()
  @IsString()
  pf_ac_no?: string;

  @IsOptional()
  @IsString()
  UAN?: string;

  @IsOptional()
  @IsNumber()
  basic_pay?: number;

  @IsOptional()
  @IsNumber()
  target?: number;

  @IsOptional()
  @IsNumber()
  half_yearly?: number;

  @IsOptional()
  @IsNumber()
  yearly?: number;

  @IsOptional()
  @IsString()
  emp_status?: string;

  @IsOptional()
  @IsNumber()
  salary_status?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  created_by?: string;
}
