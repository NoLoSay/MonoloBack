import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ExhibitionsServiceModule } from '@noloback/exhibitions.service'
import { ExhibitionsController } from './exhibitions.controller'

@Module({
  controllers: [ExhibitionsController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, ExhibitionsServiceModule]
})
export class ExhibitionsControllerModule {}
