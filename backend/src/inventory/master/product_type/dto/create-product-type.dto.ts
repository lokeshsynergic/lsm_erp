import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  prodTypeName: string;
}