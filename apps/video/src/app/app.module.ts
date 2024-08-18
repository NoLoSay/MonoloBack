import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthServiceModule } from '@noloback/auth.service';
import { PicturesControllerModule } from '@noloback/pictures.controller';
import { UploadControllerModule } from '@noloback/upload.controller';
import { WatchControllerModule } from '@noloback/watch.controller';
import { SanctionsServiceModule } from '@noloback/sanctions.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@noloback/guards';
import { RolesGuard } from '@noloback/roles';

@Module({
  imports: [AuthServiceModule, SanctionsServiceModule, PicturesControllerModule, UploadControllerModule, WatchControllerModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
