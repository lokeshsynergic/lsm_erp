import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, Get, Param } from '@nestjs/common';
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

    // Create new user - not approved by default
    const newUser = this.userRepository.create({
      user_id: registerDto.user_id,
      password: hashedPassword,
      usertype: registerDto.usertype || 'U', // Default to User type
      user_status: 'A', // Active by default
      is_approved: false, // Not approved until admin approves
      usermode: registerDto.usermode || 'W', // Default to Web
    });

    await this.userRepository.save(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      message: 'User registered successfully. Awaiting admin approval.',
      user: userWithoutPassword,
    };
  }

  @Get('getuserbyid/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    return await this.authService.getUserById(id);
  }
    
     @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: string, @Body() updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if(updateData.user_status == 'A')
      updateData.is_approved = true;
    else if(updateData.user_status == 'I')
      updateData.is_approved = false; 
    Object.assign(user, updateData);
    await this.userRepository.save(user);
    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'User updated successfully.',
      user: userWithoutPassword,
    };
  }

}
