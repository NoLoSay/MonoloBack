import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthServiceModule } from '@noloback/auth.service';
import { UploadControllerModule } from '@noloback/upload.controller';

@Module({
  imports: [AuthServiceModule, UploadControllerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
