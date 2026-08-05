import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Create a new employee
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      created_dt: new Date(),
    });
    return await this.employeeRepository.save(employee);
  }

  /**
   * Get all employees
   */
  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  /**
   * Get employee by ID
   */
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  /**
   * Get employee by emp_code
   */
  async findByEmpCode(emp_code: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { emp_code },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with code ${emp_code} not found`);
    }
    return employee;
  }

  /**
   * Update employee
   */
  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);
    
    const updatedEmployee = {
      ...employee,
      ...updateEmployeeDto,
      modified_dt: new Date(),
    };

    return await this.employeeRepository.save(updatedEmployee);
  }

  /**
   * Delete employee
   */
  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }

  /**
   * Get employee count
   */
  async getCount(): Promise<number> {
    return await this.employeeRepository.count();
  }

  /**
   * Get active employees
   */
  async getActiveEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { emp_status: 'A' },
      order: {
        id: 'DESC',
      },
    });
  }
}
