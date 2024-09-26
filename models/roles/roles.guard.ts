import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Roles } from './roles.decorator'
import { SanctionsService } from '@noloback/sanctions.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor (
    private reflector: Reflector,
    private sanctionsService: SanctionsService,
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const sanctions = await this.sanctionsService.getUserSanctionsByEmail(request?.body?.username)
    const isBanned = sanctions?.banned
    if (isBanned) {
      throw new UnauthorizedException('User is banned');
    }

    const roles = this.reflector.get(Roles, context.getHandler())
    if (!roles) {
      return true
    }
    return roles.includes(user.activeProfile.role)
  }
}