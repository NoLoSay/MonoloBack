import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { PersonsServiceModule } from '@noloback/persons.service';
import { PersonsController } from './persons.controller';

@Module({
  controllers: [PersonsController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, PersonsServiceModule],
})
export class PersonsControllerModule {}
