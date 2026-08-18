import { Module } from '@nestjs/common';
import { MobileAuthModule } from './auth/auth.module';


@Module({
  imports: [MobileAuthModule],
})
export class MobileModule {}
