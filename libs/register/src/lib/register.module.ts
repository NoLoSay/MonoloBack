import { Module } from '@nestjs/common';
import { UsersLibModule } from '@noloback/users-lib';
import { RegisterController } from './register.controller';

@Module({
  controllers: [RegisterController],
  providers: [],
  exports: [],
  imports: [UsersLibModule]
})
export class RegisterModule {}
