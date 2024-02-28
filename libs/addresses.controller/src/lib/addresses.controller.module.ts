import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { AddressesServiceModule } from '@noloback/addresses.service'
import { AddressesController } from './addresses.controller'

@Module({
  controllers: [AddressesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, AddressesServiceModule]
})
export class AddressesControllerModule {}
