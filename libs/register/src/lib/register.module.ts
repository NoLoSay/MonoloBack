import { Module } from '@nestjs/common';
import { UsersServiceModule } from 'libs/users.service/src';
import { RegisterController } from './register.controller';

@Module({
  controllers: [RegisterController],
  providers: [],
  exports: [],
  imports: [UsersServiceModule]
})
export class RegisterModule {}
