import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { DepartmentsServiceModule } from '@noloback/departments.service'
import { DepartmentsController } from './departments.controller'

@Module({
  controllers: [DepartmentsController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, DepartmentsServiceModule]
})
export class DepartmentsControllerModule {}
