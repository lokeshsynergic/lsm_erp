import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductDocument } from './entities/product-document.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductDocument])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule, ProductService],
})
export class ProductsModule {}