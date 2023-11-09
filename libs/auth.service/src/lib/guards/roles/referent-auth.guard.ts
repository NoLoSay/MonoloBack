import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ReferentAuthGuard extends AuthGuard('role.referent') {}
