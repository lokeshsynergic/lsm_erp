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
  UploadedFile,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Controller('master/emp')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return await this.employeeService.create(createEmployeeDto);
  }

  @Post(':empCode/documents')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadDocuments(
    @Param('empCode') empCode: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    console.log('📤 Upload Documents API called');
    console.log('Files received:', files?.length || 0);
    console.log('Body:', body);
    
    if (!files || files.length === 0) {
      console.warn('⚠️  No files received. Body:', JSON.stringify(body));
    }

    return await this.employeeService.uploadDocuments(
      empCode,
      files || [],
      body,
    );
  }
  
  @Get()
  async findAll(): Promise<Employee[]> {
    return await this.employeeService.findAll();
  }

  /**
   * Get employee by ID
   * GET /master/emp/id/:id
   */
  @Get('id/:id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.findOne(+id);
  }

  /**
   * Get employee by emp code
   * GET /master/emp/code/:empCode
   */
  @Get('code/:empCode')
  async findByEmpCode(@Param('empCode') empCode: string): Promise<Employee> {
    return await this.employeeService.findByEmpCode(empCode);
  }

  /**
   * Get employee documents
   * GET /master/emp/:empCode/documents
   */
  @Get(':empCode/documents')
  async getempDocuments(@Param('empCode') empCode: string): Promise<any[]> {
    return await this.employeeService.getempDocuments(empCode);
  }

  /**
   * Get employee qualifications
   * GET /master/emp/:empCode/qualifications
   */
  @Get(':empCode/qualifications')
  async getEmployeeQualifications(@Param('empCode') empCode: string): Promise<any[]> {
    return await this.employeeService.getEmployeeQualifications(empCode);
  }
  @Get(':empCode/experience')
  async getEmployeeExperience(@Param('empCode') empCode: string): Promise<any[]> {
    return await this.employeeService.getEmployeeExperience(empCode);
  }
   
  /**
   * Get active employees
   * GET /employee/active
   */
  @Get('active')
  async getActiveEmployees(): Promise<Employee[]> {
    return await this.employeeService.getActiveEmployees();
  }


  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return await this.employeeService.update(+id, updateEmployeeDto);
  }

  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.employeeService.remove(+id);
  }

   
  @Get('todayattnsumm')
  async getTodayAttendance(): Promise<any> {
    return await this.employeeService.getTodayAttendanceSummary();
  }
  @Get('lastthirtydaysattendance')
  async getLast30DaysAttendance(): Promise<any> {
    return await this.employeeService.getLast30DaysAttendance();
  }
  @Get('attendance-range')
    async getAttendanceByDateRange(
      @Query('fromDate') fromDate?: string,
      @Query('toDate') toDate?: string,
    ): Promise<any> {
      return await this.employeeService.getAttendanceByDateRange(fromDate, toDate);
  }

  @Get(':empCode/attendance')
async getEmployeeAttendance(
  @Param('empCode') empCode: string,
  @Query('fromDate') fromDate?: string,
  @Query('toDate') toDate?: string,
): Promise<any> {
  return await this.employeeService.getEmployeeAttendance(empCode, fromDate, toDate);
}

  @Get('attendance/:id')
  async getAttendanceByStatus(
    @Param('id', ParseIntPipe) statusId: number,
    @Query('date') date?: string,
  ): Promise<any> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return await this.employeeService.getAttendanceByStatus(statusId, targetDate);
  }

}
