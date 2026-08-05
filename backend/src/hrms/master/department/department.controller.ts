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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Controller('master/dept')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * Add new department
   * POST /department
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return await this.departmentService.create(createDepartmentDto);
  }

  /**
   * Get all departments
   * GET /department
   */
  @Get()
  async findAll(): Promise<Department[]> {
    return await this.departmentService.findAll();
  }

  /**
   * Get department by ID
   * GET /department/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Department> {
    return await this.departmentService.findOne(+id);
  }

  /**
   * Update department
   * PUT /department/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return await this.departmentService.update(+id, updateDepartmentDto);
  }

  /**
   * Delete department
   * DELETE /department/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.departmentService.remove(+id);
  }
}
