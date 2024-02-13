import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ObjectsService } from './objects.service'
import { VideoServiceModule } from '@noloback/video.service'
export { ObjectManipulationModel } from './models/object.manipulation.models'
export {
  ObjectCommonReturn,
  ObjectAdminReturn
} from './models/object.api.models'

@Module({
  controllers: [],
  providers: [ObjectsService],
  exports: [ObjectsService],
  imports: [PrismaClientBaseModule, LoggerLibModule, VideoServiceModule]
})
export class ObjectsServiceModule {}
