import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { Employee } from '../hrms/employee/entities/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
   //private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const { user_id, password } = loginDto;

    try {
      const user = await this.userRepository.findOne({
        where: { user_id },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.is_approved) {
        throw new UnauthorizedException('Your account is pending admin approval. Please wait for approval.');
      }

      if (user.user_status !== 'A') {
        throw new UnauthorizedException('User account is inactive');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = user;

      return {
        message: 'Login successful',
        user: userWithoutPassword,
      };
    } catch (error) {
      // Re-throw NestJS HTTP exceptions directly
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Prevent unhandled database/bcrypt crashes from leaking unexpected structures
      throw new InternalServerErrorException('An error occurred during authentication');
    }
  }
  // async login(loginDto: LoginDto): Promise<any> {
  //   const { user_id, password } = loginDto;

  //   // Find user by user_id
  //   const user = await this.userRepository.findOne({
  //     where: { user_id },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   // Check if user is approved
  //   if (!user.is_approved) {
  //     throw new UnauthorizedException('Your account is pending admin approval. Please wait for approval.');
  //   }

  //   // Check if user status is active
  //   if (user.user_status !== 'A') {
  //     throw new UnauthorizedException('User account is inactive');
  //   }

  //   // Verify password using bcrypt
  //   const isPasswordValid = await bcrypt.compare(password, user.password);

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   // Return user data without password
  //   const { password: _, ...userWithoutPassword } = user;
  //   return {
  //     message: 'Login successful',
  //     user: userWithoutPassword,
    
  //     // token: this.generateToken(user),
  //   };
  // }

  

  // Helper method to hash password (use when creating/updating users)
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }


  // private generateToken(user: User): string {
  //   return this.jwtService.sign({
  //     sub: user.id,
  //     user_id: user.user_id,
  //     usertype: user.usertype,
  //   });
  // }

  async getUserById(id) {
        const result = await this.employeeRepository.manager.query(
          `
          SELECT 
            TRIM(CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.middle_name, ''), ' ', COALESCE(e.last_name, ''))) AS name,
            u.id,
            u.user_id,
            u.device_id,
            u.usertype,
            u.user_status,
            u.work_mode,
            u.shift_id
          FROM "md_hrms_employee" e
          LEFT JOIN "td_user" u ON u.user_id = e.emp_code
          WHERE u.id = $1
          `,
          [id]
        );
        return result[0] || null;
    }
}
