import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  /**
   * Get all departments
   */
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: {
        category_id: 'ASC',
      },
    });
  }

  /**
   * Get department by ID
   */
  async findOne(category_id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { category_id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }
    return category;
  }

  /**
   * Update a department
   */
  async update(
    category_id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(category_id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  /**
   * Delete a department
   */
  async remove(category_id: number): Promise<void> {
    const category = await this.findOne(category_id);
    await this.categoryRepository.remove(category);
  }
}
