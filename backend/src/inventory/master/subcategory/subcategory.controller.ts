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
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';
import { SubcategoryService } from './subcategory.service';


@Controller('invt/master/subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  /**
   * Add new department
   * POST /department
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
    return await this.subcategoryService.create(createSubcategoryDto);
  }

  /**
   * Get all departments
   * GET /department
   */
  @Get()
  async findAll(): Promise<Subcategory[]> {
    return await this.subcategoryService.findAllWithCategory();
  }

  /**
   * Get department by ID
   * GET /department/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Subcategory> {
    return await this.subcategoryService.findOne(+id);
  }

  /**
   * Update department
   * PUT /department/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    return await this.subcategoryService.update(+id, updateSubcategoryDto);
  }

  /**
   * Delete department
   * DELETE /department/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.subcategoryService.remove(+id);
  }
}
