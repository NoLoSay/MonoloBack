import { Module } from '@nestjs/common';

import { PrismaClientTranslatorModule } from '@noloback/prisma-client-translator';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [PrismaClientTranslatorModule],
})
export class TranslatorLibModule {}
