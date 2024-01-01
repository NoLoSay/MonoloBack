import { UseGuards } from '@nestjs/common';
import { ReferentAuthGuard } from './referent-auth.guard';

export const Referent = () => UseGuards(ReferentAuthGuard);
