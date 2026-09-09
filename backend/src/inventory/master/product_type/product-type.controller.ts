import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { ProductType } from './entities/product-type.entity';

@Controller('invt/master/product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
    return await this.productTypeService.create(createProductTypeDto);
  }

  @Get()
  async findAll(): Promise<ProductType[]> {
    return await this.productTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductType> {
    return await this.productTypeService.findOne(+id);
  }
  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ): Promise<ProductType> {
    return await this.productTypeService.update(+id, updateProductTypeDto);
  }
}
