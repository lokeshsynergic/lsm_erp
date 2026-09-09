import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateProductTypeDto {
   @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    prodTypeName: string;
}
