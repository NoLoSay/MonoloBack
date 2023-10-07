import { Module } from '@nestjs/common';

import { UsersLibModule } from '@noloback/users-lib';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [UsersLibModule]
})
export class AuthLibModule {}
