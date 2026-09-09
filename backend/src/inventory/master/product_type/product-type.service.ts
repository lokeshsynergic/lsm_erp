import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from './entities/product-type.entity';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
  ) {}

  
  async create(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
    const productType = this.productTypeRepository.create(createProductTypeDto);
    return await this.productTypeRepository.save(productType);
  }

  /**
   * Get all product types
   */
  async findAll(): Promise<ProductType[]> {
    return await this.productTypeRepository.find({
      select: ['prodTypeId', 'prodTypeName'],
      order: {
        prodTypeName: 'ASC',
      },
    });
  }

 
  async findOne(prodTypeId: number): Promise<ProductType> {
    const productType = await this.productTypeRepository.findOne({
      where: { prodTypeId },
    });
    if (!productType) {
      throw new NotFoundException(`ProductType with ID ${prodTypeId} not found`);
    }
    return productType;
  }

  async update(
    prodTypeId: number,
    updateProductTypeDto: UpdateProductTypeDto,
  ): Promise<ProductType> {
    const productType = await this.findOne(prodTypeId);
    Object.assign(productType, updateProductTypeDto);
    return await this.productTypeRepository.save(productType);
  }
}
