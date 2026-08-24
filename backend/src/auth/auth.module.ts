import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { Employee } from '../hrms/employee/entities/employee.entity';
//import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: '1d',
    //     },
    //   }),
    // }),
    TypeOrmModule.forFeature([User, Employee]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
