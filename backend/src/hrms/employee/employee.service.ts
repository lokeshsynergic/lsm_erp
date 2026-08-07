import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as fs from 'fs';
import * as path from 'path';
import { EmployeeDoc } from './entities/employee-doc.entity'; 
import { CreateEmployeeDocDto } from './dto/create-employee.dto';
import { Multer } from 'multer';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeDoc)
    private employeeDocRepository: Repository<EmployeeDoc>,
  ) {}

  /**
   * Create a new employee
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      createdAt: new Date(),
    });
    return await this.employeeRepository.save(employee);
  }

  async uploadDocuments(
    empCode: string,
    files: Express.Multer.File[],
    body: any,
  ) {
    console.log('📤 uploadDocuments service called');
    console.log('FILES:', files);
    console.log('FILES LENGTH:', files?.length || 0);
    console.log('BODY:', body);

    // Guard against undefined or empty files
    if (!files || files.length === 0) {
      throw new Error('❌ No files provided for upload. Check that files were sent correctly in multipart/form-data format.');
    }

    const employee = await this.employeeRepository.findOne({
      where: { empCode },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'employees',
      empCode,
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`✓ Created upload directory: ${uploadPath}`);
    }

    const documentPromises = files.map(async (file) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      const filePath = path.join(uploadPath, fileName);

      // Save physical file
      await fs.promises.writeFile(filePath, file.buffer);
      console.log(`✓ File saved: ${fileName}`);

      // Create & save DB entry
      const document = this.employeeDocRepository.create({
        empCode,
        docId: Number(body?.docId) || 0,
        documentNo: body?.documentNo || file.originalname,
        documentPath: `uploads/employees/${empCode}/${fileName}`,
      });

      const saved = await this.employeeDocRepository.save(document);
      console.log(`✓ DB entry created for: ${file.originalname}`);
      return saved;
    });

    const results = await Promise.all(documentPromises);
    console.log(`✓ Successfully uploaded ${results.length} documents`);
    return results;
  }

//   async uploadDocuments(
//   empCode: string,
//   files: Express.Multer.File[], // Note: Express.Multer.File is standard type for NestJS
//   body: any,
// ) {
//   const employee = await this.employeeRepository.findOne({
//     where: { empCode },
//   });

//   if (!employee) {
//     throw new NotFoundException('Employee not found');
//   }

//   const uploadPath = path.join(
//     process.cwd(),
//     'uploads',
//     'employees',
//     empCode,
//   );

//   if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
//   }

//   const documentPromises = files.map(async (file) => {
//     const fileName = `${Date.now()}_${file.originalname}`;
//     const filePath = path.join(uploadPath, fileName);

//     // Save physical file
//     await fs.promises.writeFile(filePath, file.buffer);

//     // Create & save DB entry
//     const document = this.employeeDocRepository.create({
//       empCode,
//       docId: Number(body.docId),
//       documentNo: body.documentNo,
//       documentPath: `uploads/employees/${empCode}/${fileName}`,
//     });

//     return await this.employeeDocRepository.save(document);
//   });

//   return await Promise.all(documentPromises);
// }

  /**
   * Get all employees
   */
  // async findAll(): Promise<Employee[]> {
  //   return await this.employeeRepository.find({
  //     order: {
  //       firstName: 'DESC',
  //     },
  //   });
  // }

    async findAll() {
      return await this.employeeRepository
        .createQueryBuilder('emp')
        .leftJoin('md_hrms_department', 'dept', 'dept.dept_id = emp.dept_id')
        .leftJoin('md_hrms_designation', 'desig', 'desig.desig_id = emp.desig_id')
        .select([
          'emp.*',
          'dept.department_name AS department',
          'desig.designation_name AS designation',
        ])
        .orderBy('emp.first_name', 'ASC')
        .getRawMany();
    }

  /**
   * Get employee by ID
   */
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { empId: id },
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
      where: { empCode: emp_code },
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
      modifiedAt: new Date(),
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
     
      order: {
        firstName: 'DESC',
      },
    });
  }
}
