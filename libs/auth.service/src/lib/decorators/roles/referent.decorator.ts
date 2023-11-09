import { UseGuards } from '@nestjs/common';
import { ReferentAuthGuard } from '../../guards/roles/referent-auth.guard';

export const Referent = () => UseGuards(ReferentAuthGuard);
