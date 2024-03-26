import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsEmail,
  IsNumber
} from 'class-validator'

export class InviteManagerRequestBody {
  @ApiProperty()
  @IsEmail()
  email: string = ''

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  siteId: number = 0
}
