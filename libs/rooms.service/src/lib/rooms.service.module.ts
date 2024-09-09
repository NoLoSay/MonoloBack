import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Module({
  controllers: [],
  providers: [RoomsService],
  exports: [RoomsService],
  imports: []
})
export class RoomsServiceModule {}
