import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { CitiesServiceModule } from '@noloback/cities.service'
import { CitiesController } from './cities.controller'

@Module({
  controllers: [CitiesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, CitiesServiceModule]
})
export class CitiesControllerModule {}
