import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ExhibitionsServiceModule } from '@noloback/exhibitions.service'
import { ExhibitionsController } from './exhibitions.controller'
import { ExhibitedObjectsServiceModule } from '@noloback/exhibited.objects.service'

@Module({
  controllers: [ExhibitionsController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    ExhibitionsServiceModule,
    ExhibitedObjectsServiceModule
  ]
})
export class ExhibitionsControllerModule {}
