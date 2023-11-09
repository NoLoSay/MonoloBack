import { UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../guards/roles/admin-auth.guard';

export const Admin = () => UseGuards(AdminAuthGuard);
