import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { MobileAuthController } from './auth.controller';
import { User } from '../../auth/entities/user.entity';
import { Employee } from '../../hrms/employee/entities/employee.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Employee]),
    JwtModule.register({
      secret: '89895iokoIJKI', // Replace with your secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [MobileAuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class MobileAuthModule {}
