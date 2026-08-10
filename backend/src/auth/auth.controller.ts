import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    });

    await this.userRepository.save(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }
}
