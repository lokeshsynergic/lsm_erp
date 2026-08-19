import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductDocument } from './entities/product-document.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { CreateProductDocumentDto } from './dto/create-product-document.dto';
import { UpdateProductDocumentDto } from './dto/update-product-document.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductDocument)
    private productDocumentRepository: Repository<ProductDocument>,
  ) {}

  // ==================== PRODUCT OPERATIONS ====================

  /**
   * Create a new product
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  /**
   * Get all products
   */
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['images', 'documents'],
      order: { productId: 'DESC' },
    });
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

  /**
   * Update product
   */
  async update(product_id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(product_id);

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  /**
   * Delete product (cascades to images and documents)
   */
  async remove(product_id: number): Promise<void> {
    const product = await this.findOne(product_id);
    await this.productRepository.remove(product);
  }

  // ==================== PRODUCT IMAGE OPERATIONS ====================

  /**
   * Add image to product
   */
  async createImage(createProductImageDto: CreateProductImageDto): Promise<ProductImage> {
    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { productId: BigInt(createProductImageDto.product_id) as any },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createProductImageDto.product_id} not found`,
      );
    }

    const productImage = this.productImageRepository.create(createProductImageDto);
    return await this.productImageRepository.save(productImage);
  }

  /**
   * Get all images for a product
   */
  async findImagesByProduct(product_id: number): Promise<ProductImage[]> {
    const product = await this.productRepository.findOne({
      where: { productId: BigInt(product_id) as any },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    return await this.productImageRepository.find({
      where: { product_id },
      order: { document_id: 'DESC' },
    });
  }

  /**
   * Get single image by ID
   */
  async findOneImage(document_id: number): Promise<ProductImage> {
    const productImage = await this.productImageRepository.findOne({
      where: { document_id },
    });

    if (!productImage) {
      throw new NotFoundException(`Image with ID ${document_id} not found`);
    }

    return productImage;
  }

  /**
   * Update image details
   */
  async updateImage(
    document_id: number,
    updateProductImageDto: UpdateProductImageDto,
  ): Promise<ProductImage> {
    const productImage = await this.findOneImage(document_id);

    Object.assign(productImage, updateProductImageDto);
    return await this.productImageRepository.save(productImage);
  }

  /**
   * Delete image
   */
  async removeImage(document_id: number): Promise<void> {
    const productImage = await this.findOneImage(document_id);
    await this.productImageRepository.remove(productImage);
  }

  /**
   * Delete all images for a product
   */
  async removeAllImagesByProduct(product_id: number): Promise<void> {
    await this.productImageRepository.delete({ product_id });
  }

  // ==================== PRODUCT DOCUMENT OPERATIONS ====================

  /**
   * Add document to product
   */
  async createDocument(createProductDocumentDto: CreateProductDocumentDto): Promise<ProductDocument> {
    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { productId: BigInt(createProductDocumentDto.product_id) as any },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createProductDocumentDto.product_id} not found`,
      );
    }

    const productDocument = this.productDocumentRepository.create(createProductDocumentDto);
    return await this.productDocumentRepository.save(productDocument);
  }

  /**
   * Get all documents for a product
   */
  async findDocumentsByProduct(product_id: number): Promise<ProductDocument[]> {
    const product = await this.productRepository.findOne({
      where: { productId: BigInt(product_id) as any },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    return await this.productDocumentRepository.find({
      where: { product_id },
      order: { document_id: 'DESC' },
    });
  }

  /**
   * Get single document by ID
   */
  async findOneDocument(document_id: number): Promise<ProductDocument> {
    const productDocument = await this.productDocumentRepository.findOne({
      where: { document_id },
    });

    if (!productDocument) {
      throw new NotFoundException(`Document with ID ${document_id} not found`);
    }

    return productDocument;
  }

  /**
   * Update document details
   */
  async updateDocument(
    document_id: number,
    updateProductDocumentDto: UpdateProductDocumentDto,
  ): Promise<ProductDocument> {
    const productDocument = await this.findOneDocument(document_id);

    Object.assign(productDocument, updateProductDocumentDto);
    return await this.productDocumentRepository.save(productDocument);
  }

  /**
   * Delete document
   */
  async removeDocument(document_id: number): Promise<void> {
    const productDocument = await this.findOneDocument(document_id);
    await this.productDocumentRepository.remove(productDocument);
  }

  /**
   * Delete all documents for a product
   */
  async removeAllDocumentsByProduct(product_id: number): Promise<void> {
    await this.productDocumentRepository.delete({ product_id });
  }
}
