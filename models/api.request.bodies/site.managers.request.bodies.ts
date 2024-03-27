import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsEmail,
  IsNumber,
  IsPositive
} from 'class-validator'

export class InviteManagerRequestBody {
  @ApiProperty()
  @IsEmail()
  email: string = ''
}

export class SiteManagerModificationRequestBody {
  @ApiProperty()
  @IsEmail()
  email: string = ''

  @ApiProperty()
  isMain: boolean = false
}

export class RemoveManagerRequestBody {
  @ApiProperty()
  @IsEmail()
  email: string = ''
}