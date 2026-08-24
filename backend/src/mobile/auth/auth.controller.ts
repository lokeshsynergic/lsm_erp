import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Employee } from '../../hrms/employee/entities/employee.entity';
import { QueryBuilder } from 'typeorm/browser';
import { LoginDto } from './dto/login.dto';


@Controller('mobile/auth')
export class MobileAuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>
  ) {}

   @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
      return await this.authService.login(loginDto);
    }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { user_id: registerDto.user_id },
    });

    if (existingUser) {
      throw new BadRequestException('User ID already exists');
    }

    // Hash password
    const hashedPassword = await this.authService.hashPassword(registerDto.password);

    // Create new user
    const newUser = this.userRepository.create({
      user_id: registerDto.user_id,
      password: hashedPassword,
      usertype: registerDto.usertype || 'U', // Default to User type
      user_status: 'A', // Active by default
      device_id: registerDto.device_id,
      usermode: 'M', // Default to Web mode
    });

    await this.userRepository.save(newUser);

    // Return user without password
    //const { password: _, ...userWithoutPassword } = newUser;
    return {
      status: true,
      message: 'User registered successfully',
    };
  }

  @Post('checkuser')
  @HttpCode(HttpStatus.OK)
  async checkUser(@Body() body: { user_id: string; dob: string }) {

    const user = await this.employeeRepository
      .createQueryBuilder('employee')
      .select([
        'employee.emp_code', // Include primary key / unique identifier
        'employee.firstName',
        'employee.middleName',
        'employee.lastName',
      ])
      .where('employee.emp_code = :user_id AND employee.date_of_birth = :dob', {
        user_id: body.user_id,
        dob: body.dob, // Pass '2000-01-01' directly as a string (no new Date())
      })
      .getOne();

    if (!user) {
      return {
        exists: false,
        fullName: null,
      };
    }

    const fullName = [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(' ');

    return {
      exists: true,
      fullName,
    };
    }
}
