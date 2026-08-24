import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Employee } from '../../hrms/employee/entities/employee.entity';
import { CreateEmployeeDto } from '../../hrms/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../../hrms/employee/dto/update-employee.dto';
import * as fs from 'fs';
import * as path from 'path';
import { EmployeeDoc } from '../../hrms/employee/entities/employee-doc.entity'; 
import { CreateEmployeeDocDto } from '../../hrms/employee/dto/create-employee.dto';
import { Multer } from 'multer';
import { IsNull } from 'typeorm';
import { EmployeeAttendance } from '../../hrms/employee/entities/employee-attendance.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeDoc)
    private employeeDocRepository: Repository<EmployeeDoc>,
    private dataSource: DataSource,
    @InjectRepository(EmployeeAttendance)
    private attendanceRepository: Repository<EmployeeAttendance>,
  ) {}

  /**
   * Create a new employee with education and experience records
   */
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { education, experience, ...employeeData } = createEmployeeDto;

    const employee = this.employeeRepository.create({
      ...employeeData,
      createdAt: new Date(),
    });
    
    const savedEmployee = await this.employeeRepository.save(employee);

    // Ensure empCode exists before inserting related records
    if (!savedEmployee.empCode) {
      throw new BadRequestException('Employee code is required');
    }

    // Insert education records if provided
    if (education && education.length > 0) {
      await this.insertEducationRecords(savedEmployee.empCode, education);
    }

    // Insert experience records if provided (only those with fromDate and toDate)
    if (experience && experience.length > 0) {
      const validExperience = experience.filter((exp) => exp.fromDate && exp.toDate);
      if (validExperience.length > 0) {
        await this.insertExperienceRecords(savedEmployee.empCode, validExperience);
      }
    }

    return savedEmployee;
  }

  /**
   * Insert education records into md_hrms_employee_edu table
   */
  private async insertEducationRecords(
    empCode: string,
    education: any[],
  ): Promise<void> {
    for (const edu of education) {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('md_hrms_employee_edu')
        .values({
          emp_code: empCode,
          degree_name: edu.qualification,
          institute_university: edu.institute,
          year_pass: edu.yearOfPassing,
          created_by: 1, // Default value, can be passed in request if needed
          created_at: new Date(),
        })
        .execute();
    }
  }

  /**
   * Insert experience records into md_hrms_employee_expe table
   */
  private async insertExperienceRecords(
    empCode: string,
    experience: any[],
  ): Promise<void> {
    for (const exp of experience) {
      // Skip records without required fields (from_dt and to_dt)
      if (!exp.fromDate || !exp.toDate) {
        continue;
      }

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('md_hrms_employee_expe')
        .values({
          emp_code: empCode,
          org_name: exp.orgName,
          desig_name: exp.designationName,
          from_dt: exp.fromDate,
          to_dt: exp.toDate,
          created_by: 1, // Default value, can be passed in request if needed
          created_at: new Date(),
        })
        .execute();
    }
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

  async getempDocuments(empCode: string) {
    return await this.employeeDocRepository
      .createQueryBuilder('employee')
      .leftJoin('md_hrms_document', 'doc', 'doc.doc_id = employee.doc_id')
      .addSelect(['doc.document_name AS documentName'])
      .where('employee.empCode = :empCode', { empCode })
      .getRawMany();
  }

  /**
   * Get employee qualifications/education records
   */
  async getEmployeeQualifications(empCode: string) {
    return await this.dataSource
      .createQueryBuilder()
      .select([
        'emp_edu.emp_code as empCode',
        'emp_edu.degree_name as degreeName',
        'emp_edu.institute_university as instituteUniversity',
        'emp_edu.year_pass as yearOfPassing',
        'emp_edu.created_at as createdAt',
      ])
      .from('md_hrms_employee_edu', 'emp_edu')
      .where('emp_edu.emp_code = :empCode', { empCode })
      .orderBy('emp_edu.created_at', 'DESC')
      .getRawMany();
  }

  async getEmployeeExperience(empCode: string) {
    return await this.dataSource
      .createQueryBuilder()
      .select([
        'emp_expe.emp_code as empCode',
        'emp_expe.org_name as organization',
        'emp_expe.desig_name as designation',
        'emp_expe.from_dt as fromDate',
        'emp_expe.to_dt as toDate',
        'emp_expe.created_at as createdAt',
      ])
      .from('md_hrms_employee_expe', 'emp_expe')
      .where('emp_expe.emp_code = :empCode', { empCode })
      .orderBy('emp_expe.created_at', 'DESC')
      .getRawMany();
  }



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
    const { education, experience, ...employeeData } = updateEmployeeDto;
    const updatedEmployee = {
      ...employee,
      ...employeeData,
      updatedAt: new Date(),
    };

    const savedEmployee = await this.employeeRepository.save(updatedEmployee);

    // Ensure empCode exists before inserting related records
    if (!savedEmployee.empCode) {
      throw new BadRequestException('Employee code is required');
    }

    // Insert education records if provided
    if (education && education.length > 0) {
      await this.insertEducationRecords(savedEmployee.empCode, education);
    }

    // Insert experience records if provided
    if (experience && experience.length > 0) {
      const validExperience = experience.filter((exp) => exp.fromDate && exp.toDate);
      if (validExperience.length > 0) {
        await this.insertExperienceRecords(savedEmployee.empCode, validExperience);
      }
    }

    return savedEmployee;
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



  async checkInOut(body: any,image?: Express.Multer.File) {
  const {id,empcode,type,datetime,lat,long,address,
is_out_of_office} = body;
  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------
  if (!empcode) {
    throw new BadRequestException(
      'Employee code is required',
    );
  }
  if (!type || !['IN', 'OUT'].includes(type.toUpperCase())) {
    throw new BadRequestException(
      'Type must be IN or OUT',
    );
  }

  const attendanceType = type.toUpperCase();
  // --------------------------------------------------
  // IN
  // id must be 0
  // --------------------------------------------------

  if (attendanceType === 'IN') {
    if (Number(id) !== 0) {
      throw new BadRequestException(
        'ID must be 0 for IN attendance',
      );
    }

    // Check whether employee already has an open record
    const openAttendance =
      await this.attendanceRepository.findOne({
        where: {
          empcode,
          outDttime: IsNull(),
        },
        order: {
          indatetime: 'DESC',
        },
      });

    if (openAttendance) {
      throw new BadRequestException(
        'Employee already checked in',
      );
    }

    // --------------------------------------------------
    // Upload IN image if provided
    // --------------------------------------------------

    let pictureUrl: string | null = null;

    if (image) {
      pictureUrl =
        await this.uploadAttendanceImage(
          empcode,
          image,
          'in',
        );
    }

    // --------------------------------------------------
    // Create attendance record
    // --------------------------------------------------

    const attendance =
      this.attendanceRepository.create({
        empcode,
        indatetime: datetime
          ? new Date(datetime)
          : new Date(),

        inLat:
          lat !== undefined && lat !== ''
            ? Number(lat)
            : null,

        inLong:
          long !== undefined && long !== ''
            ? Number(long)
            : null,

        inAddress:
          address || null,

        inPictureUrl:
          pictureUrl,

        isOutOfOffice:
          is_out_of_office !== undefined
            ? Number(is_out_of_office)
            : 0,
      });

    const savedAttendance =
      await this.attendanceRepository.save(
        attendance,
      );
    return savedAttendance;
  }

  // --------------------------------------------------
  // OUT
  // id must be existing IN record ID
  // --------------------------------------------------

  if (!id || Number(id) === 0) {
    throw new BadRequestException(
      'Attendance ID is required for OUT',
    );
  }

  // Find exact attendance record using ID + employee
  const attendance =
    await this.attendanceRepository.findOne({
      where: {
        id: String(id),
        empcode,
      },
    });

  if (!attendance) {
    throw new NotFoundException(
      'Attendance record not found',
    );
  }

  // Check if already checked out
  if (attendance.outDttime) {
    throw new BadRequestException(
      'Employee already checked out for this attendance record',
    );
  }

  // --------------------------------------------------
  // Upload OUT image if provided
  // --------------------------------------------------

  let pictureUrl: string | null = null;

  if (image) {
    pictureUrl =
      await this.uploadAttendanceImage(
        empcode,
        image,
        'out',
      );
  }
  // --------------------------------------------------
  // Update OUT details
  // --------------------------------------------------
  attendance.outDttime = datetime
    ? new Date(datetime)
    : new Date();
  attendance.outLat =lat || null;
  attendance.outLong = long || null;
  attendance.outAddress = address || null;
  attendance.outPictureUrl = pictureUrl || '';
  return await this.attendanceRepository.save(
    attendance,
  );
}


// ======================================================
// IMAGE UPLOAD
// ======================================================

private async uploadAttendanceImage(
  empcode: string,
  image: Express.Multer.File,
  type: 'in' | 'out',
): Promise<string> {

  const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'attendance',
    empcode,
  );

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });
  }

  const extension =
    path.extname(image.originalname);

  const fileName =
    `${type}_${Date.now()}${extension}`;

  const fullPath =
    path.join(
      uploadPath,
      fileName,
    );

  fs.writeFileSync(
    fullPath,
    image.buffer,
  );

  return path.join(
    'uploads',
    'attendance',
    empcode,
    fileName,
  );
}   
  async getTodayAttendance(empcode?: string): Promise<EmployeeAttendance[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await this.attendanceRepository.find({
    where: {
      ...(empcode && { empcode }), // Only filters by empcode if passed
      indatetime: Between(today, tomorrow),
    },
  });
  }
}
