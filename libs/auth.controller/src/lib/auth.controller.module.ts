import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthServiceModule } from '@noloback/auth.service';

@Module({
  controllers: [AuthController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule],
})
export class AuthControllerModule {}
