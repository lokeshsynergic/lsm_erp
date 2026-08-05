import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  /**
   * Create a new department
   */
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  /**
   * Get all departments
   */
  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      order: {
        dept_id: 'ASC',
      },
    });
  }

  /**
   * Get department by ID
   */
  async findOne(dept_id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { dept_id },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${dept_id} not found`);
    }
    return department;
  }

  /**
   * Update a department
   */
  async update(
    dept_id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(dept_id);
    Object.assign(department, updateDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  /**
   * Delete a department
   */
  async remove(dept_id: number): Promise<void> {
    const department = await this.findOne(dept_id);
    await this.departmentRepository.remove(department);
  }
}
