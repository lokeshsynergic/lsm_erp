import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  /**
   * Create a new subcategory
   */
  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
    const subcategory = this.subcategoryRepository.create(createSubcategoryDto);
    return await this.subcategoryRepository.save(subcategory);
  }

  /**
   * Get all subcategories
   */
  async findAll(): Promise<Subcategory[]> {
    return await this.subcategoryRepository.find({
      order: {
        subcategory_id: 'ASC',
      },
    });
  }

  /**
   * Get all subcategories with category details
   */
  // subcategory.service.ts
  async findAllWithCategory() {
  return await this.subcategoryRepository
    .createQueryBuilder('sub')
    .leftJoin('md_invt_category', 'cat', 'cat.category_id = sub.category_id')
    .select([
      'sub.*', // Selects all columns from the subcategory table
      'cat.category_name AS category_name', // Selects only category_name
    ])
    .orderBy('sub.subcategory_id', 'ASC')
    .getRawMany();
}

  /**
   * Get subcategory by ID
   */
  async findOne(subcategory_id: number): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { subcategory_id },
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${subcategory_id} not found`);
    }
    return subcategory;
  }

  /**
   * Update a subcategory
   */
  async update(
    subcategory_id: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    const subcategory = await this.findOne(subcategory_id);
    Object.assign(subcategory, updateSubcategoryDto);
    return await this.subcategoryRepository.save(subcategory);
  }

  /**
   * Delete a subcategory
   */
  async remove(subcategory_id: number): Promise<void> {
    const subcategory = await this.findOne(subcategory_id);
    await this.subcategoryRepository.remove(subcategory);
  }
}
