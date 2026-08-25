import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // async login(loginDto: LoginDto): Promise<any> {
  //     const { user_id, device_id, password } = loginDto;
  
  //     // Find user by user_id
  //     const user = await this.userRepository.findOne({
  //       where: { user_id , device_id },
  //     });
  
  //     if (!user) {
  //       throw new UnauthorizedException('Invalid User ID or Device ID');
  //     }
  
     
  //     if (user.user_status !== 'A') {
  //       throw new UnauthorizedException('User account is inactive');
  //     }
  
  //     // Verify password using bcrypt
  //     const isPasswordValid = await bcrypt.compare(password, user.password);
  
  //     if (!isPasswordValid) {
  //       throw new UnauthorizedException('Invalid credentials');
  //     }
  
  //     // Return user data without password
  //     const { password: _, ...userWithoutPassword } = user;
  //     return {
  //       message: 'Login successful',
  //       user: userWithoutPassword,
  //       token: this.generateToken(user),
  //     };
  //   }

  async login(loginDto: LoginDto): Promise<any> {
  const { user_id, device_id, password } = loginDto;

  const rawUser = await this.userRepository
    .createQueryBuilder('user')
    .innerJoin('md_hrms_employee', 'employee', 'employee.emp_code = user.user_id')
    .innerJoin('md_company_branches', 'branch', 'branch.branch_id = employee.branch_id')
    .select([
      'user.user_id AS user_id',
      'user.password AS password',
      'user.user_status AS user_status',
      'user.device_id AS device_id',
      'user.work_mode AS work_mode',
      'user.shift_id AS shift_id',
      'employee.first_name AS first_name',
      'branch.latitude AS latitude',
      'branch.longitude AS longitude',
      'branch.login_range AS login_range',
    ])
    .where('user.user_id = :user_id AND user.device_id = :device_id', {
      user_id,
      device_id,
    })
    .getRawOne();

  if (!rawUser) {
    throw new UnauthorizedException('Invalid User ID or Device ID');
  }

  if (rawUser.user_status !== 'A') {
    throw new UnauthorizedException('User account is inactive');
  }

  // Verify password against alias
  const isPasswordValid = await bcrypt.compare(password, rawUser.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Omit password from output
  const { password: _, ...userWithoutPassword } = rawUser;

  return {
    message: 'Login successful',
    user: userWithoutPassword,
    google_maps_key: process.env.GOOGLE_MAPS_API_KEY,
    token: this.generateToken(userWithoutPassword),
  };
}

  // Helper method to hash password (use when creating/updating users)
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  
      private generateToken(user: User): string {
        return this.jwtService.sign({
          sub: user.id,
          user_id: user.user_id,
          usertype: user.usertype,
        });
      }
}
