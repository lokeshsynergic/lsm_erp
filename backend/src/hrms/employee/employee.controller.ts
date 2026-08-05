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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * Add new employee
   * POST /employee
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return await this.employeeService.create(createEmployeeDto);
  }

  /**
   * Get all employees
   * GET /employee
   */
  @Get()
  async findAll(): Promise<Employee[]> {
    return await this.employeeService.findAll();
  }

  /**
   * Get active employees
   * GET /employee/active
   */
  @Get('active')
  async getActiveEmployees(): Promise<Employee[]> {
    return await this.employeeService.getActiveEmployees();
  }

  /**
   * Get employee by ID
   * GET /employee/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.findOne(+id);
  }

  /**
   * Get employee by emp_code
   * GET /employee/code/:empCode
   */
  @Get('code/:empCode')
  async findByEmpCode(@Param('empCode') empCode: string): Promise<Employee> {
    return await this.employeeService.findByEmpCode(empCode);
  }

  /**
   * Update employee
   * PUT /employee/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeeService.update(+id, updateEmployeeDto);
  }

  /**
   * Delete employee
   * DELETE /employee/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.employeeService.remove(+id);
  }
}
