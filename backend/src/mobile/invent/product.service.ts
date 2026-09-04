import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../inventory/products/entities/product.entity';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  // ==================== PRODUCT OPERATIONS ====================

  async getProductList(): Promise<{ id: number; name: string }[]> {
    const products = await this.productRepository.find({
      select: ['productId', 'productName'],
      order: { productName: 'ASC' },
    });
    
    return products
      .filter(product => product.productName) // Filter out products without a name
      .map(product => ({
        id: Number(product.productId),
        name: product.productName as string,
      }));
  }

  /**
   * Get product by ID with related images and documents
   */
  async findOne(product_id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId: BigInt(product_id) as any },
      relations: ['images', 'documents'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    return product;
  }

  
}
