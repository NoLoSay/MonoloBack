import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from './user-auth.guard';

export const User = () => UseGuards(UserAuthGuard);
