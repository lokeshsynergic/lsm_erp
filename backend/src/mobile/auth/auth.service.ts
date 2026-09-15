import { Injectable, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // 1. Import ConfigService


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService, //
  ) {}

  

  async login(loginDto: LoginDto): Promise<any> {
    const { user_id, device_id, password } = loginDto;

    try {
      // Validate input
      if (!user_id || !device_id || !password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      let rawUser: any;
      try {
        rawUser = await this.userRepository
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
      } catch (dbError) {
        this.logger.error(`Database error during login query: ${dbError}`, dbError instanceof Error ? dbError.stack : '');
        throw new InternalServerErrorException('An error occurred during authentication');
      }

      if (!rawUser) {
        throw new UnauthorizedException('Invalid User ID or Device ID');
      }

      if (rawUser.user_status !== 'A') {
        throw new UnauthorizedException('User account is inactive');
      }

      // Verify password against alias
      let isPasswordValid: boolean;
      try {
        isPasswordValid = await bcrypt.compare(password, rawUser.password);
      } catch (bcryptError) {
        this.logger.error(`Bcrypt error during password comparison: ${bcryptError}`, bcryptError instanceof Error ? bcryptError.stack : '');
        throw new InternalServerErrorException('An error occurred during authentication');
      }

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const mapsApiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY') ?? 'NOT_SET';

      const { password: _, ...userWithoutPassword } = rawUser;

      return {
        message: 'Login successful',
        user: userWithoutPassword,
        req_app_key: mapsApiKey, // Provide a default value if the environment variable is not set
        token: this.generateToken(userWithoutPassword),
      };
    } catch (error) {
      // Re-throw NestJS HTTP exceptions directly
      if (error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        throw error;
      }

      // Log unexpected errors for debugging
      this.logger.error(`Unexpected login error: ${error}`, error instanceof Error ? error.stack : '');

      // For any other error, throw a generic server error
      throw new InternalServerErrorException('An error occurred during authentication');
    }
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
