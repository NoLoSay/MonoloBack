import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { AddressesService } from './addresses.service'
export { AddressManipulationModel } from './models/address.manipulation.models'
export {
  AddressAdminReturn,
  AddressCommonReturn
} from './models/address.api.models'

@Module({
  controllers: [],
  providers: [AddressesService],
  exports: [AddressesService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class AddressesServiceModule {}
