import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { user_id, password } = loginDto;

    // Find user by user_id
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user status is active
    if (user.user_status !== 'A') {
      throw new UnauthorizedException('User account is inactive');
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'Login successful',
      user: userWithoutPassword,
      // For JWT implementation, add token here:
      // token: this.generateToken(user),
    };
  }

  // Helper method to hash password (use when creating/updating users)
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // TODO: Implement JWT token generation when @nestjs/jwt is installed
  // private generateToken(user: User): string {
  //   return this.jwtService.sign({
  //     sub: user.id,
  //     user_id: user.user_id,
  //     usertype: user.usertype,
  //   });
  // }
}
