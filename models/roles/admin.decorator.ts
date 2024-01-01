import { UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from './admin-auth.guard';

export const Admin = () => UseGuards(AdminAuthGuard);
