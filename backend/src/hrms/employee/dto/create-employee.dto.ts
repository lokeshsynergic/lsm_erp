import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  IsDateString,
  Length,
  ValidateNested,
  IsArray,
} from 'class-validator';

export class CreateEmployeeDocDto {
  @IsNumber()
  docId?: number;

  @IsOptional()
  @IsString()
  documentNo?: string;

  @IsOptional()
  @IsString()
  documentPath?: string;
}

export class CreateEducationDto {
  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsString()
  institute?: string;

  @IsOptional()
  @IsNumber()
  yearOfPassing?: number;
}

export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  @Length(1, 20)
  empCode?: string;

  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  gender?: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfJoining?: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsNumber()
  deptId?: number;

  @IsOptional()
  @IsNumber()
  desigId?: number;

  @IsOptional()
  @IsNumber()
  catId?: number;

  @IsOptional()
  @IsString()
  jobApplicant?: string;

  @IsOptional()
  @IsDateString()
  confirmationDate?: string;

  @IsOptional()
  @IsNumber()
  noticePeriod?: number;

  @IsOptional()
  @IsDateString()
  offerDate?: string;

  @IsOptional()
  @IsDateString()
  contractEndDate?: string;

  @IsOptional()
  @IsDateString()
  dateOfRetirement?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  mobileNumber2?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  landmarkLocation?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  pin?: string;

  @IsOptional()
  @IsString()
  stateProvince?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankAccountNo?: string;

  @IsOptional()
  @IsString()
  ifscCode?: string;

  @IsOptional()
  @IsNumber()
  ctc?: number;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeDocDto)
  documents?: CreateEmployeeDocDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  education?: CreateEducationDto[];
}
