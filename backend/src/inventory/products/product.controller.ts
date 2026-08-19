import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { CreateProductDocumentDto } from './dto/create-product-document.dto';
import { UpdateProductDocumentDto } from './dto/update-product-document.dto';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductDocument } from './entities/product-document.entity';

@Controller('invt/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ==================== PRODUCT OPERATIONS ====================

  /**
   * Create a new product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  /**
   * Get all products
   */
  @Get()
  async findAllProducts(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  /**
   * Get product by ID with related images and documents
   */
  @Get(':id')
  async findOneProduct(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne(+id);
  }

  /**
   * Update product
   */
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.update(+id, updateProductDto);
  }

  /**
   * Delete product (cascades to images and documents)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.remove(+id);
  }

  // ==================== PRODUCT IMAGE OPERATIONS ====================

  /**
   * Add image to product
   */
  @Post(':product_id/image')
  @HttpCode(HttpStatus.CREATED)
  async addImage(
    @Param('product_id') product_id: string,
    @Body() createProductImageDto: CreateProductImageDto,
  ): Promise<ProductImage> {
    // Override product_id from route parameter
    createProductImageDto.product_id = +product_id;
    return await this.productService.createImage(createProductImageDto);
  }

  /**
   * Get all images for a product
   */
  @Get(':product_id/images')
  async getProductImages(@Param('product_id') product_id: string): Promise<ProductImage[]> {
    return await this.productService.findImagesByProduct(+product_id);
  }

  /**
   * Get single image
   */
  @Get('image/:image_id')
  async getImage(@Param('image_id') image_id: string): Promise<ProductImage> {
    return await this.productService.findOneImage(+image_id);
  }

  /**
   * Update image
   */
  @Put('image/:image_id')
  async updateImage(
    @Param('image_id') image_id: string,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ): Promise<ProductImage> {
    return await this.productService.updateImage(+image_id, updateProductImageDto);
  }

  /**
   * Delete image
   */
  @Delete('image/:image_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Param('image_id') image_id: string): Promise<void> {
    await this.productService.removeImage(+image_id);
  }

  /**
   * Delete all images for a product
   */
  @Delete(':product_id/images')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllProductImages(@Param('product_id') product_id: string): Promise<void> {
    await this.productService.removeAllImagesByProduct(+product_id);
  }

  // ==================== PRODUCT DOCUMENT OPERATIONS ====================

  /**
   * Add document to product
   */
  @Post(':product_id/document')
  @HttpCode(HttpStatus.CREATED)
  async addDocument(
    @Param('product_id') product_id: string,
    @Body() createProductDocumentDto: CreateProductDocumentDto,
  ): Promise<ProductDocument> {
    // Override product_id from route parameter
    createProductDocumentDto.product_id = +product_id;
    return await this.productService.createDocument(createProductDocumentDto);
  }

  /**
   * Get all documents for a product
   */
  @Get(':product_id/documents')
  async getProductDocuments(@Param('product_id') product_id: string): Promise<ProductDocument[]> {
    return await this.productService.findDocumentsByProduct(+product_id);
  }

  /**
   * Get single document
   */
  @Get('document/:document_id')
  async getDocument(@Param('document_id') document_id: string): Promise<ProductDocument> {
    return await this.productService.findOneDocument(+document_id);
  }

  /**
   * Update document
   */
  @Put('document/:document_id')
  async updateDocument(
    @Param('document_id') document_id: string,
    @Body() updateProductDocumentDto: UpdateProductDocumentDto,
  ): Promise<ProductDocument> {
    return await this.productService.updateDocument(+document_id, updateProductDocumentDto);
  }

  /**
   * Delete document
   */
  @Delete('document/:document_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(@Param('document_id') document_id: string): Promise<void> {
    await this.productService.removeDocument(+document_id);
  }

  /**
   * Delete all documents for a product
   */
  @Delete(':product_id/documents')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllProductDocuments(@Param('product_id') product_id: string): Promise<void> {
    await this.productService.removeAllDocumentsByProduct(+product_id);
  }
}

