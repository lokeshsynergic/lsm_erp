import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../../inventory/products/entities/product.entity';


@Controller('mobile/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  /**
   * Get all products with only id and name (for mobile app)
   */
  @Get('list')
  async getProductList(): Promise<{ id: number; name: string }[]> {
    return await this.productService.getProductList();
  }

  @Get(':product_id')
  async findOne(@Param('product_id') product_id: string): Promise<Product> {
    return await this.productService.findOne(+product_id);
  }

}

