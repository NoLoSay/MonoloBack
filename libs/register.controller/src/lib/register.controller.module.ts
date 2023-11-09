import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { UsersServiceModule } from '@noloback/users.service';

@Module({
  controllers: [RegisterController],
  providers: [],
  exports: [],
  imports: [UsersServiceModule]
})
export class RegisterModule {}
