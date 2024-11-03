import { Module } from '@nestjs/common';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { ProfileService } from './profile.service';

@Module({
  controllers: [],
  providers: [ProfileService],
  exports: [ProfileService],
  imports: [PrismaClientBaseModule],
})
export class ProfileServiceModule {}
